// Cloudflare Email Routing Worker

export default {
  async email(message, env, ctx) {
    // 记录 email 函数开始执行
    console.log('========= EMAIL HANDLER STARTED =========');
    console.log('Worker 环境信息:', {
      hasEnv: !!env,
      hasKV: !!(env && env["temp-email"]),
      messageType: typeof message,
      messageFrom: message.from,
      messageTo: message.to
    });
    
    try {
      // 解析邮件信息
      const from = message.from;
      const to = message.to;
      const subject = message.headers.get('subject') || '(无主题)';
      let textContent = '';
      let htmlContent = '';
      let rawContent = '';
      
      try {
        rawContent = await message.raw();
        console.log('成功获取原始内容，长度:', rawContent.length);
      } catch (rawError) {
        console.error('获取原始内容失败:', rawError);
      }
      
      try {
        textContent = await message.text();
        console.log('成功获取文本内容，长度:', textContent.length);
      } catch (textError) {
        console.error('获取文本内容失败:', textError);
      }
      
      try {
        htmlContent = await message.html();
        console.log('成功获取HTML内容，长度:', htmlContent ? htmlContent.length : 0);
      } catch (htmlError) {
        console.error('获取HTML内容失败:', htmlError);
      }

      // 构建邮件对象
      const email = {
        from: from,
        to: to,
        subject: subject,
        sender: from.split('<')[0].trim() || 'Unknown',
        senderEmail: from.match(/<(.+)>/)?.[1] || from,
        text: textContent || '', // 必须字段，email-worker 需要验证
        time: new Date().toLocaleString(),
        preview: textContent ? textContent.slice(0, 100) : '(无内容预览)',
        content: htmlContent || textContent || '(无内容)',
        receivedAt: Date.now()
      };

      console.log('邮件对象创建成功:', {
        to: to,
        from: from,
        subject: subject,
        textLength: textContent?.length || 0,
        htmlLength: htmlContent?.length || 0
      });

      // 直接保存到 KV 的测试代码
      try {
        if (env["temp-email"]) {
          const timestamp = Date.now();
          const emailId = `email:${timestamp}`;
          const recipientKey = `recipient:${to}`;
          
          console.log('======= 开始直接将邮件保存到 KV =======');
          console.log('保存邮件，ID:', emailId);
          console.log('收件人索引:', recipientKey);
          
          // 测试 KV 写入权限
          try {
            await env["temp-email"].put('test-key', 'test-value');
            console.log('KV 写入测试成功');
            
            // 删除测试键
            await env["temp-email"].delete('test-key');
            console.log('KV 测试键删除成功');
          } catch (testError) {
            console.error('KV 写入测试失败:', testError);
          }
          
          // 获取现有邮件 ID
          let emailIds = [];
          try {
            const existingEmails = await env["temp-email"].get(recipientKey);
            console.log('获取现有邮件索引:', existingEmails ? '成功' : '未找到');
            
            if (existingEmails) {
              emailIds = JSON.parse(existingEmails);
              console.log(`找到收件人现有索引，包含 ${emailIds.length} 封邮件`);
            }
          } catch (getError) {
            console.error('获取现有邮件索引失败:', getError);
          }
          
          // 添加新邮件
          emailIds.push(emailId);
          console.log('添加新邮件到索引，当前索引长度:', emailIds.length);
          
          // 保存邮件
          try {
            await env["temp-email"].put(emailId, JSON.stringify(email), {
              expirationTtl: 86400 // 24小时
            });
            console.log('邮件数据已保存到 KV');
          } catch (putEmailError) {
            console.error('保存邮件数据失败:', putEmailError);
          }
          
          // 更新索引
          try {
            await env["temp-email"].put(recipientKey, JSON.stringify(emailIds), {
              expirationTtl: 86400 // 24小时
            });
            console.log('收件人索引更新成功');
          } catch (putIndexError) {
            console.error('更新收件人索引失败:', putIndexError);
          }
          
          // 检查是否成功保存
          try {
            const savedEmail = await env["temp-email"].get(emailId);
            console.log('验证邮件保存:', savedEmail ? '成功' : '失败');
            
            const savedIndex = await env["temp-email"].get(recipientKey);
            console.log('验证索引保存:', savedIndex ? '成功' : '失败');
          } catch (verifyError) {
            console.error('验证保存失败:', verifyError);
          }
          
          console.log('======= 直接保存到 KV 完成 =======');
        } else {
          console.error('ERROR: env["temp-email"] 不存在');
        }
      } catch (kvError) {
        console.error('直接保存到 KV 过程中发生错误:', kvError);
      }
      
      // 重试策略
      const MAX_RETRIES = 3;
      const RETRY_DELAY = 1000; // 1秒
      
      // 发送邮件数据到处理Worker（带重试）
      let retries = 0;
      let lastError = null;
      
      while (retries < MAX_RETRIES) {
        try {
          console.log(`尝试发送邮件到 Worker (尝试 ${retries + 1}/${MAX_RETRIES})`);
          
          const response = await fetch('https://email-worker.2668812066.workers.dev/email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(email)
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
          }

          const responseData = await response.text();
          console.log('邮件处理成功:', responseData);
          
          // 邮件处理成功
          return new Response('邮件处理成功', { status: 200 });
        } catch (error) {
          lastError = error;
          console.error(`邮件处理失败 (尝试 ${retries + 1}/${MAX_RETRIES}):`, error.message);
          
          // 如果还有重试次数，等待后重试
          if (retries < MAX_RETRIES - 1) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            retries++;
          } else {
            break; // 达到最大重试次数
          }
        }
      }
      
      // 所有重试都失败了
      console.error('所有重试都失败，邮件处理错误:', {
        error: lastError?.message,
        stack: lastError?.stack,
        emailTo: email.to,
        emailFrom: email.from,
        subject: email.subject
      });
      
      // 尝试保存失败的邮件到 KV（如果有）
      if (env["temp-email"]) {
        try {
          const failedKey = `failed:${Date.now()}`;
          await env["temp-email"].put(failedKey, JSON.stringify(email), {
            expirationTtl: 86400 * 7 // 保存 7 天
          });
          console.log('失败的邮件已保存到 KV:', failedKey);
        } catch (kvError) {
          console.error('保存失败的邮件到 KV 时出错:', kvError);
        }
      }
      
      // 返回错误响应
      return new Response(`邮件处理失败: ${lastError?.message}`, { 
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    } catch (globalError) {
      console.error('邮件处理过程中发生全局错误:', globalError);
      
      return new Response(`邮件处理失败: ${globalError.message}`, { 
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    } finally {
      console.log('========= EMAIL HANDLER FINISHED =========');
    }
  }
};
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

      // 尝试直接保存到 KV
      try {
        if (env["temp-email"]) {
          const timestamp = Date.now();
          const emailAddress = to.toLowerCase().trim();
          const emailKey = `${emailAddress}:${timestamp}`;
          
          console.log('准备存储邮件到KV，键:', emailKey);
          console.log('邮件内容:', JSON.stringify({
            to: email.to,
            from: email.from,
            subject: email.subject,
            receivedAt: email.receivedAt
          }));
          
          // 直接保存邮件
          await env["temp-email"].put(emailKey, JSON.stringify(email), {
            expirationTtl: 86400 // 24小时
          });
          
          // 验证存储
          const stored = await env["temp-email"].get(emailKey);
          if (stored) {
            console.log('邮件成功存储到KV，键:', emailKey);
          } else {
            console.error('邮件存储验证失败，未找到:', emailKey);
          }
        } else {
          console.error('KV绑定不存在: temp-email');
        }
      } catch (kvError) {
        console.error('直接保存到KV失败:', kvError);
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
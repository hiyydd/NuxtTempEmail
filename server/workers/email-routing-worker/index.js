// Cloudflare Email Routing Worker

export default {
  async email(message, env, ctx) {
    // 解析邮件信息
    const from = message.from;
    const to = message.to;
    const subject = message.headers.get('subject') || '(无主题)';
    const rawContent = await message.raw();
    const textContent = await message.text();
    const htmlContent = await message.html();

    // 构建邮件对象
    const email = {
      from: from,
      to: to,
      subject: subject,
      sender: from.split('<')[0].trim() || 'Unknown',
      senderEmail: from.match(/<(.+)>/)?.[1] || from,
      text: textContent || '',
      time: new Date().toLocaleString(),
      preview: textContent ? textContent.slice(0, 100) : '(无内容预览)',
      content: htmlContent || textContent || '(无内容)',
      receivedAt: Date.now()
    };

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
    if (env.tempEmail) {
      try {
        const failedKey = `failed:${Date.now()}`;
        await env.tempEmail.put(failedKey, JSON.stringify(email), {
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
  }
};
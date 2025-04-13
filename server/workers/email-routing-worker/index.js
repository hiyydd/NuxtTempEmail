// Cloudflare Email Routing Worker

export default {
  async email(message, env, ctx) {
    try {
      // 正确获取邮件内容 - 使用正确的API
      const rawEmail = await message.raw.text();
      let emailContent;
      
      // 尝试获取HTML内容，如果有的话
      try {
        emailContent = await message.html;
      } catch (e) {
        // 如果没有HTML内容，尝试获取纯文本内容
        try {
          emailContent = await message.text();
        } catch (e) {
          // 如果两者都失败，使用原始邮件
          emailContent = rawEmail;
        }
      }
      
      // 保存基本邮件信息和内容
      const email = {
        from: message.from,
        to: message.to,
        subject: message.headers.get('subject') || '(无主题)',
        content: emailContent || '(无内容)',
        rawEmail: rawEmail,
        receivedAt: Date.now()
      };

      // 保存到 KV
      if (env["temp-email"]) {
        const timestamp = Date.now();
        const emailAddress = message.to.toLowerCase().trim();
        const emailKey = `${emailAddress}:${timestamp}`;
        
        // 保存邮件
        await env["temp-email"].put(emailKey, JSON.stringify(email), {
          expirationTtl: 86400 // 24小时过期
        });
        
        return new Response('邮件保存成功', { status: 200 });
      } else {
        throw new Error('KV绑定不存在: temp-email');
      }
    } catch (error) {
      console.error('邮件处理失败:', error);
      return new Response(`邮件处理失败: ${error.message}`, { 
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
};
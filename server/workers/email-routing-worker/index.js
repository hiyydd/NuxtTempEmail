// Cloudflare Email Routing Worker
import * as PostalMime from 'postal-mime';

export default {
  async email(message, env, ctx) {
    console.log('message.from:', message.from)
    console.log('message.to:', message.to)
    console.log('message.headers:', message.headers)
    
    try {
      // 使用message.raw()获取原始邮件数据并通过PostalMime解析
      const rawEmail = await message.raw();
      const parser = new PostalMime.default();
      const parsedEmail = await parser.parse(rawEmail);
      
      console.log('成功解析邮件，主题:', parsedEmail.subject);
      
      // 提取邮件内容
      let textContent = parsedEmail.text || '';
      let htmlContent = parsedEmail.html || '';
      
      console.log('文本内容长度:', textContent.length);
      console.log('HTML内容长度:', htmlContent.length);
      
      if (textContent.length > 0) {
        console.log('文本内容前200字符:', textContent.substring(0, 200) + '...');
      }
      
      if (htmlContent.length > 0) {
        console.log('HTML内容前200字符:', htmlContent.substring(0, 200) + '...');
      }
      
      // 获取附件信息
      const attachments = parsedEmail.attachments || [];
      console.log('附件数量:', attachments.length);
      
      // 保存完整的邮件信息
      const email = {
        from: parsedEmail.from.value[0]?.address || message.from,
        to: message.to,
        subject: parsedEmail.subject || '(无主题)',
        content: htmlContent || textContent || '(无内容)',
        textContent: textContent,
        htmlContent: htmlContent,
        hasAttachments: attachments.length > 0,
        attachmentsCount: attachments.length,
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
        
        console.log('成功保存邮件到KV, 键:', emailKey);
        return new Response('邮件保存成功', { status: 200 });
      } else {
        throw new Error('KV绑定不存在: temp-email');
      }
    } catch (error) {
      console.error('邮件处理失败:', error);
      
      // 尝试最简单的处理方式，保存最基本的邮件信息
      try {
        if (env["temp-email"]) {
          const basicEmail = {
            from: message.from || 'unknown',
            to: message.to || 'unknown',
            subject: '(处理失败)',
            content: '邮件处理过程中出错: ' + error.message,
            receivedAt: Date.now(),
            processingError: error.message
          };
          
          const timestamp = Date.now();
          const emailAddress = (message.to || 'error').toLowerCase().trim();
          const emailKey = `${emailAddress}:${timestamp}:error`;
          
          await env["temp-email"].put(emailKey, JSON.stringify(basicEmail), {
            expirationTtl: 86400 // 24小时过期
          });
          
          console.log('保存了基本错误信息到KV');
        }
      } catch (e) {
        console.error('保存基本错误信息也失败了:', e);
      }
      
      return new Response(`邮件处理失败: ${error.message}`, { 
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
};
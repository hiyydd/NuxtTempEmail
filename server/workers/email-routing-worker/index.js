// Cloudflare Email Routing Worker
import * as PostalMime from 'postal-mime';

export default {
  async email(message, env, ctx) {
    console.log('message.from:', message.from)
    console.log('message.to:', message.to)
    console.log('message.headers:', message.headers)
    
    // 确保message对象有正确的属性
    if (!message.from || !message.to) {
      console.error('错误：message对象缺少必要的from或to属性');
    }
    
    // 检查message对象的所有属性
    console.log('message properties:', Object.getOwnPropertyNames(message));
    
    try {
      // 检测邮件内容的位置
      let rawEmail;
      
      if (typeof message.raw === 'function') {
        // 旧API - message.raw是函数
        rawEmail = await message.raw();
      } else if (message.raw) {
        // 新API - message.raw是属性
        rawEmail = message.raw;
      } else if (message.rawBytes) {
        // 备选属性
        rawEmail = message.rawBytes;
      } else if (message.text) {
        // 有些实现可能直接提供text
        rawEmail = message.text;
      } else if (message.body) {
        // 或者直接提供body
        rawEmail = message.body;
      } else {
        // 最后尝试使用消息本身
        rawEmail = message;
      }
      
      console.log('获取到rawEmail类型:', typeof rawEmail);
      
      const parser = new PostalMime.default();
      const parsedEmail = await parser.parse(rawEmail);
      
      console.log('成功解析邮件，主题:', parsedEmail.subject);
      
      // 调试parsedEmail.from结构
      if (parsedEmail.from === undefined) {
        console.log('警告：parsedEmail.from为undefined');
      } else {
        console.log('parsedEmail.from类型:', typeof parsedEmail.from);
        console.log('parsedEmail.from值:', JSON.stringify(parsedEmail.from));
      }
      
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
      
      // 安全地提取发件人
      let fromAddress = message.from; // 默认使用message.from
      
      // 非常安全地尝试从parsedEmail.from中提取地址
      if (parsedEmail.from) {
        try {
          if (typeof parsedEmail.from === 'string') {
            fromAddress = parsedEmail.from;
          } else if (parsedEmail.from.text) {
            fromAddress = parsedEmail.from.text;
          } else if (parsedEmail.from.html) {
            fromAddress = parsedEmail.from.html;
          } else if (parsedEmail.from.value) {
            if (Array.isArray(parsedEmail.from.value) && parsedEmail.from.value.length > 0) {
              const firstValue = parsedEmail.from.value[0];
              if (firstValue) {
                if (firstValue.address) {
                  fromAddress = firstValue.address;
                } else if (typeof firstValue === 'string') {
                  fromAddress = firstValue;
                }
              }
            } else if (typeof parsedEmail.from.value === 'string') {
              fromAddress = parsedEmail.from.value;
            }
          } else if (parsedEmail.from.address) {
            fromAddress = parsedEmail.from.address;
          } else if (parsedEmail.from.email) {
            fromAddress = parsedEmail.from.email;
          }
        } catch (e) {
          console.error('从parsedEmail.from提取地址时出错:', e);
          // 保持使用默认的message.from
        }
      }
      
      // 保存完整的邮件信息
      const email = {
        from: fromAddress,
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
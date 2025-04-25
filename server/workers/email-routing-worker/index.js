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
      const timestamp = Date.now();
      const email = {
        from: fromAddress,
        to: message.to,
        subject: parsedEmail.subject || '(无主题)',
        content: htmlContent || textContent || '(无内容)',
        textContent: textContent,
        htmlContent: htmlContent,
        hasAttachments: attachments.length > 0,
        attachmentsCount: attachments.length,
        receivedAt: timestamp
      };
      
      const emailAddress = message.to.toLowerCase().trim();
      
      // 只保存到D1数据库
      if (env.DB) {
        try {
          // 准备数据库字段
          const sqlData = {
            email_address: emailAddress,
            sender: fromAddress,
            subject: parsedEmail.subject || '(无主题)',
            content: htmlContent || textContent || '(无内容)',
            text_content: textContent,
            html_content: htmlContent,
            has_attachments: attachments.length > 0 ? 1 : 0, // SQLite布尔值转为0/1
            attachments_count: attachments.length,
            received_at: timestamp,
            processing_error: null,
            created_at: timestamp
          };
          
          // 构建INSERT语句
          const stmt = env.DB.prepare(`
            INSERT INTO emails (
              email_address, sender, subject, content, 
              text_content, html_content, has_attachments, 
              attachments_count, received_at, processing_error, created_at
            ) VALUES (
              ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
          `).bind(
            sqlData.email_address,
            sqlData.sender,
            sqlData.subject,
            sqlData.content,
            sqlData.text_content,
            sqlData.html_content,
            sqlData.has_attachments,
            sqlData.attachments_count,
            sqlData.received_at,
            sqlData.processing_error,
            sqlData.created_at
          );
          
          // 执行插入操作
          const result = await stmt.run();
          console.log('成功保存邮件到D1, ID:', result.meta?.last_row_id);
          return new Response(`邮件已成功保存到数据库，ID: ${result.meta?.last_row_id}`, { status: 200 });
        } catch (d1Error) {
          console.error('保存到D1失败:', d1Error);
          return new Response(`保存邮件失败: ${d1Error.message}`, { status: 500 });
        }
      } else {
        console.error('D1数据库绑定不存在');
        return new Response('D1数据库绑定不存在', { status: 500 });
      }
    } catch (error) {
      console.error('处理邮件时出错:', error);
      return new Response(`处理邮件失败: ${error.message}`, { status: 500 });
    }
  }
};
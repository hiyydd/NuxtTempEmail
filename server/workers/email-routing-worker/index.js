// Cloudflare Email Routing Worker

export default {
  async email(message, env, ctx) {
    console.log('message-----', message)
    console.log('message.from:', message.from)
    console.log('message.to:', message.to)
    console.log('message.headers:', message.headers)
    
    try {
      // 完全避免使用message.raw方法，转而使用更可靠的方法
      let emailString = '';
      
      try {
        // 检查message对象上可用的属性和方法
        const messageKeys = Object.keys(message);
        console.log('message对象可用的属性:', messageKeys);
        
        const messageProto = Object.getPrototypeOf(message);
        const messageMethods = Object.getOwnPropertyNames(messageProto);
        console.log('message对象可用的方法:', messageMethods);
      } catch (e) {
        console.log('无法检查message对象结构:', e.message);
      }
      
      // 尝试各种可能的方法获取邮件内容
      if (typeof message.text === 'function') {
        console.log('使用message.text()获取内容');
        emailString = await message.text();
      } else if (typeof message.content === 'function') {
        console.log('使用message.content()获取内容');
        emailString = await message.content();
      } else if (typeof message.plainText === 'function') {
        console.log('使用message.plainText()获取内容');
        emailString = await message.plainText();
      } else if (typeof message.body === 'function') {
        console.log('使用message.body()获取内容');
        emailString = await message.body();
      } else if (message.rawContent) {
        console.log('使用message.rawContent获取内容');
        emailString = typeof message.rawContent === 'function' 
          ? await message.rawContent()
          : message.rawContent.toString();
      } else {
        // 最后的备选方案：尝试从message直接获取信息
        console.log('尝试直接获取基本邮件信息');
        
        // 构建包含基本信息的字符串
        emailString = `From: ${message.from}\nTo: ${message.to}\n`;
        
        // 尝试获取主题
        if (message.headers && typeof message.headers.get === 'function') {
          const subject = message.headers.get('subject') || '(无主题)';
          emailString += `Subject: ${subject}\n\n`;
        }
        
        // 尝试将整个message对象序列化为JSON
        try {
          emailString += "Full message: " + JSON.stringify(message);
        } catch (e) {
          console.log('无法序列化message对象:', e.message);
        }
      }
      
      console.log('获取到的邮件内容长度:', emailString.length);
      if (emailString.length > 0) {
        console.log('邮件内容前200字符:', emailString.substring(0, 200) + '...');
      } else {
        console.log('警告: 未能获取到任何邮件内容');
      }
      
      // 解析邮件内容
      let textContent = emailString; // 默认使用获取到的内容作为文本内容
      let htmlContent = '';
      
      // 尝试从邮件中提取HTML内容
      try {
        // 方法1: 通过MIME标记查找HTML部分
        const htmlMarker = "Content-Type: text/html";
        let htmlStart = emailString.indexOf(htmlMarker);
        if (htmlStart > -1) {
          htmlStart = emailString.indexOf("\r\n\r\n", htmlStart) + 4;
          let htmlEnd = emailString.indexOf("--", htmlStart);
          if (htmlEnd === -1) {
            htmlEnd = emailString.length;
          }
          if (htmlStart > 0 && htmlEnd > htmlStart) {
            htmlContent = emailString.substring(htmlStart, htmlEnd).trim();
            console.log('通过MIME标记找到HTML内容');
          }
        }
        
        // 方法2: 如果方法1失败，尝试直接查找HTML标签
        if (!htmlContent) {
          const htmlStartIndex = emailString.indexOf('<html');
          if (htmlStartIndex > -1) {
            const htmlEndIndex = emailString.lastIndexOf('</html>');
            if (htmlEndIndex > -1 && htmlEndIndex > htmlStartIndex) {
              htmlContent = emailString.substring(htmlStartIndex, htmlEndIndex + 7);
              console.log('通过HTML标签找到HTML内容');
            }
          }
        }
      } catch (e) {
        console.log('解析HTML内容失败:', e.message);
      }
      
      // 保存基本邮件信息和内容
      const email = {
        from: message.from,
        to: message.to,
        subject: message.headers && typeof message.headers.get === 'function' 
                ? message.headers.get('subject') || '(无主题)' 
                : '(无主题)',
        content: htmlContent || textContent || '(无内容)',
        textContent: textContent || '',
        htmlContent: htmlContent || '',
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
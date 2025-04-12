// Cloudflare Worker for handling temporary email service

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// 更详细的日志
function logInfo(message, data = {}) {
  console.log(`[INFO] ${message}`, data);
}

function logError(message, error) {
  console.error(`[ERROR] ${message}`, error);
}

// KV namespace binding name: tempEmail

async function handleOptions(request) {
  return new Response(null, {
    headers: corsHeaders
  });
}

async function generateEmailAddress(env) {
  try {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let username = '';
    for (let i = 0; i < 8; i++) {
      username += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // 使用环境变量中的域名
    const domain = env.EMAIL_DOMAIN || "liaoxiang.fun";
    const emailAddress = `${username}@${domain}`;
    
    logInfo(`生成邮箱地址: ${emailAddress}`, { domain });
    return emailAddress;
  } catch (error) {
    logError("生成邮箱地址失败", error);
    throw error;
  }
}

async function handleNewEmail(request, env) {
  try {
    const email = await request.json();
    const timestamp = new Date().getTime();
    const emailId = `email:${timestamp}`;
    
    // 详细记录收到的邮件内容
    logInfo('收到新邮件', {
      from: email.from,
      to: email.to,
      subject: email.subject,
      hasText: !!email.text,
      textLength: email.text?.length || 0,
      contentLength: email.content?.length || 0
    });
    
    // 验证必要的邮件字段
    if (!email.from || !email.to || !email.subject) {
      logError('邮件缺少必要字段', { email });
      return new Response(JSON.stringify({ error: "缺少必要的邮件字段" }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // 确保 text 字段存在 - 如果没有，使用 content 或空字符串
    if (!email.text) {
      email.text = email.content || '';
      logInfo('自动添加 text 字段', { text: email.text.substring(0, 50) });
    }

    // 创建邮件索引
    const recipient = email.to;
    const recipientKey = `recipient:${recipient}`;
    
    // 获取当前收件人的邮件列表
    let emailIds = [];
    const existingEmails = await env["temp-email"].get(recipientKey);
    if (existingEmails) {
      emailIds = JSON.parse(existingEmails);
      logInfo('找到现有邮件索引', { recipient, count: emailIds.length });
    } else {
      logInfo('为收件人创建新索引', { recipient });
    }
    
    // 添加新邮件ID到列表
    emailIds.push(emailId);
    
    // 保存邮件数据，24小时过期
    await env["temp-email"].put(emailId, JSON.stringify(email), {
      expirationTtl: 86400 // 24小时
    });
    logInfo('邮件保存成功', { emailId });
    
    // 更新收件人索引
    await env["temp-email"].put(recipientKey, JSON.stringify(emailIds), {
      expirationTtl: 86400 // 24小时
    });
    logInfo('收件人索引更新成功', { recipient, totalEmails: emailIds.length });

    return new Response(JSON.stringify({ success: true, emailId }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    logError('处理新邮件失败', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

async function getEmails(request, env) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    
    if (!address) {
      logError('获取邮件时缺少地址参数');
      return new Response(JSON.stringify({ error: "需要提供邮箱地址" }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    logInfo(`获取邮件列表`, { address });
    
    // 使用收件人索引快速查找
    const recipientKey = `recipient:${address}`;
    logInfo(`查询收件人索引`, { recipientKey });
    
    const emailIdsStr = await env["temp-email"].get(recipientKey);
    
    if (!emailIdsStr) {
      logInfo(`未找到收件人索引`, { address });
      
      // 尝试直接查找所有 email: 前缀的键
      logInfo(`尝试列出所有邮件`);
      
      try {
        const allEmails = await env["temp-email"].list({ prefix: 'email:' });
        logInfo(`找到 ${allEmails.keys.length} 封邮件记录`);
        
        // 检查是否有任何邮件是发给这个地址的
        const emails = [];
        
        for (const key of allEmails.keys) {
          try {
            const emailData = await env["temp-email"].get(key.name);
            if (emailData) {
              const parsedEmail = JSON.parse(emailData);
              if (parsedEmail.to && parsedEmail.to.toLowerCase() === address.toLowerCase()) {
                logInfo(`找到匹配的邮件`, { id: key.name });
                emails.push({
                  id: key.name.split(':')[1],
                  ...parsedEmail
                });
              }
            }
          } catch (emailError) {
            logError(`解析邮件 ${key.name} 失败`, emailError);
          }
        }
        
        if (emails.length > 0) {
          logInfo(`找到 ${emails.length} 封邮件但索引丢失，重建索引`, { address });
          
          // 重建索引
          const emailIds = emails.map(e => `email:${e.id}`);
          await env["temp-email"].put(recipientKey, JSON.stringify(emailIds), {
            expirationTtl: 86400 // 24小时
          });
          
          // 按时间排序（最新的在前）
          emails.sort((a, b) => b.id - a.id);
          return new Response(JSON.stringify(emails), {
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          });
        }
      } catch (listError) {
        logError(`列出所有邮件失败`, listError);
      }
      
      // 如果找不到任何匹配的邮件，返回空数组
      return new Response(JSON.stringify([]), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    const emailIds = JSON.parse(emailIdsStr);
    logInfo(`找到收件人索引`, { count: emailIds.length });
    
    const emails = [];
    
    // 批量获取邮件
    for (const emailId of emailIds) {
      try {
        const emailData = await env["temp-email"].get(emailId);
        if (emailData) {
          const parsedEmail = JSON.parse(emailData);
          if (parsedEmail.to === address) {  // 二次验证地址匹配
            emails.push({
              id: emailId.split(':')[1],
              ...parsedEmail
            });
          } else {
            logInfo(`邮件地址不匹配`, { expected: address, actual: parsedEmail.to });
          }
        } else {
          logInfo(`未找到邮件`, { emailId });
        }
      } catch (emailError) {
        logError(`解析邮件 ${emailId} 失败`, emailError);
      }
    }
    
    logInfo(`找到 ${emails.length} 封邮件`, { address });
    
    // 按时间排序（最新的在前）
    emails.sort((a, b) => b.id - a.id);

    return new Response(JSON.stringify(emails), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    logError(`获取邮件列表失败`, error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

async function handleRequest(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  logInfo(`收到请求: ${request.method} ${path}`, { 
    url: url.toString(),
    headers: Object.fromEntries(request.headers)
  });

  if (request.method === 'OPTIONS') {
    return handleOptions(request);
  }

  try {
    switch (path) {
      case '/generate':
        const address = await generateEmailAddress(env);
        logInfo(`生成邮箱成功: ${address}`);
        return new Response(JSON.stringify({ address }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      case '/emails':
        logInfo(`获取邮件`, { query: url.search });
        return getEmails(request, env);
      case '/email':
        logInfo(`接收新邮件`);
        return handleNewEmail(request, env);
      default:
        logInfo(`未找到路径: ${path}`);
        return new Response('Not found', { status: 404 });
    }
  } catch (err) {
    logError(`请求处理错误: ${path}`, err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request, event.env));
});
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
    
    // 验证必要的邮件字段
    if (!email.from || !email.to || !email.subject || !email.text) {
      return new Response(JSON.stringify({ error: "缺少必要的邮件字段" }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // 创建邮件索引
    const recipient = email.to;
    const recipientKey = `recipient:${recipient}`;
    
    // 获取当前收件人的邮件列表
    let emailIds = [];
    const existingEmails = await env["temp-email"].get(recipientKey);
    if (existingEmails) {
      emailIds = JSON.parse(existingEmails);
    }
    
    // 添加新邮件ID到列表
    emailIds.push(emailId);
    
    // 保存邮件数据，24小时过期
    await env["temp-email"].put(emailId, JSON.stringify(email), {
      expirationTtl: 86400 // 24小时
    });
    
    // 更新收件人索引
    await env["temp-email"].put(recipientKey, JSON.stringify(emailIds), {
      expirationTtl: 86400 // 24小时
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
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
      return new Response(JSON.stringify({ error: "需要提供邮箱地址" }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    // 使用收件人索引快速查找
    const recipientKey = `recipient:${address}`;
    const emailIdsStr = await env["temp-email"].get(recipientKey);
    
    if (!emailIdsStr) {
      return new Response(JSON.stringify([]), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    const emailIds = JSON.parse(emailIdsStr);
    const emails = [];
    
    // 批量获取邮件
    for (const emailId of emailIds) {
      const emailData = await env["temp-email"].get(emailId);
      if (emailData) {
        const parsedEmail = JSON.parse(emailData);
        if (parsedEmail.to === address) {  // 二次验证地址匹配
          emails.push({
            id: emailId.split(':')[1],
            ...parsedEmail
          });
        }
      }
    }
    
    // 按时间排序（最新的在前）
    emails.sort((a, b) => b.id - a.id);

    return new Response(JSON.stringify(emails), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
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
// Cloudflare Worker for handling temporary email service

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// 简化日志
function logInfo(message, data = {}) {
  console.log(`[INFO] ${message}`);
}

function logError(message, error) {
  console.error(`[ERROR] ${message}`);
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
    
    return emailAddress;
  } catch (error) {
    logError("生成邮箱地址失败");
    throw error;
  }
}

async function handleNewEmail(request, env) {
  try {
    const email = await request.json();
    const timestamp = new Date().getTime();
    
    // 验证必要的邮件字段
    if (!email.from || !email.to || !email.subject) {
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
    }

    // 使用邮箱地址作为键的一部分，确保唯一性
    const emailAddress = email.to.toLowerCase().trim();
    const emailKey = `${emailAddress}:${timestamp}`;
    
    // 保存邮件数据，24小时过期
    await env["temp-email"].put(emailKey, JSON.stringify(email), {
      expirationTtl: 86400 // 24小时
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  } catch (error) {
    logError('处理新邮件失败');
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
    
    const normalizedAddress = address.toLowerCase().trim();
    
    try {
      // 直接使用邮箱地址前缀列出所有相关邮件
      const allEmails = await env["temp-email"].list({ prefix: `${normalizedAddress}:` });
      
      // 处理所有匹配邮件
      const emails = [];
      
      for (const key of allEmails.keys) {
        try {
          const emailData = await env["temp-email"].get(key.name);
          if (emailData) {
            const parsedEmail = JSON.parse(emailData);
            // 添加ID，使用时间戳部分
            const timestamp = key.name.split(':')[1];
            emails.push({
              id: timestamp,
              ...parsedEmail
            });
          }
        } catch (emailError) {
          logError(`解析邮件失败`);
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
    } catch (listError) {
      logError(`列出邮件失败`);
      
      return new Response(JSON.stringify([]), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  } catch (error) {
    logError(`获取邮件列表失败`);
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

  if (request.method === 'OPTIONS') {
    return handleOptions(request);
  }

  try {
    switch (path) {
      case '/generate':
        const address = await generateEmailAddress(env);
        return new Response(JSON.stringify({ address }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      case '/emails':
        return getEmails(request, env);
      case '/email':
        return handleNewEmail(request, env);
      default:
        return new Response('Not found', { status: 404 });
    }
  } catch (err) {
    logError(`请求处理错误`);
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
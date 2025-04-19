// Cloudflare Worker for handling temporary email service

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// 简化日志
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
    const domain = env.EMAIL_DOMAIN || "220901.xyz";
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
    
    // 检查 KV 绑定是否存在
    if (!env["temp-email"]) {
      logError('KV 绑定不存在: temp-email');
      return new Response(JSON.stringify({ error: 'KV 绑定不存在' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
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
      logError('获取邮件时缺少地址参数');
      return new Response(JSON.stringify({ error: "需要提供邮箱地址" }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    // 检查 KV 绑定是否存在
    if (!env || !env["temp-email"]) {
      logError('KV 绑定不存在: temp-email', { env: !!env });
      return new Response(JSON.stringify({ error: 'KV 绑定不存在', details: 'temp-email binding not found' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    const normalizedAddress = address.toLowerCase().trim();
    logInfo(`查询邮件，地址: ${normalizedAddress}`);
    
    try {
      // 获取缓存控制参数
      const noCache = searchParams.get('no_cache') === 'true';
      
      // 设置缓存控制标头
      const cacheHeaders = {
        'Content-Type': 'application/json',
        ...corsHeaders,
        // 如果请求明确要求不缓存，则禁用缓存
        ...(noCache ? {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        } : {
          // 否则允许缓存5秒，提高频繁查询性能
          'Cache-Control': 'public, max-age=5'
        })
      };
      
      // 尝试使用并行处理优化查询性能
      logInfo(`开始查询KV，前缀: ${normalizedAddress}:`);
      
      // 一次性列出所有键，限制更高以确保获取完整结果
      const allEmails = await env["temp-email"].list({ 
        prefix: `${normalizedAddress}:`,
        limit: 100 // 提高默认限制
      });
      
      logInfo(`KV查询结果，找到 ${allEmails.keys.length} 个键`);
      
      if (allEmails.keys.length === 0) {
        // 没有邮件时快速返回空数组
        return new Response(JSON.stringify([]), {
          headers: cacheHeaders
        });
      }
      
      // 使用Promise.all并行获取所有邮件内容
      const emailPromises = allEmails.keys.map(async (key) => {
        try {
          const emailData = await env["temp-email"].get(key.name);
          if (!emailData) {
            logError(`未找到邮件内容: ${key.name}`);
            return null;
          }
          
          const parsedEmail = JSON.parse(emailData);
          // 解析时间戳作为ID
          const timestamp = key.name.split(':')[1];
          // 添加接收时间
          return {
            id: timestamp,
            receivedAt: parseInt(timestamp, 10),
            ...parsedEmail,
            // 简化预览，不需要完整内容
            preview: parsedEmail.text ? parsedEmail.text.slice(0, 100) : (parsedEmail.subject || '无内容')
          };
        } catch (emailError) {
          logError(`解析邮件失败: ${key.name}`, emailError);
          return null;
        }
      });
      
      // 等待所有Promise完成
      const results = await Promise.all(emailPromises);
      
      // 过滤掉null值并按时间排序（最新的在前）
      const emails = results
        .filter(email => email !== null)
        .sort((a, b) => b.receivedAt - a.receivedAt);
      
      logInfo(`返回 ${emails.length} 封邮件`);
      
      return new Response(JSON.stringify(emails), {
        headers: cacheHeaders
      });
    } catch (listError) {
      logError(`列出邮件失败`, listError);
      
      return new Response(JSON.stringify({ error: '查询邮件失败', details: listError.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
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

/**
 * 清空指定邮箱的所有邮件
 * 处理 DELETE 请求，删除KV存储中特定邮箱的所有数据
 */
async function clearEmails(request, env) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    
    if (!address) {
      logError('清空邮件时缺少地址参数');
      return new Response(JSON.stringify({ error: "需要提供邮箱地址" }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    // 检查 KV 绑定是否存在
    if (!env || !env["temp-email"]) {
      logError('KV 绑定不存在: temp-email', { env: !!env });
      return new Response(JSON.stringify({ error: 'KV 绑定不存在', details: 'temp-email binding not found' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
    
    const normalizedAddress = address.toLowerCase().trim();
    logInfo(`准备清空邮件，地址: ${normalizedAddress}`);
    
    try {
      // 使用邮箱地址前缀列出所有相关邮件
      logInfo(`查询待删除邮件，前缀: ${normalizedAddress}:`);
      const allEmails = await env["temp-email"].list({ prefix: `${normalizedAddress}:` });
      logInfo(`查询结果，找到 ${allEmails.keys.length} 个待删除键`);
      
      if (allEmails.keys.length === 0) {
        return new Response(JSON.stringify({ 
          success: true,
          message: "没有找到需要删除的邮件",
          count: 0
        }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
      
      // 批量删除所有匹配的键
      const deletePromises = allEmails.keys.map(key => {
        logInfo(`删除邮件: ${key.name}`);
        return env["temp-email"].delete(key.name);
      });
      
      await Promise.all(deletePromises);
      
      logInfo(`成功删除 ${allEmails.keys.length} 封邮件`);
      
      return new Response(JSON.stringify({ 
        success: true,
        message: `成功删除 ${allEmails.keys.length} 封邮件`,
        count: allEmails.keys.length
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    } catch (listError) {
      logError(`列出或删除邮件失败`, listError);
      throw listError;
    }
  } catch (error) {
    logError(`清空邮件失败`, error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }
}

/**
 * 清空 KV 存储中的所有邮件
 * 处理 DELETE 请求，删除KV存储中的所有数据
 */
async function clearAllEmails(request, env) {
  try {
    // 检查 KV 绑定是否存在
    if (!env || !env["temp-email"]) {
      logError('KV 绑定不存在: temp-email', { env: !!env });
      return new Response(JSON.stringify({ error: 'KV 绑定不存在', details: 'temp-email binding not found' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    logInfo(`准备清空所有邮件`);

    let allKeys = [];
    let cursor = null;
    let count = 0;

    // 循环获取所有 key，因为 list 可能有数量限制
    do {
      const listResult = await env["temp-email"].list({ cursor: cursor });
      allKeys = allKeys.concat(listResult.keys);
      cursor = listResult.list_complete ? null : listResult.cursor;
    } while (cursor);

    logInfo(`查询结果，找到 ${allKeys.length} 个待删除键`);

    if (allKeys.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        message: "KV 存储中没有需要删除的数据",
        count: 0
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000); // Timestamp 24 hours ago
    let deletedCount = 0;
    const deletePromises = [];

    allKeys.forEach(key => {
      const parts = key.name.split(':');
      // Ensure there's a part after the last colon which should be the timestamp
      if (parts.length > 1) {
        const timestampStr = parts[parts.length - 1];
        const timestamp = parseInt(timestampStr, 10);
        // Check if parsing was successful and if the timestamp is older than one day ago
        if (!isNaN(timestamp) && timestamp < oneDayAgo) {
          logInfo(`删除过期键: ${key.name}`);
          deletePromises.push(env["temp-email"].delete(key.name));
          deletedCount++;
        } else if (isNaN(timestamp)) {
           logError(`无法将时间戳部分解析为数字: ${key.name}`);
        }
        // Optionally log keys that are kept
        // else { logInfo(`保留键: ${key.name}`); }
      } else {
        logError(`无法解析键名以获取时间戳: ${key.name}`);
      }
    });

    // Wait for all delete operations to complete
    await Promise.all(deletePromises);

    logInfo(`成功删除 ${deletedCount} 个过期键`);

    return new Response(JSON.stringify({
      success: true,
      message: `成功删除 ${deletedCount} 个1天前的键`,
      count: deletedCount
    }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });

  } catch (error) {
    logError(`清空所有邮件失败`, error);
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
  // 检查 env 对象是否存在
  if (!env) {
    logError('环境变量对象不存在');
    return new Response(JSON.stringify({ error: '服务器配置错误' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }

  const url = new URL(request.url);
  const path = url.pathname;

  if (request.method === 'OPTIONS') {
    return handleOptions(request);
  }

  try {
    // 处理 DELETE 请求清空邮件
    if (request.method === 'DELETE') {
      if (path === '/emails/clear') {
        return clearEmails(request, env);
      } else if (path === '/emails/clear-all') { // 新增清空所有邮件的路由
        return clearAllEmails(request, env);
      }
    }

    // 其他请求方法
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

// 使用新的模块格式导出处理函数
export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env);
  },

  // 添加 scheduled 事件处理程序以响应 Cron Triggers
  async scheduled(event, env, ctx) {
    logInfo(`Cron Trigger 启动: ${event.cron}`);
    try {
      // 调用 clearAllEmails 函数清理过期邮件
      // 注意：scheduled 事件没有 request 对象，所以第一个参数传 null 或一个模拟对象
      const result = await clearAllEmails(null, env);
      // 可以选择性地记录清理结果
      const resultBody = await result.json();
      logInfo('定时清理任务完成', resultBody);
    } catch (error) {
      logError('定时清理任务失败', error);
    }
  }
};

// 保留原有的事件监听器，以兼容旧版本
// 注意：对于模块 Worker，这个监听器通常不是必需的，
// 但保留它可以提供向后兼容性或在某些部署场景下有用。
// 如果确定只使用模块格式，可以考虑移除。
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request, event.env));
});
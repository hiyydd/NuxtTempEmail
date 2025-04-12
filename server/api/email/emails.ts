import { defineEventHandler, getQuery, createError } from 'h3';

const WORKER_URL = 'https://email-worker.2668812066.workers.dev';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const address = query.address as string;

  if (!address) {
    throw createError({
      statusCode: 400,
      message: '邮箱地址不能为空'
    });
  }

  // 添加重试机制
  const MAX_RETRIES = 2;
  
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`尝试获取邮件 (尝试 ${attempt + 1}/${MAX_RETRIES + 1}): ${WORKER_URL}/emails?address=${address}`);
      
      const response = await fetch(`${WORKER_URL}/emails?address=${address}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`获取到 ${data.length} 封邮件`);
        
        // 邮件按时间排序 - 确保最新邮件在前
        if (data && data.length > 0) {
          data.sort((a: any, b: any) => {
            // 尝试按 receivedAt 排序，如果没有则使用 id
            const timeA = a.receivedAt || parseInt(a.id);
            const timeB = b.receivedAt || parseInt(b.id);
            return timeB - timeA;
          });
        }
        
        return data;
      } else {
        const errorText = await response.text();
        console.warn(`获取邮件失败 (尝试 ${attempt + 1}): ${response.status} - ${errorText}`);
        
        // 如果不是最后一次尝试，等待后重试
        if (attempt < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
      }
    } catch (error: any) {
      console.error(`获取邮件出错 (尝试 ${attempt + 1}):`, error.message);
      
      // 如果不是最后一次尝试，等待后重试
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
    }
  }
  
  // 所有尝试都失败，返回空数组
  console.log('所有获取邮件尝试均失败，返回空数组');
  return [];
});
import { defineEventHandler, createError } from 'h3';

// 尝试两种方法获取邮箱地址
const WORKER_URL = 'https://email-worker.2668812066.workers.dev';

export default defineEventHandler(async () => {
  // 先尝试通过 Worker 获取
  try {
    console.log(`尝试方法1: 连接到 Worker ${WORKER_URL}/generate`);
    const response = await fetch(`${WORKER_URL}/generate`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('成功从 Worker 获取邮箱地址:', data);
      return data;
    } else {
      const errorText = await response.text();
      console.warn(`Worker 返回错误: ${response.status} - ${errorText}`);
      // 继续尝试方法2
    }
  } catch (error: any) {
    console.warn('通过 Worker 获取邮箱地址失败:', error.message);
    // 继续尝试方法2
  }
  
  // 方法2: 本地生成临时邮箱
  try {
    console.log('尝试方法2: 本地生成邮箱地址');
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let username = '';
    for (let i = 0; i < 8; i++) {
      username += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const address = `${username}@liaoxiang.fun`;
    console.log('本地生成邮箱地址成功:', address);
    return { address };
  } catch (error: any) {
    console.error('生成邮箱地址失败:', error);
    
    throw createError({
      statusCode: 500,
      message: '生成邮箱地址失败',
      data: { errorMessage: error.message }
    });
  }
});
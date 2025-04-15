import { defineEventHandler, createError } from 'h3';

// 尝试两种方法获取邮箱地址
const WORKER_URL = 'https://email-worker.2668812066.workers.dev';

export default defineEventHandler(async () => {
  // 先尝试通过 Worker 获取
  
  // 方法2: 本地生成临时邮箱
  try {
    console.log('尝试方法2: 本地生成邮箱地址');
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let username = '';
    for (let i = 0; i < 8; i++) {
      username += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const address = `${username}@220901.xyz`;
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
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

  try {
    console.log(`尝试获取邮件: ${WORKER_URL}/emails?address=${address}`);
    const response = await fetch(`${WORKER_URL}/emails?address=${address}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`获取到 ${data.length} 封邮件`);
      return data;
    } else {
      const errorText = await response.text();
      console.warn(`获取邮件失败: ${response.status} - ${errorText}`);
      // 在 Worker 失败时返回空列表
      console.log('返回空邮件列表');
      return [];
    }
  } catch (error: any) {
    console.error('获取邮件列表失败:', error);
    
    // 出错时返回空列表而不是抛出错误
    console.log('返回空邮件列表');
    return [];
  }
});
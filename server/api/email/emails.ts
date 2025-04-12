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
    const response = await fetch(`${WORKER_URL}/emails?address=${address}`);
    if (!response.ok) {
      throw new Error('Failed to fetch emails');
    }
    return await response.json();
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: '获取邮件列表失败'
    });
  }
});
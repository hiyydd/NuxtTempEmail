import { defineEventHandler, createError } from 'h3';

const WORKER_URL = 'https://email-worker.2668812066.workers.dev';

export default defineEventHandler(async () => {
  try {
    const response = await fetch(`${WORKER_URL}/generate`);
    if (!response.ok) {
      throw new Error('Failed to generate email address');
    }
    return await response.json();
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: '生成邮箱地址失败'
    });
  }
});
import { defineEventHandler, getQuery, createError } from 'h3';

const WORKER_URL = 'https://email-worker.2668812066.workers.dev';

// 生成新的临时邮箱地址
export const generateEmail = defineEventHandler(async () => {
  try {
    const response = await fetch(`${WORKER_URL}/generate`);
    if (!response.ok) {
      throw new Error('Failed to generate email address');
    }
    return await response.json();
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Error generating email address'
    });
  }
});

// 获取指定邮箱地址的所有邮件
export const getEmails = defineEventHandler(async (event) => {
  const query = getQuery(event);
  const address = query.address;

  if (!address) {
    throw createError({
      statusCode: 400,
      message: 'Email address is required'
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
      message: 'Error fetching emails'
    });
  }
});
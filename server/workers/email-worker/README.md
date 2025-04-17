# Email Worker

这是一个Cloudflare Worker，用于处理临时邮箱服务的后端功能。

## 功能

- 生成临时邮箱地址
- 接收和存储邮件
- 查询特定邮箱的邮件
- 清空特定邮箱的所有邮件

## 部署步骤

1. 确保已安装Wrangler CLI：
   ```
   npm install -g wrangler
   ```

2. 登录Cloudflare账号：
   ```
   wrangler login
   ```

3. 部署Worker：
   ```
   cd server/workers/email-worker
   wrangler publish
   ```

## API接口

### 生成临时邮箱地址

- **URL**: `/generate`
- **方法**: `GET`
- **返回**: 
  ```json
  { "address": "随机生成的邮箱地址" }
  ```

### 接收新邮件

- **URL**: `/email`
- **方法**: `POST`
- **数据**: 邮件对象
- **返回**: 
  ```json
  { "success": true }
  ```

### 获取邮件列表

- **URL**: `/emails?address=user@domain.com`
- **方法**: `GET`
- **参数**: address - 邮箱地址
- **返回**: 邮件数组

### 清空邮箱 (新增功能)

- **URL**: `/emails/clear?address=user@domain.com`
- **方法**: `DELETE`
- **参数**: address - 要清空的邮箱地址
- **返回**: 
  ```json
  { 
    "success": true,
    "message": "成功删除 X 封邮件",
    "count": X
  }
  ```

## 使用示例

### 前端清空邮箱示例代码

```javascript
async function clearEmails(emailAddress) {
  try {
    const WORKER_URL = 'https://email-worker.2668812066.workers.dev';
    const url = `${WORKER_URL}/emails/clear?address=${encodeURIComponent(emailAddress.trim())}`;
    
    const response = await fetch(url, { 
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`清空邮件失败: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('清空邮件返回数据:', data);
    return data;
  } catch (error) {
    console.error('清空邮件失败:', error);
    throw error;
  }
}
```

## 注意事项

- 所有邮件在KV存储中的过期时间为24小时
- 清空邮箱功能会永久删除所有相关邮件，无法恢复
- API具有CORS支持，可以从任何域调用 
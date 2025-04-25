// D1数据库迁移脚本
// 用于创建并初始化D1数据库

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// 读取schema.sql文件
const schemaPath = path.join(__dirname, 'schema.sql');
const schemaSql = fs.readFileSync(schemaPath, 'utf8');

console.log('准备创建D1数据库...');

try {
  // 1. 创建D1数据库（如果尚未创建）
  console.log('创建D1数据库...');
  console.log('执行: wrangler d1 create temp_email_db');
  console.log('注意: 如果数据库已存在，此命令会失败，这是正常的');
  
  try {
    const createOutput = execSync('wrangler d1 create temp_email_db', { stdio: 'pipe' }).toString();
    console.log('创建结果:');
    console.log(createOutput);
    
    // 从输出中提取database_id
    const match = createOutput.match(/database_id\s*=\s*"([^"]+)"/);
    if (match && match[1]) {
      const databaseId = match[1];
      console.log(`请确保在wrangler.toml中设置正确的database_id: ${databaseId}`);
    }
  } catch (err) {
    console.log('数据库可能已存在，继续执行...');
  }
  
  // 2. 将schema.sql写入临时文件
  const tempSqlPath = path.join(__dirname, 'temp_schema.sql');
  fs.writeFileSync(tempSqlPath, schemaSql, 'utf8');
  
  // 3. 应用数据库迁移
  console.log('应用数据库迁移到远程服务器...');
  console.log('执行: wrangler d1 execute temp_email_db --remote --file=temp_schema.sql');
  
  const migrateOutput = execSync('wrangler d1 execute temp_email_db --remote --file=temp_schema.sql', { stdio: 'pipe' }).toString();
  console.log('迁移结果:');
  console.log(migrateOutput);
  
  // 4. 清理临时文件
  fs.unlinkSync(tempSqlPath);
  
  console.log('迁移完成！✅');
  console.log('⚠️ 请确保在wrangler.toml中设置了正确的database_id');
  
} catch (error) {
  console.error('迁移过程中出错:', error.message);
  // 尝试清理临时文件
  try {
    const tempSqlPath = path.join(__dirname, 'temp_schema.sql');
    if (fs.existsSync(tempSqlPath)) {
      fs.unlinkSync(tempSqlPath);
    }
  } catch (e) {
    // 忽略清理错误
  }
  process.exit(1);
} 
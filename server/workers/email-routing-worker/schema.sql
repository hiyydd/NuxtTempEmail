-- 临时邮箱数据表
CREATE TABLE IF NOT EXISTS emails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email_address TEXT NOT NULL,     -- 邮箱地址(收件人)
  sender TEXT NOT NULL,            -- 发件人
  subject TEXT NOT NULL,           -- 邮件主题
  content TEXT NOT NULL,           -- 邮件内容(HTML或纯文本)
  text_content TEXT,               -- 纯文本内容
  html_content TEXT,               -- HTML内容
  has_attachments BOOLEAN,         -- 是否有附件
  attachments_count INTEGER,       -- 附件数量
  received_at INTEGER NOT NULL,    -- 接收时间(Unix时间戳)
  processing_error TEXT,           -- 处理错误(如有)
  created_at INTEGER NOT NULL,     -- 记录创建时间
  -- 创建复合索引提高查询效率
  UNIQUE(email_address, received_at)
);

-- 创建索引以便快速查询某邮箱的所有邮件
CREATE INDEX IF NOT EXISTS idx_email_address ON emails (email_address);
-- 创建索引以便按接收时间排序
CREATE INDEX IF NOT EXISTS idx_received_at ON emails (received_at); 
# Anonymous Comments API

这个目录提供一个 Cloudflare Worker + D1 的匿名评论 API。

功能：

- 不需要 GitHub 登录
- 每条评论最多 60 字
- 只保存 IP 前缀，例如 `123.45.*.*`
- 按器材 `equipmentId` 读取评论

部署后，把 Worker 地址写入仓库根目录的 `config.js`：

```js
window.COMMENTS_API_URL = "https://your-worker.your-subdomain.workers.dev";
```

需要创建 D1 数据库，并执行 `schema.sql`。Worker 里需要绑定名为 `DB` 的 D1 binding。

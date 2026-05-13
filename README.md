# Table Tennis Equipment Database

乒乓器材数据库，一个纯静态的乒乓球器材筛选原型，适合部署到 GitHub Pages。

## 本地运行

```powershell
cd D:\Coding\table-tennis-equipment-db
python -m http.server 8000
```

然后打开：

```text
http://localhost:8000
```

## 数据维护

器材数据在 `data/equipment.json`。产品图片不存本地，只在 JSON 里填写图片 URL。

当前筛选逻辑：

- 同一项目下多选为 OR，例如厚度选 `2.1` 和 `2.15`，满足任一厚度即可。
- 不同项目之间为 AND，例如品牌为红双喜，同时海绵为高密海绵，同时价格为 80-100。

## 评论功能

GitHub Pages 不能直接接收评论或读取访问者 IP。项目已加入 `cloudflare-worker/`，可部署为匿名评论 API。

部署后更新 `config.js`：

```js
window.COMMENTS_API_URL = "https://your-worker.your-subdomain.workers.dev";
```

评论策略：

- 任何人可评论
- 每条最多 60 字
- 只保存 IP 前缀，例如 `123.45.*.*`
- 不保存完整 IP

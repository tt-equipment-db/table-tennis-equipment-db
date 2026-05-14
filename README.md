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

## Discussions 评论

评论区计划使用 Giscus，把每个器材详情页映射到 GitHub Discussions。

识别方式：

```text
equipment:<器材 id>
```

例如：

```text
equipment:dhs-hurricane-3-neo
equipment:yinhe-jupiter-3
```

这样即使器材名称或页面标题以后修改，只要 `id` 不变，对应的讨论串就不会变。

启用步骤：

1. 在 GitHub 仓库开启 Discussions。
2. 安装并配置 Giscus。
3. 在 `config.js` 填入 `repoId` 和 `categoryId`。

在配置完成前，详情页会显示一个评论占位提示。

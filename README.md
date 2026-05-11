# Table Tennis Equipment Database

乒乓器材数据库

一个纯静态的乒乓球器材筛选原型，适合部署到 GitHub Pages。

## 本地运行

```powershell
cd D:\Coding\pingpong-equipment-db
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

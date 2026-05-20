# Table Tennis Gear Database

乒乓器材数据库，用来查询、筛选和补充胶皮、底板资料。

网站地址：

https://ttgear.github.io/

## 我想帮忙补充器材

你不需要会写程序，只要会用 GitHub 网页编辑文件即可。

1. 打开数据文件：[`data/equipment.json`](data/equipment.json)
2. 点击右上角铅笔图标编辑。
3. 在 `rubbers` 里添加胶皮，或在 `blades` 里添加底板。
4. 复制下面的模板，改成真实资料。
5. 页面底部选择 `Propose changes`，提交 Pull Request。

维护者检查后会合并。合并后，网站会自动更新。

## 胶皮模板

把这段放进 `rubbers` 数组里。注意前后逗号要保持 JSON 格式正确。

```json
{
  "id": "brand-product-name",
  "name": "器材名称",
  "brand": "中文品牌",
  "brandEn": "English Brand",
  "series": "系列",
  "price": 100,
  "priceMin": 80,
  "priceMax": 120,
  "currency": "CNY",
  "image": "图片网址",
  "description": "一句话说明它适合什么打法、手感大概如何。",
  "tags": {
    "brand": ["中文品牌", "English Brand"],
    "position": ["正手", "反手"],
    "rubberType": ["反胶", "粘性胶面"],
    "sponge": ["高密海绵"],
    "thickness": ["2.1", "Max"],
    "hardness": ["中硬"],
    "style": ["弧圈", "控制"],
    "origin": ["中国"]
  },
  "sources": ["资料来源网址或店铺页面名"],
  "contributors": ["你的名字或 GitHub ID"]
}
```

## 底板模板

把这段放进 `blades` 数组里。

```json
{
  "id": "brand-blade-name",
  "name": "底板名称",
  "brand": "中文品牌",
  "brandEn": "English Brand",
  "series": "系列",
  "price": 300,
  "priceMin": 250,
  "priceMax": 360,
  "currency": "CNY",
  "image": "图片网址",
  "description": "一句话说明结构、速度、控制或适合打法。",
  "tags": {
    "brand": ["中文品牌", "English Brand"],
    "structure": ["五夹纯木"],
    "material": ["纯木"],
    "position": ["弧圈", "控制"],
    "handle": ["FL", "CS"],
    "speed": ["OFF-"],
    "feel": ["清晰", "中硬"],
    "weight": ["80-85g", "85-90g"],
    "origin": ["中国"]
  },
  "sources": ["资料来源网址或店铺页面名"],
  "contributors": ["你的名字或 GitHub ID"]
}
```

## 字段怎么填

- `id`：唯一英文小写 ID，用短横线连接，例如 `dhs-hurricane-3-commercial`。
- `price`：大概参考价，用于排序。
- `priceMin` / `priceMax`：更推荐填写价格区间。
- `image`：图片网址即可，不需要上传图片到仓库。
- `description`：尽量一句话，别写广告语。
- `tags`：用于筛选。一个项目可以有多个标签。
- `sources`：资料来源，方便别人核对。
- `contributors`：贡献者名字，可以写昵称或 GitHub ID。

## 修改已有器材

也可以直接编辑已有条目，例如补充图片、价格区间、标签、资料来源。

如果不确定某个参数是否准确，可以在 Pull Request 里说明：

```text
这个价格来自某某店铺，可能随活动变化。
硬度标签不确定，请维护者再看一下。
```

## 本地预览

如果你想在自己电脑预览：

```powershell
python -m http.server 8000
```

然后打开：

```text
http://localhost:8000
```

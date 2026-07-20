# Table Tennis Gear Database

一个面向乒乓球爱好者的器材资料库，用来查找、筛选和补充套胶、底板、膨胀油信息。

网站地址：

https://ttgear.github.io/

这里不是官方参数表，而是一个社区共同维护的器材索引。价格、手感、标签和图片都可能随着版本、渠道和个人体验变化，所以每条资料都欢迎补充来源、修正错误。

## 我想帮忙，应该怎么做？

如果你只是想补充一条器材、纠正一个错误、增加图片或价格区间，推荐走最简单的方式：

1. 打开项目仓库：https://github.com/ttgear/ttgear.github.io
2. 点上方的 `Issues`
3. 点 `New issue`
4. 选择“补充或修改器材资料”
5. 按表格填写你知道的信息
6. 点 `Submit new issue`

维护者看到后会检查资料，并整理进数据库。你不需要会写代码。

如果你会使用 GitHub，也可以直接修改数据文件并提交 Pull Request。数据文件是：

```text
data/equipment.json
```

## 最推荐提交哪些信息？

能填多少填多少，不确定的可以留空。最有用的信息是：

- 品牌和型号，例如“银河 木星 3 亚洲”
- 类型：套胶、底板或膨胀油
- 参考价格区间，例如“60-110 元”
- 套胶厚度、胶面类型、海绵类型；硬度只写商品内部标注，不作为筛选标准
- 底板结构、重量范围、打法/特色标签、是否有直板柄
- 膨胀油品牌、规格、主要效果、晾干速度和持久时间
- 图片网址，最多 5 张
- 资料来源，例如官网、店铺页面、评测帖、自己实物照片链接
- 你的贡献者名字，可以是真名、昵称或 GitHub ID

图片不用上传到这个仓库。只要填写图片网址即可。

## 图片怎么填？

`image` 是主图，`images` 是详情页轮播图。里面写的都是图片地址。

示例：

```json
"image": "https://example.com/main.jpg",
"images": [
  "https://example.com/front.jpg",
  "https://example.com/sponge.jpg",
  "https://example.com/package.jpg"
]
```

建议最多 5 张：

- 包装正面
- 胶面细节
- 海绵或底板侧面
- 参数图
- 实物图

请尽量使用稳定的图片地址。如果图片来自店铺，后续可能失效，维护者可以再替换。

## 关于器材 ID

器材的 `id` 会关联网页地址、短评和体感评分。上线后不要随便改。

未来会逐步使用更稳定的编号：

```text
rubber-1
rubber-2
blade-1
blade-2
```

普通贡献者不需要自己决定正式 ID。你可以在 Issue 里不填 ID，由维护者统一分配。

如果你直接改 `data/equipment.json`，新器材可以先写一个临时 ID，例如：

```json
"id": "todo-rubber-yinhe-jupiter-3-asia"
```

维护者合并前会改成正式编号。已经上线的旧 ID 如果必须修改，会放进 `legacyIds`，避免旧评分和短评丢失。

## 方式一：发 Issue，最适合普通用户

适合这些情况：

- 我想新增一个套胶
- 我想新增一个底板
- 我想新增一种膨胀油
- 我发现价格、图片、厚度、商品内部硬度写错了
- 我不想碰 JSON

入口：

https://github.com/ttgear/ttgear.github.io/issues/new/choose

提交时可以这样写：

```text
类型：套胶
品牌：银河 / Yinhe
型号：木星 3 亚洲
参考价格：60-110 元
厚度：2.1、Max
硬度：偏硬
胶面：粘性反胶
适合：正手、弧圈、发抢
图片：
https://example.com/image1.jpg
https://example.com/image2.jpg
来源：某店铺页面、球友评测、自己实物
贡献者：你的昵称
```

## 方式二：直接改 JSON，适合会一点 GitHub 的用户

1. 打开数据文件：

   https://github.com/ttgear/ttgear.github.io/blob/main/data/equipment.json

2. 点右上角铅笔按钮编辑。

3. 套胶放到 `rubbers` 数组里，底板放到 `blades` 数组里，膨胀油放到 `boosters` 数组里。

4. 复制下面模板，改成真实资料。

5. 页面底部选择 `Propose changes`，提交 Pull Request。

6. 维护者检查后合并。合并后网站会更新。

注意：JSON 对逗号和引号很敏感。如果提交失败或不会改，可以直接发 Issue。

## 套胶模板

```json
{
  "id": "todo-rubber-brand-model",
  "name": "器材名称",
  "brand": "中文品牌",
  "brandEn": "English Brand",
  "series": "系列",
  "releaseDate": "2026-07-21",
  "price": 100,
  "priceMin": 80,
  "priceMax": 120,
  "currency": "CNY",
  "image": "https://example.com/main.jpg",
  "images": [
    "https://example.com/detail-1.jpg",
    "https://example.com/detail-2.jpg"
  ],
  "description": "一句话说明它的大致特点和适合打法。",
  "tags": {
    "brand": ["中文品牌", "English Brand"],
    "position": ["正手", "反手"],
    "rubberType": ["反胶", "粘性胶面"],
    "sponge": ["高密海绵"],
    "thickness": ["2.1", "Max"],
    "hardness": ["商品内部标注的硬度，如 39度、40度、Max Medium"],
    "style": ["弧圈", "控制"],
    "origin": ["中国"]
  },
  "sources": ["资料来源网址或页面名称"],
  "contributors": ["你的名字或 GitHub ID"]
}
```

## 底板模板

```json
{
  "id": "todo-blade-brand-model",
  "name": "底板名称",
  "brand": "中文品牌",
  "brandEn": "English Brand",
  "series": "系列",
  "releaseDate": "2026-07-21",
  "price": 300,
  "priceMin": 250,
  "priceMax": 360,
  "currency": "CNY",
  "image": "https://example.com/main.jpg",
  "images": [
    "https://example.com/front.jpg",
    "https://example.com/side.jpg"
  ],
  "description": "一句话说明结构、速度、控制或适合打法。",
  "tags": {
    "brand": ["中文品牌", "English Brand"],
    "bladeType": ["纯木"],
    "structure": ["五层纯木"],
    "speed": ["中等"],
    "feel": ["清晰", "中硬"],
    "style": ["弧圈", "控制"],
    "handle": ["横板", "直板", "FL", "CS"],
    "weight": ["80-85g", "85-90g"],
    "origin": ["中国"]
  },
  "sources": ["资料来源网址或页面名称"],
  "contributors": ["你的名字或 GitHub ID"]
}
```

已知准确上市日期时用 `releaseDate`（`YYYY-MM-DD`）；只知道年份时可改用 `"releaseYear": 2026`。首页会优先展示较新的器材，不确定时请不要猜日期。

## 价格怎么写？

器材价格经常浮动，所以更推荐写区间：

```json
"priceMin": 80,
"priceMax": 120,
"price": 100
```

`price` 可以写大概中间值，用来排序；`priceMin` 和 `priceMax` 用来展示“约 80-120 元”。

## 贡献者名字会显示吗？

会。只要条目里有：

```json
"contributors": ["你的名字"]
```

网站详情页就可以显示贡献者。多人共同维护同一个器材时，可以写成：

```json
"contributors": ["Alice", "Bob"]
```

GitHub 不会自动帮你把名字写进 JSON。如果你希望显示贡献者名字，请在 Issue 或 Pull Request 里写清楚。

## 哪些资料更容易被合并？

更容易合并：

- 有清楚品牌和型号
- 有价格区间，而不是只写“很便宜”
- 有图片链接
- 有资料来源
- 标签不要写太夸张，例如“神胶”“无敌”“最强”

需要再确认：

- 只有口头印象，没有型号
- 图片打不开
- 价格明显只是一家店的活动价
- 把不同版本混在一起，例如普狂、省狂、国狂混为一条

## 本地预览

如果你想在自己电脑上预览：

```powershell
python -m http.server 8000
```

然后打开：

```text
http://localhost:8000
```

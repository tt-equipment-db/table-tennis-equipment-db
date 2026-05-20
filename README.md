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

维护者检查后会合并。合并后，网站会自动更新。你不需要把 JSON 单独发给维护者，也不需要手工粘贴到数据库；直接修改 `data/equipment.json` 并提交 Pull Request 就可以。

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
  "images": [
    "图片网址 1",
    "图片网址 2"
  ],
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
  "images": [
    "图片网址 1",
    "图片网址 2"
  ],
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

- `id`：唯一英文小写 ID，用短横线连接，例如 `dhs-hurricane-3-commercial`。如果不会写，先按“品牌-型号”写，维护者合并前可以帮你调整。
- `legacyIds`：如果已经上线的器材后来必须改 `id`，把旧 ID 放到这里，例如 `"legacyIds": ["old-product-id"]`，旧评论和评分仍可读取。
- `price`：大概参考价，用于排序。
- `priceMin` / `priceMax`：更推荐填写价格区间。
- `image`：主图网址。
- `images`：更多图片网址，最多建议 5 张。图片只是外链，不占这个网站或后端数据库空间。
- `description`：尽量一句话，别写广告语。
- `tags`：用于筛选。一个项目可以有多个标签。
- `sources`：资料来源，方便别人核对。
- `contributors`：贡献者名字，可以写昵称或 GitHub ID。

## 关于 ID、评论和评分

器材的 `id` 会用于网页地址，也会关联后端里的短评和体感评分。器材刚提交时，维护者可以调整 `id`；一旦合并上线，尽量不要再改。

如果确实需要改名，例如原来写错了型号，可以这样处理：

```json
"id": "new-correct-id",
"legacyIds": ["old-wrong-id"]
```

这样旧 ID 下的评分和短评还能被读取到。

## 贡献者名字会自动保留吗

如果你在条目里写了：

```json
"contributors": ["你的名字"]
```

合并后网页会显示你的名字。多人维护同一个器材时，可以把名字加进同一个数组：

```json
"contributors": ["Alice", "Bob"]
```

GitHub 不会自动替你合并贡献者名字；你或维护者需要在 JSON 里保留这些名字。Pull Request 合并后，这些内容就会进入网站数据。

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

# Heart Wallpaper

一个静态手机壁纸展示站。壁纸图片直接存放在 GitHub 仓库中，页面通过 `data/wallpapers.json` 渲染图库。

## Structure

```text
index.html
styles.css
script.js
data/
  wallpapers.json
assets/
  wallpapers/
    2026-05-06/
      example-wallpaper.png
```

## Wallpaper Metadata

`data/wallpapers.json` 是壁纸索引。每张壁纸建议使用下面的结构：

```json
[
  {
    "title": "Neon Heart",
    "description": "Pink neon heart wallpaper",
    "src": "assets/wallpapers/2026-05-06/neon-heart.png",
    "thumbnail": "assets/wallpapers/2026-05-06/neon-heart.png",
    "filename": "neon-heart.png",
    "ratio": "9:16",
    "tags": ["heart", "neon", "pink"],
    "alt": "Pink neon heart wallpaper for mobile"
  }
]
```

## Content Workflow

1. 生成新的 9:16 手机壁纸。
2. 将图片放入 `assets/wallpapers/YYYY-MM-DD/`。
3. 在 `data/wallpapers.json` 追加对应元数据。
4. 推送到 GitHub，网站自动展示新壁纸。

## Notes

当前方案不需要后端，也不需要前端 API Key。AI 生图只发生在内容生产流程里，用户访问网站时只浏览和下载已生成的图片。

# W.Keith 科研博客写作与发布指南

这份指南覆盖一次完整的写作周期：同步仓库、创建草稿、插入公式/代码/图片/文献、预览、发布和排错。

## 1. 首次环境准备

需要安装：

- [Git](https://git-scm.com/downloads)
- [Quarto](https://quarto.org/docs/get-started/)
- 任意文本编辑器，推荐 VS Code 与 Quarto 扩展

确认环境：

```powershell
git --version
quarto check
```

博客本地仓库位于：

```text
F:\OHYCode\blog\repo
```

进入仓库并同步远端：

```powershell
Set-Location F:\OHYCode\blog\repo
git status
git pull --ff-only origin master
```

如果 `git status` 显示有未提交修改，先处理这些修改，再执行 `git pull`。

## 2. 创建一篇新文章

文章采用“一篇文章一个目录”的结构：

```text
posts/
└── 2026-10-01-example-topic/
    ├── index.qmd
    ├── figure-1.png
    └── data.csv
```

目录名建议使用 `YYYY-MM-DD-英文短标题`，避免空格和中文标点。例如：

```powershell
New-Item -ItemType Directory -Path posts/2026-10-01-example-topic
New-Item -ItemType File -Path posts/2026-10-01-example-topic/index.qmd
```

将以下模板复制到 `index.qmd`：

````markdown
---
title: "文章标题"
description: "用一两句话概括文章内容"
date: 2026-10-01
date-modified: 2026-10-01
categories:
  - 论文阅读
  - 研究方向
draft: true
---

## 背景

这篇文章试图回答什么问题？

## 核心内容

正文从这里开始。

## 结论与思考

- 得到了什么结论？
- 证据是否充分？
- 下一步准备做什么？
````

`draft: true` 表示草稿：本地预览可以看到，但正式构建不会发布。完成后将其改成 `draft: false`。

## 3. 常用科研写作格式

### 数学公式

行内公式：

```markdown
模型输出记为 $p(y \mid x)$。
```

块级公式：

```markdown
$$
\mathcal{L} = -\sum_i y_i \log \hat{y}_i
$$
```

### 代码块

````markdown
```python
import numpy as np

values = np.array([1, 2, 3])
print(values.mean())
```
````

需要显示代码执行结果时，可使用 Quarto 代码单元：

````markdown
```{python}
#| echo: true
#| warning: false

import numpy as np
np.mean([1, 2, 3])
```
````

### 图片

把图片放入文章目录，然后使用相对路径：

```markdown
![实验结果](figure-1.png){fig-alt="实验结果曲线" width=80%}
```

建议：

- 优先使用 PNG、WebP 或 SVG；
- 图片文件名使用英文、数字和连字符；
- 为图片填写有意义的替代文本；
- 不要把大型原始数据或模型权重提交到博客仓库。

### 文献引用

在根目录的 `references.bib` 中加入 BibTeX：

```bibtex
@article{example2026,
  title   = {Example Research Paper},
  author  = {Author, Alice and Author, Bob},
  journal = {Example Journal},
  year    = {2026}
}
```

正文引用：

```markdown
已有研究提出了类似方法 [@example2026]。

@example2026 认为该问题可以从另一个角度理解。
```

Quarto 会自动生成正文引用和文末参考文献。

## 4. 本地预览

在仓库根目录运行：

```powershell
quarto preview
```

浏览器会打开本地预览，保存文件后通常会自动刷新。重点检查：

- 标题、日期和分类是否正确；
- 公式是否正常渲染；
- 代码高亮和执行结果是否正确；
- 图片是否清晰且路径无误；
- 文献引用是否存在对应的 BibTeX key；
- 手机宽度下是否仍容易阅读。

完成预览后，在终端按 `Ctrl+C` 停止预览服务。

## 5. 发布前检查

将文章头部改为：

```yaml
draft: false
```

执行完整构建：

```powershell
quarto render
```

查看 Git 变更：

```powershell
git status
git diff --check
git diff
```

不要提交 `_site/` 和 `.quarto/`；它们已经写入 `.gitignore`。

## 6. 提交并发布

```powershell
git add .
git commit -m "Add note about example topic"
git push origin master
```

推送后的流程是：

```text
master 源文件
    → GitHub Actions 渲染 Quarto
    → gh-pages 发布产物
    → https://valik601.github.io
```

打开仓库的 **Actions** 页面，确认 `Quarto Publish` 和 `pages build and deployment` 均为绿色。通常几分钟内网站会更新。

## 7. 修改已经发布的文章

直接编辑原文章的 `index.qmd`，并更新：

```yaml
date-modified: 2026-10-02
```

然后重复：

```powershell
quarto preview
quarto render
git add .
git commit -m "Update note about example topic"
git push origin master
```

不要使用动态日期（例如 `today`），否则文章排序和 RSS 顺序可能在每次构建时变化。

## 8. 计算型文章

项目已启用 Quarto `freeze`。包含 Python、R 或 Julia 计算的文章应先在本地单独渲染：

```powershell
quarto render posts/2026-10-01-example-topic/index.qmd
```

生成的 `_freeze/` 结果需要提交到 Git。这样 GitHub Actions 不必重新安装科研环境或重跑历史实验。

建议同时保存依赖文件，例如：

- Python：`requirements.txt` 或 `environment.yml`
- R：`renv.lock`
- Julia：`Project.toml` 与 `Manifest.toml`

## 9. 常见问题

### 网站没有更新

依次检查：

1. `git push` 是否成功；
2. GitHub Actions 中 `Quarto Publish` 是否成功；
3. `pages build and deployment` 是否成功；
4. 强制刷新浏览器：`Ctrl+F5`；
5. 确认文章不是 `draft: true`。

### 公式显示异常

- 检查 `$...$` 和 `$$...$$` 是否成对；
- 检查 LaTeX 命令是否拼写正确；
- 先用一个最小公式定位问题。

### 找不到文献

- 检查 `references.bib` 中是否存在对应 key；
- 正文中的 `[@key]` 必须与 BibTeX key 完全一致；
- 检查 BibTeX 条目括号和逗号是否完整。

### 构建成功但页面还是旧内容

- 等待 Pages 部署完成；
- 使用 `Ctrl+F5` 跳过浏览器缓存；
- 确认 Pages 发布源仍是 `gh-pages` 分支的根目录。

## 10. 推荐的文章结构

论文阅读笔记建议包含：

1. 论文解决的问题；
2. 核心假设；
3. 方法与公式；
4. 实验设计；
5. 主要结果；
6. 局限和可能的偏差；
7. 与自己研究的关联；
8. 可复现资源。

实验记录建议包含：

1. 实验目标；
2. 环境、数据和版本；
3. 参数设置；
4. 结果与图表；
5. 失败尝试；
6. 结论；
7. 下一步计划。

保持文章“可追溯、可复现、可再次理解”，比追求发布频率更重要。


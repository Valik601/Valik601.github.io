# W.Keith · 科研动态

这是 <https://valik601.github.io> 的 Quarto 源代码。

## 本地预览

安装 [Quarto](https://quarto.org/docs/get-started/) 后运行：

```powershell
quarto preview
```

## 写作与发布

完整流程参见 [GUIDE.md](GUIDE.md)。最简流程是在 `posts/YYYY-MM-DD-slug/` 下创建 `index.qmd`，写作时使用 `draft: true`，发布前改为 `draft: false`。

```powershell
quarto preview
git add .
git commit -m "Add research note"
git push
```

推送到 `master` 后，GitHub Actions 会自动渲染并发布到 `gh-pages` 分支。


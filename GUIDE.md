# Keith W. · Research & Notes

## 本地查看全部文章

在网站根目录运行：

```powershell
quarto preview --profile local
```

或运行 `preview-local.ps1`。导航中的「研究工作区」展示 `posts/private/`，输出保存到 `_site-local/`。

## 公开发布

原来的 `git add` / `git commit` / `git push` 工作流可以继续使用；GitHub Actions 强制使用 publish 配置。

如需从本地发布：

```powershell
quarto publish gh-pages --profile publish
```

普通 `quarto render` / `quarto preview` 默认也只包含公开内容。输出 `_site/` 与本地预览完全分开。

## 写文章

- 公开：`posts/published/文章目录/index.qmd`
- 未公开：`posts/private/文章目录/index.qmd`（Git 忽略）
- 项目文章：在 front matter 中添加 `type: project`，会进入公开项目列表。
- 公开研究：将整个文章目录从 private 移到 published，再提交。
- 公共图片放 assets；私有图片随私有文章保存在其目录内。
- 不要在公开页面引用私有文章、图片或实验附件。

## 安装此次修改

先备份原 repo。将此包中 repo 的内容复制到原 repo，保留原来的 .git。
**不要同时保留旧的 `posts/_private/`**：已迁移为 `posts/private/`。不要删除原来的文章；检查迁移后的版本。
删除原 `_site/`、`.quarto/`（仅构建输出/缓存），防止旧内容残留。

提交前检查：

```powershell
git status --short
git ls-files posts/private posts/_private _site _site-local _freeze
```

第二条应无输出。如有，先从 Git 索引移除对应目录（保留本地文件）：

```powershell
git rm -r --cached --ignore-unmatch posts/private posts/_private _site _site-local _freeze
```

既往已经 push 的内容仍可能在 Git 历史中，忽略规则不会删除历史。
私有文件不在远程 Git 备份中，请自行保留私有备份。

发布前脚本会清理公共输出；发布后检查私有路径、资源、搜索、列表与 RSS 链接。如发现 Git 跟踪私有内容或公共输出引用私有路径，会中止发布。

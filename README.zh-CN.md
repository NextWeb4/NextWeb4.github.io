<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/English-0969da?style=flat-square" alt="English"></a>
  <a href="README.zh-CN.md"><img src="https://img.shields.io/badge/%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87-c8102e?style=flat-square" alt="简体中文"></a>
  <a href="README.ja.md"><img src="https://img.shields.io/badge/%E6%97%A5%E6%9C%AC%E8%AA%9E-8250df?style=flat-square" alt="日本語"></a>
</p>

<div align="center">

# NextWeb4 公开网站运行版

**通过 [nextweb4.github.io](https://nextweb4.github.io/) 交付的生成后、仅浏览器运行的公开站点。**

[![在线网站](https://img.shields.io/badge/%E5%9C%A8%E7%BA%BF-nextweb4.github.io-0969da?style=flat-square&logo=githubpages&logoColor=white)](https://nextweb4.github.io/)
[![最近提交](https://img.shields.io/github/last-commit/NextWeb4/NextWeb4.github.io?style=flat-square&logo=github&label=%E6%9C%80%E8%BF%91%E6%8F%90%E4%BA%A4)](https://github.com/NextWeb4/NextWeb4.github.io/commits/main)
[![仓库大小](https://img.shields.io/github/repo-size/NextWeb4/NextWeb4.github.io?style=flat-square&logo=github&label=%E4%BB%93%E5%BA%93%E5%A4%A7%E5%B0%8F)](https://github.com/NextWeb4/NextWeb4.github.io)
![生成运行版](https://img.shields.io/badge/%E7%B1%BB%E5%9E%8B-%E7%94%9F%E6%88%90%E8%BF%90%E8%A1%8C%E7%89%88-0969da?style=flat-square)
![HTML](https://img.shields.io/badge/HTML-%E9%9D%99%E6%80%81-E34F26?style=flat-square&logo=html5&logoColor=white)

<img src="images/hero-campus.jpg" alt="公开主页使用的校园照片" width="900">

</div>

## 项目用途

本仓库是 NextWeb4 个人网站的公开运行产物，只包含浏览器交付的 HTML、CSS、JavaScript、图片、受管理公开内容，以及理解该运行产物所需的说明文档。

私有源码仓库 `NextWeb4/website-source` 负责管理编辑器、后端、测试、部署工作流和作者历史。不要把本仓库当作开发源代码，也不要在其中存放凭据。

## 读者体验

- 新访问默认暗色，明暗主题与中英文切换会保存；用户明确保存的亮色偏好继续优先。
- 首屏标题池中英文各有 27 条唯一内容，并按 Unicode 字素动画；当前完整标题始终作为无障碍名称，所有候选共同预留最大几何，完整文字短暂停留光标，文档隐藏时暂停。每次进入页面即使启用减少动态效果，也只先打出固定第一条“向世界交付你的价值”；之后点击标题文字或用键盘激活，会先逐字删除当前内容，再随机打出一条不会立即重复的内容。页头不显示独立重播图标，禁用 JavaScript 时第一条完整可见。
- 每种语言各有 100 条带日期的思考归档：31 条 Moments 和 69 条 iCloud Notes。
- 可见性感知轮换：交互中、文档隐藏或面板可见区域不足四分之一时暂停；上一条/下一条、阅读进度、来源、阅读时间、键盘操作和原生全文对话框仍然可用。
- 完整的 GitHub 项目目录实时优先：每次进入页面都重新校验全部符合条件的公开仓库、描述、Topics、Stars、更新时间和代码推送时间。刷新期间可先显示新鲜缓存或最近一次同源定时同步结果，完整的带日期应急快照是最终回退；默认只渲染当前排序的前四张卡片，通过可访问的展开按钮显示全部项目或收回四项，并支持按热度、交付时间和名称排序。中文界面依据公开元数据生成简介并本地化常用 Topic，同时保留 GitHub 原值。
- 响应式编辑风格布局、均衡项目卡片、带桌面中文单行说明和移动端正常流换行的仓库自有首屏照片，以及四条按元数据评分的能力线。项目总数允许时，每条至少包含三个唯一项目且每页恰好展示三个；介绍、聚合 Topic 标签栏、技术语言和每项最多两个原始 Topic 都随当前项目重算。一个项目可以验证多条匹配能力线，但每个项目至少进入一条；页面每八秒轮换，并提供上一组、下一组、暂停及交互/可见性感知停止。
- 浏览器复制或开发者工具阻止措施只提供展示层阻力；交付的浏览器代码和内容都可检查。

## 公开产物清单

部署工作流从私有源码白名单生成并替换公开树。运行版包含：

| 路径 | 职责 |
| --- | --- |
| `.nojekyll` | 防止 GitHub Pages 使用 Jekyll 处理 |
| `index.html` | 首页结构、回退文案、项目列表和思考界面 |
| `404.html` | 公开错误页 |
| `content/site-content.json` | 校验后的双语内容、模块可见性与受限页面样式覆盖 |
| `content/github-projects.json` | 带日期的完整公开仓库元数据，为 GitHub 限流提供同源回退 |
| `css/site.css` | 主题、响应式布局、字体和交互状态 |
| `js/site.js` | 内容覆盖、主题、项目、归档轮换、对话框和安全文本渲染 |
| `images/favicon.png` | 网站图标 |
| `images/hero-campus.jpg` | 首页首屏照片 |
| `README.md`、`README.zh-CN.md`、`README.ja.md` | 独立的英文、简体中文和日文运行版说明 |
| `AGENTS.md` | 审查生成运行版仓库的规则 |
| `LICENSE` | 权利与来源声明；不授予开源许可 |

`admin/`、`backend/`、`tests/`、`.github/`、`scripts/`、私有历史和备份等仅源码路径会被有意排除。

## 内容与回退

页面先渲染完整的内置内容，也可以从同源读取 `content/site-content.json` 进行覆盖。如果 JSON 缺失、无效、缓慢或不可用，内置页面仍然可用。覆盖层携带中英文各 27 行的标题池，可以为七个受管模块分别设置 85%–115% 字号，为六个区块设置按中英文适配的窄栏/均衡/通栏主标题宽度，并设置完整顺序和紧凑/标准/宽展尺寸；窄屏仍以响应式限制为准。缺少标题设置时使用均衡档，旧版全局字号会应用到七个模块。受管理思考归档对每种语言都严格保持 31 条带日期 Moments 与 69 条带日期 iCloud Notes，并保持来源/日期顺序一致。独立的只读项目 JSON 由私有部署工作流每 15 分钟根据 GitHub 公开 REST 元数据生成。

公开 JavaScript 将受管理文本视为不受信任内容，安全赋值日期、来源、标题和正文。运行版不会显示 iCloud 存储标签，也不会在浏览器中调用翻译服务。

## 联网与隐私

- 公开项目列表每次进入页面都会请求 GitHub 仓库数据，并保留 GitHub 描述和最多 20 个规范化 Topics。新鲜缓存、同源同步源与完整内置应急快照组成回退链；加载、刷新、实时、缓存、最近同步和应急状态都会明确标注。首屏仅创建四张排序后的卡片，展开后才创建全部卡片，但完整仓库集合和能力线证据始终保留。项目卡与能力线的中文简介及常用 Topic 标签只根据公开元数据在本地生成，原值保留且不发起翻译请求。
- 可选壁纸会向 `bing.biturl.top` 请求元数据，只接受经过校验的 HTTPS `bing.com` 图片主机，使用有界超时并回退到纯色。
- 语言、主题和壁纸缓存保存在浏览器状态中；本仓库不应包含管理令牌或 GitHub 凭据。
- GitHub 渲染 README 时会向 `img.shields.io` 请求徽章图片。
- 本仓库公开可见，HTML、JavaScript、JSON、图片和 README 都必须按可检查内容对待。

## 本地预览

运行版没有包管理器、后端、构建命令、测试套件、lint 或 format 命令。为了以正确的相对 `fetch()` 行为预览已提交产物：

```bash
python -m http.server 8000 --bind 127.0.0.1
```

打开 `http://127.0.0.1:8000/`。创作和部署测试位于私有的 `NextWeb4/website-source` 仓库。

## 部署模型

修改应在 `NextWeb4/website-source` 中完成。其固定版本 GitHub Actions 工作流构建白名单产物，再通过仓库级部署密钥同步到本公开仓库。下一次成功部署会覆盖此处的手工修改，因此直接编辑本仓库不是持久的内容变更方式。

公开仓库绝不能接收私有源码树、后端、管理端、测试、凭据、部署密钥或私有 Git 历史。

## 验证清单

- 确认产物只包含白名单运行文件和说明文件。
- 通过 HTTP 打开 `/`、`/404.html`、两种公开语言状态和代表性归档条目。
- 检查键盘导航、焦点可见性、减少动态效果下固定第一条入场打字与先删除再随机重打、不会立即重复、隐藏文档暂停、所有候选几何稳定、页头没有独立重播图标、桌面中文单行说明、移动端溢出、对话框关闭入口和回退内容。
- 确认默认四张项目卡、展开全部/收起语义、完整 GitHub 实时状态/刷新、三种排序、中文简介与保留原值的 Topics、缓存/同步源/应急回退、每条能力线三个可见项目、随项目变化的介绍/标签、多能力线覆盖、轮换/暂停/手动控制、项目链接、图片路径、两个 JSON 文件和规范网站 URL 都能解析。
- 部署前将公开树与私有构建产物进行比较。

## 联系方式

- [Rays688888@Gmail.com](mailto:Rays688888@Gmail.com)

## 状态、贡献与许可证

请参阅 [LICENSE](LICENSE)。该文件是权利与来源声明，并非开源许可证；它不授予使用、复制、修改、部署或再分发项目自有材料的许可。第三方材料仍受其各自权利与条款约束。

截至 2026-07-22 审计时，本仓库公开、活跃、未归档且启用了 Pages。贡献应在 `NextWeb4/website-source` 中完成；若公开仓库启用了 Issue，可在那里报告可复现的运行版问题。

# 开源说明 / Open Source Notes

## 中文

### 导出信息

- 导出日期：2026-10-02
- 原始目录：`D:\www\ccsnft_nft\template\base`
- 导出目录：`D:\www\highis_nft\nft_uniapp`
- 项目类型：uni-app + Vue 2 + uView 用户端
- 后端类型：ThinkPHP 5.1 NFT / 数字藏品后端
- 导出文件量：674 个文件，约 4.55 MB（不计算 `.git/`）

### 本次未导出的内容

| 内容 | 处理方式 | 原因 |
| --- | --- | --- |
| `node_modules/` | 未导出 | 依赖目录，应通过 `npm install` 生成 |
| `unpackage/` | 未导出 | 构建产物目录，不应作为源码发布 |
| `.DS_Store` | 未导出 | macOS 自动生成的目录信息文件 |
| `.hbuilderx/` | 已加入 `.gitignore` | HBuilderX 本地调试配置，不属于通用源码 |

### 已做的脱敏处理

- 清理 `config.js` 中历史内网 IP 和旧域名注释。
- 将非 H5 端默认接口地址改为 `http://127.0.0.1:8000`。
- 将加载占位文案中的手机号改为 `133****3333`。
- 删除藏品详情和 webview 页面中的历史测试 URL 注释。
- 保留 `.gitignore`，防止依赖、构建产物、日志和环境变量文件被误提交。

### 敏感信息检查

已检查以下高风险特征：

- 私钥块，例如 `BEGIN PRIVATE KEY`
- 云厂商 AccessKey 和 SecretKey
- JWT 字符串
- URL 中内嵌的用户名和密码
- 硬编码的 privateKey、secretKey、passwordSecret、tokenSecret
- 证书、密钥、数据库备份、压缩包、表格文件和日志文件

检查结果：**未发现高置信度的真实密钥或凭证。**

需要注意：

- 代码中会出现 `token`、`password`、`secret` 等单词，多数是变量名、表单字段或第三方组件属性。
- `127.0.0.1:8000` 是本机示例地址，不是敏感信息；真机调试时需要改成可访问的后端地址。
- 第三方组件目录较多，公开仓库前建议再使用 Gitleaks、TruffleHog 或 GitHub Secret Scanning 扫描一次。

### 仍需确认的历史资源引用

以下地址不是密钥，但会暴露旧基础设施或品牌信息；仓库中没有对应本地文件，因此本次没有直接替换，避免破坏功能。

| 文件 | 引用内容 | 建议 |
| --- | --- | --- |
| `template.h5.html` | `ios.js`、jQuery、jquery.qrcode 三个远程脚本 | 将脚本本地化或改为可信 CDN，并确认是否仍需要桌面端二维码逻辑 |
| `components/tfgg-verify.vue` | 滑块验证图片 | 改为后端返回的图片地址，或将图片放入 `static/` |
| `components/goods-info/goods-info.vue` | `photo_model.fbx` | 改为后端模型 URL，或将默认模型本地化 |
| `components/kefu/kefu.vue` | `kefu.png` | 改为系统配置中的客服二维码，或删除默认值 |
| `pages/nft/goods/previewModel.vue` | `model_preview_bg.jpg` | 将背景图放入 `static/` 或使用可配置资源域名 |
| `pages/public/info.vue` | `licence.png` | 将证照图片改为可配置地址，并确认是否允许公开展示 |

### 其他开源前待确认

- [x] 版权主体：个人 hzhihu。
- [x] 开源许可证：MIT License。
- [ ] 检查品牌名称、Logo、图标和图片是否允许公开。
- [ ] 检查用户协议、隐私政策等文案是否包含不适合开源的内容。
- [ ] 确认是否保留 `uniCloud-aliyun/`；当前业务主要连接 ThinkPHP 后端，该目录未发现凭证。
- [ ] 使用自动化密钥扫描工具再次扫描。
- [ ] 确认 GitHub 仓库公开范围、分支保护和 Issue 模板。

### 第三方软件

本项目包含或使用以下第三方代码和服务：

- uView UI：MIT License
- DCloud uni-app 插件：以各插件目录下的许可证为准
- npm 依赖：以 `package.json` 和 `package-lock.json` 为准

根目录 `LICENSE` 为本项目的 MIT License（版权所有 © 2026 hzhihu）；uView UI 的许可证保留在 `uview-ui/LICENSE`。

## English

### Export Information

- Export date: 2026-10-02
- Source directory: `D:\www\ccsnft_nft\template\base`
- Target directory: `D:\www\highis_nft\nft_uniapp`
- Project type: uni-app + Vue 2 + uView user app
- Backend type: ThinkPHP 5.1 NFT / digital collection backend
- Export size: 674 files, about 4.55 MB, not including `.git/`

### Excluded Content

| Content | Action | Reason |
| --- | --- | --- |
| `node_modules/` | Not exported | Dependencies should be created by `npm install` |
| `unpackage/` | Not exported | Build output should not be released as source |
| `.DS_Store` | Not exported | macOS folder metadata |
| `.hbuilderx/` | Added to `.gitignore` | Local HBuilderX debug settings |

### Cleanup Done

- Removed old internal IP and old domain comments from `config.js`.
- Changed the default non-H5 API address to `http://127.0.0.1:8000`.
- Changed the sample phone number to `133****3333`.
- Removed old test URL comments from the goods info and webview pages.
- Kept `.gitignore` to prevent dependencies, build output, logs, and environment files from being committed by mistake.

### Security Check

The source was checked for private key blocks, cloud AccessKeys, JWT strings, credentials inside URLs, hardcoded secret values, certificates, database backups, archives, spreadsheet files, and log files.

Result: **no high-confidence real credential was found.**

Words such as `token`, `password`, and `secret` still appear in the code, but they are mostly variable names, form fields, or third-party component properties.

Before making the repository public, please run a dedicated scanner such as Gitleaks, TruffleHog, or GitHub Secret Scanning.

### Historical Asset References Still Needing a Decision

The following URLs are not credentials, but they show old infrastructure or brand information. No local copies of these files were found, so they were not replaced in this export, to avoid breaking features.

| File | Reference | Suggestion |
| --- | --- | --- |
| `template.h5.html` | Remote `ios.js`, jQuery, and jquery.qrcode scripts | Store the scripts locally or use a trusted CDN |
| `components/tfgg-verify.vue` | Captcha images | Use backend URLs or place images in `static/` |
| `components/goods-info/goods-info.vue` | `photo_model.fbx` | Use a backend model URL or store a default model locally |
| `components/kefu/kefu.vue` | `kefu.png` | Use the customer service QR code from settings or remove the default |
| `pages/nft/goods/previewModel.vue` | `model_preview_bg.jpg` | Store the background locally or use a configurable asset domain |
| `pages/public/info.vue` | `licence.png` | Use a configurable URL and confirm whether it may be public |

### Other Items to Confirm

- Copyright owner: hzhihu (individual).
- Open-source license: MIT License.
- Check whether brand names, logos, icons, and images may be published.
- Check legal documents such as user agreements and privacy policies.
- Decide whether `uniCloud-aliyun/` should remain. No credential was found there.
- Run an automated secret scan again.
- Confirm the GitHub repository visibility, branch protection, and issue templates.

### Third-Party Software

- uView UI: MIT License
- DCloud uni-app plugins: please follow the license in each plugin directory
- npm dependencies: please refer to `package.json` and `package-lock.json`

The root `LICENSE` is the MIT License for this project (Copyright © 2026 hzhihu). The uView UI license remains at `uview-ui/LICENSE`.
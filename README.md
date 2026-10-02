# NFT UniApp Frontend / NFT UniApp 前端

> 数字藏品平台的 uni-app 用户端源码。
> This is the uni-app user frontend for a digital collection platform.

- [中文](#中文)
- [English](#english)

---

## 中文

### 项目简介

这是一个基于 **uni-app + Vue 2 + uView** 的数字藏品 / NFT 用户端前端项目，可构建为 H5、Android App、iOS App 或小程序。项目需要配合 ThinkPHP 5.1 后端使用，接口基础路径和上传地址在 `config.js` 中配置。

### 功能模块

- 首页、藏品分类、藏品详情和展厅
- 藏品预约、购买、订单和支付
- 盲盒购买、开启和持有记录
- 市场挂售、取消挂售和市场购买
- 藏品合成、空投、积分兑换和链上哈希查询
- 用户注册、登录、退出、密码找回和个人资料
- 钱包、余额、充值、账户流水、提现和收货地址
- 收藏、关注创作者、粉丝、签到和分享活动

### 技术栈

| 类型 | 技术 |
| --- | --- |
| 跨端框架 | uni-app |
| 前端框架 | Vue 2 |
| UI 组件 | uView UI |
| 包管理 | npm / HBuilderX |
| 后端接口 | ThinkPHP 5.1 |

### 目录结构

```text
.
├── pages/           # 业务页面
├── common/          # 请求封装、通用方法和支付逻辑
├── components/      # 自定义业务组件
├── static/          # 图片、字体等静态资源
├── uview-ui/        # uView UI 源码
├── uni_modules/     # uni-app 本地插件
├── js_sdk/          # JS SDK
├── mixins/          # 公共 mixin
├── hybrid/          # 本地 HTML 资源
├── App.vue          # 应用入口组件
├── main.js          # 应用入口 JS
├── config.js        # 接口和项目运行配置
├── pages.json       # 页面和 tabBar 配置
└── manifest.json    # uni-app 应用配置
```

### 环境要求

- HBuilderX，推荐使用与旧项目兼容的版本。
- Node.js 和 npm；如果只通过 HBuilderX 运行，可按实际需要安装依赖。
- 可运行的 ThinkPHP 5.1 后端。

### 安装依赖

```bash
npm install
```

### 配置后端地址

默认配置在 `config.js`：

```js
var _baseUrl = 'http://127.0.0.1:8000'
```

- 浏览器 H5：默认请求当前站点。
- App 或真机调试：请改成电脑的局域网 IP，例如 `http://192.168.1.10:8000`。
- 生产环境：建议使用 HTTPS 域名，例如 `https://api.example.com`。

### 运行和构建

1. 使用 HBuilderX 打开本目录。
2. 选择运行到浏览器、手机或模拟器。
3. 发布时使用 HBuilderX 的发行功能生成 H5、App 或小程序产物。

当前 `package.json` 主要记录 npm 依赖，没有提供完整的 uni-app CLI 构建脚本。

### 安全说明

- 登录 token 通过请求头 `token` 传递。
- App 会话通过请求头 `appsessionid` 传递。
- 不要在代码中写入真实密码、支付密钥、私钥或助记词。
- 不要提交 `node_modules/`、`unpackage/`、日志或 `.DS_Store`。
- 正式上线前应使用 HTTPS，并重新执行密钥扫描和安全检查。

更多开源前检查结果请查看 [OPEN_SOURCE.md](OPEN_SOURCE.md)。

### 许可证

本项目基于 **MIT License** 开源，版权所有 © 2026 hzhihu，完整条款请查看 [LICENSE](LICENSE)。

仓库中包含的 uView UI 等第三方组件仍遵循各自原始许可证；例如 uView UI 的许可证位于 `uview-ui/LICENSE`。

---

## English

### Introduction

This is a digital collection / NFT user frontend based on **uni-app, Vue 2, and uView**. It can be built as H5, Android App, iOS App, or a mini program. It works with a ThinkPHP 5.1 backend, and the API address is set in `config.js`.

### Features

- Home, collection categories, details, and show rooms
- Reservation, purchase, orders, and payment
- Blind boxes, owned items, market listing and buying
- Synthesis, airdrops, point exchange, and hash search
- Login, registration, user profiles, wallets, recharge, withdrawal, and addresses
- Favorites, creator following, fans, sign-in, and sharing

### Setup

```bash
npm install
```

Open the folder in HBuilderX, then run it in a browser, on a phone, or in an emulator.

The default backend URL is:

```js
http://127.0.0.1:8000
```

For a real phone, use your computer's LAN IP. For production, use an HTTPS API domain.

### Security

The login token is sent through the `token` header, and the app session is sent through `appsessionid`. Do not put real passwords, payment secrets, private keys, or mnemonics in source code.

Please read [OPEN_SOURCE.md](OPEN_SOURCE.md) for the export and security checklist.

### License

This project is released under the **MIT License**, Copyright © 2026 hzhihu. Please see [LICENSE](LICENSE) for the full text.

Bundled third-party components such as uView UI keep their original licenses; for example, the uView UI license is at `uview-ui/LICENSE`.

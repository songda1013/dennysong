# myApp

基于 **Taro 4** 的多端应用，使用 React 18 + NutUI + Less 构建。目前包含地址列表与优惠中心两个业务页面，重点打磨了领券弹窗的交互动效与渲染性能。

## 技术栈

| 类别 | 选型 |
|------|------|
| 跨端框架 | Taro 4.2.1（微信/支付宝/百度/字节/QQ/京东/H5/RN/快应用） |
| UI 框架 | React 18 |
| 组件库 | NutUI React Taro |
| 样式 | Less + CSS Modules |
| 构建工具 | Vite 4 |
| 语法 | JavaScript（JSX） |

## 功能特性

### 页面
- **地址列表页** (`pages/index`)：展示地址卡片列表，支持选中态切换，底部入口跳转卡券页
- **优惠券中心** (`pages/coupon`)：底部弹窗式优惠中心，含 Tab 切换、券列表、领券动效、一键领券

### 核心交互：领券动效
点击领券按钮触发三段式动画：
1. **滑入** — 一张券条从右侧滑入到被点击卡片中心（480ms）
2. **中心排列** — 分裂为 4 张 ¥ 小券在中心一行亮相、轻微放大
3. **飘落** — 4 张券沿抛物线轨迹向左下角依次飘落并淡出（1700ms）

动画结束后标记已领、卡片高亮闪烁、Toast 提示成功领取。

### 性能优化
领券动效涉及 4 个并发粒子动画，为保证 60fps 采取了以下措施：
- **高亮闪烁零重绘**：`.highlightCard::after` 伪元素，box-shadow 静态绘制一次，仅动画 `opacity`（走 GPU 合成层，避免逐帧重绘）
- **列表隔离**：`CouponCard`/`CompactCard` 等组件全部 `React.memo`，配合稳定回调（ref 桥接），粒子动画期间 12 张卡片不重渲染
- **合成层隔离**：`.popupBody` 加 `transform: translateZ(0)`，滚动内容与粒子层互不干扰
- **CSS 零 calc**：下落轨迹中间位置在 JS 预计算，CSS 仅引用纯数值

## 目录结构

```
src/
├── app.js                       # 应用入口
├── app.config.js                # 全局配置（页面注册、窗口样式）
├── app.less                     # 全局样式
├── pages/
│   ├── index/                   # 地址列表页
│   │   ├── index.jsx
│   │   ├── index.config.js
│   │   └── index.module.less
│   └── coupon/                  # 优惠券中心页
│       ├── index.jsx            # 页面入口（hero + CouponPopup）
│       ├── index.config.js
│       ├── index.module.less    # 仅页面级样式
│       └── constants.js         # tabs/时间常量/mock 数据
└── components/
    ├── address-card/            # 地址卡片（含 TagList/AddressTitle）
    ├── coupon-popup/            # 优惠中心弹窗容器（内聚弹窗/Tab/领券/动效状态）
    ├── coupon-tabs/             # 顶部 Tab 栏 + 滑动指示器
    ├── coupon-card/             # 标准券卡（封面/标签/价格/规则）
    ├── compact-card/            # 紧凑券包卡（warm 风格徽标）
    ├── claim-button/            # 共享领券按钮
    └── claim-animation/         # 领券粒子动效层（memo 隔离）
```

### 组件约定
- 目录组织：`组件名/index.jsx` + `组件名/index.module.less`
- 样式方案：CSS Modules，`import styles from './index.module.less'`
- 导出方式：`export default`，性能敏感组件包 `React.memo`
- Props 风格：受控优先（如 `CouponPopup` 接收 `visible`/`onClose`）

## 快速开始

### 环境要求
- Node.js >= 16
- npm / yarn / pnpm

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
# 微信小程序
npm run dev:weapp

# H5
npm run dev:h5

# 支付宝小程序
npm run dev:alipay

# 字节跳动小程序
npm run dev:tt
```
开发模式默认开启 `--watch`，产物输出至 `dist/`。微信小程序需用微信开发者工具打开 `dist/` 目录预览。

### 生产构建
```bash
npm run build:weapp    # 微信小程序
npm run build:h5       # H5
npm run build:alipay   # 支付宝小程序
# 其他端：build:swan / build:tt / build:qq / build:jd / build:rn / build:quickapp
```

## 关键组件说明

### CouponPopup
优惠中心弹窗容器，内聚全部业务状态：
- 弹窗显隐过渡（`visible` 受控，内部管理 mount/active 动画）
- Tab 切换
- 领券动效编排（滑入 → 排列 → 飘落）
- 已领状态与高亮

```jsx
<CouponPopup visible={popupVisible} onClose={() => setPopupVisible(false)} />
```

### ClaimAnimation
粒子动效层，纯展示组件，`React.memo` 隔离。接收 `animPhase`/`fallParticles`/`animSource`/`fallDurationMs`。

### CouponCard / CompactCard
两种券卡样式，均接收 `item`/`isClaimed`/`onClaim`，内部复用 `ClaimButton`。

## 备注

- 当前券数据为 mock，集中在 `pages/coupon/constants.js`，接入真实接口时替换该文件即可
- 动效时间常量（`SLIDE_DURATION_MS`/`FALL_DURATION_MS` 等）同样位于 `constants.js`，可按需调整
- `project.config.json` 中 `appid` 为占位值，正式使用前请替换为真实 AppID

# iNav - 浏览器新标签页扩展

一个基于 Vue 3 + TypeScript + Vite 开发的浏览器新标签页扩展。

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **Vite** - 下一代前端构建工具
- **Tailwind CSS** - 原子化 CSS 框架
- **Element Plus** - Vue 3 组件库
- **Pinia** - Vue 3 状态管理
- **Chrome Extension Manifest V3** - 浏览器扩展标准

## 项目结构

```
iNav/
├── src/
│   ├── components/
│   │   └── widgets/          # 小组件目录
│   │       ├── ClockWidget.vue
│   │       ├── SearchWidget.vue
│   │       ├── WeatherWidget.vue
│   │       └── BookmarkWidget.vue
│   ├── App.vue              # 主应用组件
│   ├── main.ts              # 应用入口
│   └── style.css            # 全局样式
├── public/
│   └── manifest.json        # 浏览器扩展配置
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 开发

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 加载扩展到浏览器

1. 运行 `npm run build` 构建项目
2. 打开 Chrome 浏览器，访问 `chrome://extensions/`
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目根目录下的 `dist` 文件夹
6. 打开新标签页即可看到效果

## 功能

- ✅ 时钟小组件（显示当前时间和日期）
- ✅ 搜索小组件（支持百度、Google、必应）
- ✅ 天气小组件（演示版）
- ✅ 快捷链接小组件
- 🔄 更多小组件开发中...

## 许可证

MIT


团购吧(group-purchase-manage)前端界面

### 源仓库地址

- Gitee：https://gitee.com/laramie/Geeker-Admin
- GitHub：https://github.com/HalseySpicy/Geeker-Admin

### 安装使用步骤 📔

- **Install：**

```text
npm install
cnpm install

# npm install 安装失败，请升级 nodejs 到 16 以上，或尝试使用以下命令：
npm install --registry=https://registry.npm.taobao.org

# 这里只是为了指定依赖包版本，防止没有版本锁 lock 而安装最新依赖包，导致的项目报错
npm i @element-plus/icons-vue@1.1.4 @vueuse/core@8.0.1 @wangeditor/editor@5.1.12 axios@0.27.2 echarts@5.3.0 echarts-liquidfill@3.1.0 element-plus@2.2.6 js-md5@0.7.3 nprogress@0.2.0 pinia@2.0.12 pinia-plugin-persistedstate@1.6.1 qs@6.10.3 vue@3.2.25 vue-i18n@9.1.9 vue-router@4.0.12 vue3-seamless-scroll@1.2.0 --save
```

- **Run：**

```text
npm run dev
npm run serve
```

- **Build：**

```text
# 开发环境
npm run build:dev

# 测试环境
npm run build:test

# 生产环境
npm run build:pro
```

- **Lint：**

```text
# eslint 检测代码
npm run lint:eslint

# prettier 格式化代码
npm run lint:prettier

# stylelint 格式化样式
lint:stylelint
```

- **commit：**

```text
# 提交代码（提交前会自动执行 lint:lint-staged 命令）
npm run commit
```

### 文件资源目录 📚

```text
Geeker-Admin
├─ .vscode                # vscode推荐配置
├─ public                 # 静态资源文件（忽略打包）
├─ src
│  ├─ api                 # API 接口管理
│  ├─ assets              # 静态资源文件
│  ├─ components          # 全局组件
│  ├─ config              # 全局配置项
│  ├─ directives          # 全局指令文件
│  ├─ enums               # 项目枚举
│  ├─ hooks               # 常用 Hooks
│  ├─ language            # 语言国际化
│  ├─ layout              # 框架布局
│  ├─ routers             # 路由管理
│  ├─ store               # pinia store
│  ├─ styles              # 全局样式
│  ├─ typings             # 全局 ts 声明
│  ├─ utils               # 工具库
│  ├─ views               # 项目所有页面
│  ├─ App.vue             # 入口页面
│  ├─ env.d.ts            # ts 识别 vue 文件
│  └─ main.ts             # 入口文件
├─ .editorconfig          # 编辑器配置（格式化）
├─ .env                   # vite 常用配置
├─ .env.development       # 开发环境配置
├─ .env.production        # 生产环境配置
├─ .env.test              # 测试环境配置
├─ .eslintignore          # 忽略 Eslint 校验
├─ .eslintrc.js           # Eslint 校验配置
├─ .gitignore             # git 提交忽略
├─ .prettierignore        # 忽略 prettier 格式化
├─ .prettierrc.js         # prettier 配置
├─ .stylelintignore       # 忽略 stylelint 格式化
├─ .stylelintrc.js        # stylelint 样式格式化配置
├─ CHANGELOG.md           # 项目更新日志
├─ commitlint.config.js   # git 提交规范配置
├─ index.html             # 入口 html
├─ LICENSE                # 开源协议文件
├─ lint-staged.config     # lint-staged 配置文件
├─ package-lock.json      # 依赖包包版本锁
├─ package.json           # 依赖包管理
├─ postcss.config.js      # postcss 配置
├─ README.md              # README 介绍
├─ STANDARD.md            # 项目编码规范说明书
├─ tsconfig.json          # typescript 全局配置
└─ vite.config.ts         # vite 配置
```

### 八、浏览器支持

> 默认支持以下浏览器，vue3.2 不支持 IE 浏览器。更多浏览器可以查看 [Can I Use Es Module](https://caniuse.com/?search=ESModule)
>
> **💢 请不要使用 QQ && 360 浏览器开发，不识别 某些 ES6 以上语法**

| ![Edge](https://iamge-1259297738.cos.ap-chengdu.myqcloud.com/md/Edge.png) | ![Firefox](https://iamge-1259297738.cos.ap-chengdu.myqcloud.com/md/Firefox.png) | ![Chrome](https://iamge-1259297738.cos.ap-chengdu.myqcloud.com/md/Chrome.png) | ![Safari](https://iamge-1259297738.cos.ap-chengdu.myqcloud.com/md/Safari.png) |
| :-----------------------------------------------------------------------: | :-----------------------------------------------------------------------------: | :---------------------------------------------------------------------------: | :---------------------------------------------------------------------------: |
|                              last 2 versions                              |                                 last 2 versions                                 |                                last 2 versions                                |                                last 2 versions                                |



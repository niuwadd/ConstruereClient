# Construere Client 交接文档

## 1. 项目概览

- 项目名称：`construere-client`
- 技术栈：`Vue 3` + `TypeScript` + `Vite` + `Pinia` + `Vue Router` + `Tailwind CSS`
- 项目定位：面向 AIOS/智能体交互场景的前端可视化客户端，包含首页形态展示、仪表盘卡片、语音录制与消息流处理能力。
- 运行形态：前端 SPA，通过 Thrift + WebSocket 与本地/内网 AIOS 服务通信。

## 2. 环境与启动

## 2.1 环境要求

- Node.js `>= 18`
- npm `>= 8`

## 2.2 安装与运行

```bash
npm install
npm run dev
```

其他命令：

```bash
npm run build
npm run build-prod
npm run preview
```

## 2.3 环境变量

`.env.development`

```env
NODE_ENV=development
VITE_APP_HOME_COMPONENT=Home
```

`.env.production`

```env
NODE_ENV=production
VITE_APP_HOME_COMPONENT=HomeSpecialty
```

说明：`VITE_APP_HOME_COMPONENT` 当前未在路由中生效（路由已固定到 `HomeBase` 组件），如需按环境切换首页需恢复对应逻辑。

## 3. 架构与目录

核心目录：

- `src/main.ts`：应用入口，注册路由、i18n、Pinia、Toast、AIOS 服务初始化。
- `src/router/index.ts`：路由配置（首页、仪表盘、agent 列表、多个 home 变体）。
- `src/store/message.ts`：消息中心（agent 消息流、右侧展示数据、后台 token 管理）。
- `src/utils/AIOSService/`：Thrift 客户端、WebSocket 注册与消息分发。
- `src/views/home/`：首页系列页面（`home-base`/`home-specialty`/`home-nopicture`）。
- `src/views/dashboard/`：仪表盘主页面、模板卡片、布局组件、agent 页面。
- `src/components/`：地图、录音器、通知、消息列表等通用组件。

## 4. 关键业务流程

## 4.1 启动流程

1. `main.ts` 启动 Vue 应用并挂载插件。
2. `initStore()` 初始化 Pinia 消息 store 引用。
3. `initThriftClient()` 建立 Thrift 通道并调用 `registerClient`。
4. 返回 `wsUrl` 后建立 WebSocket，进入消息监听。

## 4.2 消息流（后端 -> 前端）

- WebSocket 收到消息后写入 `socketState.message`。
- 在 `handleSocketMessage` 中按 `TaskType` 分发：
  - `TTS`：追加 agent 文本消息。
  - `GET_USER_ANSWER`：追加用户消息。
  - `SHOW_RIGHT`：追加右侧卡片展示数据。
  - `DONE`：流程结束（当前仅记录日志，清理逻辑注释中）。

## 4.3 意图发送（前端 -> 后端）

通过 `sendIntent(intentType, intentParams)` 调用 Thrift `sendIntent`，常见意图类型定义在 `src/types/enum.ts`：

- `greetings`
- `modeType`
- `backgroundRunning`
- `asr`
- `userAnswer`
- `stopAllWorkflow`

## 5. 路由说明

当前主要路由：

- `/` -> `src/views/home/index.vue`
- `/dashboard/homePage` -> `src/views/dashboard/homePage.vue`
- `/dashboard/agentList` -> `src/views/dashboard/agentList.vue`
- `/home-specialty` -> `src/views/home/home-specialty/index.vue`
- `/home-base` -> `src/views/home/home-base/index.vue`
- `/home-nopicture` -> `src/views/home/home-nopicture/index.vue`

## 6. 第三方与外部依赖

## 6.1 Vite 代理（开发态）

在 `vite.config.ts` 中：

- `/stream/v1` -> `https://nls-gateway-cn-shanghai.aliyuncs.com`
- `/thrift` -> `http://10.31.13.177:52002`

## 6.2 AIOS 通道

- `AIOSService/index.js` 中 Thrift 地址当前写死为 `http://localhost:52002/thrift`。
- WebSocket 地址来自 `registerClient` 接口返回。

注意：开发代理配置与 Thrift 代码中直连地址并存，需确认最终运行环境采用哪一套链路。

## 7. 当前代码状态（交接时）

当前工作区存在未提交变更，涉及：

- 页面与逻辑：`homePage`、`home-base`、`home-specialty`、`chat`、`router`、`utils`、`enum`、`MapContainer`、`Recorder` 等。
- 资源文件：新增/修改多张天气与车机相关图片。

建议：交接前先将本次迭代改动按功能拆分提交，避免后续排查责任边界不清。

## 8. 风险与已知问题

- `clientId` 在 `AIOSService/index.js` 中为固定值（`123213213`），多端并发可能冲突。
- `DONE` 分支的消息清理逻辑未启用（注释状态），长期运行可能导致消息堆积。
- 部分配置写死（如 Thrift 地址），环境切换成本较高。
- `router` 中按环境动态首页逻辑处于注释状态，配置项与实际行为可能不一致。

## 9. 接手建议（优先级）

1. **配置治理**：将 Thrift 地址、clientId 生成策略统一改为环境变量配置。
2. **流程收口**：补全 `DONE` 后的 store 清理与 UI 同步策略。
3. **消息协议文档化**：整理 `TaskType/MessageType/ShowRightType` 与示例 payload。
4. **稳定性增强**：补充 WebSocket 重连日志、错误上报、边界兜底。
5. **测试基线**：建立至少一套核心流程手工回归清单（启动、问候、卡片渲染、语音交互）。

## 10. 交接 Checklist

- [ ] 本地可运行（`npm run dev`）并验证关键页面可访问
- [ ] 代理与后端连通性已验证（Thrift + WebSocket）
- [ ] 核心流程验证通过（greetings、modeType、TTS、SHOW_RIGHT）
- [ ] 当前未提交改动已按需求确认（保留/拆分/回滚）
- [ ] 已明确下一版本责任人、发布窗口与回滚方案

## 11. 常用定位文件

- 启动入口：`src/main.ts`
- 路由：`src/router/index.ts`
- 消息 store：`src/store/message.ts`
- AIOS 通讯：`src/utils/AIOSService/index.js`
- 仪表盘首页：`src/views/dashboard/homePage.vue`
- Home 基础版：`src/views/home/home-base/index.vue`
- Home 专业版：`src/views/home/home-specialty/index.vue`

---

如需进一步升级为“可直接交付客户/团队”的版本，建议在本文件基础上补两部分：  
1) 环境部署图（开发/测试/生产）；  
2) 消息协议表（字段、类型、示例、异常码）。

# gstack

我是 [Garry Tan](https://x.com/garrytan)，Y Combinator 的 President & CEO。过去我和成千上万家创业公司合作过，比如 Coinbase、Instacart、Rippling，很多时候他们还只是车库里的一两个人，后来都成长为市值数百亿美元的公司。加入 YC 之前，我设计过 Palantir 的 logo，也是那里最早一批工程经理、PM 和设计师之一。我还联合创办过 Posterous，后来把它卖给了 Twitter。我在 2013 年搭建了 YC 的内部社交网络 Bookface。长期以来，我一直同时以设计师、PM 和工程经理的身份做产品。

而现在，我正处在一个像是新纪元的阶段。

过去 60 天里，我写了 **超过 60 万行生产代码**，其中 35% 是测试。我还在做 CEO 其他工作的同时，利用每天一部分时间，持续产出 **每天 1 万到 2 万行可用代码**。这不是夸张。最近一次 `/retro`（过去 7 天的开发统计）覆盖 3 个项目，结果是：**新增 140,751 行、362 次提交、净增约 115k LOC**。模型每周都在显著进步。我们真的已经站在一个新阶段的门口，一个人完成过去需要二十个人才能完成的产出。

**2026 年，贡献数已经达到 1,237 并且还在增长：**

![GitHub contributions 2026 — 1,237 contributions, massive acceleration in Jan-Mar](docs/images/github-2026.png)

**2013 年，当我在 YC 搭建 Bookface 时的贡献数是 772：**

![GitHub contributions 2013 — 772 contributions building Bookface at YC](docs/images/github-2013.png)

还是同一个人，只是时代变了。差别在于工具。

**gstack 就是我这样做事的方式。** 它是我的开源软件工厂，把 Claude Code 变成一个你真正可以管理的虚拟工程团队：重新思考产品的 CEO、锁定架构的工程经理、识别 AI slop 的设计师、找生产问题的审查者、打开真实浏览器点进你应用里验证流程的 QA 负责人，以及负责发版的 release engineer。18 个专业角色和 7 个强力工具，全都是 slash command，全都是 Markdown，**全部免费，MIT 许可，现在就能用。**

我正在研究 agentic 系统在 2026 年 3 月左右到底能做到什么程度，这是一个实时实验。我把它开源，是因为我想带着所有人一起经历这个阶段。

Fork 它，改进它，把它变成你自己的。别只会挑刺，先欣赏再改造。

**适合谁：**
- **创始人和 CEO**：尤其是还想自己继续写代码的技术型创始人。这就是你如何像一支 20 人团队一样工作。
- **第一次使用 Claude Code 的人**：gstack 是最好的起点。它提供结构化角色，而不是一个空白提示词。
- **技术负责人和 Staff Engineer**：把严格的评审、QA 和发布自动化带到每一个 PR。

## 快速开始：你的前 10 分钟

1. 安装 gstack（30 秒，见下文）
2. 运行 `/office-hours`，描述你正在做什么。它会在你写代码之前重新定义问题。
3. 在任何功能想法上运行 `/plan-ceo-review`
4. 对任何带变更的分支运行 `/review`
5. 对你的 staging 地址运行 `/qa`
6. 到这里先停一下。你会知道它是不是适合你。

如果仓库已经有测试，通常 5 分钟内就能得到第一次有价值的结果。

**如果你只愿意再读一个部分，就读安装这一节。**

## 安装：只需 30 秒

**前提：** [Claude Code](https://docs.anthropic.com/en/docs/claude-code)、[Git](https://git-scm.com/)、[Bun](https://bun.sh/) 1.0+、[Node.js](https://nodejs.org/)（仅 Windows 需要）

### 第 1 步：安装到你的机器上

打开 Claude Code，粘贴下面这段。剩下的 Claude 会处理。

> 安装 gstack：运行 **`curl -fsSL https://raw.githubusercontent.com/garrytan/gstack/main/install.sh | bash`**

再次运行同一个命令，就会更新现有安装。

如果你本地已经有这个仓库，直接在仓库根目录运行 **`./install.sh`**。

安装器只会把内容写入 `~/.claude/skills/gstack` 和 `~/.agent/skills/gstack`，不会在系统技能目录里留下一个克隆出来的仓库。

如果你是在源代码仓库里开发 gstack，请使用这个 checkout 里的本地 `./setup` 工作流。它和上面的系统级安装路径是分开的。

## 看它如何工作

```
你：  我想做一个日历日程简报应用。
你：  /office-hours
Claude: [先问痛点，不问假设]

你：  多个 Google 日历，事件信息会过期，地点经常错。
      准备工作太耗时，而且结果也不够好……

Claude: 我要先挑战你的表述。你说的是“日程简报应用”，但你真正
        描述的是一个个人首席助理 AI。
        [抽取出 5 个你没意识到自己在描述的能力]
        [挑战 4 个前提，你可以同意、反对或调整]
        [给出 3 种实现方案和预估成本]
        建议：先明天就上线最小可行版本，从真实使用中学习。
        完整愿景是一个 3 个月项目，先从真正能用的日程简报开始。
        [写出设计文档，再喂给后续技能]

你：  /plan-ceo-review
      [读取设计文档，挑战范围，做 10 段式评审]

你：  /plan-eng-review
      [ASCII 数据流图、状态机、错误路径]
      [测试矩阵、失败模式、安全问题]

你：  批准方案，退出计划模式。
      [8 分钟内写出 2,400 行、11 个文件]

你：  /review
      [AUTO-FIXED] 2 个问题。 [ASK] 一个竞态问题，你批准修复。

你：  /qa https://staging.myapp.com
      [打开真实浏览器，点击流程，找出并修复一个 bug]

你：  /ship
      测试：42 → 51（新增 9 个）。PR：github.com/you/app/pull/42
```

你说的是“日程简报应用”。系统听到的是“你在做一个个人首席助理 AI”。
它听的是你的痛点，而不是你的功能描述。它会挑战你的前提，给出三个方案，
推荐最窄的切入点，并写出一个会继续喂给后续所有技能的设计文档。
这不是一个 copilot。这是一支团队。

## 工作流

gstack 不是一组工具，而是一套流程。技能的排列顺序就是一个 sprint 的顺序：

**思考 → 计划 → 构建 → 评审 → 测试 → 发布 → 复盘**

每个技能都会把上下文交给下一个技能。`/office-hours` 写出的设计文档会被
`/plan-ceo-review` 读取。`/plan-eng-review` 写出的测试计划会被 `/qa`
接上。`/review` 会找出 `/ship` 需要验证的问题。因为每一步都知道前一步发生了什么，
所以不会有内容掉队。

一个人、一个功能、一个 sprint，通常大约 30 分钟就能跑完。
但真正改变一切的是：你可以同时跑 10 到 15 个这样的 sprint。
不同功能、不同分支、不同 agent，一起并行。这就是我为什么能在做自己
本职工作的同时，每天产出 10,000 行以上生产代码。

| 技能 | 角色 | 做什么 |
|------|------|--------|
| `/office-hours` | **YC Office Hours** | 从这里开始。6 个强制性问题，在你写代码前先重构你的产品定义。会挑战你的表述、前提，并给出实现替代方案。设计文档会继续喂给后续技能。 |
| `/plan-ceo-review` | **CEO / Founder** | 重新思考问题，找到请求背后隐藏的 10 分产品。四种模式：扩张、选择性扩张、保持范围、缩小范围。 |
| `/plan-eng-review` | **Eng Manager** | 锁定架构、数据流、图表、边界情况和测试，把隐藏假设全部拉出来。 |
| `/plan-design-review` | **Senior Designer** | 给每个设计维度打 0 到 10 分，解释什么是 10 分，再把方案改到 10 分。专门抓 AI slop。一次只问一个设计决策。 |
| `/design-consultation` | **Design Partner** | 从零建立完整的设计系统。了解行业情况，给出安全方案和创意风险，生成接近真实产品的 mockup。设计是所有阶段的核心。 |
| `/review` | **Staff Engineer** | 找出能过 CI 但会在生产炸掉的问题。会自动修掉明显问题，也会标出完整性缺口。 |
| `/investigate` | **Debugger** | 系统化做根因分析。铁律：没有调查，就没有修复。跟踪数据流、验证假设，最多尝试 3 次失败修复。 |
| `/design-review` | **Designer Who Codes** | 和 `/plan-design-review` 一样的审计，然后直接修掉发现的问题。每次修复都要原子提交，并附 before/after 截图。 |
| `/qa` | **QA Lead** | 测试你的应用，找出 bug，修复它们，生成回归测试，再重新验证。 |
| `/qa-only` | **QA Reporter** | 和 `/qa` 同样的方法论，但只出报告，不改代码。 |
| `/ship` | **Release Engineer** | 同步 main，运行测试，审计覆盖率，推送并开 PR。即使你没有测试框架，它也会帮你启动。 |
| `/land-and-deploy` | **Release Engineer** | 合并 PR，等待 CI 和部署完成，再验证生产环境健康状况。接在 `/ship` 后面使用。 |
| `/canary` | **SRE** | 部署后持续监控。观察控制台错误、性能回退和页面失败，定期截图并检测异常。 |
| `/benchmark` | **Performance Engineer** | 建立页面加载时间、Core Web Vitals 和资源大小基线，并在每个 PR 上比较前后差异。 |
| `/document-release` | **Technical Writer** | 你刚发布什么，它就同步更新什么文档。自动修正过期的 README。 |
| `/retro` | **Eng Manager** | 面向团队的一周复盘。按人拆分、看发布节奏、看测试健康趋势、看成长空间。 |
| `/browse` | **QA Engineer** | 给 agent 一双眼睛。真实 Chromium 浏览器、真实点击、真实截图，单步约 100ms。 |
| `/setup-browser-cookies` | **Session Manager** | 把真实浏览器里的 cookie 导入到无头会话中，用来测试需要登录的页面。 |

### 强力工具

| 技能 | 作用 |
|------|------|
| `/codex` | **Second Opinion**。来自 OpenAI Codex CLI 的独立代码审查。三种模式：审查（通过 / 不通过）、对抗式挑战、开放咨询。当 `/review` 和 `/codex` 都跑过时，还能做交叉模型分析。 |
| `/careful` | **Safety Guardrails**。在执行破坏性命令前报警，例如 rm -rf、DROP TABLE、force-push。说“be careful”就会启用。 |
| `/freeze` | **Edit Lock**。把文件编辑限制在一个目录里，避免调试时误改别处。 |
| `/guard` | **Full Safety**。把 `/careful` 和 `/freeze` 合并到一个命令里。 |
| `/unfreeze` | **Unlock**。移除 `/freeze` 的边界。 |
| `/setup-deploy` | **Deploy Configurator**。为 `/land-and-deploy` 做一次性配置，自动识别你的平台、生产地址和部署命令。 |
| `/gstack-upgrade` | **Self-Updater**。升级 gstack 到最新版本，自动识别全局安装和 vendored 安装，并显示变化内容。 |

**[每个技能的深度说明、示例和方法论请看这里 →](docs/skills.md)**

## 新增内容，以及为什么重要

**`/office-hours` 会在你写代码前重构你的产品。** 你说“日程简报应用”，它会先听你的痛点，挑战你的表述，告诉你你真正做的是一个个人首席助理 AI，挑战你的前提，然后给出 3 种实现方案和成本预估。它写出的设计文档会直接喂给 `/plan-ceo-review` 和 `/plan-eng-review`，让后面的所有步骤都建立在清晰的问题定义上，而不是模糊的功能请求上。

**设计是核心。** `/design-consultation` 不只是挑字体。它会研究你的赛道，给出安全选择和创意风险，生成接近真实产品的 mockup，还会写 `DESIGN.md`。然后 `/design-review` 和 `/plan-eng-review` 会继续读取这些决策，设计就这样贯穿整个系统。

**`/qa` 是一个巨大突破。** 它让我从 6 个并行 worker 提升到 12 个。Claude Code 能说“我看到了问题”，然后真的修掉它，生成回归测试，再验证修复，这完全改变了我的工作方式。agent 现在真的有眼睛了。

**智能路由评审。** 就像一个运转良好的创业公司：CEO 不需要看基础设施 bug 的修复，设计评审也不需要参与后端变更。gstack 会记录跑了哪些评审，判断什么是合适的，然后自动选出正确动作。发布前的 Review Readiness Dashboard 会告诉你当前状态。

**把测试做到位。** 如果你的项目还没有测试框架，`/ship` 会从零把它启动起来。每次 `/ship` 都会输出覆盖率审计。每次 `/qa` 修一个 bug 都会生成回归测试。目标是 100% 覆盖率，因为测试能把 vibe coding 变成安全的工程方式，而不是 yolo coding。

**一个命令发布到生产。** `/land-and-deploy` 会接过 `/ship` 的结果，合并你的 PR，等待 CI 和部署，然后在你的生产地址上做 canary 验证。它能自动识别 Fly.io、Render、Vercel、Netlify、Heroku 或 GitHub Actions。出问题时，它会提供回滚建议。配合 `/canary` 可以继续做发布后的长期监控，配合 `/benchmark` 可以在性能回退进入生产前把它抓出来。

**`/document-release` 是你一直缺的那个工程师。** 它会读你项目里的每个文档文件，交叉对照 diff，把所有漂移的内容更新掉。README、ARCHITECTURE、CONTRIBUTING、CLAUDE.md、TODOS 都能自动保持最新。现在 `/ship` 也会自动触发它，所以文档不会再轻易过期。

**当 agent 卡住时，可以把浏览器交出去。** 遇到验证码、登录墙或 MFA 提示？`$B handoff` 会打开一个可见的 Chrome，停在同一个页面，保留所有 cookie 和标签页。你手动处理完后告诉 Claude，`$B resume` 就会接着跑。连续失败 3 次后，它甚至会自动建议这么做。

**多 AI 第二意见。** `/codex` 会从 OpenAI Codex CLI 拿到一个独立审查结果，等于有一个完全不同的 AI 在看同一个 diff。三种模式：带通过 / 不通过门禁的代码审查、会主动尝试破坏你代码的对抗式挑战、带会话连续性的开放咨询。当 `/review`（Claude）和 `/codex`（OpenAI）都审过同一个分支后，你会拿到一个交叉模型分析，显示哪些发现重叠，哪些只属于某一边。

**按需开启安全护栏。** 说“be careful”，`/careful` 就会在执行破坏性命令前提醒你，比如 rm -rf、DROP TABLE、force-push、git reset --hard。`/freeze` 会把编辑锁在一个目录里，防止 Claude 误修别的模块。`/guard` 会同时开启两者。`/investigate` 会自动把自己限制在正在调查的模块里。

**主动推荐合适技能。** gstack 会判断你现在处于哪一阶段，比如头脑风暴、评审、调试还是测试，然后推荐合适的技能。如果你不想再看到建议，直接说“stop suggesting”，它会记住。

## 10 到 15 个并行 sprint

单个 sprint 很强。十个同时跑，才是真正的变革。

[Conductor](https://conductor.build) 可以同时运行多个 Claude Code 会话，每个都在独立工作区里。一个会话跑新的 `/office-hours`，另一个做 PR 的 `/review`，第三个实现功能，第四个在 staging 上跑 `/qa`，另外六个再跑别的分支。全部同时进行。我通常会同时跑 10 到 15 个 sprint，这基本就是当前的实用上限。

sprint 的结构让并行成为可能。没有流程，十个 agent 就是十个混乱源。有了流程，也就是思考、计划、构建、评审、测试、发布，十个 agent 就知道自己该做什么、何时停手。你管理它们的方式，就像 CEO 管理团队一样：盯住关键决策，其余工作交给它们继续跑。

---

## 来一起乘上这股浪潮

这是一套**免费、MIT 许可、开源、现在就能用**的工具。没有高级版，没有等待名单，没有附加条件。

我已经开源了自己的开发方式，而且还在持续升级自己的软件工厂。你可以 fork 它，改造成你自己的版本。这就是它存在的意义。我想让每个人都能经历这个阶段。

同样的工具，不同的结果。因为 gstack 给你的是结构化角色和评审门禁，而不是一团 generic 的 agent 混乱。这个治理层，才是“快速但不乱”和“只会乱飞”的分界线。

模型进步得非常快。那些现在就学会如何和它们真正协作的人，而不是只是浅尝辄止的人，会拥有巨大的优势。这个窗口期就在这里。上车吧。

18 个专家角色，7 个强力工具。全部都是 slash command，全部是 Markdown，全部免费。**[github.com/garrytan/gstack](https://github.com/garrytan/gstack)**，MIT License。

> **我们在招人。** 想做到每天 1 万行以上 LOC，并帮助把 gstack 打磨得更稳定？
> 来 YC 工作吧 - [ycombinator.com/software](https://ycombinator.com/software)
> 薪资和股权都非常有竞争力，地点在旧金山 Dogpatch District。

## 文档

| 文档 | 内容 |
|------|------|
| [技能深度说明](docs/skills.md) | 每个技能的方法论、示例和工作流，包括 Greptile 集成 |
| [Builder Ethos](ETHOS.md) | 构建者哲学：Boil the Lake、Search Before Building、三层知识结构 |
| [架构](ARCHITECTURE.md) | 设计决策和系统内部结构 |
| [浏览器参考](BROWSER.md) | `/browse` 的完整命令参考 |
| [贡献指南](CONTRIBUTING.md) | 开发环境、测试、contributor 模式和 dev 模式 |
| [更新日志](CHANGELOG.md) | 每个版本的新内容 |

## 隐私与遥测

gstack 含有**默认关闭、可选择开启**的使用遥测，用来帮助改进项目。具体如下：

- **默认关闭。** 除非你明确同意，否则不会发送任何数据。
- **首次运行时**，gstack 会询问你是否愿意共享匿名使用数据。你可以直接拒绝。
- **如果你开启，发送的内容只有：** 技能名、持续时间、成功 / 失败、gstack 版本、操作系统。仅此而已。
- **绝不会发送：** 代码、文件路径、仓库名、分支名、提示词或任何用户生成内容。
- **随时可改：** 执行 `gstack-config set telemetry off` 可以立刻关闭全部遥测。

数据存储在 [Supabase](https://supabase.com) 中，这是一个开源的 Firebase 替代品。Schema 在 [`supabase/migrations/001_telemetry.sql`](supabase/migrations/001_telemetry.sql) 里，你可以直接核查到底收集了什么。仓库里的 Supabase publishable key 是公开 key，类似 Firebase API key，真正起作用的是行级安全策略，它只允许插入。

**本地分析始终可用。** 运行 `gstack-analytics` 就能从本地 JSONL 文件查看个人使用数据，不需要任何远端数据。

## 故障排查

**技能没有出现？** `cd ~/.claude/skills/gstack && ./setup`

**`/browse` 失败？** `cd ~/.claude/skills/gstack && bun install && bun run build`

**安装过旧？** 运行 `/gstack-upgrade`，或者在 `~/.gstack/config.yaml` 里设置 `auto_upgrade: true`

**Windows 用户：** gstack 可通过 Git Bash 或 WSL 在 Windows 11 上使用。除 Bun 之外还需要 Node.js，因为 Bun 在 Windows 上和 Playwright 的 pipe transport 有已知问题（[bun#4253](https://github.com/oven-sh/bun/issues/4253)）。browse server 会自动回退到 Node.js。请确认 `bun` 和 `node` 都在 PATH 中。

**Claude 说它看不到技能？** 确认你项目里的 `CLAUDE.md` 有 gstack 段落。可以添加下面这段：

```
## gstack
使用 gstack 的 /browse 进行所有网页浏览。不要使用 mcp__claude-in-chrome__* 工具。
可用技能：/office-hours, /plan-ceo-review, /plan-eng-review, /plan-design-review,
/design-consultation, /review, /ship, /browse, /qa, /qa-only, /design-review,
/setup-browser-cookies, /retro, /investigate, /document-release, /codex, /careful,
/freeze, /guard, /unfreeze, /gstack-upgrade.
```

## 许可

MIT。永久免费。去做点有意思的东西吧。

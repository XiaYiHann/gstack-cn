# gstack 安装脚本一键安装实现计划

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增一个一键安装入口，只把 gstack 的 skill 本体安装到系统级 skill 目录，并同步写入中文输出指令。

**Architecture:** 保留现有 `setup` 作为源码仓库内的构建/注册入口，新增独立的 `install.sh` 作为系统级安装器。安装器从本地 checkout 或远程仓库拉取源代码，然后只复制 skill 本体、运行时资产和顶层技能目录到 `~/.claude/skills/gstack` 与 `~/.agent/skills/gstack`，不保留仓库级内容。README 只暴露一键安装命令和本地安装命令，测试覆盖路径、复制白名单和中文指令注入。

**Tech Stack:** Bash, Bun test, existing repository shell scripts.

---

### Chunk 1: 安装器

**Files:**
- Create: `install.sh`
- Modify: `README.md`
- Create: `test/install-script.test.ts`

- [x] **Step 1: 写失败测试**
- [x] **Step 2: 运行测试，确认失败**
- [x] **Step 3: 实现最小安装器**
- [x] **Step 4: 重新运行测试，确认通过**
- [ ] **Step 5: 提交**

### Chunk 2: 回归验证

**Files:**
- Modify: `test/gen-skill-docs.test.ts`

- [x] **Step 1: 保持中文指令回归**
- [x] **Step 2: 运行目标测试**
- [x] **Step 3: 必要时修复**
- [x] **Step 4: 再跑一次验证**
- [ ] **Step 5: 收尾**

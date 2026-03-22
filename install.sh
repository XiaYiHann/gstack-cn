#!/usr/bin/env bash
set -euo pipefail

GSTACK_REPO_URL="${GSTACK_REPO_URL:-https://github.com/garrytan/gstack.git}"
GSTACK_INSTALL_REF="${GSTACK_INSTALL_REF:-main}"

find_local_repo_root() {
  local dir="$PWD"

  while [ "$dir" != "/" ]; do
    if [ -f "$dir/package.json" ] && [ -f "$dir/README.md" ] && [ -f "$dir/install.sh" ]; then
      printf '%s\n' "$dir"
      return 0
    fi
    dir="$(dirname "$dir")"
  done

  return 1
}

copy_skill_tree() {
  local source_root="$1"
  local target_root="$2"
  local tmp_target

  tmp_target="$(mktemp -d "${TMPDIR:-/tmp}/gstack-install.XXXXXX")"
  mkdir -p "$target_root"

  for file_name in SKILL.md ETHOS.md VERSION; do
    if [ -f "$source_root/$file_name" ]; then
      cp "$source_root/$file_name" "$tmp_target/$file_name"
    fi
  done

  if [ -d "$source_root/bin" ]; then
    cp -R "$source_root/bin" "$tmp_target/bin"
  fi

  for skill_dir in "$source_root"/*/; do
    if [ -f "$skill_dir/SKILL.md" ]; then
      cp -R "$skill_dir" "$tmp_target/$(basename "$skill_dir")"
    fi
  done

  find "$tmp_target" -type d -name node_modules -prune -exec rm -rf {} +

  rm -rf "$target_root"
  mkdir -p "$(dirname "$target_root")"
  mv "$tmp_target" "$target_root"
}

inject_chinese_directive() {
  local target_file="$1"
  local marker="# gstack-cn: Chinese output"

  mkdir -p "$(dirname "$target_file")"
  touch "$target_file"

  if ! grep -q "$marker" "$target_file" 2>/dev/null; then
    cat >> "$target_file" << 'DIRECTIVE'

## gstack-cn: Chinese output
When using gstack skills, always respond in Chinese. Generate plans, docs, and
all user-facing output in Chinese unless explicitly requested otherwise.
DIRECTIVE
    echo "  injected Chinese output directive into $target_file"
  fi
}

SOURCE_ROOT=""
TMP_DIR=""
if local_root="$(find_local_repo_root 2>/dev/null)"; then
  SOURCE_ROOT="$local_root"
else
  TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/gstack-cn-install.XXXXXX")"
  trap 'rm -rf "$TMP_DIR"' EXIT INT TERM
  git clone --depth 1 --branch "$GSTACK_INSTALL_REF" "$GSTACK_REPO_URL" "$TMP_DIR/gstack-cn"
  SOURCE_ROOT="$TMP_DIR/gstack-cn"
fi

if [ ! -x "$SOURCE_ROOT/browse/dist/browse" ] || [ ! -f "$SOURCE_ROOT/.agents/skills/gstack-cn/SKILL.md" ]; then
  if command -v bun >/dev/null 2>&1 && [ -f "$SOURCE_ROOT/package.json" ]; then
    (
      cd "$SOURCE_ROOT"
      bun install
      bun run build
    )
  fi
fi

copy_skill_tree "$SOURCE_ROOT" "$HOME/.claude/skills/gstack"
inject_chinese_directive "$HOME/.claude/CLAUDE.md"
echo "gstack ready (claude)."
echo "  skills: $HOME/.claude/skills/gstack"

copy_skill_tree "$SOURCE_ROOT" "$HOME/.agent/skills/gstack"
inject_chinese_directive "$HOME/.agent/AGENTS.md"
echo "gstack ready (agent)."
echo "  skills: $HOME/.agent/skills/gstack"

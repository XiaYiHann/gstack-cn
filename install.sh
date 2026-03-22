#!/usr/bin/env bash
set -euo pipefail

GSTACK_BUNDLE_URL="${GSTACK_BUNDLE_URL:-https://raw.githubusercontent.com/XiaYiHann/gstack-cn/main/dist/gstack-skill-bundle.tar.gz}"

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

download_bundle() {
  local bundle_url="$1"
  local bundle_path="$2"

  curl -fsSL "$bundle_url" -o "$bundle_path"
}

extract_bundle_root() {
  local bundle_path="$1"
  local extract_dir="$2"
  local first_entry
  local root_name

  mkdir -p "$extract_dir"
  tar -xzf "$bundle_path" -C "$extract_dir"

  first_entry="$(tar -tzf "$bundle_path" | head -n 1)"
  root_name="${first_entry%%/*}"

  if [ -z "$root_name" ] || [ ! -d "$extract_dir/$root_name" ]; then
    echo "failed to locate bundle root from $bundle_path" >&2
    return 1
  fi

  printf '%s\n' "$extract_dir/$root_name"
}

SOURCE_ROOT=""
TMP_DIR=""
if local_root="$(find_local_repo_root 2>/dev/null)"; then
  SOURCE_ROOT="$local_root"
else
  TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/gstack-cn-install.XXXXXX")"
  trap 'rm -rf "$TMP_DIR"' EXIT INT TERM
  BUNDLE_PATH="$TMP_DIR/gstack-skill-bundle.tar.gz"
  download_bundle "$GSTACK_BUNDLE_URL" "$BUNDLE_PATH"
  SOURCE_ROOT="$(extract_bundle_root "$BUNDLE_PATH" "$TMP_DIR/extracted")"
fi

copy_skill_tree "$SOURCE_ROOT" "$HOME/.claude/skills/gstack-cn"
inject_chinese_directive "$HOME/.claude/CLAUDE.md"
echo "gstack ready (claude)."
echo "  skills: $HOME/.claude/skills/gstack-cn"

copy_skill_tree "$SOURCE_ROOT" "$HOME/.agents/skills/gstack-cn"
inject_chinese_directive "$HOME/.agents/AGENTS.md"
echo "gstack ready (agents)."
echo "  skills: $HOME/.agents/skills/gstack-cn"

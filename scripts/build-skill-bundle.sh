#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUTPUT_DIR="$ROOT_DIR/dist"
OUTPUT_PATH="$OUTPUT_DIR/gstack-skill-bundle.tar.gz"
STAGE_DIR="$(mktemp -d "${TMPDIR:-/tmp}/gstack-bundle.XXXXXX")"
STAGE_ROOT="$STAGE_DIR/gstack-cn"

cleanup() {
  rm -rf "$STAGE_DIR"
}

trap cleanup EXIT INT TERM

mkdir -p "$OUTPUT_DIR" "$STAGE_ROOT"

for file_name in SKILL.md ETHOS.md VERSION; do
  if [ -f "$ROOT_DIR/$file_name" ]; then
    cp "$ROOT_DIR/$file_name" "$STAGE_ROOT/$file_name"
  fi
done

if [ -d "$ROOT_DIR/bin" ]; then
  cp -R "$ROOT_DIR/bin" "$STAGE_ROOT/bin"
fi

for skill_dir in "$ROOT_DIR"/*/; do
  if [ -f "$skill_dir/SKILL.md" ]; then
    cp -R "$skill_dir" "$STAGE_ROOT/$(basename "$skill_dir")"
  fi
done

find "$STAGE_ROOT" -type d -name node_modules -prune -exec rm -rf {} +

tar -czf "$OUTPUT_PATH" -C "$STAGE_DIR" gstack-cn
echo "wrote $OUTPUT_PATH"

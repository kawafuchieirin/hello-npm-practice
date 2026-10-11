#!/usr/bin/env bash
# 自作パッケージを「作る → 固める → 別プロジェクトに入れて使う」まで一気に体験するスクリプト。
# 公開（npm publish）はせず、npm pack で作った .tgz をローカルインストールするだけなので安全。
set -euo pipefail

PKG_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PKG_NAME="$(node -p "require('$PKG_DIR/package.json').name")"
TRY_DIR="$(dirname "$PKG_DIR")/try-hello-npm"

step() {
  printf '\n\033[1;36m==> %s\033[0m\n' "$1"
}

step "1/6 テストを実行する（npm test）"
cd "$PKG_DIR"
npm test

step "2/6 配布用の .tgz を作る（npm pack）"
# 古い成果物が残っていると、どれをインストールしたのか分からなくなるので消す
rm -f "$PKG_DIR"/*.tgz
TARBALL="$(npm pack --silent | tail -n 1)"
echo "作成: $TARBALL"

step "3/6 .tgz の中身を確認する（\"files\" に書いたものだけが入る）"
# npm publish で公開されるのもこれと同じ中身。test.js や try-install.sh は入らない。
tar -tzf "$PKG_DIR/$TARBALL"

step "4/6 試用プロジェクトを作る（${TRY_DIR}）"
if [ -d "$TRY_DIR" ]; then
  echo "既存の試用プロジェクトを作り直します: $TRY_DIR"
  # このスクリプトが作ったディレクトリであることを確認してから消す
  if [ ! -f "$TRY_DIR/.created-by-try-install" ]; then
    echo "中断: $TRY_DIR は try-install.sh が作ったものではないようです。手動で確認してください。" >&2
    exit 1
  fi
  rm -rf "$TRY_DIR"
fi
mkdir -p "$TRY_DIR"
touch "$TRY_DIR/.created-by-try-install"
cd "$TRY_DIR"
npm init -y >/dev/null
npm install "$PKG_DIR/$TARBALL"

step "5/6 ライブラリとして使う（require）"
node -e "const { greet } = require('$PKG_NAME'); console.log(greet('太郎'));"

step "6/6 コマンドとして使う（npx）"
npx hello-npm 太郎
npx hello-npm
npx hello-npm --version

step "npmがどこに何を置いたか覗いてみる"
echo "- パッケージの実体: $TRY_DIR/node_modules/$PKG_NAME"
ls -1 "$TRY_DIR/node_modules/$PKG_NAME"
echo "- 登録されたコマンド:"
ls -l "$TRY_DIR/node_modules/.bin/" | grep hello-npm

printf '\n\033[1;32m完了！\033[0m 試用プロジェクト: %s\n' "$TRY_DIR"
echo "片付けるときは: rm -rf \"$TRY_DIR\" && rm -f \"$PKG_DIR\"/*.tgz"

# hello-npm-practice

npmパッケージの作り方を手を動かして学ぶための練習用パッケージです。
ライブラリ（`require` して使う）とCLIコマンド（`hello-npm`）の両方を1つのパッケージで提供します。

## ファイル構成

```
hello-npm-practice/
├── package.json     ← パッケージの設定（名前・バージョン・入口など）
├── index.js         ← ライブラリ本体（"main" で指定）
├── bin/cli.js       ← コマンド本体（"bin" で指定）
├── test.js          ← npm test で実行
├── try-install.sh   ← 自分でインストールして試すスクリプト
└── README.md
```

## まずは動かす

```bash
bash try-install.sh
```

このスクリプト1本で、次の流れを一通り体験できます。

1. `npm test` でテストを実行
2. `npm pack` で配布用の `.tgz` を作成
3. `.tgz` の中身を表示（`"files"` に書いたものだけが入っていることを確認）
4. 隣に試用プロジェクト `try-hello-npm/` を作成し、`.tgz` をインストール
5. ライブラリとして `require` して使う
6. コマンドとして `npx hello-npm 太郎` を実行

後片付けは以下のとおりです。

```bash
rm -rf ../try-hello-npm && rm -f ./*.tgz
```

## 使い方

ライブラリとして:

```js
const { greet } = require('hello-npm-practice');

greet('太郎'); // => 'こんにちは、太郎さん！'
greet();       // => 'こんにちは、世界さん！'
```

コマンドとして:

```bash
hello-npm 太郎      # こんにちは、太郎さん！
hello-npm           # こんにちは、世界さん！
hello-npm --help    # 使い方
hello-npm --version # バージョン
```

## package.json の読みどころ

| フィールド | 役割 |
| --- | --- |
| `main` | `require('hello-npm-practice')` したときに読み込まれるファイル |
| `bin` | コマンド名 → 実行ファイルの対応。インストール時に `node_modules/.bin/` にリンクが作られる |
| `files` | `.tgz`（= 公開物）に含めるファイル。書かなければ余計なものまで配布されてしまう |
| `scripts.test` | `npm test` の中身 |
| `engines` | 動作を保証するNodeのバージョン |

## 学びどころ

- **`npm pack` の `.tgz` は `npm publish` で公開されるものと中身が同じ。**
  `"files"` に書いたファイルだけが含まれ、`test.js` や `try-install.sh` は入りません。
  `tar -tzf hello-npm-practice-1.0.0.tgz` で確認できます。
- **インストール後のディレクトリを覗くと、npmの仕組みが見えます。**
  - `try-hello-npm/node_modules/hello-npm-practice/` … パッケージの実体
  - `try-hello-npm/node_modules/.bin/hello-npm` … `bin` から作られたシンボリックリンク
- **`bin/cli.js` の1行目 `#!/usr/bin/env node`（シェバン）が必須。**
  これが無いと、リンク経由でコマンドとして実行できません。

## 他のインストール方法も試す

### npm link（開発中に便利）

シンボリックリンクで繋ぐので、コードを編集すると即座に反映されます。

```bash
# パッケージ側で
npm link

# 使う側のプロジェクトで
npm link hello-npm-practice
```

### パス指定でインストール

```bash
npm install ../hello-npm-practice
```

### npmjs.com に実際に公開する

```bash
npm login
npm publish
```

`hello-npm-practice` という名前が既に使われている場合は、スコープ付きの名前にします。

```bash
# package.json の "name" を "@yourname/hello-npm" に変更してから
npm publish --access public
```

## 補足

このリポジトリは **npm** の学習が目的なので、意図的に `npm` コマンドを使っています
（普段の開発では `pnpm` を使っていても、ここでは `npm` の挙動そのものが教材です）。
Nodeのバージョンは `.mise.toml` で固定しているので、`mise install` で揃えられます。

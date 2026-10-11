#!/usr/bin/env node
'use strict';

// 先頭の #!/usr/bin/env node（シェバン）があることで、
// npmが node_modules/.bin に作るリンク経由で直接実行できる。
const { greet } = require('../index.js');
const { name: pkgName, version } = require('../package.json');

const USAGE = `使い方: ${pkgName.replace('-practice', '')} [名前]

  hello-npm            こんにちは、世界さん！
  hello-npm 太郎       こんにちは、太郎さん！

オプション:
  -h, --help           このヘルプを表示
  -v, --version        バージョンを表示`;

function main(argv) {
  const args = argv.slice(2);

  if (args.includes('-h') || args.includes('--help')) {
    console.log(USAGE);
    return 0;
  }

  if (args.includes('-v') || args.includes('--version')) {
    console.log(version);
    return 0;
  }

  // 位置引数は1つだけ受け取る想定。余分な引数は使い方の誤りとして弾く。
  if (args.length > 1) {
    console.error(`エラー: 引数が多すぎます（${args.length}個）\n`);
    console.error(USAGE);
    return 1;
  }

  console.log(greet(args[0]));
  return 0;
}

process.exitCode = main(process.argv);

'use strict';

// 依存ゼロでテストするため、Node標準の assert と child_process だけを使う。
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const { greet } = require('./index.js');

const CLI = path.join(__dirname, 'bin', 'cli.js');
const runCli = (...args) =>
  execFileSync(process.execPath, [CLI, ...args], {
    encoding: 'utf8',
    // 既定だと子プロセスのstderrが親に流れ、失敗系テストでログが汚れるのでpipeする
    stdio: ['ignore', 'pipe', 'pipe'],
  });

const tests = {
  '名前を渡すとその名前であいさつする'() {
    assert.equal(greet('太郎'), 'こんにちは、太郎さん！');
  },

  '名前を省略すると既定値であいさつする'() {
    assert.equal(greet(), 'こんにちは、世界さん！');
  },

  '前後の空白は取り除かれる'() {
    assert.equal(greet('  花子  '), 'こんにちは、花子さん！');
  },

  '空文字やスペースのみなら既定値に倒す'() {
    assert.equal(greet(''), 'こんにちは、世界さん！');
    assert.equal(greet('   '), 'こんにちは、世界さん！');
  },

  '文字列以外を渡すとTypeErrorになる'() {
    assert.throws(() => greet(123), TypeError);
    assert.throws(() => greet(null), TypeError);
  },

  'CLIは引数の名前であいさつを出力する'() {
    assert.equal(runCli('太郎'), 'こんにちは、太郎さん！\n');
  },

  'CLIは引数なしでも動く'() {
    assert.equal(runCli(), 'こんにちは、世界さん！\n');
  },

  'CLIの--versionはpackage.jsonのバージョンを返す'() {
    const { version } = require('./package.json');
    assert.equal(runCli('--version'), `${version}\n`);
  },

  'CLIの--helpは使い方を表示する'() {
    assert.match(runCli('--help'), /使い方:/);
  },

  'CLIは引数が多すぎると終了コード1で失敗する'() {
    assert.throws(
      () => runCli('太郎', '花子'),
      (error) => error.status === 1
    );
  },
};

let failed = 0;
for (const [name, run] of Object.entries(tests)) {
  try {
    run();
    console.log(`  ✓ ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`  ✗ ${name}`);
    console.error(`    ${error.message}`);
  }
}

const total = Object.keys(tests).length;
console.log(`\n${total - failed} passed, ${failed} failed`);
process.exitCode = failed === 0 ? 0 : 1;

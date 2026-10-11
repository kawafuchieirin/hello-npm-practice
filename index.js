'use strict';

/**
 * あいさつ文を組み立てる。
 * パッケージの「公開API」はこの1関数だけに絞っている。
 * 公開APIを小さく保つと、後方互換を壊さずにバージョンを上げやすい。
 *
 * @param {string} [name='世界'] あいさつする相手の名前
 * @returns {string} あいさつ文
 */
function greet(name = '世界') {
  if (typeof name !== 'string') {
    throw new TypeError(`name must be a string, got ${typeof name}`);
  }

  const trimmed = name.trim();
  // 空文字やスペースのみが渡されても「こんにちは、さん！」にならないよう既定値へ倒す
  return `こんにちは、${trimmed === '' ? '世界' : trimmed}さん！`;
}

module.exports = { greet };

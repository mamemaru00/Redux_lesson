// reducer のテスト。npm test で実行する。
//
// Node.js に最初から入っているテストの仕組みを使っているので、追加のインストールはいらない。
// node --test は、tests フォルダの中の .test.js で終わるファイルを探して実行する。
//
// reducer は「受け取ったものから計算して返すだけ」の関数なので、
// 画面もブラウザも用意せず、値を渡して返ってきた値を比べるだけでテストできる。
// これも reducer を純粋な関数にしておく利点の1つ。

// test は「テストを1つ定義する」関数。1つめの引数がテストの名前、2つめが中身。
import { test } from "node:test";
// assert は「こうなっているはず」を確かめる道具。違っていたらそのテストは失敗になる。
// /strict を付けると、型の違う値を同じとみなすような甘い比べ方をしなくなる。
import assert from "node:assert/strict";

import { counterReducer } from "../src/reducer.js";

// assert.deepEqual(A, B) は「A と B の中身が同じか」を比べる。
// 別々のオブジェクトでも、中身が { count: 0 } 同士なら合格になる。

test("最初の状態は count 0", () => {
  // store が最初にやるのと同じ呼び方。state を渡さないと initialState が使われる。
  assert.deepEqual(counterReducer(undefined, { type: "@@INIT" }), { count: 0 });
});

test("increment で 1 増える", () => {
  assert.deepEqual(counterReducer({ count: 5 }, { type: "counter/increment" }), { count: 6 });
});

test("decrement で 1 減る", () => {
  assert.deepEqual(counterReducer({ count: 5 }, { type: "counter/decrement" }), { count: 4 });
});

test("reset で 0 に戻る", () => {
  // 5 から始めているのは、「最初から 0 だったので 0 のまま」で偶然通ってしまうのを防ぐため。
  assert.deepEqual(counterReducer({ count: 5 }, { type: "counter/reset" }), { count: 0 });
});

test("知らない action では、今の state をそのまま返す", () => {
  const before = { count: 3 };
  // assert.equal(A, B) は deepEqual と違い「A と B がまったく同じオブジェクトか」を比べる。
  // 中身が同じ別のオブジェクトを返したら失敗する。
  // 何も変わらないときは、新しい箱を作らずに同じ箱を返すのが正しい動き。
  assert.equal(counterReducer(before, { type: "counter/typo" }), before);
});

test("元の state は書き換えず、新しい state を作って返す", () => {
  const before = { count: 5 };
  const after = counterReducer(before, { type: "counter/decrement" });

  // 1つめ: 渡した before の中身が 5 のままか。
  //   state.count -= 1 のように書き換えていると、ここが 4 になって失敗する。
  assert.deepEqual(before, { count: 5 }, "元の state が書き換えられている");

  // 2つめ: 返ってきた after が before とは別のオブジェクトか。
  //   assert.notEqual は「同じオブジェクトではない」ことを確かめる。
  //   書き換えたうえで return state としていると、同じ箱が返ってきてここで失敗する。
  // 3つめの引数の文は、失敗したときに表示されるメッセージ。
  assert.notEqual(after, before, "同じオブジェクトが返ってきている。新しいオブジェクトを作って返す");
});

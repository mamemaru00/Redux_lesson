// node --test で動く、Node.js に最初から入っているテストの仕組みを使っている。
import { test } from "node:test";
import assert from "node:assert/strict";

import { counterReducer } from "../src/reducer.js";

test("最初の状態は count 0", () => {
  assert.deepEqual(counterReducer(undefined, { type: "@@INIT" }), { count: 0 });
});

test("increment で 1 増える", () => {
  assert.deepEqual(counterReducer({ count: 5 }, { type: "counter/increment" }), { count: 6 });
});

test("decrement で 1 減る", () => {
  assert.deepEqual(counterReducer({ count: 5 }, { type: "counter/decrement" }), { count: 4 });
});

test("reset で 0 に戻る", () => {
  assert.deepEqual(counterReducer({ count: 5 }, { type: "counter/reset" }), { count: 0 });
});

test("知らない action では、今の state をそのまま返す", () => {
  const before = { count: 3 };
  assert.equal(counterReducer(before, { type: "counter/typo" }), before);
});

test("元の state は書き換えず、新しい state を作って返す", () => {
  const before = { count: 5 };
  const after = counterReducer(before, { type: "counter/decrement" });
  assert.deepEqual(before, { count: 5 }, "元の state が書き換えられている");
  assert.notEqual(after, before, "同じオブジェクトが返ってきている。新しいオブジェクトを作って返す");
});

// 画面と store をつなぐところ。このファイルは完成品。

import { createStore } from "./store.js";
import { counterReducer } from "./reducer.js";

const store = createStore(counterReducer);

// ブラウザの開発者ツールのコンソールから store を触れるようにしておく。
// 例: store.dispatch({ type: "counter/increment" })
window.store = store;

// 画面の数字を、store の今の状態に合わせて描き直す。
// ボタンの処理はこの関数を直接呼ばない。呼ぶのは store だけ。
function render() {
  document.querySelector("#count").textContent = store.getState().count;
}
store.subscribe(render);
render();

// dispatch の前後の状態を、右側の記録欄に1行ずつ残す。
// 本物の Redux では、この役目を Redux DevTools や middleware が担う。
function send(action) {
  const before = store.getState();
  store.dispatch(action);
  const after = store.getState();

  const row = document.createElement("li");
  row.innerHTML = `
    <code class="state">${JSON.stringify(before)}</code>
    <span class="arrow">→</span>
    <code class="action">${action.type}</code>
    <span class="arrow">→</span>
    <code class="state">${JSON.stringify(after)}</code>
    <span class="box">${before === after ? "同じ箱のまま" : "新しい箱"}</span>`;
  document.querySelector("#log").prepend(row);
}

// ボタンは action を送るだけ。数字を直接いじらない。
document.querySelector("#inc").addEventListener("click", () => send({ type: "counter/increment" }));
document.querySelector("#dec").addEventListener("click", () => send({ type: "counter/decrement" }));
document.querySelector("#reset").addEventListener("click", () => send({ type: "counter/reset" }));
document.querySelector("#unknown").addEventListener("click", () => send({ type: "counter/typo" }));

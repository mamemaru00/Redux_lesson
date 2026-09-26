// 画面と store をつなぐところ。このファイルは完成品。
//
// Redux の構成要素でいうと、このファイルは View の側にあたる。
// やることは3つ。
//   1. store を作る
//   2. store が変わったら画面を描き直すように登録する
//   3. ボタンが押されたら action を dispatch する
// 画面の数字を直接書き換える行は、render の中にしかない。

// import は、別のファイルが export したものを取り込む書き方。
// "./store.js" の ./ は「このファイルと同じフォルダ」という意味。
import { createStore } from "./store.js";
import { counterReducer } from "./reducer.js";

// reducer を渡して store を作る。アプリ全体で store はこの1つだけ。
const store = createStore(counterReducer);

// ブラウザの開発者ツールのコンソールから store を触れるようにしておく。
// window はブラウザ全体を表すオブジェクトで、ここに付けたものはコンソールから名前で呼べる。
// 例: store.dispatch({ type: "counter/increment" }) と打つと、ボタンを押さなくても数字が変わる。
//     store.getState() と打つと、今の状態が見える。
// 学習用に付けているだけで、ふつうのアプリではやらない。
window.store = store;

// 画面の数字を、store の今の状態に合わせて描き直す関数。
// document.querySelector("#count") は、index.html の中から id="count" の要素を探して取り出す。
// textContent に値を入れると、その要素の中の文字が差し替わる。
//
// ボタンの処理はこの関数を直接呼ばない。呼ぶのは store だけ。
// 「状態が変わったら画面が追いかける」という向きを守るため。
function render() {
  document.querySelector("#count").textContent = store.getState().count;
}

// render を store に登録する。以後、dispatch のたびに store が render を呼ぶ。
store.subscribe(render);

// 登録しただけではまだ一度も呼ばれていないので、最初の1回は自分で描く。
render();

// action を dispatch して、その前後の状態を右側の記録欄に1行残す関数。
// 本物の Redux では、この役目を Redux DevTools や middleware が担う。
function send(action) {
  // dispatch の直前の状態を取っておく。
  const before = store.getState();

  // ここで reducer が動き、store の状態が差し替わり、render が呼ばれる。
  store.dispatch(action);

  // dispatch の直後の状態を取る。
  const after = store.getState();

  // 記録欄に足す1行を作る。li はリストの1項目を表す HTML の要素。
  const row = document.createElement("li");

  // バッククォート ` で囲んだ文字列の中では、${ } の中に書いた式の値が埋め込まれる。
  // Python の f文字列と同じ働き。
  // JSON.stringify は、オブジェクトを {"count":1} のような文字列に変える。
  //
  // before === after は「前と後が同じオブジェクトか」を調べている。中身が同じかではない。
  //   reducer が新しいオブジェクトを作って返したら false になり「新しい箱」と出る。
  //   default を通って今の state をそのまま返したら true になり「同じ箱のまま」と出る。
  // 条件 ? A : B は「条件が成り立てば A、そうでなければ B」を1行で書く書き方。
  row.innerHTML = `
    <code class="state">${JSON.stringify(before)}</code>
    <span class="arrow">→</span>
    <code class="action">${action.type}</code>
    <span class="arrow">→</span>
    <code class="state">${JSON.stringify(after)}</code>
    <span class="box">${before === after ? "同じ箱のまま" : "新しい箱"}</span>`;

  // prepend は先頭に足す。新しい記録ほど上に来る。
  document.querySelector("#log").prepend(row);
}

// ボタンが押されたときの処理を登録する。
// addEventListener("click", 関数) は「クリックされたらこの関数を呼んで」という登録。
// () => send(...) は引数のない短い関数で、クリックされた時点で send が呼ばれる。
//
// どのボタンも action を送るだけで、数字には触らない。
// { type: "..." } の部分が action。type に「何が起きたか」の名前を入れる。
document.querySelector("#inc").addEventListener("click", () => send({ type: "counter/increment" }));
document.querySelector("#dec").addEventListener("click", () => send({ type: "counter/decrement" }));
document.querySelector("#reset").addEventListener("click", () => send({ type: "counter/reset" }));

// reducer が知らない名前をわざと送るボタン。
// 打ち間違えた action が来ても、reducer の default が今の state をそのまま返すので、アプリは壊れない。
document.querySelector("#unknown").addEventListener("click", () => send({ type: "counter/typo" }));

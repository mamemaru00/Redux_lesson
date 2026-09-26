// Redux の store を、仕組みが見えるように最小限で書いたもの。
// 本物の Redux の createStore も、芯の部分はこれとほぼ同じことをしている。
// このファイルは完成品。読むだけでよい。

export function createStore(reducer) {
  // アプリ全体の状態は、この1つの変数にだけ入っている。
  // 最初は reducer に「状態なし」と初期化用の action を渡して、初期状態を作ってもらう。
  let state = reducer(undefined, { type: "@@INIT" });

  // 「状態が変わったら教えて」と登録してきた関数の一覧。
  const listeners = [];

  return {
    // 今の状態を読む。読むだけで、ここから書き換えることはしない。
    getState() {
      return state;
    },

    // 状態を変える、ただ1つの入口。
    // 1. reducer に「今の状態」と「何が起きたか」を渡して、次の状態を計算してもらう
    // 2. 計算された新しい状態で差し替える
    // 3. 登録されている全員に「変わったよ」と知らせる
    dispatch(action) {
      state = reducer(state, action);
      listeners.forEach((listener) => listener());
      return action;
    },

    // 状態が変わるたびに呼んでほしい関数を登録する。
    // 画面の描き直しは、ここに登録した関数が担当する。
    subscribe(listener) {
      listeners.push(listener);
    },
  };
}

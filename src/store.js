// Redux の store を、仕組みが見えるように最小限で書いたもの。
// 本物の Redux の createStore も、芯の部分はこれとほぼ同じことをしている。
// このファイルは完成品。読むだけでよい。
//
// store の仕事は3つだけ。
//   getState  … 今の状態を読ませる
//   dispatch  … 「何が起きたか」を受け付けて、状態を次に進める
//   subscribe … 状態が変わったら知らせてほしい人を登録する
//
// jacobs-workspace では web/src/main/jp/esouzoku/common/frontend/component/redux.cljs が
// このファイルにあたる。

// export は「このファイルの外から import して使ってよい」という印。
// main.js の import { createStore } from "./store.js" がこれを読み込んでいる。
//
// createStore は reducer を1つ受け取り、store を作って返す関数。
// reducer をどう書くかは store の知ったことではない。
// 「次の状態の計算は reducer に任せる」という分担がここで決まる。
export function createStore(reducer) {
  // アプリ全体の状態は、この1つの変数にだけ入っている。3原則の「情報源は1つだけ」。
  // let は「後から中身を入れ替える変数」を作る書き方。入れ替えないものは const を使う。
  //
  // 最初は reducer に「状態なし」の undefined と、初期化用の action を渡す。
  // reducer は state が渡されないと initialState を使うので、ここで { count: 0 } が返ってくる。
  // "@@INIT" はどの case にも当てはまらない名前にしてあり、reducer の default を通る。
  let state = reducer(undefined, { type: "@@INIT" });

  // 「状態が変わったら教えて」と登録してきた関数を並べておく配列。
  // const でも配列の中身は増やせる。const が禁じるのは、配列そのものを別物に差し替えることだけ。
  const listeners = [];

  // ここで返しているのは、3つの関数を持ったオブジェクト。
  // 呼び出した側はこれを store として受け取り、store.getState() のように使う。
  //
  // state と listeners はこの関数の中の変数なので、外から直接は触れない。
  // 触れるのは、下の3つの関数を通したときだけ。
  // これが「State は読むだけ、変えるなら dispatch を通す」を仕組みとして守っている部分。
  return {
    // 今の状態を返す。読むだけで、ここから書き換えることはしない。
    getState() {
      return state;
    },

    // 状態を変える、ただ1つの入口。
    // action は { type: "counter/increment" } のような「何が起きたかのメモ」。
    dispatch(action) {
      // 1. reducer に「今の状態」と「何が起きたか」を渡して、次の状態を計算してもらう。
      // 2. 返ってきた新しい状態で、state の中身を差し替える。
      //    差し替えるのは store だけ。reducer は計算して返すだけで、state には触らない。
      state = reducer(state, action);

      // 3. 登録されている全員に「変わったよ」と知らせる。
      //    forEach は配列の中身を1つずつ取り出して、渡した関数を呼ぶ。
      //    (listener) => listener() は「取り出した listener を、そのまま呼ぶ」という短い関数。
      //    何が変わったかは伝えない。知らせを受けた側が getState() で読みに来る。
      listeners.forEach((listener) => listener());

      // 受け取った action をそのまま返す。本物の Redux に合わせているだけで、今回は使っていない。
      return action;
    },

    // 状態が変わるたびに呼んでほしい関数を、配列の最後に足す。
    // 画面の描き直しは、ここに登録された関数が担当する。
    // 本物の Redux は登録を取り消す関数も返すが、今回は使わないので省いている。
    subscribe(listener) {
      listeners.push(listener);
    },
  };
}

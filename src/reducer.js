// reducer は「今の状態」と「何が起きたか (action)」を受け取り、「次の状態」を返す関数。
// 画面にも通信にも触らない。受け取ったものから計算して返すだけ。
// 同じ state と同じ action を渡せば、いつも同じ結果が返る。これを「純粋な関数」と呼ぶ。
//
// jacobs-workspace では web/src/main/jp/esouzoku/*/frontend/redux/reducer/ の下がこれにあたる。

// アプリが始まったときの状態。
// { count: 0 } は JavaScript のオブジェクトで、Python の辞書 {"count": 0} に近い。
// 中の値は state.count のように、点でつないで読む。
// export しているのは、テストや reset からも使えるようにするため。
export const initialState = { count: 0 };

// state = initialState は「state が渡されなかったら initialState を使う」という意味。
// store が一番最初に呼ぶときだけ、これが効く。
// action には { type: "counter/increment" } のような「何が起きたかのメモ」が入ってくる。
export function counterReducer(state = initialState, action) {
  // action.type を見て、何が起きたかで分ける。
  // switch は、() の中の値と一致する case の行へ飛ぶ書き方。
  // 一致する case がなければ、一番下の default へ飛ぶ。
  // どの case も return で終わっているので、下の case まで流れ落ちることはない。
  switch (action.type) {
    case "counter/increment":
      // 今の state を書き換えずに、新しいオブジェクトを作って返す。
      // { ...state } は「state の中身を全部写す」、その後ろの count: は「count だけ上書きする」。
      // 今は count しかないが、項目が増えても他の項目を消さずに済む。
      return { ...state, count: state.count + 1 };

    // TODO(human): "counter/decrement" と "counter/reset" の2つの case を書く
    //
    // 書く形は上の increment とまったく同じ。
    //   case "action の名前":
    //     return 次の状態;
    //
    // ヒント
    //   decrement … increment の 1 行をまねて、+ を - に変える
    //   reset     … 今の数に関係なく最初の状態に戻す。一番上の initialState がそのまま使える
    //
    // やってはいけない書き方
    //   state.count -= 1;
    //   return state;
    // 数は減るが、元の state を直接書き換えている。テストの1本がこれを見張っている。
    case "counter/decrement":
      return { ...state, count: state.count - 1 };
    case "counter/reset":
      return { count: 0 };

    default:
      // 知らない action が来たら、何もせず今の state をそのまま返す。
      // 何も返さないと state が undefined になり、アプリが壊れる。
      return state;
  }
}

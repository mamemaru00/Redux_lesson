# Redux の仕組みを体験する

1日30分の勉強用。カウンターを題材に、Redux の中で何が起きているかを手で追う。

## 画面を開く

    npm start

ブラウザで http://localhost:8000 を開く。止めるときは Ctrl + C。

## テスト

    npm test

## ファイル

- `src/store.js` … Redux の store を最小限で書いたもの。読むだけ
- `src/reducer.js` … 状態の計算。今日書くのはここ
- `src/main.js` … 画面と store をつなぐところ
- `tests/reducer.test.js` … reducer のテスト
- `docs/progress.md` … 学習の記録

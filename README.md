# 3D STG (Docs Only)

Three.js/Vite/TypeScriptで作るスペースハリアー風3Dシューティングの設計ドキュメントと実装です。

## 構成
- `Docs/REQUIREMENTS.md`: 要件定義
- `Docs/IMPLEMENTATION_PLAN.md`: 実装計画
- `Docs/TEST_PLAN.md`: テスト計画
- `src/`: Three.js実装（プレイヤー・敵・ステージ進行・UI）

## 予定されている機能概要
- フェーズ1-2までのプレイアブル版（プレイヤー移動/射撃、敵連隊/障害物、5ステージ進行、ボス・中ボス、背景/天井、敵弾）
- 今後の拡張: UI改善、サウンド

## ビルド/デプロイ想定
Viteを利用し、GitHub Pagesで公開する想定です。

```bash
npm run build
npm run deploy
```

## ローカル開発

```bash
npm install
npm run dev
```

## ライセンス
未設定。必要に応じて追加してください。

# Implementation Plan: 謎キャン2026 回遊システム

## Overview

企画書に基づいた謎キャン2026システムの実装計画です。カタカナ入力、数字変換、マス進む機能を持つHTML5ベースのWebアプリケーションを構築します。

## Implementation Language

JavaScript (ES6+) with HTML5 and CSS3

## Tasks

- [ ] 1. プロジェクト構造のセットアップ
  - [x] 1.1 ディレクトリ構造の作成
    - css/, js/, config/, assets/ディレクトリを作成
    - _Requirements: 1.2_
  
  - [x] 1.2 index.htmlの作成
    - セマンティックHTML5構造
    - UTF-8 charset設定
    - 上部エリア（数字入力欄、+ボタン、マス進むボタン）
    - 答え表示エリア
    - 五十音表モーダル
    - フィードバック表示エリア
    - _Requirements: 2.1, 2.2, 5.4_
  
  - [x] 1.3 プレースホルダーJSファイルの作成
    - app.js
    - kana-input-controller.js
    - answer-validator.js
    - kana-to-number-converter.js
    - number-input-controller.js
    - question-manager.js
    - config-loader.js
    - storage-manager.js
    - _Requirements: 1.2_
  
  - [x] 1.4 プレースホルダーCSSファイルの作成
    - styles.css
    - responsive.css
    - _Requirements: 1.2_

- [x] 2. ConfigLoaderモジュールの実装
  - [x] 2.1 ConfigLoaderクラスの作成
    - async loadConfig()メソッド
    - async loadKanaMapping()メソッド
    - JSON fetch処理
    - エラーハンドリング
    - _Requirements: 4.1, 4.2_
  
  - [x] 2.2 設定ファイルの検証
    - 必須フィールドのチェック
    - データ構造の検証
    - _Requirements: 4.1_
  
  - [ ]* 2.3 ユニットテストの作成
    - 正常な設定読み込みのテスト
    - エラーハンドリングのテスト
    - _Requirements: 4.1, 4.2_

- [x] 3. AnswerValidatorモジュールの実装
  - [x] 3.1 AnswerValidatorクラスの作成
    - static normalize(kana)メソッド
    - static validate(input, correct)メソッド
    - カタカナ正規化ロジック
    - _Requirements: 3.2_
  
  - [x] 3.2 正規化ルールの実装
    - 大文字・小文字の統一
    - 濁音・半濁音の正規化
    - 空白の除去
    - _Requirements: 3.2.1_
  
  - [ ]* 3.3 ユニットテストの作成
    - 正規化のテスト
    - 検証ロジックのテスト
    - _Requirements: 3.2_

- [x] 4. KanaToNumberConverterモジュールの実装
  - [x] 4.1 KanaToNumberConverterクラスの作成
    - constructor(mappingData)
    - convert(kana)メソッド
    - convertString(kanaString)メソッド
    - _Requirements: 3.3, 4.2_
  
  - [x] 4.2 変換ロジックの実装
    - カタカナ→数字マッピング
    - 文字列の変換処理
    - エラーハンドリング
    - _Requirements: 3.3.1_
  
  - [ ]* 4.3 ユニットテストの作成
    - 単一文字変換のテスト
    - 文字列変換のテスト
    - エッジケースのテスト
    - _Requirements: 3.3_

- [x] 5. StorageManagerモジュールの実装
  - [x] 5.1 StorageManagerクラスの作成
    - isAvailable()メソッド
    - saveProgress(data)メソッド
    - loadProgress()メソッド
    - clearProgress()メソッド
    - _Requirements: 4.3_
  
  - [x] 5.2 エラーハンドリングの実装
    - QuotaExceededErrorの処理
    - ストレージ利用不可時の処理
    - _Requirements: 4.3_
  
  - [ ]* 5.3 ユニットテストの作成
    - 保存・読み込みのテスト
    - エラーハンドリングのテスト
    - _Requirements: 4.3_

- [x] 6. Checkpoint - 基本モジュールのテスト
  - すべてのテストが通ることを確認
  - 質問があればユーザーに確認

- [x] 7. KanaInputControllerモジュールの実装
  - [x] 7.1 KanaInputControllerクラスの作成
    - constructor(containerElement)
    - show()メソッド
    - hide()メソッド
    - getInput()メソッド
    - clear()メソッド
    - _Requirements: 2.2, 3.1_
  
  - [x] 7.2 五十音表UIの構築
    - あ行〜わ行のボタン生成
    - 濁音・半濁音ボタン
    - バックスペース・クリアボタン
    - _Requirements: 2.2.2_
  
  - [x] 7.3 イベントハンドラの実装
    - カタカナボタンのクリック処理
    - 濁音・半濁音変換処理
    - バックスペース処理
    - クリア処理
    - _Requirements: 3.1_
  
  - [x] 7.4 回答欄の更新
    - 入力文字の表示
    - リアルタイム更新
    - _Requirements: 2.2.3_
  
  - [ ]* 7.5 ユニットテストの作成
    - 入力処理のテスト
    - 濁音変換のテスト
    - _Requirements: 3.1_

- [x] 8. NumberInputControllerモジュールの実装
  - [x] 8.1 NumberInputControllerクラスの作成
    - constructor(inputElement)
    - addNumber(number)メソッド
    - addSeparator()メソッド
    - clear()メソッド
    - getValue()メソッド
    - _Requirements: 3.4_
  
  - [x] 8.2 数字入力ロジックの実装
    - 数字の追加処理
    - 区切り記号の挿入
    - 入力のクリア
    - _Requirements: 3.4.1, 3.4.2_
  
  - [x] 8.3 マス移動機能の実装
    - マスの位置変更
    - _Requirements: 3.4.3_
  
  - [ ]* 8.4 ユニットテストの作成
    - 数字追加のテスト
    - 区切り機能のテスト
    - _Requirements: 3.4_

- [x] 9. QuestionManagerモジュールの実装
  - [x] 9.1 QuestionManagerクラスの作成
    - constructor(questions, storageManager)
    - getCurrentQuestion()メソッド
    - moveToNext()メソッド
    - reset()メソッド
    - saveProgress()メソッド
    - _Requirements: 3.5, 4.3_
  
  - [x] 9.2 問題管理ロジックの実装
    - 現在の問題の取得
    - 次の問題への移動
    - 進行状態の保存
    - _Requirements: 3.5.1_
  
  - [x] 9.3 状態リセット機能の実装
    - 入力のクリア
    - 表示のリセット
    - _Requirements: 3.5.2_
  
  - [ ]* 9.4 ユニットテストの作成
    - 問題取得のテスト
    - 移動処理のテスト
    - 状態保存のテスト
    - _Requirements: 3.5, 4.3_

- [x] 10. Checkpoint - コアロジックのテスト
  - すべてのテストが通ることを確認
  - 質問があればユーザーに確認

- [ ] 11. UIコントローラーの統合
  - [ ] 11.1 答え表示エリアのイベント処理
    - タップで五十音表を表示
    - 正解後のカタカナ表示
    - カタカナタップで数字変換
    - _Requirements: 2.1.2, 2.2.1, 3.2_
  
  - [ ] 11.2 フィードバック表示の実装
    - 正解時の○マーク表示
    - 音声フィードバック（オプション）
    - エラー表示
    - _Requirements: 2.3_
  
  - [ ] 11.3 ボタンイベントの実装
    - +ボタンのクリック処理
    - マス進むボタンのクリック処理
    - 答えるボタンのクリック処理
    - _Requirements: 3.4.2, 3.5.1_
  
  - [ ]* 11.4 統合テストの作成
    - ユーザーフローのテスト
    - イベント連携のテスト
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 12. app.jsの実装
  - [ ] 12.1 初期化処理の実装
    - 設定ファイルの読み込み
    - 各モジュールの初期化
    - イベントリスナーの登録
    - _Requirements: 1.2_
  
  - [ ] 12.2 DOMContentLoadedイベントの処理
    - 初期化関数の呼び出し
    - エラーハンドリング
    - _Requirements: 1.2_
  
  - [ ]* 12.3 E2Eテストの作成
    - 完全なユーザーフローのテスト
    - _Requirements: すべて_

- [ ] 13. CSSスタイリングの実装
  - [ ] 13.1 基本スタイルの作成 (styles.css)
    - CSS custom propertiesの定義
    - レイアウトスタイル
    - ボタンスタイル
    - モーダルスタイル
    - _Requirements: 5.3_
  
  - [ ] 13.2 レスポンシブデザインの実装 (responsive.css)
    - モバイル (320px-767px)
    - タブレット (768px-1023px)
    - デスクトップ (1024px+)
    - _Requirements: 5.2_
  
  - [ ] 13.3 日本語フォントの設定
    - フォントスタックの定義
    - line-heightの設定
    - _Requirements: 5.4_
  
  - [ ] 13.4 アクセシビリティの確保
    - タッチターゲットサイズ (44x44px)
    - コントラスト比 (4.5:1)
    - フォーカスインジケーター
    - _Requirements: 5.3_

- [ ] 14. 設定ファイルの作成
  - [ ] 14.1 event.jsonの作成
    - サンプル問題データ
    - 日本語テキスト
    - _Requirements: 4.1_
  
  - [ ] 14.2 kana-mapping.jsonの作成
    - カタカナ→数字変換テーブル
    - 五十音すべての定義
    - _Requirements: 4.2_
  
  - [ ]* 14.3 設定ファイルのテスト
    - JSONの妥当性確認
    - 実際の読み込みテスト
    - _Requirements: 4.1, 4.2_

- [ ] 15. アクセシビリティの実装
  - [ ] 15.1 ARIA属性の追加
    - role属性
    - aria-label属性
    - aria-live領域
    - _Requirements: 5.3_
  
  - [ ] 15.2 キーボード操作の実装
    - Tabキーナビゲーション
    - Enterキーでのボタン実行
    - Escキーでのモーダル閉じる
    - _Requirements: 5.3_
  
  - [ ] 15.3 スクリーンリーダー対応
    - セマンティックHTML
    - フォーカス管理
    - _Requirements: 5.3_
  
  - [ ]* 15.4 アクセシビリティ監査
    - Lighthouse監査
    - スコア90以上を目標
    - _Requirements: 5.3_

- [ ] 16. Checkpoint - 最終テスト
  - すべてのテストが通ることを確認
  - 質問があればユーザーに確認

- [ ] 17. 統合とポリッシュ
  - [ ] 17.1 すべてのモジュールの統合
    - モジュール間の連携確認
    - エンドツーエンドのフロー確認
    - _Requirements: すべて_
  
  - [ ] 17.2 パフォーマンス最適化
    - DOM操作の最適化
    - イベント委譲の使用
    - メモリリークのチェック
    - _Requirements: 5.1_
  
  - [ ] 17.3 クロスブラウザテスト
    - Chrome, Firefox, Safari
    - iOS Safari, Android Chrome
    - _Requirements: 5.2_
  
  - [ ] 17.4 実機テスト
    - タッチ操作の確認
    - レスポンシブデザインの確認
    - _Requirements: 5.2, 5.3_

- [ ] 18. 最終Checkpoint
  - すべての機能が正常に動作することを確認
  - ユーザーに最終確認

## Notes

- タスクに`*`がついているものはオプション（テスト関連）
- 各タスクは対応するRequirementsを参照
- Checkpointで進捗を確認し、問題があれば修正
- モバイルファーストで開発
- 日本語（カタカナ）対応が必須

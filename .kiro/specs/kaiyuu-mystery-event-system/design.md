# Design Document: 謎キャン2026 回遊システム

## 1. システムアーキテクチャ

### 1.1 全体構成

```
┌─────────────────────────────────────────┐
│           index.html (UI)               │
├─────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────────────┐    │
│  │ 数字入力欄 │  │ マス進むボタン    │    │
│  └──────────┘  └──────────────────┘    │
│  ┌─────────────────────────────────┐   │
│  │   答えが表示されるエリア          │   │
│  │   (タップで五十音表表示)         │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │   五十音表 (モーダル)            │   │
│  │   ┌─────────────────────────┐   │   │
│  │   │ 回答欄 (カタカナ表示)    │   │   │
│  │   └─────────────────────────┘   │   │
│  │   [あ][い][う][え][お]...        │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│        JavaScript Modules               │
├─────────────────────────────────────────┤
│  app.js (初期化・調整)                   │
│  ├─ kana-input-controller.js            │
│  │  └─ 五十音表UI管理                   │
│  ├─ answer-validator.js                 │
│  │  └─ 答え検証ロジック                 │
│  ├─ kana-to-number-converter.js         │
│  │  └─ カタカナ→数字変換               │
│  ├─ number-input-controller.js          │
│  │  └─ 数字入力欄管理                   │
│  ├─ question-manager.js                 │
│  │  └─ 問題管理・進行制御               │
│  ├─ config-loader.js                    │
│  │  └─ 設定ファイル読み込み             │
│  └─ storage-manager.js                  │
│     └─ ローカルストレージ管理           │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│          Data Layer                     │
├─────────────────────────────────────────┤
│  config/event.json (問題データ)          │
│  config/kana-mapping.json (変換テーブル) │
│  localStorage (進行状態)                 │
└─────────────────────────────────────────┘
```

### 1.2 モジュール設計

#### 1.2.1 KanaInputController
五十音表UIの表示・非表示、カタカナ入力の管理を担当

**責務:**
- 五十音表の表示/非表示制御
- カタカナボタンのイベント処理
- 回答欄への文字追加
- 濁音・半濁音変換
- バックスペース・クリア機能

**主要メソッド:**
```javascript
class KanaInputController {
  constructor(containerElement)
  show()                    // 五十音表を表示
  hide()                    // 五十音表を非表示
  getInput()                // 現在の入力を取得
  clear()                   // 入力をクリア
  onInputComplete(callback) // 入力完了時のコールバック
}
```

#### 1.2.2 AnswerValidator
答えの検証ロジックを担当

**責務:**
- カタカナの正規化（大文字・小文字、濁音・半濁音）
- 正解との照合
- 検証結果の返却

**主要メソッド:**
```javascript
class AnswerValidator {
  static normalize(kana)           // カタカナを正規化
  static validate(input, correct)  // 答えを検証
}
```

#### 1.2.3 KanaToNumberConverter
カタカナから数字への変換を担当

**責務:**
- カタカナ→数字変換テーブルの管理
- 変換ロジックの実装
- 変換結果の返却

**主要メソッド:**
```javascript
class KanaToNumberConverter {
  constructor(mappingData)
  convert(kana)              // カタカナを数字に変換
  convertString(kanaString)  // カタカナ文字列を数字配列に変換
}
```

#### 1.2.4 NumberInputController
カタカナ入力欄の管理を担当

**責務:**
- カタカナ文字の表示
- 区切り記号（+）の挿入
- 分割ボタン機能（「マ」「ス」「進む」）
- 入力のクリア

**主要メソッド:**
```javascript
class NumberInputController {
  constructor(inputElement)
  addKana(kana)        // カタカナを追加
  addNumber(number)    // 数字を追加
  addSeparator()       // 区切り記号を追加
  clear()              // 入力をクリア
  getValue()           // 現在の値を取得
}
```

#### 1.2.5 QuestionManager
問題の管理と進行制御を担当

**責務:**
- 問題データの管理
- 現在の問題の取得
- 次の問題への移動
- 進行状態の保存

**主要メソッド:**
```javascript
class QuestionManager {
  constructor(questions, storageManager)
  getCurrentQuestion()   // 現在の問題を取得
  moveToNext()          // 次の問題に移動
  reset()               // 状態をリセット
  saveProgress()        // 進行状態を保存
}
```

## 2. データモデル

### 2.1 問題データ構造

```json
{
  "eventId": "nazikan2026",
  "eventTitle": "謎キャン2026",
  "questions": [
    {
      "id": "q1",
      "question": "問題文がここに入ります",
      "answer": "セイカイ",
      "hint": "ヒントがここに入ります（オプション）"
    }
  ]
}
```

### 2.2 カタカナ→数字変換テーブル

```json
{
  "ア": 1, "イ": 2, "ウ": 3, "エ": 4, "オ": 5,
  "カ": 6, "キ": 7, "ク": 8, "ケ": 9, "コ": 10,
  "サ": 11, "シ": 12, "ス": 13, "セ": 14, "ソ": 15,
  "タ": 16, "チ": 17, "ツ": 18, "テ": 19, "ト": 20,
  "ナ": 21, "ニ": 22, "ヌ": 23, "ネ": 24, "ノ": 25,
  "ハ": 26, "ヒ": 27, "フ": 28, "ヘ": 29, "ホ": 30,
  "マ": 31, "ミ": 32, "ム": 33, "メ": 34, "モ": 35,
  "ヤ": 36, "ユ": 38, "ヨ": 40,
  "ラ": 41, "リ": 42, "ル": 43, "レ": 44, "ロ": 45,
  "ワ": 46, "ヲ": 47, "ン": 48
}
```

### 2.3 進行状態データ

```json
{
  "eventId": "nazikan2026",
  "currentQuestionIndex": 0,
  "currentNumberInput": "1+2+3",
  "answeredQuestions": ["q1", "q2"],
  "timestamp": 1234567890
}
```

## 3. UI設計

### 3.1 レイアウト構造

```html
<div class="app-container">
  <!-- 上部エリア -->
  <div class="top-section">
    <input type="text" id="number-input" class="number-input" readonly>
    <button id="add-separator-btn" class="separator-btn">+</button>
    <div class="move-forward-container">
      <span id="kana-ma" class="clickable-kana" data-kana="マ">マ</span>
      <span id="kana-su" class="clickable-kana" data-kana="ス">ス</span>
      <button id="move-forward-btn" class="move-forward-btn">進む</button>
    </div>
  </div>
  
  <!-- 答え表示エリア -->
  <div id="answer-display" class="answer-display">
    <p class="answer-text" id="answer-text">答えが表示されるところ</p>
  </div>
  
  <!-- 五十音表モーダル -->
  <div id="kana-modal" class="kana-modal hidden">
    <div class="kana-modal-content">
      <!-- 回答欄 -->
      <div class="answer-input-area">
        <input type="text" id="kana-input" class="kana-input" readonly>
        <button id="backspace-btn" class="backspace-btn">←</button>
        <button id="clear-btn" class="clear-btn">クリア</button>
      </div>
      
      <!-- 五十音表 -->
      <div class="kana-grid">
        <!-- あ行 -->
        <div class="kana-row">
          <button class="kana-btn" data-kana="ア">ア</button>
          <button class="kana-btn" data-kana="イ">イ</button>
          <button class="kana-btn" data-kana="ウ">ウ</button>
          <button class="kana-btn" data-kana="エ">エ</button>
          <button class="kana-btn" data-kana="オ">オ</button>
        </div>
        <!-- 他の行も同様 -->
      </div>
      
      <!-- 濁音・半濁音ボタン -->
      <div class="modifier-buttons">
        <button id="dakuten-btn" class="modifier-btn">゛</button>
        <button id="handakuten-btn" class="modifier-btn">゜</button>
      </div>
      
      <!-- 確定ボタン -->
      <button id="submit-answer-btn" class="submit-btn">答える</button>
    </div>
  </div>
  
  <!-- フィードバック表示 -->
  <div id="feedback" class="feedback hidden">
    <div class="feedback-icon"></div>
    <p class="feedback-message"></p>
  </div>
</div>
```

### 3.2 個別文字クリック機能

正解後の答え表示エリアでは、各カタカナ文字が個別にクリック可能になります：

```html
<!-- 正解後の答え表示エリア（例：「テスト」の場合） -->
<p class="answer-text has-answer">
  <span class="clickable-answer-char" data-kana="テ">テ</span>
  <span class="clickable-answer-char" data-kana="ス">ス</span>
  <span class="clickable-answer-char" data-kana="ト">ト</span>
</p>
```

**インタラクション:**
- 各文字をクリックすると、そのカタカナが数字入力欄に追加される
- 数字変換は行わず、カタカナそのものが追加される

### 3.3 分割ボタン設計

「マス進む」ボタンは3つの部分に分割されています：

```html
<div class="move-forward-container">
  <span id="kana-ma" class="clickable-kana" data-kana="マ">マ</span>
  <span id="kana-su" class="clickable-kana" data-kana="ス">ス</span>
  <button id="move-forward-btn" class="move-forward-btn">進む</button>
</div>
```

**機能:**
- 「マ」をクリック → 数字入力欄に「マ」追加
- 「ス」をクリック → 数字入力欄に「ス」追加
- 「進む」をクリック → 次の問題に移動

### 3.4 インタラクションフロー

```
1. 初期状態
   ↓
2. 答え表示エリアをタップ
   ↓
3. 五十音表モーダルが表示される
   ↓
4. カタカナボタンをタップして入力
   ↓
5. 「答える」ボタンをタップ
   ↓
6a. 正解の場合:
    - ○マークと音声フィードバック
    - 答えがカタカナで表示エリアに表示（個別クリック可能）
    - 各カタカナ文字が個別のクリック可能要素に
    ↓
7. 個別のカタカナ文字をタップして数字入力欄に追加
   ↓
8. +ボタンで区切りを追加、または「マ」「ス」ボタンをクリック
   ↓
9. 「進む」ボタンで次の問いへ
   ↓
10. 状態がリセットされ、次の問題が表示

6b. 不正解の場合:
    - エラー表示
    - 再入力を促す
    ↓
    (4に戻る)
```

## 4. 状態管理

### 4.1 アプリケーション状態

```javascript
const appState = {
  currentQuestion: null,      // 現在の問題
  currentQuestionIndex: 0,    // 現在の問題番号
  kanaInput: '',              // カタカナ入力
  numberInput: '',            // 数字入力
  isAnswered: false,          // 答え済みフラグ
  displayedAnswer: '',        // 表示中の答え
  isKanaModalOpen: false      // 五十音表の表示状態
};
```

### 4.2 状態遷移

```
[初期状態]
  ↓ (答え表示エリアタップ)
[五十音表表示]
  ↓ (カタカナ入力)
[入力中]
  ↓ (答えるボタン)
[検証中]
  ↓ (正解)
[答え表示]
  ↓ (カタカナタップ)
[数字入力]
  ↓ (マス進むボタン)
[次の問題へ移動]
  ↓
[初期状態]
```

## 5. CSS設計

### 5.1 レイアウト

```css
/* モバイルファースト */
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 1rem;
}

.top-section {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.number-input {
  flex: 1;
  min-height: 44px;
  font-size: 1.2rem;
  padding: 0.5rem;
}

.separator-btn {
  min-width: 44px;
  min-height: 44px;
  font-size: 1rem;
}

/* 分割ボタンコンテナ */
.move-forward-container {
  display: flex;
  align-items: center;
  gap: 0;
}

.clickable-kana {
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 3px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  margin-right: 2px;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.move-forward-btn {
  min-width: 44px;
  min-height: 44px;
  font-size: 1rem;
  margin-left: 4px;
}

/* 個別文字クリック */
.clickable-answer-char {
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 3px;
  transition: background-color 0.2s ease;
  display: inline-block;
  margin: 0 1px;
}

.clickable-answer-char:hover,
.clickable-kana:hover {
  background-color: rgba(0, 123, 255, 0.1);
}

.answer-display {
  flex: 1;
  border: 2px solid #333;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  min-height: 200px;
}

.kana-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.kana-modal.hidden {
  display: none;
}

.kana-grid {
  display: grid;
  gap: 0.5rem;
  margin: 1rem 0;
}

.kana-row {
  display: flex;
  gap: 0.5rem;
}

.kana-btn {
  min-width: 44px;
  min-height: 44px;
  font-size: 1.2rem;
  flex: 1;
}
```

### 5.2 カラースキーム

```css
:root {
  --primary-color: #007bff;
  --success-color: #28a745;
  --error-color: #dc3545;
  --text-color: #333;
  --bg-color: #fff;
  --border-color: #ddd;
}
```

## 6. エラーハンドリング

### 6.1 設定ファイル読み込みエラー
- ネットワークエラー時の再試行
- エラーメッセージの表示
- フォールバック設定の使用

### 6.2 ローカルストレージエラー
- ストレージ利用不可時の警告
- メモリ内での状態管理にフォールバック

### 6.3 入力検証エラー
- 不正な入力の検出
- ユーザーへのフィードバック

## 7. パフォーマンス最適化

### 7.1 DOM操作の最適化
- イベント委譲の使用
- DOM要素のキャッシュ
- 不要な再描画の削減

### 7.2 メモリ管理
- イベントリスナーの適切な削除
- 不要なデータの解放

## 8. アクセシビリティ

### 8.1 キーボード操作
- Tabキーでのフォーカス移動
- Enterキーでのボタン実行
- Escキーでのモーダル閉じる

### 8.2 スクリーンリーダー対応
- ARIA属性の適切な使用
- セマンティックHTML
- フォーカス管理

### 8.3 タッチターゲット
- 最小44x44pxのタッチエリア
- 適切な間隔の確保

## 9. テスト戦略

### 9.1 ユニットテスト
- 各モジュールの単体テスト
- カタカナ正規化のテスト
- 変換ロジックのテスト

### 9.2 統合テスト
- モジュール間の連携テスト
- ユーザーフローのテスト

### 9.3 E2Eテスト
- 実際のブラウザでの動作確認
- タッチ操作のテスト

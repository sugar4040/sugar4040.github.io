---
inclusion: auto
---

# UI Interaction Patterns

## Overview

This document describes the specific UI interaction patterns implemented in the Kaiyuu mystery event system, based on the proposal document requirements.

## Core Interaction Flow

### 1. Answer Input Flow
1. **答え表示エリアをタップ** → 五十音表モーダルが開く
2. **カタカナボタンをタップ** → そのカタカナが入力欄に追加される
3. **「答える」ボタンをタップ** → 答えの検証が行われる
4. **正解の場合** → 答え表示エリアにカタカナが表示される（例：「テスト」）

### 2. Individual Character Interaction
5. **答え表示エリア（正解後）のカタカナ一文字をタップ** → そのカタカナが数字入力欄に追加される
   - 「テ」をタップ → 数字入力欄に「テ」が追加
   - 「ス」をタップ → 数字入力欄に「テス」になる
   - 「ト」をタップ → 数字入力欄に「テスト」になる

### 3. Control Button Interactions
6. **「+」ボタンをタップ** → 区切り記号「+」が数字入力欄に追加される
7. **「マ」ボタンをタップ** → 数字入力欄に「マ」が追加される
8. **「ス」ボタンをタップ** → 数字入力欄に「ス」が追加される（「マス」になる）
9. **「進む」ボタンをタップ** → 次の問題に進む

## Key Implementation Details

### Individual Character Clicking
- 正解後の答え表示エリアでは、各カタカナ文字が個別のクリック可能要素になる
- 実装：`<span class="clickable-answer-char" data-kana="${char}">${char}</span>`
- 各文字にクリックイベントリスナーが追加される

### Split Button Design
- 「マス進む」ボタンは3つの部分に分割：
  - 「マ」（クリック可能、数字入力欄に追加）
  - 「ス」（クリック可能、数字入力欄に追加）
  - 「進む」（機能ボタン、次の問題に移動）

### Data Flow
- カタカナ入力 → 答え検証 → 個別文字表示 → 数字入力欄への追加
- すべてのカタカナ操作は文字そのものを扱う（数字変換は行わない）

## CSS Classes

### Clickable Elements
```css
.clickable-kana,
.clickable-answer-char {
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 3px;
  transition: background-color 0.2s ease;
}
```

### Container Structure
```css
.move-forward-container {
  display: flex;
  align-items: center;
  gap: 0;
}
```

## Accessibility Features

- すべてのクリック可能要素にaria-label属性
- role="button"とtabindex="0"でキーボードアクセス対応
- フォーカスインジケーターの実装

## Testing Notes

- Chrome DevToolsでの動作確認済み
- 各インタラクションパターンが正常に動作
- 文字追加、区切り追加、問題移動すべて機能確認済み
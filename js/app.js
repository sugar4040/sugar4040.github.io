/**
 * 謎キャン2026 - Application Entry Point
 * カタカナ謎解きシステム
 */

import { ConfigLoader } from './config-loader.js';
import { AnswerValidator } from './answer-validator.js';
import { KanaToNumberConverter } from './kana-to-number-converter.js';
import { KanaInputController } from './kana-input-controller.js';
import { NumberInputController } from './number-input-controller.js';
import { QuestionManager } from './question-manager.js';
import { DragDropController } from './drag-drop-controller.js';

// グローバル変数
let configLoader;
let kanaInputController;
let numberInputController;
let questionManager;
let kanaToNumberConverter;
let dragDropController;

/**
 * アプリケーションの初期化
 */
async function init() {
  try {
    console.log('謎キャン2026 初期化中...');

    // ConfigLoaderの初期化
    configLoader = new ConfigLoader();

    // 設定ファイルとマッピングファイルの読み込み
    const [config, kanaMapping] = await Promise.all([
      configLoader.loadConfig('config/event.json'),
      configLoader.loadKanaMapping('config/kana-mapping.json')
    ]);

    // 設定の検証
    const validationErrors = configLoader.validateConfig(config);
    if (validationErrors.length > 0) {
      console.error('設定エラー:', validationErrors);
      alert('設定ファイルにエラーがあります:\n' + validationErrors.join('\n'));
      return;
    }

    // KanaToNumberConverterの初期化
    kanaToNumberConverter = new KanaToNumberConverter(kanaMapping);

    // QuestionManagerの初期化（StorageManagerなし）
    questionManager = new QuestionManager(config.questions);

    // NumberInputControllerの初期化
    const numberInput = document.getElementById('number-input');
    numberInputController = new NumberInputController(numberInput);
    
    // 文字削除時のコールバックを設定
    numberInputController.onCharacterRemoved((removedChar) => {
      restoreCharacterToOriginalPlace(removedChar);
    });

    // KanaInputControllerの初期化
    const kanaModal = document.getElementById('kana-modal');
    kanaInputController = new KanaInputController(kanaModal);

    // DragDropControllerの初期化
    dragDropController = new DragDropController();
    
    // ドロップゾーン（数字入力欄）を設定
    dragDropController.makeDroppable(numberInput);
    
    // ドロップ時の処理を設定
    dragDropController.onDrop((kana, dropZone, elementToHide) => {
      // +記号の場合はseparatorを追加
      if (kana === '+') {
        numberInputController.addSeparator();
        // +ボタンは非表示にしない（何度でも使える）
      } else {
        // カタカナの場合は通常通り追加
        numberInputController.addKana(kana);
        
        // ドラッグした要素を非表示にする
        if (elementToHide) {
          elementToHide.style.visibility = 'hidden';
          elementToHide.style.pointerEvents = 'none';
        }
      }
    });

    // イベントリスナーの設定
    setupEventListeners();

    // 初期表示の設定
    setupInitialDisplay(config);

    console.log('初期化完了');
  } catch (error) {
    console.error('初期化エラー:', error);
    alert('アプリケーションの初期化に失敗しました: ' + error.message);
  }
}

/**
 * イベントリスナーの設定
 */
function setupEventListeners() {
  // 答え表示エリアのクリック
  const answerDisplay = document.getElementById('answer-display');
  if (answerDisplay) {
    answerDisplay.addEventListener('click', (e) => {
      const answerText = document.getElementById('answer-text');
      
      // 正解後は五十音表を開かない（個別文字クリックは除く）
      if (answerText && answerText.dataset.answered === 'true') {
        // 個別文字のクリックの場合は通す
        if (e.target.classList.contains('clickable-answer-char')) {
          return; // 個別文字のイベントハンドラに任せる
        }
        // 答え表示エリア全体のクリックは無効化
        return;
      }
      
      // ルート最終問題の場合は常に五十音表を開く
      if (answerText && answerText.dataset.routeFinal === 'true') {
        // 個別文字のクリックの場合は通す
        if (e.target.classList.contains('clickable-answer-char')) {
          return;
        }
        // 答え表示エリア全体のクリックで五十音表を開く
        kanaInputController.show();
        return;
      }
      
      // 正解前は通常通り五十音表を開く
      kanaInputController.show();
    });
  }

  // +ボタンのクリック
  const addSeparatorBtn = document.getElementById('add-separator-btn');
  if (addSeparatorBtn) {
    addSeparatorBtn.addEventListener('click', () => {
      numberInputController.addSeparator();
    });
    
    // +ボタンをドラッグ可能にする
    dragDropController.makeDraggable(addSeparatorBtn, '+');
  }

  // マス進むボタンのクリック
  const moveForwardBtn = document.getElementById('move-forward-btn');
  if (moveForwardBtn) {
    moveForwardBtn.addEventListener('click', () => {
      handleMoveForward();
    });
  }

  // 戻るボタンのクリック
  const moveBackBtn = document.getElementById('move-back-btn');
  if (moveBackBtn) {
    moveBackBtn.addEventListener('click', () => {
      handleMoveBack();
    });
  }

  // 問題選択モーダルの閉じるボタン
  const closeQuestionSelectionBtn = document.getElementById('close-question-selection-btn');
  if (closeQuestionSelectionBtn) {
    closeQuestionSelectionBtn.addEventListener('click', () => {
      hideQuestionSelectionModal();
    });
  }

  // 問題選択モーダルの背景クリックで閉じる
  const questionSelectionModal = document.getElementById('question-selection-modal');
  if (questionSelectionModal) {
    questionSelectionModal.addEventListener('click', (e) => {
      if (e.target === questionSelectionModal) {
        hideQuestionSelectionModal();
      }
    });
  }

  // カタカナ入力完了時のコールバック
  kanaInputController.onInputComplete((input) => {
    handleAnswerSubmit(input);
  });
  
  // 「マ」「ス」のドラッグ設定は正解後に行う（setupEventListenersでは設定しない）
}

/**
 * 初期表示の設定
 */
function setupInitialDisplay(config) {
  // イベントタイトルの設定（必要に応じて）
  const currentQuestion = questionManager.getCurrentQuestion();
  if (currentQuestion) {
    updateQuestionDisplay(currentQuestion);
  }
  
  // ナビゲーションボタンの初期状態を設定
  updateNavigationButtons();
}

/**
 * 問題表示の更新
 */
function updateQuestionDisplay(question) {
  const answerText = document.getElementById('answer-text');
  
  // ルート最終問題で、片方のルートが完了している場合
  if (question.isFinal && question.route && !questionManager.areBothRoutesCompleted()) {
    const completedAnswer = questionManager.getCompletedRouteFinalAnswer();
    if (completedAnswer) {
      // 完了済みルートの最終問題の答えを表示
      if (answerText) {
        answerText.textContent = completedAnswer;
        answerText.classList.add('has-answer');
        // ルート最終問題フラグを設定（50音入力を許可するため）
        answerText.dataset.routeFinal = 'true';
        answerText.dataset.completedAnswer = completedAnswer;
      }
      
      // 「マ」「ス」ボタンを有効化
      const kanaMa = document.getElementById('kana-ma');
      const kanaSu = document.getElementById('kana-su');
      if (kanaMa) {
        kanaMa.classList.remove('disabled');
        dragDropController.makeDraggable(kanaMa, 'マ');
      }
      if (kanaSu) {
        kanaSu.classList.remove('disabled');
        dragDropController.makeDraggable(kanaSu, 'ス');
      }
      
      // +ボタンを表示
      const separatorBtn = document.getElementById('add-separator-btn');
      if (separatorBtn) {
        separatorBtn.classList.remove('hidden');
      }
      
      // 答え表示エリアにクリックイベントを追加
      setupAnswerClickHandler(completedAnswer);
      return;
    }
  }
  
  // 通常の問題表示
  if (answerText) {
    answerText.textContent = '回答を入力';
    delete answerText.dataset.routeFinal;
    delete answerText.dataset.completedAnswer;
  }
  
  // 「マ」「ス」ボタンを無効化（正解前の状態）
  const kanaMa = document.getElementById('kana-ma');
  const kanaSu = document.getElementById('kana-su');
  if (kanaMa) {
    kanaMa.classList.add('disabled');
  }
  if (kanaSu) {
    kanaSu.classList.add('disabled');
  }
}

/**
 * ひらがなをカタカナに変換
 * @param {string} str - 変換する文字列
 * @returns {string} カタカナに変換された文字列
 */
function hiraganaToKatakana(str) {
  return str.replace(/[\u3041-\u3096]/g, (match) => {
    const chr = match.charCodeAt(0) + 0x60;
    return String.fromCharCode(chr);
  });
}

/**
 * 答えの送信処理
 */
function handleAnswerSubmit(input) {
  const currentQuestion = questionManager.getCurrentQuestion();
  if (!currentQuestion) {
    return;
  }

  // 答えの検証
  const isCorrect = AnswerValidator.validate(input, currentQuestion.answer);

  if (isCorrect) {
    // 正解の場合
    showFeedback('success', '正解です！');
    
    // 答えをカタカナに変換して表示エリアに表示
    const katakanaAnswer = hiraganaToKatakana(input);
    
    // 答えを保存
    const currentIndex = questionManager.getCurrentQuestionIndex();
    questionManager.saveAnswer(currentIndex, katakanaAnswer);
    
    const answerText = document.getElementById('answer-text');
    
    // ルート最終問題で、完了済みルートの答えがある場合
    if (currentQuestion.isFinal && currentQuestion.route && answerText && answerText.dataset.routeFinal === 'true') {
      const completedAnswer = answerText.dataset.completedAnswer;
      // 「完了済み答え/現在の答え」の形式で表示
      const combinedAnswer = `${completedAnswer}／${katakanaAnswer}`;
      
      if (answerText) {
        answerText.innerHTML = '';
        
        // 完了済み答えの部分（ドラッグ可能）
        const completedSpan = document.createElement('span');
        completedSpan.className = 'combined-answer-part';
        completedAnswer.split('').forEach((char) => {
          const charSpan = document.createElement('span');
          charSpan.className = 'clickable-answer-char';
          charSpan.dataset.kana = char;
          charSpan.setAttribute('role', 'button');
          charSpan.setAttribute('tabindex', '0');
          charSpan.setAttribute('aria-label', `${char}をドラッグして数字入力欄に追加`);
          charSpan.textContent = char;
          completedSpan.appendChild(charSpan);
        });
        
        // スラッシュ（移動不可）
        const slashSpan = document.createElement('span');
        slashSpan.className = 'answer-separator';
        slashSpan.textContent = '／';
        
        // 現在の答えの部分（ドラッグ可能）
        const currentSpan = document.createElement('span');
        currentSpan.className = 'combined-answer-part';
        katakanaAnswer.split('').forEach((char) => {
          const charSpan = document.createElement('span');
          charSpan.className = 'clickable-answer-char';
          charSpan.dataset.kana = char;
          charSpan.setAttribute('role', 'button');
          charSpan.setAttribute('tabindex', '0');
          charSpan.setAttribute('aria-label', `${char}をドラッグして数字入力欄に追加`);
          charSpan.textContent = char;
          currentSpan.appendChild(charSpan);
        });
        
        answerText.appendChild(completedSpan);
        answerText.appendChild(slashSpan);
        answerText.appendChild(currentSpan);
        answerText.classList.add('has-answer');
        
        // 各文字をドラッグ可能にする
        const clickableChars = answerText.querySelectorAll('.clickable-answer-char');
        clickableChars.forEach((charElement) => {
          const kana = charElement.dataset.kana;
          dragDropController.makeDraggable(charElement, kana);
        });
        
        // 答え済みフラグを設定
        answerText.dataset.answered = 'true';
        delete answerText.dataset.routeFinal;
      }
    } else {
      // 通常の答え表示
      if (answerText) {
        answerText.textContent = katakanaAnswer;
        answerText.classList.add('has-answer');
      }
      
      // 答え表示エリアにクリックイベントを追加（カタカナ→数字変換用）
      setupAnswerClickHandler(katakanaAnswer);
    }

    // 「マ」「ス」ボタンを有効化（数字入力フェーズ開始）
    const kanaMa = document.getElementById('kana-ma');
    const kanaSu = document.getElementById('kana-su');
    if (kanaMa) {
      kanaMa.classList.remove('disabled');
      // 正解後にドラッグ可能にする
      dragDropController.makeDraggable(kanaMa, 'マ');
    }
    if (kanaSu) {
      kanaSu.classList.remove('disabled');
      // 正解後にドラッグ可能にする
      dragDropController.makeDraggable(kanaSu, 'ス');
    }

    // カタカナを数字に変換して表示
    const numbers = kanaToNumberConverter.convertString(katakanaAnswer);
    console.log('変換された数字:', numbers);

    // 五十音表を閉じる
    kanaInputController.hide();

  } else {
    // 不正解の場合
    showFeedback('error', '不正解です。');
  }
}

/**
 * 答えクリック時の処理（個別文字ドラッグ対応）
 */
function setupAnswerClickHandler(answer) {
  const answerText = document.getElementById('answer-text');
  if (answerText) {
    // 答えテキストを個別の文字に分割してドラッグ可能にする
    const characters = answer.split('');
    let htmlContent = '';
    
    characters.forEach((char) => {
      htmlContent += `<span class="clickable-answer-char" data-kana="${char}" role="button" tabindex="0" aria-label="${char}をドラッグして数字入力欄に追加">${char}</span>`;
    });
    
    answerText.innerHTML = htmlContent;
    answerText.classList.add('has-answer');
    
    // 各文字をドラッグ可能にする
    const clickableChars = answerText.querySelectorAll('.clickable-answer-char');
    
    clickableChars.forEach((charElement) => {
      const kana = charElement.dataset.kana;
      dragDropController.makeDraggable(charElement, kana);
    });

    // +ボタンを表示
    const separatorBtn = document.getElementById('add-separator-btn');
    if (separatorBtn) {
      separatorBtn.classList.remove('hidden');
    }

    // 答え表示エリア全体のクリックイベントを無効化（正解後は五十音表を開かない）
    // フラグを設定して、元のイベントリスナーがこれをチェックするようにする
    answerText.dataset.answered = 'true';
  }
}

/**
 * マス進む処理
 */
function handleMoveForward() {
  // 現在の問題を取得
  const currentQuestion = questionManager.getCurrentQuestion();
  if (!currentQuestion) {
    return;
  }

  // 数字入力欄の内容を取得
  const numberInput = numberInputController.getValue();
  
  // numberAnswerがnullの場合（ルート最終問題）
  if (currentQuestion.numberAnswer === null) {
    // ルート完了を記録
    if (currentQuestion.route) {
      questionManager.markRouteCompleted(currentQuestion.route);
    }
    
    // 両方のルートが完了している場合は最終問題へ
    if (questionManager.areBothRoutesCompleted()) {
      const finalQuestionIndex = questionManager.questions.findIndex(q => q.requiresBothRoutes === true);
      if (finalQuestionIndex !== -1) {
        questionManager.currentQuestionIndex = finalQuestionIndex;
        resetQuestionDisplay();
        return;
      }
    }
    
    // まだ片方のルートしか完了していない場合
    showFeedback('error', '数字が正しくありません');
    return;
  }
  
  // 正解の数字と比較（配列形式に対応）
  if (currentQuestion.numberAnswer) {
    // 空白を除去して比較
    const normalizedInput = numberInput.replace(/\s+/g, '');
    
    // numberAnswerが配列の場合は、いずれかに一致すればOK
    const answers = Array.isArray(currentQuestion.numberAnswer) 
      ? currentQuestion.numberAnswer 
      : [currentQuestion.numberAnswer];
    
    const isCorrect = answers.some(answer => {
      const normalizedAnswer = answer.replace(/\s+/g, '');
      return normalizedInput === normalizedAnswer;
    });
    
    if (!isCorrect) {
      // 不正解の場合
      showFeedback('error', '数字が正しくありません');
      return;
    }
    
    // 分岐処理（問題5の場合）
    if (currentQuestion.nextQuestion) {
      const nextQuestionId = currentQuestion.nextQuestion[normalizedInput];
      if (nextQuestionId) {
        // 指定された次の問題に移動
        const nextIndex = questionManager.questions.findIndex(q => q.id === nextQuestionId);
        if (nextIndex !== -1) {
          questionManager.currentQuestionIndex = nextIndex;
          resetQuestionDisplay();
          return;
        }
      }
    }
  }
  
  // 通常の次の問題に移動
  const moved = questionManager.moveToNext();
  
  if (moved) {
    resetQuestionDisplay();
  } else {
    // 全問題完了
    console.log('全ての問題が完了しました');
  }
}

/**
 * 問題表示をリセット
 */
function resetQuestionDisplay() {
  // 入力をクリア
  numberInputController.clear();
  
  // 答え表示エリアをリセット
  const answerText = document.getElementById('answer-text');
  if (answerText) {
    answerText.innerHTML = '回答を入力';
    answerText.classList.remove('has-answer');
    delete answerText.dataset.answered;
  }

  // +ボタンを非表示にする
  const separatorBtn = document.getElementById('add-separator-btn');
  if (separatorBtn) {
    separatorBtn.classList.add('hidden');
  }

  // 「マ」「ス」ボタンの状態をリセット
  const kanaMa = document.getElementById('kana-ma');
  const kanaSu = document.getElementById('kana-su');
  if (kanaMa) {
    kanaMa.style.visibility = 'visible';
    kanaMa.style.pointerEvents = 'auto';
    kanaMa.classList.add('disabled');
  }
  if (kanaSu) {
    kanaSu.style.visibility = 'visible';
    kanaSu.style.pointerEvents = 'auto';
    kanaSu.classList.add('disabled');
  }

  // 新しい問題を表示
  const currentQuestion = questionManager.getCurrentQuestion();
  if (currentQuestion) {
    updateQuestionDisplay(currentQuestion);
  }
  
  // 戻るボタンの状態を更新
  updateNavigationButtons();
}

/**
 * マス戻る処理
 */
function handleMoveBack() {
  // 問題選択モーダルを表示
  showQuestionSelectionModal();
}

/**
 * 問題選択モーダルを表示
 */
function showQuestionSelectionModal() {
  const modal = document.getElementById('question-selection-modal');
  const questionList = document.getElementById('question-list');
  
  if (!modal || !questionList) return;
  
  // 問題リストをクリア
  questionList.innerHTML = '';
  
  // 現在の問題インデックスを取得
  const currentIndex = questionManager.getCurrentQuestionIndex();
  const questions = questionManager.questions;
  
  // 現在の問題までの問題をリストに追加
  for (let i = 0; i <= currentIndex; i++) {
    const question = questions[i];
    const questionItem = document.createElement('div');
    questionItem.className = 'question-item';
    
    if (i === currentIndex) {
      questionItem.classList.add('current');
    }
    
    // 答えをカタカナに変換
    const katakanaAnswer = hiraganaToKatakana(question.answer);
    
    // 表示テキストを「問題番号: 答え」の形式にする
    questionItem.textContent = `${i + 1}: ${katakanaAnswer}`;
    questionItem.setAttribute('data-index', i);
    questionItem.setAttribute('role', 'button');
    questionItem.setAttribute('tabindex', '0');
    questionItem.setAttribute('aria-label', `問題${i + 1}、${katakanaAnswer}に移動`);
    
    // クリックイベント
    questionItem.addEventListener('click', () => {
      navigateToQuestion(i);
      hideQuestionSelectionModal();
    });
    
    questionList.appendChild(questionItem);
  }
  
  // モーダルを表示
  modal.classList.remove('hidden');
}

/**
 * 問題選択モーダルを非表示
 */
function hideQuestionSelectionModal() {
  const modal = document.getElementById('question-selection-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

/**
 * 指定した問題に移動
 * @param {number} targetIndex - 移動先の問題インデックス
 */
function navigateToQuestion(targetIndex) {
  const currentIndex = questionManager.getCurrentQuestionIndex();
  
  // 同じ問題の場合は何もしない
  if (targetIndex === currentIndex) {
    return;
  }
  
  // 問題インデックスを直接設定
  questionManager.currentQuestionIndex = targetIndex;
  
  // 入力をクリア
  numberInputController.clear();
  
  // 答え表示エリアをリセット
  const answerText = document.getElementById('answer-text');
  if (answerText) {
    answerText.innerHTML = '回答を入力';
    answerText.classList.remove('has-answer');
    delete answerText.dataset.answered;
  }

  // +ボタンを非表示にする
  const separatorBtn = document.getElementById('add-separator-btn');
  if (separatorBtn) {
    separatorBtn.classList.add('hidden');
  }

  // 「マ」「ス」ボタンの状態をリセット
  const kanaMa = document.getElementById('kana-ma');
  const kanaSu = document.getElementById('kana-su');
  if (kanaMa) {
    kanaMa.style.visibility = 'visible';
    kanaMa.style.pointerEvents = 'auto';
    kanaMa.classList.add('disabled');
  }
  if (kanaSu) {
    kanaSu.style.visibility = 'visible';
    kanaSu.style.pointerEvents = 'auto';
    kanaSu.classList.add('disabled');
  }

  // 過去の問題に戻る場合は、保存された答えを復元
  if (questionManager.isAnswered(targetIndex)) {
    const savedAnswer = questionManager.getAnswer(targetIndex);
    if (savedAnswer && answerText) {
      answerText.textContent = savedAnswer;
      answerText.classList.add('has-answer');
    }
    
    // 「マ」「ス」ボタンを有効化
    if (kanaMa) {
      kanaMa.classList.remove('disabled');
      dragDropController.makeDraggable(kanaMa, 'マ');
    }
    if (kanaSu) {
      kanaSu.classList.remove('disabled');
      dragDropController.makeDraggable(kanaSu, 'ス');
    }
    
    // +ボタンを表示
    if (separatorBtn) {
      separatorBtn.classList.remove('hidden');
    }
    
    // 答え表示エリアにクリックイベントを追加
    setupAnswerClickHandler(savedAnswer);
  } else {
    // 未回答の問題の場合は通常の表示
    const currentQuestion = questionManager.getCurrentQuestion();
    if (currentQuestion) {
      updateQuestionDisplay(currentQuestion);
    }
  }
  
  // ナビゲーションボタンの状態を更新
  updateNavigationButtons();
}

/**
 * ナビゲーションボタンの状態を更新
 */
function updateNavigationButtons() {
  const moveBackBtn = document.getElementById('move-back-btn');
  const currentIndex = questionManager.getCurrentQuestionIndex();
  
  if (moveBackBtn) {
    // 最初の問題の場合は戻るボタンを無効化
    if (currentIndex === 0) {
      moveBackBtn.disabled = true;
    } else {
      moveBackBtn.disabled = false;
    }
  }
}

/**
 * 文字を元の場所に戻す
 * @param {string} char - 戻すカタカナ文字
 */
function restoreCharacterToOriginalPlace(char) {
  console.log('restoreCharacterToOriginalPlace呼び出し:', char);
  
  // まず答え表示エリアの個別文字を確認
  const answerText = document.getElementById('answer-text');
  if (answerText && answerText.dataset.answered === 'true') {
    const clickableChars = answerText.querySelectorAll('.clickable-answer-char');
    console.log('答え表示エリアの文字数:', clickableChars.length);
    
    // 最初に見つかった隠れている文字のみを復元
    for (let i = 0; i < clickableChars.length; i++) {
      const charElement = clickableChars[i];
      if (charElement.dataset.kana === char && 
          charElement.style.visibility === 'hidden') {
        console.log('答え表示エリアで文字を復元:', char, 'インデックス:', i);
        charElement.style.visibility = 'visible';
        charElement.style.pointerEvents = 'auto';
        return; // 最初の1つだけ復元してすぐに終了
      }
    }
  }
  
  // 答え表示エリアで見つからない場合のみ「マ」「ス」ボタンを復元
  console.log('マ/スボタンの復元を試行:', char);
  if (char === 'マ') {
    const kanaMa = document.getElementById('kana-ma');
    if (kanaMa) {
      console.log('マボタンを復元');
      kanaMa.style.visibility = 'visible';
      kanaMa.style.pointerEvents = 'auto';
    }
  } else if (char === 'ス') {
    const kanaSu = document.getElementById('kana-su');
    if (kanaSu) {
      console.log('スボタンを復元');
      kanaSu.style.visibility = 'visible';
      kanaSu.style.pointerEvents = 'auto';
    }
  }
}

/**
 * フィードバック表示
 */
function showFeedback(type, message) {
  const feedback = document.getElementById('feedback');
  const feedbackMessage = feedback.querySelector('.feedback-message');
  
  if (feedback && feedbackMessage) {
    feedback.className = `feedback ${type}`;
    feedbackMessage.textContent = message;
    feedback.classList.remove('hidden');

    // 1秒後に自動で非表示
    setTimeout(() => {
      feedback.classList.add('hidden');
    }, 1000);
  }
}

// DOMContentLoadedイベントで初期化
document.addEventListener('DOMContentLoaded', init);

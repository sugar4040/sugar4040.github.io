/**
 * KanaInputController - 五十音表UI管理
 * Requirements: 2.2, 3.1
 */

export class KanaInputController {
  /**
   * @param {HTMLElement} modalElement - モーダル要素
   */
  constructor(modalElement) {
    this.modal = modalElement;
    this.inputElement = document.getElementById('kana-input');
    this.input = '';
    this.inputCallback = null;

    this.initializeEventListeners();
  }

  /**
   * イベントリスナーを初期化
   */
  initializeEventListeners() {
    // カタカナボタンのクリック
    const kanaButtons = this.modal.querySelectorAll('.kana-btn[data-kana]');
    kanaButtons.forEach(button => {
      button.addEventListener('click', () => {
        const kana = button.dataset.kana;
        this.addKana(kana);
      });
    });

    // バックスペースボタン
    const backspaceBtn = document.getElementById('backspace-btn');
    if (backspaceBtn) {
      backspaceBtn.addEventListener('click', () => {
        this.backspace();
      });
    }

    // クリアボタン
    const clearBtn = document.getElementById('clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.clear();
      });
    }

    // 濁音ボタン
    const dakutenBtn = document.getElementById('dakuten-btn');
    if (dakutenBtn) {
      dakutenBtn.addEventListener('click', () => {
        this.addDakuten();
      });
    }

    // 半濁音ボタン
    const handakutenBtn = document.getElementById('handakuten-btn');
    if (handakutenBtn) {
      handakutenBtn.addEventListener('click', () => {
        this.addHandakuten();
      });
    }

    // 小文字ボタン
    const smallBtn = document.getElementById('small-btn');
    if (smallBtn) {
      smallBtn.addEventListener('click', () => {
        this.makeSmall();
      });
    }

    // 答えるボタン
    const submitBtn = document.getElementById('submit-answer-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        if (this.inputCallback) {
          this.inputCallback(this.input);
        }
      });
    }

    // 閉じるボタン
    const closeBtn = document.getElementById('close-modal-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.hide();
      });
    }

    // モーダル背景クリックで閉じる
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.hide();
      }
    });

    // Escキーで閉じる
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
        this.hide();
      }
    });
  }

  /**
   * カタカナを追加
   * @param {string} kana - 追加するカタカナ
   */
  addKana(kana) {
    this.input += kana;
    this.updateDisplay();
  }

  /**
   * 最後の文字を削除
   */
  backspace() {
    if (this.input.length > 0) {
      this.input = this.input.slice(0, -1);
      this.updateDisplay();
    }
  }

  /**
   * 濁音に変換
   */
  addDakuten() {
    if (this.input.length === 0) return;

    const lastChar = this.input[this.input.length - 1];
    const dakutenMap = {
      // ひらがな
      'か': 'が', 'き': 'ぎ', 'く': 'ぐ', 'け': 'げ', 'こ': 'ご',
      'さ': 'ざ', 'し': 'じ', 'す': 'ず', 'せ': 'ぜ', 'そ': 'ぞ',
      'た': 'だ', 'ち': 'ぢ', 'つ': 'づ', 'て': 'で', 'と': 'ど',
      'は': 'ば', 'ひ': 'び', 'ふ': 'ぶ', 'へ': 'べ', 'ほ': 'ぼ',
      // カタカナ
      'カ': 'ガ', 'キ': 'ギ', 'ク': 'グ', 'ケ': 'ゲ', 'コ': 'ゴ',
      'サ': 'ザ', 'シ': 'ジ', 'ス': 'ズ', 'セ': 'ゼ', 'ソ': 'ゾ',
      'タ': 'ダ', 'チ': 'ヂ', 'ツ': 'ヅ', 'テ': 'デ', 'ト': 'ド',
      'ハ': 'バ', 'ヒ': 'ビ', 'フ': 'ブ', 'ヘ': 'ベ', 'ホ': 'ボ'
    };

    if (dakutenMap[lastChar]) {
      this.input = this.input.slice(0, -1) + dakutenMap[lastChar];
      this.updateDisplay();
    }
  }

  /**
   * 半濁音に変換
   */
  addHandakuten() {
    if (this.input.length === 0) return;

    const lastChar = this.input[this.input.length - 1];
    const handakutenMap = {
      // ひらがな
      'は': 'ぱ', 'ひ': 'ぴ', 'ふ': 'ぷ', 'へ': 'ぺ', 'ほ': 'ぽ',
      // カタカナ
      'ハ': 'パ', 'ヒ': 'ピ', 'フ': 'プ', 'ヘ': 'ペ', 'ホ': 'ポ'
    };

    if (handakutenMap[lastChar]) {
      this.input = this.input.slice(0, -1) + handakutenMap[lastChar];
      this.updateDisplay();
    }
  }

  /**
   * 小文字に変換
   */
  makeSmall() {
    if (this.input.length === 0) return;

    const lastChar = this.input[this.input.length - 1];
    const smallMap = {
      // ひらがな
      'あ': 'ぁ', 'い': 'ぃ', 'う': 'ぅ', 'え': 'ぇ', 'お': 'ぉ',
      'や': 'ゃ', 'ゆ': 'ゅ', 'よ': 'ょ',
      'つ': 'っ', 'わ': 'ゎ',
      // カタカナ
      'ア': 'ァ', 'イ': 'ィ', 'ウ': 'ゥ', 'エ': 'ェ', 'オ': 'ォ',
      'ヤ': 'ャ', 'ユ': 'ュ', 'ヨ': 'ョ',
      'ツ': 'ッ', 'ワ': 'ヮ'
    };

    if (smallMap[lastChar]) {
      this.input = this.input.slice(0, -1) + smallMap[lastChar];
      this.updateDisplay();
    }
  }

  /**
   * 表示を更新
   */
  updateDisplay() {
    if (this.inputElement) {
      this.inputElement.value = this.input;
    }
  }

  /**
   * 五十音表を表示
   */
  show() {
    this.modal.classList.remove('hidden');
    this.clear();
  }

  /**
   * 五十音表を非表示
   */
  hide() {
    this.modal.classList.add('hidden');
  }

  /**
   * 現在の入力を取得
   * @returns {string} 入力されたカタカナ
   */
  getInput() {
    return this.input;
  }

  /**
   * 入力をクリア
   */
  clear() {
    this.input = '';
    this.updateDisplay();
  }

  /**
   * 入力完了時のコールバックを設定
   * @param {Function} callback - コールバック関数
   */
  onInputComplete(callback) {
    this.inputCallback = callback;
  }
}

/**
 * AnswerValidator - 答えの検証ロジック
 * Requirements: 3.2
 */

export class AnswerValidator {
  /**
   * かな文字を正規化する
   * @param {string} kana - かな文字列
   * @returns {string} 正規化されたかな
   */
  static normalize(kana) {
    if (!kana || typeof kana !== 'string') {
      return '';
    }

    // 空白を除去
    let normalized = kana.trim().replace(/\s+/g, '');

    // ひらがなの小文字を大文字に変換
    const hiraganaSmallToLarge = {
      'ぁ': 'あ', 'ぃ': 'い', 'ぅ': 'う', 'ぇ': 'え', 'ぉ': 'お',
      'ゕ': 'か', 'ゖ': 'け',
      'っ': 'つ',
      'ゃ': 'や', 'ゅ': 'ゆ', 'ょ': 'よ',
      'ゎ': 'わ'
    };

    // カタカナの小文字を大文字に変換
    const katakanaSmallToLarge = {
      'ァ': 'ア', 'ィ': 'イ', 'ゥ': 'ウ', 'ェ': 'エ', 'ォ': 'オ',
      'ヵ': 'カ', 'ヶ': 'ケ',
      'ッ': 'ツ',
      'ャ': 'ヤ', 'ュ': 'ユ', 'ョ': 'ヨ',
      'ヮ': 'ワ'
    };

    normalized = normalized.split('').map(char => {
      return hiraganaSmallToLarge[char] || katakanaSmallToLarge[char] || char;
    }).join('');

    return normalized;
  }

  /**
   * 答えを検証する
   * @param {string} input - 入力された答え
   * @param {string} correct - 正解
   * @returns {boolean} 正解かどうか
   */
  static validate(input, correct) {
    const normalizedInput = this.normalize(input);
    const normalizedCorrect = this.normalize(correct);

    return normalizedInput === normalizedCorrect;
  }
}

/**
 * KanaToNumberConverter - カタカナ→数字変換
 * Requirements: 3.3, 4.2
 */

export class KanaToNumberConverter {
  /**
   * @param {Object} mappingData - カタカナ→数字のマッピング
   */
  constructor(mappingData) {
    this.mapping = mappingData || {};
  }

  /**
   * カタカナを数字に変換
   * @param {string} kana - カタカナ1文字
   * @returns {number|null} 対応する数字、または null
   */
  convert(kana) {
    if (!kana || typeof kana !== 'string' || kana.length !== 1) {
      return null;
    }

    const number = this.mapping[kana];
    return number !== undefined ? number : null;
  }

  /**
   * カタカナ文字列を数字配列に変換
   * @param {string} kanaString - カタカナ文字列
   * @returns {Array<number>} 数字の配列
   */
  convertString(kanaString) {
    if (!kanaString || typeof kanaString !== 'string') {
      return [];
    }

    const numbers = [];
    for (const char of kanaString) {
      const number = this.convert(char);
      if (number !== null) {
        numbers.push(number);
      }
    }

    return numbers;
  }
}

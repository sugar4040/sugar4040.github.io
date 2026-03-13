/**
 * ConfigLoader - 設定ファイルの読み込みと検証
 * Requirements: 4.1, 4.2
 */

export class ConfigLoader {
  /**
   * 設定ファイルを読み込む
   * @param {string} configPath - 設定ファイルのパス
   * @returns {Promise<Object>} 設定オブジェクト
   */
  async loadConfig(configPath) {
    try {
      const response = await fetch(configPath);
      
      if (!response.ok) {
        throw new Error(`設定ファイルの読み込みに失敗しました: ${response.status} ${response.statusText}`);
      }
      
      const config = await response.json();
      return config;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('設定ファイルのJSON形式が不正です');
      }
      throw error;
    }
  }

  /**
   * カタカナ→数字変換マッピングを読み込む
   * @param {string} mappingPath - マッピングファイルのパス
   * @returns {Promise<Object>} マッピングオブジェクト
   */
  async loadKanaMapping(mappingPath) {
    try {
      const response = await fetch(mappingPath);
      
      if (!response.ok) {
        throw new Error(`マッピングファイルの読み込みに失敗しました: ${response.status} ${response.statusText}`);
      }
      
      const mapping = await response.json();
      return mapping;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('マッピングファイルのJSON形式が不正です');
      }
      throw error;
    }
  }

  /**
   * 設定ファイルを検証する
   * @param {Object} config - 設定オブジェクト
   * @returns {Array<string>} エラーメッセージの配列
   */
  validateConfig(config) {
    const errors = [];

    // 必須フィールドのチェック
    if (!config) {
      errors.push('設定オブジェクトがnullまたはundefinedです');
      return errors;
    }

    if (!config.eventId || typeof config.eventId !== 'string') {
      errors.push('eventIdが必須です（文字列）');
    }

    if (!config.eventTitle || typeof config.eventTitle !== 'string') {
      errors.push('eventTitleが必須です（文字列）');
    }

    if (!Array.isArray(config.questions)) {
      errors.push('questionsが必須です（配列）');
      return errors;
    }

    if (config.questions.length === 0) {
      errors.push('questionsに少なくとも1つの問題が必要です');
    }

    // 各問題の検証
    const questionIds = new Set();
    config.questions.forEach((question, index) => {
      if (!question.id || typeof question.id !== 'string') {
        errors.push(`問題${index + 1}: idが必須です（文字列）`);
      } else {
        // 重複IDのチェック
        if (questionIds.has(question.id)) {
          errors.push(`問題${index + 1}: 重複したID "${question.id}" が見つかりました`);
        }
        questionIds.add(question.id);
      }

      if (!question.question || typeof question.question !== 'string') {
        errors.push(`問題${index + 1}: questionが必須です（文字列）`);
      }

      if (!question.answer || typeof question.answer !== 'string') {
        errors.push(`問題${index + 1}: answerが必須です（文字列）`);
      }
    });

    return errors;
  }
}

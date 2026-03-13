/**
 * QuestionManager - 問題管理と進行制御
 */

export class QuestionManager {
  /**
   * @param {Array} questions - 問題の配列
   */
  constructor(questions) {
    this.questions = questions;
    this.currentQuestionIndex = 0;
    this.completedRoutes = new Set(); // 完了したルートを記録
    this.answeredQuestions = new Map(); // 問題インデックス -> カタカナ答え
    this.routeFinalAnswers = new Map(); // ルート名 -> 最終問題の答え
  }

  /**
   * ルート完了を記録
   * @param {string} route - 完了したルート名
   */
  markRouteCompleted(route) {
    this.completedRoutes.add(route);
  }

  /**
   * 両方のルートが完了したかチェック
   * @returns {boolean} 両方のルートが完了している場合true
   */
  areBothRoutesCompleted() {
    return this.completedRoutes.has('route1') && this.completedRoutes.has('route2');
  }

  /**
   * 問題の答えを記録
   * @param {number} questionIndex - 問題インデックス
   * @param {string} katakanaAnswer - カタカナの答え
   */
  saveAnswer(questionIndex, katakanaAnswer) {
    this.answeredQuestions.set(questionIndex, katakanaAnswer);
    
    // ルート最終問題の場合は、ルート別に保存
    const question = this.questions[questionIndex];
    if (question && question.isFinal && question.route) {
      this.routeFinalAnswers.set(question.route, katakanaAnswer);
    }
  }

  /**
   * 問題の答えを取得
   * @param {number} questionIndex - 問題インデックス
   * @returns {string|null} カタカナの答え、または未回答の場合null
   */
  getAnswer(questionIndex) {
    return this.answeredQuestions.get(questionIndex) || null;
  }

  /**
   * 問題が回答済みかチェック
   * @param {number} questionIndex - 問題インデックス
   * @returns {boolean} 回答済みの場合true
   */
  isAnswered(questionIndex) {
    return this.answeredQuestions.has(questionIndex);
  }

  /**
   * 完了済みルートの最終問題の答えを取得
   * @returns {string|null} 完了済みルートの最終問題の答え、またはnull
   */
  getCompletedRouteFinalAnswer() {
    // route1が完了していればroute1の答えを返す
    if (this.completedRoutes.has('route1') && this.routeFinalAnswers.has('route1')) {
      return this.routeFinalAnswers.get('route1');
    }
    // route2が完了していればroute2の答えを返す
    if (this.completedRoutes.has('route2') && this.routeFinalAnswers.has('route2')) {
      return this.routeFinalAnswers.get('route2');
    }
    return null;
  }

  /**
   * 現在の問題を取得
   * @returns {Object|null} 現在の問題オブジェクト
   */
  getCurrentQuestion() {
    if (this.currentQuestionIndex >= 0 && this.currentQuestionIndex < this.questions.length) {
      return this.questions[this.currentQuestionIndex];
    }
    return null;
  }

  /**
   * 次の問題に移動
   * @returns {boolean} 移動成功かどうか
   */
  moveToNext() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      return true;
    }
    return false;
  }

  /**
   * 前の問題に移動
   * @returns {boolean} 移動成功かどうか
   */
  moveToPrevious() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      return true;
    }
    return false;
  }

  /**
   * 現在の問題インデックスを取得
   * @returns {number} 現在の問題インデックス
   */
  getCurrentQuestionIndex() {
    return this.currentQuestionIndex;
  }

  /**
   * 状態をリセット
   */
  reset() {
    this.currentQuestionIndex = 0;
  }

  /**
   * 全問題完了かどうか
   * @returns {boolean} 完了状態
   */
  isCompleted() {
    return this.currentQuestionIndex >= this.questions.length;
  }

  /**
   * 進行状況を取得
   * @returns {Object} 進行状況オブジェクト
   */
  getProgress() {
    return {
      current: this.currentQuestionIndex + 1,
      total: this.questions.length,
      percentage: Math.round(((this.currentQuestionIndex + 1) / this.questions.length) * 100)
    };
  }
}

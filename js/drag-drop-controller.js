/**
 * DragDropController - ドラッグ&ドロップ機能を管理
 */
export class DragDropController {
  constructor() {
    this.draggedElement = null;
    this.draggedKana = null;
    this.onDropCallback = null;
  }

  /**
   * ドラッグ可能な要素を設定
   * @param {HTMLElement} element - ドラッグ可能にする要素
   * @param {string} kana - カタカナ文字
   */
  makeDraggable(element, kana) {
    element.setAttribute('draggable', 'true');
    element.dataset.kana = kana;

    // タッチイベント対応
    element.addEventListener('touchstart', (e) => this.handleTouchStart(e, element, kana));
    element.addEventListener('touchmove', (e) => this.handleTouchMove(e));
    element.addEventListener('touchend', (e) => this.handleTouchEnd(e));

    // マウスイベント対応
    element.addEventListener('dragstart', (e) => this.handleDragStart(e, element, kana));
    element.addEventListener('dragend', (e) => this.handleDragEnd(e));
  }

  /**
   * ドロップ可能な要素を設定
   * @param {HTMLElement} element - ドロップ先の要素
   */
  makeDroppable(element) {
    element.addEventListener('dragover', (e) => this.handleDragOver(e));
    element.addEventListener('drop', (e) => this.handleDrop(e, element));

    // タッチイベント用のドロップゾーン設定
    element.classList.add('drop-zone');
  }

  /**
   * ドロップ時のコールバックを設定
   * @param {Function} callback - コールバック関数
   */
  onDrop(callback) {
    this.onDropCallback = callback;
  }

  // マウスイベントハンドラ
  handleDragStart(e, element, kana) {
    this.draggedElement = element;
    this.draggedKana = kana;
    element.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', kana);
  }

  handleDragEnd(e) {
    if (this.draggedElement) {
      this.draggedElement.style.opacity = '1';
    }
  }

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  handleDrop(e, dropZone) {
    e.preventDefault();
    if (this.draggedKana && this.onDropCallback) {
      // コールバックを呼び出す前に要素への参照を保持
      const elementToHide = this.draggedElement;
      this.onDropCallback(this.draggedKana, dropZone, elementToHide);
    }
    
    // リセット（コールバック後）
    if (this.draggedElement) {
      this.draggedElement.style.opacity = '1';
    }
    this.draggedElement = null;
    this.draggedKana = null;
  }

  // タッチイベントハンドラ
  handleTouchStart(e, element, kana) {
    this.draggedElement = element;
    this.draggedKana = kana;
    element.style.opacity = '0.5';
    
    // タッチ位置を記録
    const touch = e.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.hasMoved = false;
  }

  handleTouchMove(e) {
    e.preventDefault(); // スクロールを防ぐ
    
    if (!this.draggedElement) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - this.touchStartX);
    const deltaY = Math.abs(touch.clientY - this.touchStartY);
    
    // 10px以上移動したらドラッグと判定
    if (deltaX > 10 || deltaY > 10) {
      this.hasMoved = true;
    }
  }

  handleTouchEnd(e) {
    if (!this.draggedElement || !this.draggedKana) return;

    const touch = e.changedTouches[0];
    const x = touch.clientX;
    const y = touch.clientY;

    // 移動していない場合はタップと判定（クリックイベントに任せる）
    if (!this.hasMoved) {
      // リセット
      if (this.draggedElement) {
        this.draggedElement.style.opacity = '1';
      }
      this.draggedElement = null;
      this.draggedKana = null;
      return;
    }

    // タッチ終了位置の要素を取得
    const dropZone = document.elementFromPoint(x, y);
    
    // ドロップゾーンかチェック
    if (dropZone && dropZone.classList.contains('drop-zone')) {
      if (this.onDropCallback) {
        const elementToHide = this.draggedElement;
        this.onDropCallback(this.draggedKana, dropZone, elementToHide);
      }
    }

    // リセット
    if (this.draggedElement) {
      this.draggedElement.style.opacity = '1';
    }
    this.draggedElement = null;
    this.draggedKana = null;
  }

  /**
   * 要素のドラッグを無効化
   * @param {HTMLElement} element - 無効化する要素
   */
  disableDragging(element) {
    element.setAttribute('draggable', 'false');
    element.style.opacity = '0.5';
    element.style.pointerEvents = 'none';
  }

  /**
   * 要素のドラッグを有効化
   * @param {HTMLElement} element - 有効化する要素
   */
  enableDragging(element) {
    element.setAttribute('draggable', 'true');
    element.style.opacity = '1';
    element.style.pointerEvents = 'auto';
  }
}

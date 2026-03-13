/**
 * NumberInputController - 数字入力欄管理（ドラッグ&ドロップ対応）
 */

export class NumberInputController {
  /**
   * @param {HTMLElement} inputElement - 数字入力欄の要素
   */
  constructor(inputElement) {
    this.inputElement = inputElement;
    this.items = []; // {type: 'kana'|'separator', value: string, id: number}
    this.nextId = 0;
    this.onCharRemoved = null;
    this.draggedItem = null;
    this.updateDisplay();
  }

  /**
   * カタカナを追加
   * @param {string} kana - 追加するカタカナ
   */
  addKana(kana) {
    if (typeof kana === 'string' && kana.length > 0) {
      this.items.push({
        type: 'kana',
        value: kana,
        id: this.nextId++
      });
      this.updateDisplay();
    }
  }

  /**
   * 区切り記号を追加
   */
  addSeparator() {
    if (this.items.length > 0) {
      const lastItem = this.items[this.items.length - 1];
      if (lastItem.type !== 'separator') {
        this.items.push({
          type: 'separator',
          value: '+',
          id: this.nextId++
        });
        this.updateDisplay();
      }
    }
  }

  /**
   * 入力をクリア
   */
  clear() {
    this.items = [];
    this.updateDisplay();
  }

  /**
   * 現在の値を取得
   * @returns {string} 現在の入力値
   */
  getValue() {
    return this.items.map(item => item.value).join('');
  }

  /**
   * 表示を更新
   */
  updateDisplay() {
    if (!this.inputElement) return;

    let htmlContent = '';
    
    this.items.forEach((item, index) => {
      const itemClass = item.type === 'separator' ? 'input-separator' : 'input-kana';
      htmlContent += `<span 
        class="${itemClass}" 
        data-id="${item.id}" 
        data-index="${index}"
        data-value="${item.value}"
        draggable="true"
        role="button" 
        tabindex="0" 
        aria-label="${item.value}をタップで削除、ドラッグで移動"
      >${item.value}</span>`;
    });
    
    this.inputElement.innerHTML = htmlContent || '';
    
    // イベントを設定
    this.setupEvents();
  }

  /**
   * イベントを設定
   */
  setupEvents() {
    const itemElements = this.inputElement.querySelectorAll('.input-kana, .input-separator');
    console.log('setupEvents: 要素数=', itemElements.length);
    
    itemElements.forEach(element => {
      console.log('イベント設定:', element.dataset.value);
      
      // クリックイベント（PC用）
      element.addEventListener('click', (e) => {
        console.log('クリックイベント発火');
        e.preventDefault();
        e.stopPropagation();
        const id = parseInt(element.dataset.id);
        this.removeItem(id);
      });
      
      // ドラッグイベント
      element.addEventListener('dragstart', (e) => this.handleDragStart(e, element));
      element.addEventListener('dragend', (e) => this.handleDragEnd(e));
      element.addEventListener('dragover', (e) => this.handleDragOver(e));
      element.addEventListener('drop', (e) => this.handleDrop(e, element));

      // タッチイベント
      element.addEventListener('touchstart', (e) => this.handleTouchStart(e, element), { passive: false });
      element.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
      element.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
    });
  }

  /**
   * アイテムを削除
   * @param {number} id - 削除するアイテムのID
   */
  removeItem(id) {
    const index = this.items.findIndex(item => item.id === id);
    if (index !== -1) {
      const removedItem = this.items[index];
      console.log('削除するアイテム:', removedItem);
      this.items.splice(index, 1);
      this.updateDisplay();
      
      // カタカナの場合は元の場所に戻す
      if (removedItem.type === 'kana' && this.onCharRemoved) {
        console.log('onCharRemovedコールバックを呼び出し:', removedItem.value);
        this.onCharRemoved(removedItem.value);
      } else {
        console.log('コールバック呼び出しスキップ - type:', removedItem.type, 'callback:', !!this.onCharRemoved);
      }
    }
  }

  /**
   * ドラッグ開始
   */
  handleDragStart(e, element) {
    const id = parseInt(element.dataset.id);
    this.draggedItem = this.items.find(item => item.id === id);
    element.style.opacity = '0.5';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id.toString());
  }

  /**
   * ドラッグ終了
   */
  handleDragEnd(e) {
    e.target.style.opacity = '1';
    this.draggedItem = null;
  }

  /**
   * ドラッグオーバー
   */
  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  /**
   * ドロップ
   */
  handleDrop(e, targetElement) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!this.draggedItem) return;

    const targetId = parseInt(targetElement.dataset.id);
    const draggedIndex = this.items.findIndex(item => item.id === this.draggedItem.id);
    const targetIndex = this.items.findIndex(item => item.id === targetId);

    if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
      // アイテムを並び替え
      const [removed] = this.items.splice(draggedIndex, 1);
      this.items.splice(targetIndex, 0, removed);
      this.updateDisplay();
    }
  }

  /**
   * タッチ開始
   */
  handleTouchStart(e, element) {
    console.log('タッチ開始');
    e.preventDefault(); // デフォルトの動作を防ぐ
    
    // すぐにドラッグ開始
    const id = parseInt(element.dataset.id);
    this.draggedItem = this.items.find(item => item.id === id);
    console.log('ドラッグアイテム:', this.draggedItem);
    element.style.opacity = '0.5';
    this.isDragging = true;
    
    // タッチ位置を記録
    const touch = e.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    this.touchStartTime = Date.now();
    this.hasMoved = false;
  }

  /**
   * タッチ移動
   */
  handleTouchMove(e) {
    if (this.isDragging) {
      e.preventDefault();
      
      // 移動距離を計算
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - this.touchStartX);
      const deltaY = Math.abs(touch.clientY - this.touchStartY);
      
      // 10px以上移動したらドラッグと判定
      if (deltaX > 10 || deltaY > 10) {
        this.hasMoved = true;
      }
    }
  }

  /**
   * タッチ終了
   */
  handleTouchEnd(e) {
    console.log('タッチ終了 - hasMoved:', this.hasMoved, 'isDragging:', this.isDragging);
    e.preventDefault(); // デフォルトの動作を防ぐ
    
    if (this.isDragging && this.draggedItem) {
      // 移動していない場合はタップと判定して削除
      if (!this.hasMoved) {
        console.log('タップと判定 - アイテムを削除');
        const id = this.draggedItem.id;
        
        // 元の透明度に戻す
        const itemElements = this.inputElement.querySelectorAll('.input-kana, .input-separator');
        itemElements.forEach(el => {
          el.style.opacity = '1';
        });
        
        this.isDragging = false;
        this.draggedItem = null;
        
        // アイテムを削除
        this.removeItem(id);
        return;
      }
      
      console.log('ドラッグと判定 - 並び替え処理');
      // ドラッグ終了 - ドロップ位置を判定
      const touch = e.changedTouches[0];
      const dropElement = document.elementFromPoint(touch.clientX, touch.clientY);
      
      if (dropElement && (dropElement.classList.contains('input-kana') || dropElement.classList.contains('input-separator'))) {
        const targetId = parseInt(dropElement.dataset.id);
        const draggedIndex = this.items.findIndex(item => item.id === this.draggedItem.id);
        const targetIndex = this.items.findIndex(item => item.id === targetId);

        if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
          const [removed] = this.items.splice(draggedIndex, 1);
          this.items.splice(targetIndex, 0, removed);
        }
      }
      
      // 元の透明度に戻す
      const itemElements = this.inputElement.querySelectorAll('.input-kana, .input-separator');
      itemElements.forEach(el => {
        el.style.opacity = '1';
      });
      
      this.isDragging = false;
      this.draggedItem = null;
      this.updateDisplay();
    }
  }

  /**
   * 文字削除時のコールバックを設定
   * @param {Function} callback - 文字削除時に呼ばれる関数
   */
  onCharacterRemoved(callback) {
    this.onCharRemoved = callback;
  }

  /**
   * 入力が空かどうか
   * @returns {boolean} 空の場合true
   */
  isEmpty() {
    return this.items.length === 0;
  }
}

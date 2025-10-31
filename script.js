class ATMSystem {
    constructor() {
        this.balanceYen = 1; // 円の残高
        this.balanceMakai = 0; // マカイドルの残高
        this.currentCurrency = 'yen'; // 'yen' または 'makai'
        this.currentAction = null; // 'withdraw' または 'deposit'
        this.init();
    }

    init() {
        this.updateBalanceDisplay();
        this.setupEventListeners();
        this.generateAmountButtons();
        this.generateBalanceButtons();
    }

    setupEventListeners() {
        // 引出ボタン
        document.getElementById('withdraw-btn').addEventListener('click', () => {
            this.currentAction = 'withdraw';
            this.showAmountScreen();
        });

        // 預入ボタン
        document.getElementById('deposit-btn').addEventListener('click', () => {
            this.currentAction = 'deposit';
            this.showAmountScreen();
        });

        // 戻るボタン
        document.getElementById('back-btn').addEventListener('click', () => {
            this.showMainScreen();
        });

        // 通貨単位ボタン
        document.getElementById('currency').addEventListener('click', () => {
            this.toggleCurrency();
        });

        // 日付表示ボタン
        document.getElementById('date-display').addEventListener('click', () => {
            this.showPopup();
        });

        // ポップアップ閉じるボタン
        document.getElementById('close-popup').addEventListener('click', () => {
            this.hidePopup();
        });

        // ポップアップオーバーレイクリックで閉じる
        document.getElementById('popup-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'popup-overlay') {
                this.hidePopup();
            }
        });

        // 番号表示ボタン
        document.getElementById('number-display').addEventListener('click', () => {
            this.showBalanceSetting();
        });

        // 残高設定閉じるボタン
        document.getElementById('close-balance-setting').addEventListener('click', () => {
            this.hideBalanceSetting();
        });

        // 残高設定オーバーレイクリックで閉じる
        document.getElementById('balance-setting-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'balance-setting-overlay') {
                this.hideBalanceSetting();
            }
        });
    }

    generateAmountButtons() {
        const grid = document.getElementById('amount-grid');

        // 指定された6つの金額ボタンを生成
        const amounts = [1, 10, 100, 1000, 10000, 100000];

        amounts.forEach(amount => {
            const button = document.createElement('button');
            button.className = 'amount-btn';
            button.textContent = amount;
            button.addEventListener('click', () => this.processTransaction(amount));
            grid.appendChild(button);
        });
    }

    processTransaction(amount) {
        const currencyName = this.currentCurrency === 'yen' ? '円' : 'マカイドル';

        if (this.currentAction === 'withdraw') {
            const currentBalance = this.currentCurrency === 'yen' ? this.balanceYen : this.balanceMakai;
            if (currentBalance >= amount) {
                if (this.currentCurrency === 'yen') {
                    this.balanceYen -= amount;
                } else {
                    this.balanceMakai -= amount;
                }
                this.showMessage(`${amount}${currencyName}を引き出しました`);
            } else {
                this.showMessage('残高不足です');
            }
        } else if (this.currentAction === 'deposit') {
            if (this.currentCurrency === 'yen') {
                this.balanceYen += amount;
            } else {
                this.balanceMakai += amount;
            }
            this.showMessage(`${amount}${currencyName}を預け入れました`);
        }

        this.updateBalanceDisplay();
    }

    updateBalanceDisplay() {
        const balance = this.currentCurrency === 'yen' ? this.balanceYen : this.balanceMakai;
        const currencyText = this.currentCurrency === 'yen' ? '円' : 'マカイドル';

        document.getElementById('balance').textContent = balance;
        const currencyElement = document.getElementById('currency');
        currencyElement.textContent = currencyText;

        // マカイドルの場合はフォントサイズを半分に
        if (this.currentCurrency === 'makai') {
            currencyElement.style.fontSize = '81px';
        } else {
            currencyElement.style.fontSize = '100px';
        }
    }

    toggleCurrency() {
        this.currentCurrency = this.currentCurrency === 'yen' ? 'makai' : 'yen';
        this.updateBalanceDisplay();
    }

    showPopup() {
        document.getElementById('popup-overlay').style.display = 'flex';
    }

    hidePopup() {
        document.getElementById('popup-overlay').style.display = 'none';
    }

    generateBalanceButtons() {
        const grid = document.getElementById('balance-buttons-grid');

        // 指定された残高設定値
        const balanceSettings = [
            { yen: 1, makai: 0 },
            { yen: 0, makai: 0 },
            { yen: 30000, makai: 0 },
            { yen: 200, makai: 0 },
            { yen: 137, makai: 0 },
            { yen: 132, makai: 0 },
            { yen: 13632, makai: 0 },
            { yen: 13634, makai: 0 },
            { yen: 13332, makai: 0 },
            { yen: 13334, makai: 0 },
            { yen: 0, makai: 4444 },
            { yen: 0, makai: 3344 }
        ];

        balanceSettings.forEach((setting, index) => {
            const button = document.createElement('button');
            button.className = 'balance-setting-btn';

            if (setting.makai > 0) {
                button.textContent = `${setting.makai}マカイドル`;
            } else {
                button.textContent = `${setting.yen}円`;
            }

            button.addEventListener('click', () => {
                this.setBalance(setting.yen, setting.makai);
                this.hideBalanceSetting();
            });

            grid.appendChild(button);
        });
    }

    setBalance(yen, makai) {
        this.balanceYen = yen;
        this.balanceMakai = makai;
        this.updateBalanceDisplay();
    }

    showBalanceSetting() {
        document.getElementById('balance-setting-overlay').style.display = 'flex';
    }

    hideBalanceSetting() {
        document.getElementById('balance-setting-overlay').style.display = 'none';
    }

    showMainScreen() {
        document.getElementById('main-screen').classList.add('active');
        document.getElementById('amount-screen').classList.remove('active');
    }

    showAmountScreen() {
        document.getElementById('main-screen').classList.remove('active');
        document.getElementById('amount-screen').classList.add('active');
    }

    showMessage(message) {
        // 簡単なメッセージ表示（アラートの代わり）
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 18px;
            font-weight: bold;
            z-index: 1000;
        `;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 1500);
    }
}

// ATMシステムを初期化
document.addEventListener('DOMContentLoaded', () => {
    new ATMSystem();
});
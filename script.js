let interval;
let fields = [[], [], [], [], []];

function startSimulation() {
    // 時給入力を確認
    const hourlyRate = parseFloat(document.getElementById("hourlyRate").value);
    if (isNaN(hourlyRate) || hourlyRate <= 0) {
        alert("有効な時給を入力してください");
        return;
    }

    // インターバルタイマーを設定して開始
    const intervalMs = 3600 * 1000 / hourlyRate;
    interval = setInterval(dropCoin, intervalMs);
}

function stopSimulation() {
    clearInterval(interval); // インターバルをクリアして停止
}

function dropCoin() {
    const coin = document.createElement("div");
    coin.className = "coin";
    coin.textContent = "1";
    const field = document.getElementById("field1");
    field.appendChild(coin);
    animateDrop(coin, 0);
}

function animateDrop(coin, fieldIndex) {
    let posY = 0;
    const interval = setInterval(() => {
        if (posY < 330 - (fields[fieldIndex].length * 30)) {  // フィールドの高さに合わせて調整
            posY += 5;
            coin.style.top = posY + "px";
        } else {
            clearInterval(interval);
            fields[fieldIndex].push(coin);
            checkExchange(fieldIndex);
        }
    }, 20);
}

function checkExchange(fieldIndex) {
    const currentFieldCoins = fields[fieldIndex];
    
    const exchangeRules = [
        { count: 10, newValue: "10" },
        { count: 10, newValue: "100" },
        { count: 10, newValue: "1000" },
        { count: 10, newValue: "10000" }
    ];
    
    // 両替ルールの確認と両替
    if (fieldIndex < exchangeRules.length && currentFieldCoins.length === exchangeRules[fieldIndex].count) {
        for (let coin of currentFieldCoins) {
            coin.remove();
        }
        fields[fieldIndex] = [];
        
        const newCoin = document.createElement("div");
        newCoin.className = fieldIndex < 2 ? "coin" : "note";  // 1000円以上は紙幣として表示
        newCoin.textContent = exchangeRules[fieldIndex].newValue;
        const nextField = document.getElementById(`field${fieldIndex + 2}`);
        nextField.appendChild(newCoin);
        
        animateDrop(newCoin, fieldIndex + 1);

        // 10000円札が10枚に達した場合は停止
        if (fieldIndex === 3 && fields[4].length === 10) {
            stopSimulation();
            alert("10000円札が10枚たまりました。シミュレーションを停止します。");
        }
    }
}

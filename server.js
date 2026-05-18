const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// 🚀 關鍵核心：無條件放行所有網頁來抓資料，徹底粉碎 CORS 阻擋！
app.use(cors());

// 建立一個專屬的資料通道網址： /api/parking
app.get('/api/parking', async (req, res) => {
    // 台中市政府開放資料官方 API 網址
    const apiUrl = "https://datacenter.taichung.gov.tw/swagger/OpenData/72c08233-de17-43cf-87eb-f9e0b8e76c12";
    
    try {
        // 由後端伺服器去抓政府資料（伺服器連線不會被瀏覽器 CORS 機制阻擋）
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('政府 API 伺服器異常');
        
        const data = await response.json();
        
        // 成功拿到後，加上安全標頭，開開心心地吐給您的前端網頁 App
        res.json(data);
    } catch (error) {
        console.error("後端抓取失敗:", error);
        res.status(500).json({ error: "中轉站連線政府資料庫失敗" });
    }
});

app.listen(PORT, () => {
    console.log(`後端中轉站已在連接埠 ${PORT} 順利啟動！`);
});
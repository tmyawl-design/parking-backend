import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
  origin: [
    "https://tmyawl-design.github.io",
    "http://localhost:3000",
    "http://localhost:5173"
  ]
}));

app.get("/", (req, res) => {
  res.json({
    message: "Parking API is running",
    test: "/parking?lat=24.179&lon=120.6466"
  });
});

app.get("/parking", async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({
      error: "請提供 lat 與 lon",
      example: "/parking?lat=24.179&lon=120.6466"
    });
  }

  const apiUrl =
    `https://parkboss.tw/api/v1/query-parking-space-by-coordinate?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json, text/plain, */*",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Referer": "https://parkboss.tw/",
        "Origin": "https://parkboss.tw"
      }
    });

    const contentType = response.headers.get("content-type") || "";
    const text = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "ParkBoss API 拒絕或查詢失敗",
        status: response.status,
        contentType,
        preview: text.slice(0, 500)
      });
    }

    try {
      const data = JSON.parse(text);
      return res.json(data);
    } catch {
      return res.status(502).json({
        error: "ParkBoss 回傳內容不是 JSON",
        status: response.status,
        contentType,
        preview: text.slice(0, 500)
      });
    }

  } catch (err) {
    return res.status(500).json({
      error: "後端查詢失敗",
      detail: String(err)
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Parking API running on port ${PORT}`);
});

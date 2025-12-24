const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

const APP_ENV = process.env.APP_ENV || "unknown";
const APP_MESSAGE = process.env.APP_MESSAGE || "Hello from Node.js";

const server = http.createServer((req, res) => {

  // 1️⃣ Health check (for Kubernetes)
  if (req.url === "/health") {
    res.writeHead(200);
    res.end("OK");
    return;
  }

  // 2️⃣ API endpoint for frontend
  if (req.url === "/env") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      env: APP_ENV,
      message: APP_MESSAGE
    }));
    return;
  }

  // 3️⃣ Serve static files (THIS MUST COME FIRST)
  let filePath = req.url === "/" ? "index.html" : req.url;
  let fullPath = path.join(__dirname, "public", filePath);

  if (fs.existsSync(fullPath)) {
    fs.readFile(fullPath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end("Server error");
        return;
      }

      res.writeHead(200);
      res.end(content);
    });
    return;
  }

  // 4️⃣ Fallback response (ONLY if file not found)
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end(`Environment: ${APP_ENV}\nMessage: ${APP_MESSAGE}`);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

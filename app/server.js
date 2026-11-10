const http = require("http");

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");

    if (req.url === "/health") {
        res.writeHead(200);
        return res.end(JSON.stringify({
            status: "UP",
            application: "SAP BTP Enterprise Monitor"
        }));
    }

    if (req.url === "/ready") {
        res.writeHead(200);
        return res.end(JSON.stringify({
            status: "READY"
        }));
    }

    if (req.url === "/api/status") {
        res.writeHead(200);
        return res.end(JSON.stringify({
            project: "SAP BTP Enterprise Monitor",
            environment: "Cloud Foundry",
            application: "Running",
            database: "Not connected yet",
            timestamp: new Date().toISOString()
        }));
    }

    res.writeHead(404);
    res.end(JSON.stringify({
        error: "Endpoint not found"
    }));
});

server.listen(PORT, "0.0.0.0", () => {
    console.log(`SAP BTP Monitor running on port ${PORT}`);
});

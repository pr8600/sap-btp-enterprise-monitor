
const http = require("http");
const { URL } = require("url");
const path = require("path");
const fs = require("fs");
const PORT = process.env.PORT || 8080;

const server = http.createServer(async (req, res) => {
    res.setHeader("Content-Type", "application/json");

    const pathname = new URL(req.url, "http://localhost").pathname;
    // Dashboard frontend
if (pathname === "/" && req.method === "GET") {
    const dashboardPath = path.join(
        __dirname,
        "public",
        "index.html"
    );

    return fs.readFile(dashboardPath, (error, content) => {
        if (error) {
            console.error("Dashboard loading error:", error);

            res.writeHead(500, {
                "Content-Type": "application/json"
            });

            return res.end(JSON.stringify({
                error: "Dashboard could not be loaded"
            }));
        }

        res.writeHead(200, {
            "Content-Type": "text/html; charset=utf-8"
        });

        res.end(content);
    });
}

    // Health endpoint
    if (pathname === "/health") {
        res.writeHead(200);
        return res.end(JSON.stringify({
            status: "UP",
            application: "SAP BTP Enterprise Monitor"
        }));
    }

    // Readiness endpoint
    if (pathname === "/ready") {
        res.writeHead(200);
        return res.end(JSON.stringify({
            status: "READY"
        }));
    }

    // Application status endpoint
    if (pathname === "/api/status") {
        res.writeHead(200);
        return res.end(JSON.stringify({
            project: "SAP BTP Enterprise Monitor",
            environment: "Cloud Foundry",
            application: "Running",
            timestamp: new Date().toISOString()
        }));
    }

    // SAP BTP Destination connectivity test
    if (pathname === "/api/connectivity/test") {
            // Local environment check
        if (!process.env.VCAP_SERVICES) {
             res.writeHead(200);
             return res.end(JSON.stringify({
                 status: "NOT_CONFIGURED",
                 environment: "LOCAL",
                 destination: "ENTERPRISE_MONITOR_TEST",
                 message: "SAP BTP Destination is not configured locally",
                 timestamp: new Date().toISOString()
        }));
    }

        try {
            const { getDestination } =
                require("@sap-cloud-sdk/connectivity");

            const { executeHttpRequest } =
                require("@sap-cloud-sdk/http-client");

            const destination = await getDestination({
                destinationName: "ENTERPRISE_MONITOR_TEST"
            });

            if (!destination) {
                throw new Error("Destination not found");
            }

            const response = await executeHttpRequest(
                destination,
                {
                    method: "GET",
                    url: "/get"
                }
            );

            res.writeHead(200);
            return res.end(JSON.stringify({
                status: "SUCCESS",
                destination: "ENTERPRISE_MONITOR_TEST",
                httpStatus: response.status,
                message: "Destination connectivity successful",
                timestamp: new Date().toISOString()
            }));

        } catch (error) {
            console.error("Connectivity error:", error.message);

            res.writeHead(500);
            return res.end(JSON.stringify({
                status: "FAILED",
                message: error.message
            }));
        }
    }

    // Unknown endpoint
    res.writeHead(404);
    res.end(JSON.stringify({
        error: "Endpoint not found"
    }));
});

server.listen(PORT, "0.0.0.0", () => {
    console.log(`SAP BTP Monitor running on port ${PORT}`);
});

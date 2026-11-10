
const http = require("http");
const { URL } = require("url");

const PORT = process.env.PORT || 8080;

const server = http.createServer(async (req, res) => {
    res.setHeader("Content-Type", "application/json");

    const pathname = new URL(req.url, "http://localhost").pathname;

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

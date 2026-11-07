const test = require("node:test");
const assert = require("node:assert");

const BASE_URL = "http://localhost:8080";

test("Health endpoint should return UP", async () => {
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();

    assert.strictEqual(response.status, 200);
    assert.strictEqual(data.status, "UP");
});

test("Status endpoint should return application details", async () => {
    const response = await fetch(`${BASE_URL}/api/status`);
    const data = await response.json();

    assert.strictEqual(response.status, 200);
    assert.strictEqual(data.application, "Running");
});

test("Ready endpoint should return READY", async () => {
    const response = await fetch(`${BASE_URL}/ready`);
    const data = await response.json();

    assert.strictEqual(response.status, 200);
    assert.strictEqual(data.status, "READY");
});
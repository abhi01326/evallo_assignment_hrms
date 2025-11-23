(async () => {
  const base = process.env.BASE || "http://127.0.0.1:3000/api";
  const fetch = global.fetch || (await import("node-fetch")).default;

  try {
    console.log("Using base URL:", base);

    // Try to register (ignore conflict errors)
    try {
      const regRes = await fetch(`${base}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organisation_name: "TestOrg",
          email: "smoketest@example.com",
          password: "password",
        }),
      });
      console.log("/auth/register", regRes.status);
      const regBody = await regRes.text();
      console.log("register body:", regBody);
    } catch (regErr) {
      console.warn(
        "Register request failed (continuing):",
        regErr.message || regErr
      );
    }

    // Login
    const loginRes = await fetch(`${base}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "smoketest@example.com",
        password: "password",
      }),
    });
    console.log("/auth/login", loginRes.status);
    const loginBody = await loginRes.json().catch(() => null);
    console.log("login body:", loginBody);

    if (!loginBody || !loginBody.token) {
      console.error("Login failed or no token returned. Aborting smoke test.");
      process.exit(loginRes.status || 1);
    }

    const token = loginBody.token;

    // Fetch employees
    const empRes = await fetch(`${base}/employees`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("/employees", empRes.status);
    const empBody = await empRes.json().catch(() => null);
    console.log("employees body:", empBody);

    console.log("Smoke test completed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Smoke test failed:", err);
    process.exit(1);
  }
})();

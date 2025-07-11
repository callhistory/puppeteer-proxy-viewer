const express = require("express");
const puppeteer = require("puppeteer");
const { anonymizeProxy } = require("proxy-chain");

const app = express();
const PORT = process.env.PORT || 3000;

// LunaProxy credentials
const originalProxyUrl = 'http://user-Vickyu12_Z5pjL-region-us-sessid-usq58zqblt0se7py6e-sesstime-90:Vickyu12@na.lunaproxy.com:12233';

app.get("/render", async (req, res) => {
  let browser;
  try {
    // Create anonymized proxy that supports HTTPS tunneling
    const proxyUrl = await anonymizeProxy(originalProxyUrl);

    browser = await puppeteer.launch({
      headless: "new",
      args: [
        `--proxy-server=${proxyUrl}`,
        "--no-sandbox",
        "--disable-setuid-sandbox"
      ]
    });

    const page = await browser.newPage();

    await page.goto("https://1105.go.mglgamez.com/pregames", {
      waitUntil: "networkidle2",
      timeout: 60000
    });

    const html = await page.content();
    await browser.close();

    res.set("Content-Type", "text/html");
    res.send(html);
  } catch (err) {
    if (browser) await browser.close();
    console.error("Browser error:", err.message);
    res.status(500).send("Failed to load page: " + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

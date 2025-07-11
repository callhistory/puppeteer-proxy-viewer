const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 3000;

// Proxy info
const proxyHost = "na.lunaproxy.com";
const proxyPort = "12233";
const proxyUser = "user-Vickyu12_Z5pjL-region-us-sessid-usq58zqblt0se7py6e-sesstime-90";
const proxyPass = "Vickyu12";

app.get("/render", async (req, res) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        `--proxy-server=http://${proxyHost}:${proxyPort}`,
        "--no-sandbox",
        "--disable-setuid-sandbox"
      ]
    });

    const page = await browser.newPage();

    // Set proxy credentials
    await page.authenticate({
      username: proxyUser,
      password: proxyPass
    });

    await page.goto("https://1105.go.mglgamez.com/pregames", {
      waitUntil: "networkidle2",
      timeout: 60000
    });

    const html = await page.content();
    await browser.close();
    res.set("Content-Type", "text/html");
    res.send(html);

  } catch (error) {
    if (browser) await browser.close();
    res.status(500).send(`Failed to load page: ${error.message}`);
  }
});

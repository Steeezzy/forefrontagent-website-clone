/**
 * tools/crawl-site.js
 *
 * Usage:
 *   node tools/crawl-site.js --start=https://www.tidio.com --out=./data --max=10000 --concurrency=5 --delay=300 --subdomains=false
 *
 * Outputs:
 *   ./data/urls.json
 *   ./data/urls.csv
 *   ./data/sitemap.xml
 *
 * Notes: respects robots.txt; polite by default.
 */

import fs from "fs";
import path from "path";
import url from "url";
import axios from "axios";
import PQueue from "p-queue";
import * as cheerio from "cheerio";
import RobotsParser from "robots-parser";

import minimist from "minimist";

const argvRaw = process.argv.slice(2);
const CLI = minimist(argvRaw, {
    string: ["start", "out"],
    boolean: ["subdomains"],
    default: {
        start: "https://www.tidio.com",
        out: "./data",
        max: 20000,
        concurrency: 5,
        delay: 300,
        subdomains: false,
    },
});

const START_URL = CLI.start;
const OUT_DIR = path.resolve(CLI.out);
const MAX_PAGES = Number(CLI.max);
const CONCURRENCY = Number(CLI.concurrency);
const DELAY_MS = Number(CLI.delay);
const ALLOW_SUBDOMAINS = !!CLI.subdomains;

function normalizeUrl(u) {
    try {
        const parsed = new URL(u);
        // normalize: remove trailing slash unless root
        let pathname = parsed.pathname || "/";
        if (pathname !== "/" && pathname.endsWith("/")) pathname = pathname.slice(0, -1);
        parsed.pathname = pathname;
        // remove hash
        parsed.hash = "";
        // remove default ports
        if ((parsed.protocol === "http:" && parsed.port === "80") || (parsed.protocol === "https:" && parsed.port === "443")) parsed.port = "";
        return parsed.toString();
    } catch (err) {
        return null;
    }
}

function sameSite(targetUrl, baseHost) {
    try {
        const t = new URL(targetUrl);
        const b = new URL(baseHost);
        if (t.hostname === b.hostname) return true;
        if (ALLOW_SUBDOMAINS) {
            // allow subdomains of base domain (e.g., help.tidio.com when base is tidio.com)
            const baseParts = b.hostname.split(".").slice(-2).join(".");
            const targParts = t.hostname.split(".").slice(-2).join(".");
            return baseParts === targParts;
        }
        return false;
    } catch {
        return false;
    }
}

async function fetchRobotsTxt(startUrl) {
    try {
        const u = new URL(startUrl);
        const robotsUrl = `${u.protocol}//${u.host}/robots.txt`;
        const res = await axios.get(robotsUrl, { timeout: 10_000 });
        return RobotsParser(robotsUrl, res.data);
    } catch (err) {
        console.warn("No robots.txt or failed to fetch, proceeding with default (allow all).", err.message || err);
        return RobotsParser("", "User-agent: *\nAllow: /");
    }
}

(async function main() {
    console.log("Starting crawl:", START_URL);
    if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

    const robots = await fetchRobotsTxt(START_URL);

    const q = new PQueue({ concurrency: CONCURRENCY, interval: DELAY_MS, intervalCap: 1 });

    const seen = new Set();
    const results = [];

    const startNorm = normalizeUrl(START_URL);
    if (!startNorm) {
        console.error("Invalid --start URL");
        process.exit(1);
    }
    const baseUrl = new URL(startNorm).origin;

    async function enqueue(u) {
        const norm = normalizeUrl(u);
        if (!norm) return;
        if (seen.has(norm)) return;
        if (results.length >= MAX_PAGES) return;
        // check robots
        const pathPart = new URL(norm).pathname + (new URL(norm).search || "");
        if (!robots.isAllowed(norm, "*")) {
            // Respect robots
            // console.log("Blocked by robots:", norm);
            return;
        }
        if (!sameSite(norm, START_URL)) return;
        seen.add(norm);
        q.add(() => processPage(norm)).catch((e) => console.error("queue error", e));
    }

    async function processPage(u) {
        try {
            await new Promise((r) => setTimeout(r, DELAY_MS)); // extra polite delay
            const res = await axios.get(u, { timeout: 15000, headers: { "User-Agent": "ForefrontAgentSiteCrawler/1.0 (+https://yourdomain.example)" } });
            const ct = res.headers["content-type"] || "";
            if (!ct.includes("text/html")) {
                // skip non-html
                results.push({ url: u, contentType: ct, status: res.status });
                return;
            }
            const html = res.data;
            const $ = cheerio.load(html);
            results.push({ url: u, status: res.status, title: $("title").text().trim() || null });

            // Extract links
            const links = $("a[href]")
                .map((i, el) => $(el).attr("href"))
                .get()
                .filter(Boolean);

            for (let href of links) {
                try {
                    // normalize relative URLs
                    const abs = new URL(href, u).toString();
                    // ignore mailto:, tel:
                    if (abs.startsWith("mailto:") || abs.startsWith("tel:") || abs.startsWith("javascript:")) continue;
                    await enqueue(abs);
                } catch (e) {
                    // ignore bad urls
                }
            }
        } catch (err) {
            // still record attempted url
            results.push({ url: u, error: String(err?.message ?? err) });
        }
    }

    // kick off
    await enqueue(startNorm);

    // wait for queue to drain
    await q.onIdle();

    // finalize outputs
    const urls = results.map((r) => r.url).filter(Boolean);
    // dedupe while preserving order
    const dedup = Array.from(new Set(urls));

    // write JSON
    const jsonPath = path.join(OUT_DIR, "urls.json");
    fs.writeFileSync(jsonPath, JSON.stringify({ generatedAt: new Date().toISOString(), start: START_URL, count: dedup.length, urls: dedup, details: results }, null, 2));
    console.log("Wrote", jsonPath);

    // CSV
    const csvPath = path.join(OUT_DIR, "urls.csv");
    const csvLines = ["url"];
    for (const u of dedup) csvLines.push(u);
    fs.writeFileSync(csvPath, csvLines.join("\n"));
    console.log("Wrote", csvPath);

    // sitemap.xml (simple)
    const sitemapPath = path.join(OUT_DIR, "sitemap.xml");
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${dedup
            .map((u) => {
                return `<url><loc>${u}</loc><changefreq>weekly</changefreq></url>`;
            })
            .join("\n")}
  </urlset>`;
    fs.writeFileSync(sitemapPath, sitemap);
    console.log("Wrote", sitemapPath);

    console.log(`Crawl finished. Found ${dedup.length} unique URLs.`);

    process.exit(0);
})();

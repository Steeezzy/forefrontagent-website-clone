/**
 * tools/crawl-site.js
 *
 * Crawls a website and outputs:
 *   data/urls.json
 *   data/urls.csv
 *   data/sitemap.xml
 *
 * Usage:
 *   node tools/crawl-site.js --start=https://www.tidio.com --out=./data --max=20000 --concurrency=5 --delay=300 --subdomains=true
 *
 * Respects robots.txt and rate limits.
 */

import fs from "fs";
import path from "path";
import axios from "axios";
import * as cheerio from "cheerio";
import RobotsParser from "robots-parser";
import PQueue from "p-queue";
import minimist from "minimist";

const CLI = minimist(process.argv.slice(2), {
    string: ["start", "out"],
    boolean: ["subdomains"],
    default: {
        start: "https://www.tidio.com",
        out: "./data",
        max: 20000,
        concurrency: 5,
        delay: 300,
        subdomains: true,
    },
});

function normalizeUrl(u) {
    try {
        const parsed = new URL(u);
        parsed.hash = "";
        return parsed.toString().replace(/\/$/, "");
    } catch {
        return null;
    }
}

function isAllowedUrl(target, base, allowSubdomains) {
    try {
        const t = new URL(target);
        const b = new URL(base);
        if (t.hostname === b.hostname) return true;
        if (!allowSubdomains) return false;
        const baseParts = b.hostname.split(".").slice(-2).join(".");
        const targParts = t.hostname.split(".").slice(-2).join(".");
        return baseParts === targParts;
    } catch {
        return false;
    }
}

async function fetchRobots(startUrl) {
    try {
        const u = new URL(startUrl);
        const robotsUrl = `${u.protocol}//${u.host}/robots.txt`;
        const res = await axios.get(robotsUrl);
        return RobotsParser(robotsUrl, res.data);
    } catch {
        return RobotsParser("", "User-agent: *\nAllow: /");
    }
}

(async () => {
    const START_URL = CLI.start;
    const OUT_DIR = path.resolve(CLI.out);
    const MAX_PAGES = CLI.max;
    const CONCURRENCY = CLI.concurrency;
    const DELAY = CLI.delay;
    const ALLOW_SUBDOMAINS = CLI.subdomains;

    if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

    const robots = await fetchRobots(START_URL);

    const queue = new PQueue({ concurrency: CONCURRENCY, interval: DELAY, intervalCap: 1 });

    const seen = new Set();
    const result = [];

    async function crawlPage(url) {
        try {
            const res = await axios.get(url, { timeout: 15000 });
            const html = res.data;
            const $ = cheerio.load(html);
            result.push({ url, status: res.status });

            $("a[href]").each((i, el) => {
                const href = $(el).attr("href");
                if (!href) return;
                try {
                    const abs = new URL(href, url).toString();
                    enqueue(abs);
                } catch { }
            });
        } catch (err) {
            result.push({ url, error: String(err.message || err) });
        }
    }

    function enqueue(url) {
        const norm = normalizeUrl(url);
        if (!norm || seen.has(norm) || seen.size >= MAX_PAGES) return;

        if (!robots.isAllowed(norm, "*")) return;
        if (!isAllowedUrl(norm, START_URL, ALLOW_SUBDOMAINS)) return;

        seen.add(norm);
        queue.add(() => crawlPage(norm));
    }

    enqueue(START_URL);
    await queue.onIdle();

    const urls = Array.from(seen);

    fs.writeFileSync(
        path.join(OUT_DIR, "urls.json"),
        JSON.stringify({ count: urls.length, urls, details: result }, null, 2)
    );

    fs.writeFileSync(
        path.join(OUT_DIR, "urls.csv"),
        ["url", ...urls].join("\n")
    );

    const sitemap = `
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `<url><loc>${u}</loc></url>`).join("\n")}
</urlset>
`;
    fs.writeFileSync(path.join(OUT_DIR, "sitemap.xml"), sitemap.trim());

    console.log("Crawl completed. URLs found:", urls.length);
})();

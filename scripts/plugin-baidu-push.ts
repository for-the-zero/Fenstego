import type { Plugin } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';
import yaml from 'js-yaml';
import https from 'https';
import http from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const CACHE_FILE = path.join(root, '.baidu-push-cache.json');

interface BaiduConfig {
    site: string;
    token: string;
};
interface BlogItem { filename: string; title?: string; date?: string };

const BATCH_SIZE = 10;

function loadCache(): Set<string> {
    try {
        if (fs.existsSync(CACHE_FILE)) {
            return new Set<string>(JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8')));
        };
    } catch {};
    return new Set<string>();
};

function saveCache(urls: string[]): void {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(urls, null, 2), 'utf-8');
};

export function collectUrls(root: string, hostname: string): string[] {
    const blogList = (yaml.load(fs.readFileSync(path.join(root, 'configs/blog.yaml'), 'utf-8')) as BlogItem[]) ?? [];
    const base = hostname.replace(/\/$/, '');
    const urls: string[] = [];

    const htmlFiles = globSync('src/**/*.html', { cwd: root, ignore: ['src/blog/posts/template.html'] });
    for (const f of htmlFiles) {
        const rel = path.relative('src', f).replace(/\\/g, '/');
        const filename = path.basename(f);
        let loc: string;
        if (filename === 'index.html') {
            const dirPath = path.dirname(rel);
            loc = dirPath === '.' ? '/' : '/' + dirPath.replace(/\\/g, '/') + '/';
        } else {
            loc = '/' + rel.replace(/\\/g, '/');
        };
        urls.push(`${base}${loc}`);
    };

    for (const it of blogList) {
        if (!it.filename) continue;
        urls.push(`${base}/blog/posts/${it.filename}/`);
    };

    return [...new Set(urls)];
};

async function sendBatch(batch: string[], site: string, token: string): Promise<void> {
    const body = batch.join('\n');
    const u = new URL(`http://data.zz.baidu.com/urls?site=${encodeURIComponent(site)}&token=${encodeURIComponent(token)}`);
    const mod = u.protocol === 'https:' ? https : http;
    const options = {
        hostname: u.hostname,
        port: u.port || (u.protocol === 'https:' ? 443 : 80),
        path: u.pathname + u.search,
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
            'Content-Length': Buffer.byteLength(body),
        },
    };

    let resData: { status: number; data: string } | null = null;
    try {
        resData = await new Promise<{ status: number; data: string }>((resolve, reject) => {
            const req = mod.request(options, (res) => {
                let data = '';
                res.on('data', (chunk: Buffer) => { data += chunk.toString(); });
                res.on('error', reject);
                res.on('end', () => {
                    resolve({ status: res.statusCode || 0, data });
                });
            });
            req.on('error', reject);
            req.write(body);
            req.end();
        });
    } catch (e: any) {
        console.error(`[baidu-push] 请求失败:`, e.message ?? e);
        return;
    };
    const { status, data } = resData;

    try {
        const parsed = JSON.parse(data);
        console.log(`[baidu-push] 成功 (${batch.length} URLs)`);
        console.log(parsed);
    } catch {
        console.log(data)
        console.log(`[baidu-push] Response (${status}): ${data}`);
    };
};

export async function pushUrls(urls: string[], site: string, token: string): Promise<void> {
    const cached = loadCache();
    const newUrls = urls.filter(u => !cached.has(u));

    if (newUrls.length === 0) {
        console.log(`[baidu-push] All ${urls.length} URLs already pushed, nothing to do.`);
        return;
    };

    const total = newUrls.length;
    console.log(`[baidu-push] ${total} new URLs out of ${urls.length} total, pushing in batches of ${BATCH_SIZE}...`);
    for (let i = 0; i < total; i += BATCH_SIZE) {
        const batch = newUrls.slice(i, i + BATCH_SIZE);
        console.log(`[baidu-push] Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(total / BATCH_SIZE)} (${batch.length} URLs)...`);
        await sendBatch(batch, site, token);
    };
    saveCache(urls);
    console.log(`[baidu-push] All ${total} new URLs submitted, cache updated.`);
};

export function viteBaiduPush(opts: { hostname: string; baidu: BaiduConfig | false }): Plugin {
    const { hostname, baidu } = opts;
    if (!baidu) {
        return {
            name: 'vite-baidu-push',
            apply: 'build',
        };
    };
    const { site, token } = baidu;
    return {
        name: 'vite-baidu-push',
        apply: 'build',
        closeBundle() {
            const urls = collectUrls(root, hostname);
            pushUrls(urls, site, token).catch(e => console.error(`[baidu-push] 推送失败:`, e));
        },
    };
};

if (process.argv[1] && (
    path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))
    || path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url).replace(/\.ts$/, '.js'))
)) {
    interface RootConfig { baidu_submit?: BaiduConfig | false; sitemap?: { hostname?: string } };
    const raw = yaml.load(fs.readFileSync(path.join(root, 'configs/config.yaml'), 'utf-8')) as RootConfig;
    const baidu = raw.baidu_submit;
    if (!baidu) {
        console.log('[baidu-push] baidu_submit not configured, skipping.');
    } else {
        const hostname = raw.sitemap?.hostname;
        if (!hostname) {
            console.log('[baidu-push] sitemap.hostname not configured, skipping.');
        } else {
            const urls = collectUrls(root, hostname);
            pushUrls(urls, baidu.site, baidu.token).catch(e => {
                console.error('[baidu-push] 推送失败:', e);
                process.exit(1);
            });
        };
    };
};

import type { Plugin } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';
import yaml from 'js-yaml';
import https from 'https';
import http from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface BaiduConfig {
    site: string;
    token: string;
};
interface BlogItem { filename: string; title?: string; date?: string };

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
        async closeBundle() {
            const root = path.resolve(__dirname, '..');
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

            const uniqueUrls = [...new Set(urls)];
            const body = uniqueUrls.join('\n');

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

            console.log(`[baidu-push] Submitting ${uniqueUrls.length} URLs to Baidu...`);

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
                console.log(`[baidu-push] 成功`);
                console.log(parsed);
            } catch {
                console.log(data)
                console.log(`[baidu-push] Response (${status}): ${data}`);
            };
        },
    };
};

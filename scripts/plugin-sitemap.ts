import { createRequire } from 'module'; const require = createRequire(import.meta.url);
import type { Plugin, ResolvedConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import { execSync } from 'child_process';

interface BlogItem { filename: string; title?: string; date?: string }
interface MetaItem { path: string; title: string }

export function viteSitemapMulti(opts: {
    hostname: string;
    is_hostname_netlify: boolean;
    alternatives?: string[];
    default_lang?: null | 'zh-CN' | 'en' | 'both';
    baseOutDir: string;
}): Plugin {
    let config: ResolvedConfig;
    const { hostname, is_hostname_netlify, alternatives, default_lang, baseOutDir } = opts;
    const gitTime = (file: string): Date | null => {
        try {
            const t = execSync(`git log --diff-filter=A --follow --format=%at -- "${file}" | tail -1`, {
                encoding: 'utf8',
                cwd: path.resolve(__dirname, '..'),
            }).trim();
            return t ? new Date(Number(t) * 1000) : null;
        } catch { return null; };
    };
    const loadYaml = <T>(p: string): T | null =>
        fs.existsSync(p) ? yaml.load(fs.readFileSync(p, 'utf-8')) as T : null;
    return {
        name: 'vite-sitemap-multi',
        apply: 'build',
        configResolved(c) { config = c; },
        closeBundle() {
            const root = path.resolve(__dirname, '..');
            const outDir = path.resolve(root, baseOutDir);
            const blogList: BlogItem[] = loadYaml(path.join(root, 'configs/blog.yaml')) ?? [];
            const metaList: MetaItem[] = loadYaml(path.join(root, 'configs/meta.yaml')) ?? [];
            type UrlItem = { loc: string; lastmod?: Date };
            const urlMap = new Map<string, UrlItem>();
            for (const f of require('glob').sync('src/**/*.html', { ignore: ['src/blog/posts/template.html', 'src/404.html'] })) {
                const rel = path.relative('src', f).replace(/\\/g, '/');
                const filename = path.basename(f);
                if (filename === 'index.html') {
                    const dirPath = path.dirname(rel);
                    const loc = dirPath === '.' ? '/' : '/' + dirPath.replace(/\\/g, '/') + '/';
                    urlMap.set(loc, { loc });
                } else {
                    const loc = '/' + rel.replace(/\\/g, '/');
                    urlMap.set(loc, { loc });
                };
            };
            for (const it of blogList) {
                if (!it.filename) continue;
                const mdFile = path.join(root, `posts/${it.filename}.md`);
                const date = it.date ? new Date(it.date) : gitTime(mdFile) ?? fs.statSync(mdFile).ctime;
                urlMap.set(`/blog/posts/${it.filename}/`, { loc: `/blog/posts/${it.filename}/`, lastmod: date });
            };
            if (default_lang) {
                const pathsToProcess = ['/blog/', '/links/'];
                if (default_lang === 'zh-CN' || default_lang === 'en') {
                    for (const path of pathsToProcess) {
                        const entry = urlMap.get(path);
                        if (entry) {
                            const newLoc = `${path}?lang=${default_lang}`;
                            urlMap.delete(path);
                            urlMap.set(newLoc, { ...entry, loc: newLoc });
                        };
                    };
                } else if (default_lang === 'both') {
                    for (const path of pathsToProcess) {
                        const entry = urlMap.get(path);
                        if (entry) {
                            urlMap.delete(path);
                            const zhLoc = `${path}?lang=zh-CN`;
                            urlMap.set(zhLoc, { ...entry, loc: zhLoc });
                            const enLoc = `${path}?lang=en`;
                            urlMap.set(enLoc, { ...entry, loc: enLoc });
                        };
                    };
                };
            };
            const multi = alternatives && alternatives.length > 0;
            const lines: string[] = [];
            lines.push('<?xml version="1.0" encoding="UTF-8"?>');
            lines.push(multi
                ? '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
                : '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

            for (const u of urlMap.values()) {
                lines.push('  <url>');
                const base = hostname.replace(/\/$/, '');
                const isHtmlFile = u.loc.endsWith('.html');
                let finalLoc = u.loc;
                if (!isHtmlFile) {
                    const queryIndex = finalLoc.indexOf('?');
                    let pathPart = finalLoc;
                    let queryPart = '';
                    if (queryIndex !== -1) {
                        pathPart = finalLoc.substring(0, queryIndex);
                        queryPart = finalLoc.substring(queryIndex);
                    };
                    if (!pathPart.endsWith('/')) {
                        pathPart += '/';
                    };
                    finalLoc = pathPart + queryPart;
                };
                if (is_hostname_netlify) {
                    finalLoc = finalLoc.toLowerCase();
                };
                const main = encodeURI(base + finalLoc);
                lines.push(`    <loc>${main}</loc>`);
                if (u.lastmod) {
                    const year = u.lastmod.getFullYear();
                    const month = String(u.lastmod.getMonth() + 1).padStart(2, '0');
                    const day = String(u.lastmod.getDate()).padStart(2, '0');
                    lines.push(`    <lastmod>${year}-${month}-${day}</lastmod>`);
                }
                if (multi) {
                    for (const h of alternatives!) {
                        const href = encodeURI(`${h.replace(/\/$/, '')}${finalLoc}`);
                        lines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${href}" />`);
                    };
                };
                lines.push('  </url>');
            };
            lines.push('</urlset>');
            const file = path.join(outDir, 'sitemap.xml');
            fs.mkdirSync(path.dirname(file), { recursive: true });
            fs.writeFileSync(file, lines.join('\n'), 'utf-8');
            console.log(`[sitemap-multi] sitemap.xml generated at ${file}`);
            const notFoundHtmlPath = path.join(outDir, '404.html');
            if (fs.existsSync(notFoundHtmlPath)) {
                try {
                    let htmlContent = fs.readFileSync(notFoundHtmlPath, 'utf-8');
                    const allHostnames = [hostname, ...(alternatives || [])];
                    const scriptTag = `<script id="hostnames" type="application/json">${JSON.stringify(allHostnames)}</script>`;
                    if (htmlContent.includes('</body>')) {
                        htmlContent = htmlContent.replace('</body>', `${scriptTag}\n</body>`);
                    } else {
                        htmlContent += `\n${scriptTag}`;
                    };
                    fs.writeFileSync(notFoundHtmlPath, htmlContent, 'utf-8');
                    console.log(`[sitemap-multi] Injected hostnames into ${notFoundHtmlPath}`);
                } catch (error) {
                    console.error(`[sitemap-multi] Failed to inject hostnames into 404.html:`, error);
                };
            } else {
                config.logger.warn(`[sitemap-multi] 404.html not found in output directory, skipping hostname injection.`);
            };
        },
    };
};
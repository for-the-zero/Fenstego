import type { Plugin } from 'vite';
import path from 'path';
import fs from 'fs';
import { glob } from 'glob';

export function viteServerUrlFix(): Plugin {
    const projectRoot = path.resolve(__dirname, '..');
    return {
        name: 'vite-server-url-fix',
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                const url = req.url || '';
                const urlWithoutQuery = url.split('?')[0];
                if (urlWithoutQuery.match(/^\/blog\/posts\/[^/]+\/template\.ts$/)) {
                    req.url = '/blog/posts/template.ts' + (url.includes('?') ? url.substring(url.indexOf('?')) : '');
                    return next();
                };
                if (urlWithoutQuery.match(/^\/blog\/posts\/[^/]+\/template\.css$/)) {
                    const cssPath = path.resolve(projectRoot, 'src/blog/posts/template.css');
                    if (fs.existsSync(cssPath)) {
                        res.writeHead(200, { 'Content-Type': 'text/css' });
                        res.end(fs.readFileSync(cssPath, 'utf-8'));
                        return;
                    };
                };
                if (/^\/(?:blog(?:\/posts(?:\/[^/]+)?)?|intro|links)(?:\/)?$/g.test(url) && !urlWithoutQuery.includes('.')) {
                    const newUrl = url.replace(/\/?$/, '/');
                    if (newUrl !== url) {
                        res.writeHead(302, { Location: newUrl });
                        res.end();
                        return;
                    };
                };
                next();
            });
        }
    };
};

export function viteCopyImagesPlugin(): Plugin {
    const projectRoot = path.resolve(__dirname, '..');
    return {
        name: 'vite-copy-images',
        closeBundle() {
            const imgDir = path.join(projectRoot, 'posts/img');
            const destDir = path.join(projectRoot, 'dist/blog/img');
            if (fs.existsSync(imgDir)) {
                if (!fs.existsSync(destDir)) {
                    fs.mkdirSync(destDir, { recursive: true });
                }
                const files = fs.readdirSync(imgDir);
                files.forEach(file => {
                    const src = path.join(imgDir, file);
                    const dest = path.join(destDir, file);
                    fs.copyFileSync(src, dest);
                });
            }
        }
    };
}
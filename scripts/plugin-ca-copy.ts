import path from 'path';
import fs from 'fs';

const rootDir = path.resolve(__dirname, '..');

function runCopy(srcDir: string, outDir: string) {
    if (!fs.existsSync(srcDir)) {
        return;
    };
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    };
    const files = fs.readdirSync(srcDir);
    files.forEach((file: any) => {
        fs.copyFileSync(path.join(srcDir, file), path.join(outDir, file));
    });
};

export function copyCaAssets() {
    return {
        name: 'copy-ca-copy',
        configureServer: (server: any) => {
            server.middlewares.use(async (req: any, res: any, next: any) => {
                const url = req.url || '';
                if (url.startsWith('/assets/bg/')) {
                    const fileName = url.replace('/assets/bg/', '');
                    const filePath = path.resolve(rootDir, 'configs/bg', fileName);
                    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                        const ext = path.extname(filePath);
                        const contentType = ext === '.svg' ? 'image/svg+xml' : ext === '.png' ? 'image/png' : 'application/octet-stream';
                        res.setHeader('Content-Type', contentType);
                        res.end(fs.readFileSync(filePath));
                        return;
                    };
                };
                if (url.startsWith('/assets/intro/')) {
                    const fileName = url.replace('/assets/intro/', '');
                    const filePath = path.resolve(rootDir, 'configs/intro', fileName);
                    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                        const ext = path.extname(filePath);
                        const contentType = ext === '.svg' ? 'image/svg+xml' : ext === '.png' ? 'image/png' : 'application/octet-stream';
                        res.setHeader('Content-Type', contentType);
                        res.end(fs.readFileSync(filePath));
                        return;
                    };
                };
                next();
            });
        },
        closeBundle: () => {
            runCopy(path.resolve(rootDir, 'configs/intro'), path.resolve(rootDir, 'dist/assets/intro'));
            runCopy(path.resolve(rootDir, 'configs/bg'), path.resolve(rootDir, 'dist/assets/bg'));
        }
    };
};
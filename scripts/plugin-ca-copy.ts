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

function findFile(fileName: string) {
    const configPath = path.resolve(rootDir, 'configs', fileName);
    if (fs.existsSync(configPath) && fs.statSync(configPath).isFile()) {
        return configPath;
    };
    const srcPath = path.resolve(rootDir, 'src/assets', fileName);
    if (fs.existsSync(srcPath) && fs.statSync(srcPath).isFile()) {
        return srcPath;
    };
    return null;
};

function copySingleFile(srcFile: string, outFile: string) {
    if (!fs.existsSync(srcFile)) {
        return;
    };
    const outDir = path.dirname(outFile);
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    };
    fs.copyFileSync(srcFile, outFile);
};

function copyOrFallback(fileName: string, outPath: string) {
    const srcFile = findFile(fileName);
    if (srcFile) {
        copySingleFile(srcFile, outPath);
    };
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
                if (url === '/README.md') {
                    const filePath = findFile('README.md');
                    if (filePath) {
                        res.setHeader('Content-Type', 'text/markdown');
                        res.end(fs.readFileSync(filePath));
                        return;
                    };
                };
                if (url === '/assets/avatar.png') {
                    const filePath = findFile('avatar.png');
                    if (filePath) {
                        res.setHeader('Content-Type', 'image/png');
                        res.end(fs.readFileSync(filePath));
                        return;
                    };
                };
                if (url === '/assets/icon.svg') {
                    const filePath = findFile('icon.svg');
                    if (filePath) {
                        res.setHeader('Content-Type', 'image/svg+xml');
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
            copyOrFallback('README.md', path.resolve(rootDir, 'dist/README.md'));
            copyOrFallback('avatar.png', path.resolve(rootDir, 'dist/assets/avatar.png'));
            copyOrFallback('icon.svg', path.resolve(rootDir, 'dist/assets/icon.svg'));
        }
    };
};
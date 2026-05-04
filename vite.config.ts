import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import { glob } from 'glob';
import yaml from '@modyfi/vite-plugin-yaml';
import jsYaml from 'js-yaml';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { markdownBlog } from './scripts/plugin-posts';
import { viteMeta } from './scripts/plugin-meta';
import { viteSitemapMulti } from './scripts/plugin-sitemap';
import { viteExtendHead } from './scripts/plugin-head';
import { viteRssFeed } from './scripts/plugin-rss';
import { viteSeoArea } from './scripts/plugin-seo-area';
import { viteServerUrlFix, viteCopyImagesPlugin } from './scripts/vite-server-url-fix';
import { copyCaAssets } from './scripts/plugin-ca-copy';

const configPath = path.resolve(__dirname, 'configs/config.yaml');
const config = jsYaml.load(fs.readFileSync(configPath, 'utf8')) as any;


const htmlEntries = glob.sync('src/**/*.html', {
  ignore: ['src/blog/posts/template.html']
}).reduce((acc, file) => {
  const relativePath = path.relative('src', file);
  const name = relativePath.replace(/\.html$/, '').replace(/\\/g, '/');
  acc[name] = path.resolve(__dirname, file);
  return acc;
}, {} as Record<string, string>);
const postEntries = glob.sync('posts/*.md').reduce((acc, file) => {
  const name = path.basename(file, '.md');
  acc[`blog/posts/${name}/index`] = path.resolve(__dirname, 'src/blog/posts/template.ts');
  return acc;
}, {} as Record<string, string>);
const allEntries = {
  ...htmlEntries,
  ...postEntries
};

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: allEntries,
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name.startsWith('blog/posts/')) {
            return '[name].js';
          };
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const extname = path.extname(assetInfo.name || '');
          if (extname === '.css') {
            return 'assets/[name]-[hash][extname]';
          };
          return 'assets/[name]-[hash][extname]';
        }
      },
      checks: {
        eval: false
      }
    }
  },
  server: {
    host: "0.0.0.0",
    fs: {
      allow: ['..']
    }
  },
  base: './',
  plugins: [
    copyCaAssets(),
    viteServerUrlFix(),
    viteCopyImagesPlugin(),
    viteMeta(),
    yaml(),
    markdownBlog({
      inject: config.blog?.head_inject || [],
      suffix: config.blog?.suffix || ''
    }),
    viteStaticCopy({
      targets: [
        {
          src: 'vercel.json',
          dest: ''
        },
        ...(fs.existsSync('src/README.md') ? [{
          src: 'README.md',
          dest: ''
        }] : [])
      ],
      silent: true
    }),
    viteSitemapMulti({
      hostname: config.sitemap?.hostname || '',
      is_hostname_netlify: config.sitemap?.is_hostname_netlify || false,
      alternatives: config.sitemap?.alternatives || [],
      default_lang: config.sitemap?.default_lang,
      baseOutDir: 'dist'
    }),
    viteRssFeed({
      hostname: config.rss?.hostname || '',
      feedTitle: config.rss?.title || '',
      feedDescription: config.rss?.description || '',
      copyright: config.rss?.copyright || '',
      author: config.rss?.author || ''
    }),
    viteExtendHead({
      heads: config.head?.global || [],
      home: config.head?.home || []
    }),
    viteSeoArea()
  ],
});
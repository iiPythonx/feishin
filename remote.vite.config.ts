import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, normalizePath } from 'vite';
import { ViteEjsPlugin } from 'vite-plugin-ejs';

import { version } from './package.json';

export default defineConfig({
    build: {
        emptyOutDir: true,
        outDir: path.resolve(__dirname, './out/remote'),
        rollupOptions: {
            input: {
                favicon: normalizePath(path.resolve(__dirname, './assets/icons/favicon.ico')),
                index: normalizePath(path.resolve(__dirname, './src/remote/index.html')),
                manifest: normalizePath(path.resolve(__dirname, './src/remote/manifest.json')),
                remote: normalizePath(path.resolve(__dirname, './src/remote/index.tsx')),
                worker: normalizePath(path.resolve(__dirname, './src/remote/service-worker.ts')),
            },
            output: {
                assetFileNames: '[name].[ext]',
                chunkFileNames: '[name].js',
                entryFileNames: '[name].js',
            },
        },
        sourcemap: true,
    },
    css: {
        modules: {
            generateScopedName: 'fs-[name]-[local]',
            localsConvention: 'camelCase',
        },
    },
    plugins: [
        react(),
        ViteEjsPlugin({
            prod: process.env.NODE_ENV === 'production',
            root: normalizePath(path.resolve(__dirname, './src/remote')),
            version,
        }),
    ],
    resolve: {
        alias: {
            '/@/i18n': path.resolve(__dirname, './src/i18n'),
            '/@/remote': path.resolve(__dirname, './src/remote'),
            '/@/renderer': path.resolve(__dirname, './src/renderer'),
            '/@/shared': path.resolve(__dirname, './src/shared'),
        },
    },
    root: path.resolve(__dirname, './src/remote'),
});

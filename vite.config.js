import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
    appType: 'custom',
    plugins: [
        {
            name: 'custom-routing',
            configureServer(server) {
                server.middlewares.use((req, res, next) => {
                    const url = (req.url || '').split('?')[0];
                    const tryIndex = path.join('public', url, 'index.html');
                    if (fs.existsSync(tryIndex)) {
                        req.url = url + '/index.html';
                        return next();
                    }
                    next();
                });

                return () => {
                    server.middlewares.use(async (req, res, next) => {
                        const accept = req.headers.accept || '';
                        if (req.method !== 'GET' || !accept.includes('text/html')) {
                            return next();
                        }

                        const url = (req.url || '').split('?')[0];

                        const knownPaths = ['/', '/index.html', '/logs', '/rules', '/help', '/resources', '/signal'];
                        const isKnown = knownPaths.includes(url)
                            || fs.existsSync(path.join('public', url))
                            || fs.existsSync(path.join('.', url));

                        if (isKnown) {
                            const indexHtml = fs.readFileSync(path.resolve('index.html'), 'utf-8');
                            const transformed = await server.transformIndexHtml(url, indexHtml);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'text/html');
                            res.end(transformed);
                        } else {
                            const notFoundPath = path.resolve('404.html');
                            res.statusCode = 404;
                            res.setHeader('Content-Type', 'text/html');
                            res.end(fs.readFileSync(notFoundPath, 'utf-8'));
                        }
                    });
                };
            },
        },
        react(),
    ],
});
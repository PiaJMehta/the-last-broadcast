import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
    // Disable Vite's default SPA fallback so unknown routes don't get index.html
    appType: 'custom',
    plugins: [
        {
            name: 'custom-routing',
            configureServer(server) {
                // PRE-middleware: rewrite mystery routes BEFORE Vite processes them
                server.middlewares.use((req, res, next) => {
                    const url = (req.url || '').split('?')[0];

                    // Rewrite /sector-7 → /sector-7/index.html (served from public/)
                    const tryIndex = path.join('public', url, 'index.html');
                    if (fs.existsSync(tryIndex)) {
                        req.url = url + '/index.html';
                        return next();
                    }

                    next();
                });

                // POST-middleware: handle SPA fallback + 404
                return () => {
                    server.middlewares.use(async (req, res, next) => {
                        const accept = req.headers.accept || '';
                        if (req.method !== 'GET' || !accept.includes('text/html')) {
                            return next();
                        }

                        const url = (req.url || '').split('?')[0];

                        // Check if this is a known route (root, or a file that exists)
                        const knownPaths = ['/', '/index.html'];
                        const isKnown = knownPaths.includes(url)
                            || fs.existsSync(path.join('public', url))
                            || fs.existsSync(path.join('.', url));

                        if (isKnown) {
                            // Serve the SPA index.html via Vite's transform pipeline
                            const indexHtml = fs.readFileSync(path.resolve('index.html'), 'utf-8');
                            const transformed = await server.transformIndexHtml(url, indexHtml);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'text/html');
                            res.end(transformed);
                        } else {
                            // Unknown route → serve styled 404 page
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

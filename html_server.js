const http = require('http'); // http: This is a built-in Node.js module that allows us to create a web server.
const fs = require('fs'); // fs: This is a built-in Node.js module that allows us to read files from our computer.
const path = require('path');

const hostname = '0.0.0.0';
const port = 8080;

const server = http.createServer((request, response) => { //creates a web server - callback function that runs whenever someone requests a file from the server.
    const filePath = request.url === '/' ? 'index.html' : request.url.substring(1);
    const ext = path.extname(filePath).toLowerCase();

    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';
    const readEncoding = contentType.startsWith('text/') || contentType === 'application/javascript' ? 'utf8' : null;

    fs.readFile(filePath, readEncoding, (err, data) => {
        if (err) {
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.end('404 Not Found');
        } else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(data);
        }
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://localhost:${port}`);
});

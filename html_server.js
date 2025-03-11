const http = require('http'); // http: This is a built-in Node.js module that allows us to create a web server.
const fs = require('fs'); // fs: This is a built-in Node.js module that allows us to read files from our computer.

const hostname = '0.0.0.0';
const port = 8080;

const server = http.createServer((request, response) => { //creates a web server - callback function that runs whenever someone requests a file from the server.
    const file = request.url === '/' ? 'index.html' : request.url.substring(1);
    const type = file.endsWith('.css') ? 'text/css' :
                 file.endsWith('.js') ? 'application/javascript' : 'text/html';

    fs.readFile(file, 'utf8', (err, data) => {
        response.writeHead(err ? 404 : 200, { "Content-Type": type });
        response.end(err ? "404 Not Found" : data);
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://localhost:${port}`);
});

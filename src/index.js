const http = require('http')
const { bodyParser } = require('./lib/bodyParser')

let database = []

function getTaskHandler(req,res) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(database));
    res.end();
}

async function createTaskHandler(req, res) {
    try {
        await bodyParser(req);
        database.push(req.body)
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(database));
        res.end();
    } catch (e) {
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.write('Invalid data');
        res.end();
    }
}

async function updateTaskHandler(req, res) {
    try {
        const {url} = req;
        const idQuery = url.split("?")[1];
        const idKey = idQuery.split("=")[0];
        const idValue = idQuery.split("=")[1];
        if(idKey === "id"){
            await bodyParser(req);
            database[idValue - 1] = req.body;
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify(database));
            res.end();
        } else {
            res.writeHead(400, {'Content-Type': 'text/plain'});
            res.write('Invalid request query');
            res.end();
        }
    } catch (e) {
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.write('Invalid body data was provided', e.message);
        res.end();
    }
}

async function deleteTaskHandler(req, res) {
    try {
        const {url} = req;
        const idQuery = url.split("?")[1];
        const idKey = idQuery.split("=")[0];
        const idValue = idQuery.split("=")[1];
        if(idKey === "id"){
            database.splice(idValue - 1, 1);
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write('Delete successfully');
            res.end();
        } else {
            res.writeHead(400, {'Content-Type': 'text/plain'});
            res.write('Invalid query');
            res.end();
        }
    } catch (e) {
        res.writeHead(400, {'Content-Type': 'text/plain'});
        res.write('Invalid body data was provided', e.message);
        res.end();
    }
}

const server = http.createServer((req, res) => {

    const { url, method } = req;

    // Logger

    console.log(`URL: ${url} - Method: ${method}`);

    // Routes

    switch (method) {
        case "GET":
            if(url === "/"){
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(JSON.stringify({message: 'Hello World'}));
                res.end();
            }
            if(url === "/tasks")
                getTaskHandler(req, res);
            break;

        case "POST":
            if(url === '/tasks')
                createTaskHandler(req, res);
            break;

        case "PUT":
            updateTaskHandler(req, res);
            break;
        
        case "DELETE":
            deleteTaskHandler(req, res);
            break;
    
        default:
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write('404 Not found');
            res.end();
    }

})

server.listen(3000);
console.log(`Server on port 3000`)
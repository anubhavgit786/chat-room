const net = require('net');
const port = 3008;
const hostname = 'localhost';

// an array of client sockets
const clients = [];

const server = net.createServer();

server.on("connection", (socket)=>
{
    console.log("A new connection was established with server");

    const clientId = clients.length + 1;
    const client = { id: clientId.toString(), socket }; 

    clients.forEach((client) => 
    {
        client.socket.write(`User ${clientId} joined the chat room!`);
    });

    socket.write(`id-${clientId}`);

    socket.on("data", (data)=>
    {
        const dataString = data.toString("utf-8");
        const id = dataString.substring(0, dataString.indexOf("-"));
        const message = dataString.substring(dataString.indexOf("-message-") + 9);
        clients.map((client)=> 
        {
            client.socket.write(`> User ${id}: ${message}`);
        });
    });

    socket.on("end", ()=>
    {
        clients.forEach((client) => 
        {
            client.socket.write(`User ${client.id} left the chat room!`);
        });
    });

    socket.on("error", () => 
    {
        clients.forEach((client) => 
        {
            client.socket.write(`User ${client.id} left the chat room!`);
        });
    });

    clients.push(client);
})

//start the server
server.listen(port,hostname, function(err)
{
    if(err)
    {
        console.log(err);
        return;
    }

    console.log(this.address());

    console.log(`Server is up and running at http://${hostname}:${port}`);
});


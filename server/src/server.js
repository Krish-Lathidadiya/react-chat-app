const app = require("./app");
const http = require('http');
const setupSocket = require("./socket");

// Create HTTP server instance using Express app
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Setup Socket.IO with the created server instance
setupSocket(server);

// Start listening on the specified port
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

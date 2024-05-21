const socket = require("socket.io");
const allowedOrigins = require("./config/allowedOrigins");
const chat = require("./models/Chat");
var app = require("./app");
require("dotenv").config();

const PORT = 8081;
const server = app.listen(PORT, () => {
	console.log(`Server started on port:${PORT}`);
});

const io = socket(server, {
	cors: {
		origin: allowedOrigins,
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	chat.chatSocketFunctions(socket);
});

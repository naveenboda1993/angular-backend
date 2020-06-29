class Socket {
	constructor(socket) {
		this.io = socket
		console.log('------constructor ___________________', this.io);
	}

	socketEvents() {
		this.io.on('connect', (socket) => {
			console.log('success ::::::::::::::::::::::::::::::::::::');
			console.log('new user connected :', socket.id);
		});
	}

	sendNotification(toSocketId, toUserId, category, notification, receivedTime, unreadCount ) {
		let data = {
			ReceiverId: toUserId,
			Category: category,
			Notification: notification,
			ReceivedTime: receivedTime,
			UnreadCount: unreadCount,
		};
		// io.sockets.emit('AAA');
		this.io.to(toSocketId).emit('notification', data);
	}

	socketConfig() {
		console.log('---------- YOYOYO ___________________', this.io);
		this.io.use(async (socket, next) => {
			let userId = socket.request._query['userid'];
			let role = socket.request._query['role'];
			let userSocketId = socket.id;
			console.log('/////////////////// user id', userId);
			console.log('/////////////////// role', role);
			console.log('/////////////////// socket id', userSocketId);
			this.socketEvents();
		});
	}
}

module.exports = Socket;
import { io } from 'socket.io-client';
const token = localStorage.getItem('jwt_access_token');

export const socket = io(process.env.REACT_APP_BASE_BACKEND, {
    query: { token },
    path: '/socket',
    reconnection: true,
    transports: ['websocket', 'polling'],
    reconnectionAttempts:5
}); // Replace this with your server URL

export const connectSocket = () => {
    socket.on('connect', () => {

        console.log('Connected to server');

    });
};

export const emitUpdateStatus = (data) => {
    socket.emit("updateStatus", data);

}

export const emitOffline = () => {
    socket.emit("userlogout");
};

export const emitUser = (data) => {
    socket.emit('connectedUser', data);
};

export const emitRefreshPost = (data) => {
    socket.emit('refreshPost', data);
};

export const emitEmailAndNotification = (data) => {
    socket.emit('emitEmailAndNotification', data);
};

export const emitNotification = (data) => {
    socket.emit('emitNotification', data);
};

export const emitSendChat = (message) => {
    socket.emit("emitSendChat", message);
};

export const emitGetUsers = () => {
    socket.emit("emitGetUsers");
};

export const emitSendPanelChat = (message) => {
    socket.emit("emitSendPanelChat", message);
};


// New function to explicitly mark a message as seen
export const markMessageAsSeen = (messageIdOrIds) => {
    const messageIds = Array.isArray(messageIdOrIds) ? messageIdOrIds : [messageIdOrIds];
    socket.emit('messageRead', messageIds);
    console.log("Marked messages as seen:", messageIds);
};

// Event listener for receiveMessage event
socket.on("receiveMessage", (message) => {
    console.log("New message received:", message);
});

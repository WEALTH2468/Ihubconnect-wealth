import { selectSocket } from 'app/store/socketSlice';
import { useSelector } from 'react-redux';

const useEmit = () => {
  const socket = useSelector(selectSocket);

  if (!socket) {
    console.warn('Socket is not available. Ensure it is initialized before using emits.');
  }

  // Emit functions
  const emitUpdateStatus = (data) => {
    if (socket) socket.emit('updateStatus', data);
  };

  const emitOffline = () => {
    if (socket) socket.emit('userlogout');
  };

  const emitRefreshPost = (data) => {
    if (socket) socket.emit('refreshPost', data);
  };

  const emitEmailAndNotification = (data) => {
    if (socket) socket.emit('emitEmailAndNotification', data);
  };

  const emitNotification = (data) => {
    if (socket) socket.emit('emitNotification', data);
  };

  const emitSendChat = (message) => {
    if (socket) socket.emit('emitSendChat', message);
  };

  const emitGetUsers = () => {
    if (socket) socket.emit('emitGetUsers');
  };

  const emitSendPanelChat = (message) => {
    if (socket) socket.emit('emitSendPanelChat', message);
  };

  return {
    emitUpdateStatus,
    emitOffline,
    emitRefreshPost,
    emitEmailAndNotification,
    emitNotification,
    emitSendChat,
    emitGetUsers,
    emitSendPanelChat,
  };
};

export default useEmit;

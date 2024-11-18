
import React from 'react'
import addBackendProtocol from '../../addBackendProtocol';

export default function useDestopNotification() {
    const showNotification = (data) => {
        const body = {
            idesk:"New interesting post on idesk",
            chat: data.content,
            file: "You are given access to a new file",
            task: "You have a new task"
        }
        if (Notification.permission === "granted") {
            const options = {
                body: body[data.subject],
                icon: addBackendProtocol(data.image)
            };
    
            const notification = new Notification(`${data.subject.toUpperCase()} NOTIFICATION`, options);
            notification.onclick = (event) => {
                event.preventDefault();//Prevent the browser from focusing the Notification's tab
                window.open(`${ process.env.REACT_APP_BASE_FRONTEND + data.link}`);
            };
        } else {
            alert("Notification permission is not granted");
        }
    };
  return {showNotification}
}

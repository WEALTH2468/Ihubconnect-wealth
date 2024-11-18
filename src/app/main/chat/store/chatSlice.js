import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { emitSendChat } from 'src/app/websocket/socket';

export const getChat = createAsyncThunk(
  'chatApp/chat/getChat',
  async (contactId, { dispatch, getState }) => {
    const response = await axios.get(`/chat/messages/${contactId}`);
    const data = await response.data;
    return data;
  }
);

export const sendMessage = createAsyncThunk(
  'chatApp/chat/sendMessage',
  async ({ messageText, chatId, contactId, subject, avatar, link }, { dispatch, getState }) => {
    const{data} = await axios.post(`/chat/send/${contactId}`, {
      messageText,
      subject,
      avatar,
      link
    });
    emitSendChat(data);
    return data;
  }
);

const chatSlice = createSlice({
  name: 'chatApp/chat',
  initialState: [],
  reducers: {
    removeChat: (state, action) => action.payload,
    addMessage: (state, action) => [...state, action.payload]
  },

  extraReducers: (builder) => {
    builder.addCase(getChat.fulfilled, (state, action) => action.payload,) 
    builder.addCase(sendMessage.fulfilled, (state, { payload }) => {
      return payload.chat ? [...state, payload.message] : [...state, payload]
     }) 
  },
});

export const selectChat = ({ chatApp }) => chatApp.chat;

export const { removeChat, addMessage } = chatSlice.actions;

export default chatSlice.reducer;

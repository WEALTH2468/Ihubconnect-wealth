import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';

import axios from 'axios';
import { closeChatPanel } from './stateSlice';

export const getPanelContacts = createAsyncThunk(
  'chatPanel/contacts/getContacts',
  async (params) => {
    const response = await axios.get('/chat/contacts', { params });

    const data = await response.data;

    return data;
  }
);

const contactsAdapter = createEntityAdapter({
  selectId: (entity) => entity._id,
});

export const {
  selectAll: selectPanelContacts,
  selectById: selectPanelContactById,
} = contactsAdapter.getSelectors((state) => state.chatPanel.contacts);

const contactsSlice = createSlice({
  name: 'chatPanel/contacts',
  initialState: contactsAdapter.getInitialState({
    selectedPanelContactId: null,
  }),
  reducers: {
    setSelectedContactId: (state, action) => {
      state.selectedPanelContactId = action.payload;
    },
    removeSelectedContactId: (state, action) => {
      state.selectedPanelContactId = null;
    },
    updatePanelStatus: (state, { payload }) => {
      contactsAdapter.updateOne(state, {
        id: payload.userId,
        changes: {
          status: payload.status,
        },
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPanelContacts.fulfilled, contactsAdapter.setAll);
    builder.addCase(closeChatPanel, (state, action) => {
      state.selectedPanelContactId = null;
    });
  },
});

export const {
  updatePanelStatus,
  setSelectedContactId,
  removeSelectedContactId,
} = contactsSlice.actions;

export const selectSelectedPanelContactId = ({ chatPanel }) =>
  chatPanel.contacts.selectedPanelContactId;

export default contactsSlice.reducer;

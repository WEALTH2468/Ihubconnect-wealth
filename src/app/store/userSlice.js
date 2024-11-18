/* eslint import/no-extraneous-dependencies: off */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import history from '@history';
import _ from '@lodash';
import { setInitialSettings } from 'app/store/fuse/settingsSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import settingsConfig from 'app/configs/settingsConfig';
import jwtService from '../auth/services/jwtService';
import { emitGetUsers, emitOffline, emitUser } from '../websocket/socket';
import { getUsers } from '../main/settings/users/store/usersSlice';
import { getLogo } from '../main/settings/users/store/settingsSlice';
import { getDepartments, getUnits } from '../store/settingsSlice';
import { getRoles } from '../store/roleSlice';
import { updateUser } from '../main/settings/users/store/userSlice';
import axios from 'axios';
import { getContacts } from '../main/chat/store/contactsSlice';

export const getUser = createAsyncThunk(
    'user/getUser',
    async (id, { dispatch, getState }) => {
    
        const response = await axios.get(`/ihub/users/${id}`);
        return response.data;
    }
  );
  
export const setUser = createAsyncThunk(
  'user/setUser',
  async (user, { dispatch, getState }) => {
    /*
    You can redirect the logged-in user to a specific route depending on his role
    */
    dispatch(getUsers());
    dispatch(getDepartments());
    dispatch(getUnits());
    dispatch(getRoles());
    dispatch(getLogo());
    dispatch(getContacts());
    emitUser({ userId: user._id, displayName: user.displayName });
    emitGetUsers()

    if (user.loginRedirectUrl) {
      settingsConfig.loginRedirectUrl = user.loginRedirectUrl; // for example 'apps/academy'
    }

    return user;
  }
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post('/ihub/forgetpassword', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `/ihub/reset-password/${formData.token}`,
        formData
      );
      console.log('response: ', response);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUserSettings = createAsyncThunk(
  'user/updateSettings',
  async (settings, { dispatch, getState }) => {
    const { user } = getState();
    const newUser = _.merge({}, user, { data: { settings } });

    dispatch(updateUserData(newUser));

    return newUser;
  }
);

export const updateUserShortcuts = createAsyncThunk(
  'user/updateShortucts',
  async (shortcuts, { dispatch, getState }) => {
    const { user } = getState();
    const newUser = {
      ...user,
      data: {
        ...user.data,
        shortcuts,
      },
    };

    dispatch(updateUserData(newUser));

    return newUser;
  }
);

export const logoutUser = () => async (dispatch, getState) => {
  const { user } = getState();
  emitOffline();
  if (!user.role || user.role.length === 0) {
    // is guest
    return null;
  }

  history.push({
    pathname: '/',
  });
  dispatch(setInitialSettings());

  return dispatch(userLoggedOut());
};

export const updateUserData = (data) => async (dispatch, getState) => {
  // if (!user.role || user.role.length === 0) {
  //   // is guest
  //   return;
  // }
  jwtService
    .updateUserData(data)
    .then((user) => {
      const { updatedUser, message } = user.data;

      if (updatedUser.newPassword) {
        return dispatch(userLoggedOut());
      }

      dispatch(setUser(updatedUser));

      dispatch(showMessage({ variant: 'success', message }));

      history.push({
        pathname: '/',
      });
    })
    .catch((error) => {
      console.log(error);
      dispatch(showMessage({ message: error.response.data[0].message }));
    });
};

const initialState = {
  role: [], // guest
  displayName: 'John Doe',
  photoURL: 'assets/images/avatars/brian-hughes.jpg',
  email: 'johndoe@withinpixels.com',
  shortcuts: ['apps.calendar', 'apps.mailbox', 'apps.contacts', 'apps.tasks'],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLoggedOut: (state, action) => initialState,
  },
  extraReducers: {
    [updateUserSettings.fulfilled]: (state, action) => action.payload,
    [updateUserShortcuts.fulfilled]: (state, action) => action.payload,
    [setUser.fulfilled]: (state, action) => action.payload,
    [getUser.fulfilled]: (state, action) => action.payload,
    [forgotPassword.fulfilled]: (state, action) => action.payload,
    [resetPassword.fulfilled]: (state, action) => action.payload,
  },
});

export const { userLoggedOut } = userSlice.actions;

export const selectUser = ({ user }) => user;

export const selectUserShortcuts = ({ user }) => user.data.shortcuts;

export default userSlice.reducer;

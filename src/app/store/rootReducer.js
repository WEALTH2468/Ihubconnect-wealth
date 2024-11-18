import { combineReducers } from '@reduxjs/toolkit';
import fuse from './fuse';
import i18n from './i18nSlice';
import roles from './roleSlice';
import user from './userSlice';
import settings from './settingsSlice';
import logo from '../main/settings/users/store/settingsSlice';

const createReducer = (asyncReducers) => (state, action) => {
    const combinedReducer = combineReducers({
        fuse,
        i18n,
        user,
        roles,
        settings,
        logo,
        ...asyncReducers,
    });

    /*
	Reset the redux store when user logged out
	 */
    if (action.type === 'user/userLoggedOut') {
        // state = undefined;
    }

    return combinedReducer(state, action);
};

export default createReducer;

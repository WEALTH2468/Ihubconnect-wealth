// Import necessary modules and components from various libraries
import '@mock-api';
import BrowserRouter from '@fuse/core/BrowserRouter';
import FuseLayout from '@fuse/core/FuseLayout';
import FuseTheme from '@fuse/core/FuseTheme';
import { SnackbarProvider } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import rtlPlugin from 'stylis-plugin-rtl';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { selectCurrentLanguageDirection } from 'app/store/i18nSlice';
import { selectUser } from 'app/store/userSlice';
import themeLayouts from 'app/theme-layouts/themeLayouts';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import FuseAuthorization from '@fuse/core/FuseAuthorization';
import settingsConfig from 'app/configs/settingsConfig';
import withAppProviders from './withAppProviders';
import { AuthProvider } from './auth/AuthContext';
import axios from 'axios';
import { useEffect } from 'react';
import { logoutUser } from 'app/store/userSlice';

// Import WebSocket-related functions and actions
import { emitOffline, socket } from './websocket/socket';
import { getRoles, selectRoleById } from './store/roleSlice';
import { getUsers } from './main/settings/users/store/usersSlice';
import { getDepartments, getUnits } from './store/settingsSlice';
import { getLogo } from './main/settings/users/store/settingsSlice';
import { getPosts } from './main/idesk/sub-apps/idesk/store/postSlice';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Axios HTTP Request defaults
axios.defaults.baseURL = process.env.REACT_APP_BASE_BACKEND;

// Options for emotion cache, supporting RTL and LTR
const emotionCacheOptions = {
  rtl: {
    key: 'muirtl',
    stylisPlugins: [rtlPlugin],
    insertionPoint: document.getElementById('emotion-insertion-point'),
  },
  ltr: {
    key: 'muiltr',
    stylisPlugins: [],
    insertionPoint: document.getElementById('emotion-insertion-point'),
  },
};

function App() {
  // Hook to dispatch actions in Redux
  const dispatch = useDispatch();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 120000,
        gcTime: 120000,
        refetchInterval: 120000,
        refetchOnReconnect: 'always',
      },
    },
  });

  // Selectors to access state from the Redux store
  const user = useSelector(selectUser);
  const langDirection = useSelector(selectCurrentLanguageDirection);
  const mainTheme = useSelector(selectMainTheme);
  const role = useSelector((state) => selectRoleById(state, user.roleId));

  // Effect to handle online and offline events
  // useEffect(() => {
  //   const handleOnline = () => {
  //     dispatch(logoutUser());
  //   };

  //   const handleOffline = () => {
  //     emitOffline();
  //   };

  //   // Add event listeners for online and offline
  //   window.addEventListener('online', handleOnline);
  //   window.addEventListener('offline', handleOffline);

  //   // Cleanup event listeners on component unmount
  //   return () => {
  //     window.removeEventListener('online', handleOnline);
  //     window.removeEventListener('offline', handleOffline);
  //   };
  // }, [dispatch]);

  // Function to handle updating status
  const handleGetUsers = () => {
    dispatch(getUsers());
    dispatch(getPosts());
  };

  useEffect(() => {
    socket?.on('emitGetUsers', handleGetUsers);

    return () => {
      socket?.off('emitGetUsers', handleGetUsers);
    };
  }, [socket]);

  const handleUpdateStatus = (data) => {
    //dispatch(updatePanelStatus({ userId: data.userId, status: data.status }));
  };

  // Effect to handle online status updates via WebSocket
  useEffect(() => {
    socket?.on('updateStatus', handleUpdateStatus);

    return () => {
      socket?.off('updateStatus', handleUpdateStatus);
    };
  }, [socket]);

  useEffect(() => {
    socket?.on('online', handleUpdateStatus);

    return () => {
      socket?.off('online', handleUpdateStatus);
    };
  }, [socket]);

  // Effect to handle offline status updates via WebSocket
  useEffect(() => {
    socket?.on('offline', handleUpdateStatus);
    return () => {
      socket?.off('offline', handleUpdateStatus);
    };
  }, [socket]);

  // Effect to fetch initial data when the component mounts
  useEffect(() => {
    dispatch(getUnits());
    dispatch(getRoles());
    dispatch(getUsers());
    dispatch(getLogo());
  }, [dispatch]);

  // Render the application with necessary providers and components
  return (
    <QueryClientProvider client={queryClient}>
      <CacheProvider value={createCache(emotionCacheOptions[langDirection])}>
        <FuseTheme theme={mainTheme} direction={langDirection}>
          <AuthProvider>
            <BrowserRouter>
              <FuseAuthorization
                userRole={role ? role.name.toLowerCase() : user.role}
                loginRedirectUrl={settingsConfig.loginRedirectUrl}
              >
                <SnackbarProvider
                  maxSnack={5}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  classes={{
                    containerRoot:
                      'bottom-0 right-0 mb-52 md:mb-68 mr-8 lg:mr-80 z-99',
                  }}
                >
                  <FuseLayout layouts={themeLayouts} />
                </SnackbarProvider>
              </FuseAuthorization>
            </BrowserRouter>
          </AuthProvider>
        </FuseTheme>
      </CacheProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

// Export the App component wrapped with application providers
export default withAppProviders(App)();

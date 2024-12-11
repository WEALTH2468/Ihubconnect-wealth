import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import { Navigate } from 'react-router-dom';
import SignInConfig from '../main/sign-in/SignInConfig';
import SignUpConfig from '../main/sign-up/SignUpConfig';
import SignOutConfig from '../main/sign-out/SignOutConfig';
import Error404Page from '../main/404/Error404Page';
import TemplateConfig from '../main/app-template/config/TemplateConfig';
import IdeskConfig from '../main/idesk/config/IdeskConfig';
import ProfileTabConfig from '../main/idesk/sub-apps/profile/config/ProfileTabConfig';
import ForgotPasswordConfig from '../main/forgot-password/ForgotPasswordConfig';
import settingsConfig from 'app/configs/settingsConfig';
import UsersAppConfig from '../main/settings/users/config/UsersAppConfig';
import VerifiedEmailConfig from '../main/verified-email/verifiedEmailConfig';



import ChatAppConfig from '../main/chat/ChatAppConfig'

const routeConfigs = [
  SignOutConfig,
  SignInConfig,
  SignUpConfig,
  TemplateConfig,
  IdeskConfig,
  ProfileTabConfig,
  ChatAppConfig,
  UsersAppConfig,
  ForgotPasswordConfig,
    VerifiedEmailConfig,

];

const routes = [
    ...FuseUtils.generateRoutesFromConfigs(
        routeConfigs,
        settingsConfig.defaultAuth
    ),
    {
        path: '/',
        element: <Navigate to="/idesk" />,
        // auth: settingsConfig.defaultAuth,  does nothing for now
    },
    {
        path: 'loading',
        element: <FuseLoading />,
    },
    {
        path: '404',
        element: <Error404Page />,
    },
    {
        path: '*',
        element: <Navigate to="404" />,
    },
];

export default routes;

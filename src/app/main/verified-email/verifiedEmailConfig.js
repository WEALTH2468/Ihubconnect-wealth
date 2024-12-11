import VerificationPage from "./verifiedEmailPage";
import authRoles from '../../auth/authRoles';


const VerifiedEmailConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar: {
          display: false,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: '/auth/verify-email',
      element: <VerificationPage />,
    },
  ],

  routes: [
    {
      path: '/auth',
      children: [
        {
          path: 'verify-email',
          element: <VerificationPage />,
        },
      ],
    },
  ],
};

export default VerifiedEmailConfig;

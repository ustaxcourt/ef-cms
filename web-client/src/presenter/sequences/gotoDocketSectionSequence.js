import isLoggedIn from '../actions/isLoggedInAction';
import setPath from '../actions/setPathAction';
import navigateToLogin from '../actions/navigateToLoginAction';
import setWorkItems from '../actions/setWorkItemsAction';
import getWorkItemsForSection from '../actions/getWorkItemsForSectionAction';

export default [
  isLoggedIn,
  {
    unauthorized: [setPath, navigateToLogin],
    isLoggedIn: [
      getWorkItemsForSection('docket'),
      {
        success: [setWorkItems],
      },
    ],
  },
];

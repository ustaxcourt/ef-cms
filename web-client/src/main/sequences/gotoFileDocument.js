import clearAlerts from '../actions/clearAlerts';
import clearDocument from '../actions/clearDocument';
import setCurrentPage from '../actions/setCurrentPage';
import getCase from '../actions/getCase';
import getUserRole from '../actions/getUserRole';
import setCase from '../actions/setCase';

export default [
  clearAlerts,
  clearDocument,
  getCase,
  setCase,
  getUserRole,
  {
    respondent: [setCurrentPage('FileDocument')],
  },
];

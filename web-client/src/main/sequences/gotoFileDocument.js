import clearAlerts from '../actions/clearAlerts';
import clearDocument from '../actions/clearDocument';
import setCurrentPage from '../actions/setCurrentPage';

export default [clearAlerts, clearDocument, setCurrentPage('FileDocument')];

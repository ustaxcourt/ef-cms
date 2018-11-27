import clearAlerts from '../actions/clearAlerts';
import clearPetition from '../actions/clearPetition';
import setCurrentPage from '../actions/setCurrentPage';

export const gotoFilePetition = [
  clearAlerts,
  clearPetition,
  setCurrentPage('FilePetition'),
];

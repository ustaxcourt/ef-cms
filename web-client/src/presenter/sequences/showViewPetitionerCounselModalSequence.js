import { clearModalAction } from '../actions/clearModalAction';
import { setContactOnModalAction } from '../actions/setContactOnModalAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const showViewPetitionerCounselModalSequence = [
  clearModalAction,
  setContactOnModalAction,
  setShowModalFactoryAction('ViewPetitionerCounselModal'),
];

import { clearModalAction } from '../actions/clearModalAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const showViewPetitionerCounselModalSequence = [
  clearModalAction,
  setShowModalFactoryAction('ViewPetitionerCounselModal'),
];

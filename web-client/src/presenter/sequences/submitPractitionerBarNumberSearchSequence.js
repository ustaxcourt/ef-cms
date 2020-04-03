import { clearPractitionerDetailAction } from '../actions/clearPractitionerDetailAction';
import { getFormValueBarNumberAction } from '../actions/getFormValueBarNumberAction';
import { getPractitionerDetailAction } from '../actions/getPractitionerDetailAction';
import { hasPractitionerDetailAction } from '../actions/hasPractitionerDetailAction';
import { navigateToPractitionerDetailSequence } from './navigateToPractitionerDetailSequence';
import { setPractitionerDetailAction } from '../actions/setPractitionerDetailAction';
import { setPractitionerResultsAction } from '../actions/AdvancedSearch/setPractitionerResultsAction';

export const submitPractitionerBarNumberSearchSequence = [
  clearPractitionerDetailAction,
  getFormValueBarNumberAction,
  getPractitionerDetailAction,
  hasPractitionerDetailAction,
  {
    noResults: [setPractitionerResultsAction],
    success: [
      setPractitionerDetailAction,
      ...navigateToPractitionerDetailSequence,
    ],
  },
];

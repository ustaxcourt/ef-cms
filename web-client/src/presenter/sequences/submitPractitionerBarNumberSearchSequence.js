import { getFormValueBarNumberAction } from '../actions/getFormValueBarNumberAction';
import { getPractitionerDetailAction } from '../actions/getPractitionerDetailAction';
import { hasPractitionerDetailAction } from '../actions/hasPractitionerDetailAction';
import { setPractitionerDetailAction } from '../actions/setPractitionerDetailAction';

import { gotoPractitionerDetailSequence } from './gotoPractitionerDetailSequence';

export const submitPractitionerBarNumberSearchSequence = [
  // TODO: clear practitionerDetail?
  getFormValueBarNumberAction,
  getFormValueBarNumberAction,
  getPractitionerDetailAction,
  hasPractitionerDetailAction,
  {
    noResults: [],
    success: [setPractitionerDetailAction, ...gotoPractitionerDetailSequence],
  },
];

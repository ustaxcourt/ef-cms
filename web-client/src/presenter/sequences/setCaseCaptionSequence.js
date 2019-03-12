import { props, state } from 'cerebral';

import { set } from 'cerebral/factories';

export const setCaseCaptionSequence = [
  set(state.caseCaption, props.caseCaption),
];

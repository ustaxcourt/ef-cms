import { getShouldRedirectToSigningAction } from '../actions/getShouldRedirectToSigningAction';
import { navigateToMessageDetailAction } from '../actions/navigateToMessageDetailAction';
import { navigateToSignOrderAction } from '../actions/navigateToSignOrderAction';
import { submitCourtIssuedOrderSequenceFactory } from './submitCourtIssuedOrderSequence';

const redirectAfterSubmit = [
  getShouldRedirectToSigningAction,
  {
    no: navigateToMessageDetailAction,
    yes: navigateToSignOrderAction,
  },
];

export const submitCourtIssuedOrderForMessageSequence = submitCourtIssuedOrderSequenceFactory(
  redirectAfterSubmit,
);

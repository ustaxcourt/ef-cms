import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';

export const gotoPrintPaperTrialNoticesSequence = [
  // TODO: Fetch trial session data
  setupCurrentPageAction('PrintPaperTrialNotices'),
];

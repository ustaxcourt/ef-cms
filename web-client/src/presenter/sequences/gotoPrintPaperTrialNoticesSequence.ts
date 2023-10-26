import { sequence } from 'cerebral';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';

export const gotoPrintPaperTrialNoticesSequence = sequence<{
  fileId: string;
  trialSessionId: string;
}>([
  // TODO: Fetch trial session data
  // TODO: Fetch use the id to get pdf and set 
  // setupPrintPaperTrialNoticesData
  // async (props: ActionProps) => {
  //   const pdfPreviewUrl = await applicationContext
  //     .getUseCases()
  //     .getPdfDownloadUrlInteractor();
  // },
  setupCurrentPageAction('PrintPaperTrialNotices'),
]);

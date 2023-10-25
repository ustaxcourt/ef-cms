import { sequence } from 'cerebral';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';

export const gotoPrintPaperTrialNoticesSequence = sequence<{
  fileId: string;
  trialSessionId: string;
}>([
  // TODO: Fetch trial session data
  // setupPrintPaperTrialNoticesData
  async (props: ActionProps) => {
    const pdfPreviewUrl = await applicationContext
      .getUseCases()
      .getPdfDownloadUrlInteractor();
  },
  setupCurrentPageAction('PrintPaperTrialNotices'),
]);

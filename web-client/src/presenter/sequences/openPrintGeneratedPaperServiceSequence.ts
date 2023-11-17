import { setReprintPaperServicePdfsModalFormAction } from '@web-client/presenter/actions/TrialSession/setReprintPaperServicePdfsModalFormAction';
import { setShowModalFactoryAction } from '@web-client/presenter/actions/setShowModalFactoryAction';

export const openPrintGeneratedPaperServiceSequence = [
  setReprintPaperServicePdfsModalFormAction,
  setShowModalFactoryAction('ReprintPaperServiceDocumentsModal'),
];

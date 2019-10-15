import { completeDocketEntryQCAction } from '../actions/EditDocketRecord/completeDocketEntryQCAction';
import { computeCertificateOfServiceFormDateAction } from '../actions/FileDocument/computeCertificateOfServiceFormDateAction';
import { computeDateReceivedAction } from '../actions/DocketEntry/computeDateReceivedAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';

export const completeDocketEntryQCSequence = [
  setCurrentPageAction('Interstitial'),
  computeDateReceivedAction,
  computeCertificateOfServiceFormDateAction,
  completeDocketEntryQCAction,
  setCaseAction,
  navigateToCaseDetailAction,
];

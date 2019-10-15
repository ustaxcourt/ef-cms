import { completeDocketEntryQCAction } from '../actions/EditDocketRecord/completeDocketEntryQCAction';
import { computeCertificateOfServiceFormDateAction } from '../actions/FileDocument/computeCertificateOfServiceFormDateAction';
import { computeDateReceivedAction } from '../actions/DocketEntry/computeDateReceivedAction';
import { setCaseAction } from '../actions/setCaseAction';

export const completeDocketEntryQCSequence = [
  computeDateReceivedAction,
  computeCertificateOfServiceFormDateAction,
  completeDocketEntryQCAction,
  setCaseAction,
];

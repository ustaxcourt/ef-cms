import { DocketEntry } from '../../shared/src/business/entities/DocketEntry';
import {
  calculateDifferenceInDays,
  calculateISODate,
  createEndOfDayISO,
  createISODateString,
  createStartOfDayISO,
  formatDateString,
  formatNow,
  prepareDateFromString,
} from '../../shared/src/business/utilities/DateHandler';
import { combineTwoPdfs } from '../../shared/src/business/utilities/documentGenerators/combineTwoPdfs';
import {
  compareCasesByDocketNumber,
  formatCase as formatCaseForTrialSession,
  getFormattedTrialSessionDetails,
} from '../../shared/src/business/utilities/getFormattedTrialSessionDetails';
import {
  compareISODateStrings,
  compareStrings,
} from '../../shared/src/business/utilities/sortFunctions';
import { copyPagesAndAppendToTargetPdf } from '../../shared/src/business/utilities/copyPagesAndAppendToTargetPdf';
import { formatJudgeName } from '../../shared/src/business/utilities/getFormattedJudgeName';
import {
  getAddressPhoneDiff,
  getDocumentTypeForAddressChange,
} from '../../shared/src/business/utilities/generateChangeOfAddressTemplate';
import { getCropBox } from '../../shared/src/business/utilities/getCropBox';
import { getDescriptionDisplay } from '../../shared/src/business/utilities/getDescriptionDisplay';
import {
  getDocQcSectionForUser,
  getWorkQueueFilters,
} from '../../shared/src/business/utilities/getWorkQueueFilters';
import { getDocumentTitleWithAdditionalInfo } from '../../shared/src/business/utilities/getDocumentTitleWithAdditionalInfo';
import { getFormattedCaseDetail } from '../../shared/src/business/utilities/getFormattedCaseDetail';
import { getStampBoxCoordinates } from '../../shared/src/business/utilities/getStampBoxCoordinates';
import {
  isLeadCase,
  isSealedCase,
} from '../../shared/src/business/entities/cases/Case';
import { scrapePdfContents } from '../../shared/src/business/utilities/scrapePdfContents';
import { serveCaseDocument } from '../../shared/src/business/utilities/serveCaseDocument';
import { setConsolidationFlagsForDisplay } from '../../shared/src/business/utilities/setConsolidationFlagsForDisplay';
import { setServiceIndicatorsForCase } from '../../shared/src/business/utilities/setServiceIndicatorsForCase';
import { setupPdfDocument } from '../../shared/src/business/utilities/setupPdfDocument';
import { sleep } from '../../shared/src/business/utilities/sleep';
import { uploadToS3 } from '../../shared/src/business/utilities/uploadToS3';

const utilities = {
  calculateDifferenceInDays,
  calculateISODate,
  combineTwoPdfs,
  compareCasesByDocketNumber,
  compareISODateStrings,
  compareStrings,
  copyPagesAndAppendToTargetPdf,
  createEndOfDayISO,
  createISODateString,
  createStartOfDayISO,
  formatCaseForTrialSession,
  formatDateString,
  formatJudgeName,
  formatNow,
  getAddressPhoneDiff,
  getCropBox,
  getDescriptionDisplay,
  getDocQcSectionForUser,
  getDocumentTitleWithAdditionalInfo,
  getDocumentTypeForAddressChange,
  getFormattedCaseDetail,
  getFormattedTrialSessionDetails,
  getStampBoxCoordinates,
  getWorkQueueFilters,
  isLeadCase,
  isPending: DocketEntry.isPending,
  isSealedCase,
  prepareDateFromString,
  scrapePdfContents,
  serveCaseDocument,
  setConsolidationFlagsForDisplay,
  setServiceIndicatorsForCase,
  setupPdfDocument,
  sleep,
  uploadToS3,
};

export const getUtilities = () => utilities;

type _IGetUtilities = typeof getUtilities;

declare global {
  interface IGetUtilities extends _IGetUtilities {}
}

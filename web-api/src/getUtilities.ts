import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { abbreviateState } from '@shared/business/utilities/abbreviateState';
import { calculateDaysElapsedSinceLastStatusChange } from '@shared/business/utilities/calculateDaysElapsedSinceLastStatusChange';
import {
  calculateDifferenceInDays,
  calculateISODate,
  createEndOfDayISO,
  createISODateString,
  createStartOfDayISO,
  deconstructDate,
  formatDateString,
  formatNow,
  prepareDateFromString,
  isValidPastDate,
} from '@shared/business/utilities/DateHandler';
import { caseStatusWithTrialInformation } from '@shared/business/utilities/caseStatusWithTrialInformation';
import { combineAllPdfDocuments } from '@shared/business/utilities/pdfs/combineAllPdfDocuments';
import { combineTwoPdfs } from '@shared/business/utilities/pdfs/combineTwoPdfs';
import {
  compareCasesByDocketNumber,
  getFormattedTrialSessionDetails,
} from '@shared/business/utilities/trialSession/getFormattedTrialSessionDetails';
import {
  compareISODateStrings,
  compareStrings,
} from '@shared/business/utilities/sortFunctions';
import { copyPagesAndAppendToTargetPdf } from '@web-api/business/utilities/copyPagesAndAppendToTargetPdf';
import { documentUrlTranslator } from '@web-api/utilities/documentUrlTranslator';
import { formatJudgeName } from '@shared/business/utilities/getFormattedJudgeName';
import { formatPendingItem } from '@shared/business/utilities/formatPendingItem';
import {
  getAddressPhoneDiff,
  getDocumentTypeForAddressChange,
} from '@shared/business/utilities/generateChangeOfAddressTemplate';
import { getCaseDocumentsIdsFilteredByDocumentType } from '@shared/business/utilities/getCaseDocumentsIdsFilteredByDocumentType';
import { getCropBox } from '@shared/business/utilities/getCropBox';
import { getDescriptionDisplay } from '@shared/business/utilities/getDescriptionDisplay';
import { getDocketEntriesByFilter } from '@shared/business/utilities/getDocketEntriesByFilter';
import { getDocumentTitleWithAdditionalInfo } from '@shared/business/utilities/getDocumentTitleWithAdditionalInfo';
import { getFormattedCaseDetail } from '@shared/business/utilities/getFormattedCaseDetail';
import { getSealedDocketEntryTooltip } from '@shared/business/utilities/getSealedDocketEntryTooltip';
import { getStampBoxCoordinates } from '@shared/business/utilities/getStampBoxCoordinates';
import { isLeadCase, isSealedCase } from '@shared/business/entities/cases/Case';
import { scrapePdfContents } from '@shared/business/utilities/scrapePdfContents';
import { serveCaseDocument } from '@shared/business/utilities/serveCaseDocument';
import { setConsolidationFlagsForDisplay } from '@shared/business/utilities/setConsolidationFlagsForDisplay';
import { setupPdfDocument } from '@shared/business/utilities/setupPdfDocument';
import { sleep } from '@shared/tools/helpers';

const utilities = {
  abbreviateState,
  calculateDaysElapsedSinceLastStatusChange,
  calculateDifferenceInDays,
  calculateISODate,
  caseStatusWithTrialInformation,
  combineAllPdfDocuments,
  combineTwoPdfs,
  compareCasesByDocketNumber,
  compareISODateStrings,
  compareStrings,
  copyPagesAndAppendToTargetPdf,
  createEndOfDayISO,
  createISODateString,
  createStartOfDayISO,
  deconstructDate,
  documentUrlTranslator,
  formatDateString,
  formatJudgeName,
  formatNow,
  formatPendingItem,
  getAddressPhoneDiff,
  getCaseDocumentsIdsFilteredByDocumentType,
  getCropBox,
  getDescriptionDisplay,
  getDocketEntriesByFilter,
  getDocumentTitleWithAdditionalInfo,
  getDocumentTypeForAddressChange,
  getFormattedCaseDetail,
  getFormattedTrialSessionDetails,
  getSealedDocketEntryTooltip,
  getStampBoxCoordinates,
  isLeadCase,
  isPending: DocketEntry.isPending,
  isSealedCase,
  isValidPastDate,
  prepareDateFromString,
  scrapePdfContents,
  serveCaseDocument,
  setConsolidationFlagsForDisplay,
  setupPdfDocument,
  sleep,
};

export const getUtilities = () => utilities;

type _IGetUtilities = typeof getUtilities;

declare global {
  interface IGetUtilities extends _IGetUtilities {}
}

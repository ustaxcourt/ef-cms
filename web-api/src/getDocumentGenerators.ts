import { addressLabelCoverSheet } from '../../shared/src/business/utilities/documentGenerators/addressLabelCoverSheet';
import { caseInventoryReport } from '../../shared/src/business/utilities/documentGenerators/caseInventoryReport';
import { changeOfAddress } from '../../shared/src/business/utilities/documentGenerators/changeOfAddress';
import { coverSheet } from '../../shared/src/business/utilities/documentGenerators/coverSheet';
import { docketRecord } from '../../shared/src/business/utilities/documentGenerators/docketRecord';
import { entryOfAppearance } from '@shared/business/utilities/documentGenerators/entryOfAppearance';
import { noticeOfChangeOfTrialJudge } from '../../shared/src/business/utilities/documentGenerators/noticeOfChangeOfTrialJudge';
import { noticeOfChangeToInPersonProceeding } from '../../shared/src/business/utilities/documentGenerators/noticeOfChangeToInPersonProceeding';
import { noticeOfChangeToRemoteProceeding } from '../../shared/src/business/utilities/documentGenerators/noticeOfChangeToRemoteProceeding';
import { noticeOfDocketChange } from '../../shared/src/business/utilities/documentGenerators/noticeOfDocketChange';
import { noticeOfReceiptOfPetition } from '../../shared/src/business/utilities/documentGenerators/noticeOfReceiptOfPetition';
import { noticeOfTrialIssued } from '../../shared/src/business/utilities/documentGenerators/noticeOfTrialIssued';
import { noticeOfTrialIssuedInPerson } from '../../shared/src/business/utilities/documentGenerators/noticeOfTrialIssuedInPerson';
import { order } from '../../shared/src/business/utilities/documentGenerators/order';
import { pendingReport } from '../../shared/src/business/utilities/documentGenerators/pendingReport';
import { practitionerCaseList } from '../../shared/src/business/utilities/documentGenerators/practitionerCaseList';
import { printableWorkingCopySessionList } from '../../shared/src/business/utilities/documentGenerators/printableWorkingCopySessionList';
import { receiptOfFiling } from '../../shared/src/business/utilities/documentGenerators/receiptOfFiling';
import { standingPretrialOrder } from '../../shared/src/business/utilities/documentGenerators/standingPretrialOrder';
import { standingPretrialOrderForSmallCase } from '../../shared/src/business/utilities/documentGenerators/standingPretrialOrderForSmallCase';
import { thirtyDayNoticeOfTrial } from '../../shared/src/business/utilities/documentGenerators/thirtyDayNoticeOfTrial';
import { trialCalendar } from '../../shared/src/business/utilities/documentGenerators/trialCalendar';
import { trialSessionPlanningReport } from '../../shared/src/business/utilities/documentGenerators/trialSessionPlanningReport';

export const getDocumentGenerators = () => ({
  addressLabelCoverSheet,
  caseInventoryReport,
  changeOfAddress,
  coverSheet,
  docketRecord,
  entryOfAppearance,
  noticeOfChangeOfTrialJudge,
  noticeOfChangeToInPersonProceeding,
  noticeOfChangeToRemoteProceeding,
  noticeOfDocketChange,
  noticeOfReceiptOfPetition,
  noticeOfTrialIssued,
  noticeOfTrialIssuedInPerson,
  order,
  pendingReport,
  practitionerCaseList,
  printableWorkingCopySessionList,
  receiptOfFiling,
  standingPretrialOrder,
  standingPretrialOrderForSmallCase,
  thirtyDayNoticeOfTrial,
  trialCalendar,
  trialSessionPlanningReport,
});

type _IGetDocumentGenerators = typeof getDocumentGenerators;

declare global {
  interface IGetDocumentGenerators extends _IGetDocumentGenerators {}
}

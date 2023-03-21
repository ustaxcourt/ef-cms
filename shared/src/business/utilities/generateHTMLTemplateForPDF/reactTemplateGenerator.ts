require('regenerator-runtime');
require('@babel/register')({
  extensions: ['.tsx'],
  presets: ['@babel/preset-react', '@babel/preset-env'],
});

// Documents
const {
  AddressLabelCoverSheet,
} = require('../pdfGenerator/documentTemplates/AddressLabelCoverSheet.tsx');
const {
  CaseInventoryReport,
} = require('../pdfGenerator/documentTemplates/CaseInventoryReport.tsx');
const {
  ChangeOfAddress,
} = require('../pdfGenerator/documentTemplates/ChangeOfAddress.tsx');
const {
  CoverSheet,
} = require('../pdfGenerator/documentTemplates/CoverSheet.tsx');
const {
  DatePrintedFooter,
} = require('../pdfGenerator/components/DatePrintedFooter.tsx');
const {
  DateServedFooter,
} = require('../pdfGenerator/components/DateServedFooter.tsx');
const {
  DocketRecord,
} = require('../pdfGenerator/documentTemplates/DocketRecord.tsx');
const {
  GettingReadyForTrialChecklist,
} = require('../pdfGenerator/documentTemplates/GettingReadyForTrialChecklist.tsx');
const {
  NoticeOfChangeOfTrialJudge,
} = require('../pdfGenerator/documentTemplates/NoticeOfChangeOfTrialJudge.tsx');
const {
  NoticeOfChangeToInPersonProceeding,
} = require('../pdfGenerator/documentTemplates/NoticeOfChangeToInPersonProceeding');
const {
  NoticeOfChangeToRemoteProceeding,
} = require('../pdfGenerator/documentTemplates/NoticeOfChangeToRemoteProceeding.tsx');
const {
  NoticeOfDocketChange,
} = require('../pdfGenerator/documentTemplates/NoticeOfDocketChange.tsx');
const {
  NoticeOfReceiptOfPetition,
} = require('../pdfGenerator/documentTemplates/NoticeOfReceiptOfPetition.tsx');
const {
  NoticeOfTrialIssued,
} = require('../pdfGenerator/documentTemplates/NoticeOfTrialIssued.tsx');
const {
  NoticeOfTrialIssuedInPerson,
} = require('../pdfGenerator/documentTemplates/NoticeOfTrialIssuedInPerson.tsx');
const {
  PageMetaHeaderDocket,
} = require('../pdfGenerator/components/PageMetaHeaderDocket.tsx');
const {
  PendingReport,
} = require('../pdfGenerator/documentTemplates/PendingReport.tsx');
const {
  PractitionerCaseList,
} = require('../pdfGenerator/documentTemplates/PractitionerCaseList.tsx');
const {
  PretrialMemorandum,
} = require('../pdfGenerator/components/PretrialMemorandum.tsx');
const {
  PrintableTrialSessionWorkingCopyMetaHeader,
} = require('../pdfGenerator/components/PrintableTrialSessionWorkingCopyMetaHeader.tsx');
const {
  PrintableWorkingCopySessionList,
} = require('../pdfGenerator/documentTemplates/PrintableWorkingCopySessionList.tsx');
const {
  ReceiptOfFiling,
} = require('../pdfGenerator/documentTemplates/ReceiptOfFiling.tsx');
const {
  ReportsMetaHeader,
} = require('../pdfGenerator/components/ReportsMetaHeader.tsx');
const {
  StandingPretrialOrder,
} = require('../pdfGenerator/documentTemplates/StandingPretrialOrder.tsx');
const {
  StandingPretrialOrderForSmallCase,
} = require('../pdfGenerator/documentTemplates/StandingPretrialOrderForSmallCase.tsx');
const {
  TrialCalendar,
} = require('../pdfGenerator/documentTemplates/TrialCalendar.tsx');
const {
  TrialSessionPlanningReport,
} = require('../pdfGenerator/documentTemplates/TrialSessionPlanningReport.tsx');
const { Order } = require('../pdfGenerator/documentTemplates/Order.tsx');

// Emails
const {
  BouncedEmailAlert,
} = require('../emailGenerator/emailTemplates/BouncedEmailAlert.tsx');
const {
  DocumentService,
} = require('../emailGenerator/emailTemplates/DocumentService.tsx');
const {
  PetitionService,
} = require('../emailGenerator/emailTemplates/PetitionService.tsx');

const React = require('react');
const ReactDOM = require('react-dom/server');

const components = {
  AddressLabelCoverSheet,
  BouncedEmailAlert,
  CaseInventoryReport,
  ChangeOfAddress,
  CoverSheet,
  DatePrintedFooter,
  DateServedFooter,
  DocketRecord,
  DocumentService,
  GettingReadyForTrialChecklist,
  NoticeOfChangeOfTrialJudge,
  NoticeOfChangeToInPersonProceeding,
  NoticeOfChangeToRemoteProceeding,
  NoticeOfDocketChange,
  NoticeOfReceiptOfPetition,
  NoticeOfTrialIssued,
  NoticeOfTrialIssuedInPerson,
  Order,
  PageMetaHeaderDocket,
  PendingReport,
  PetitionService,
  PractitionerCaseList,
  PretrialMemorandum,
  PrintableTrialSessionWorkingCopyMetaHeader,
  PrintableWorkingCopySessionList,
  ReceiptOfFiling,
  ReportsMetaHeader,
  StandingPretrialOrder,
  StandingPretrialOrderForSmallCase,
  TrialCalendar,
  TrialSessionPlanningReport,
};

const reactTemplateGenerator = ({ componentName, data = {} }) => {
  const componentTemplate = ReactDOM.renderToString(
    React.createElement(components[componentName], data),
  );

  return componentTemplate;
};

module.exports = { reactTemplateGenerator };

require('regenerator-runtime');
require('@babel/register')({
  extensions: ['.jsx'],
  presets: ['@babel/preset-react', '@babel/preset-env'],
});

// Documents
const {
  AddressLabelCoverSheet,
} = require('../pdfGenerator/documentTemplates/AddressLabelCoverSheet.jsx');
const {
  CaseInventoryReport,
} = require('../pdfGenerator/documentTemplates/CaseInventoryReport.jsx');
const {
  ChangeOfAddress,
} = require('../pdfGenerator/documentTemplates/ChangeOfAddress.jsx');
const {
  CoverSheet,
} = require('../pdfGenerator/documentTemplates/CoverSheet.jsx');
const {
  DatePrintedFooter,
} = require('../pdfGenerator/components/DatePrintedFooter.jsx');
const {
  DateServedFooter,
} = require('../pdfGenerator/components/DateServedFooter.jsx');
const {
  DocketRecord,
} = require('../pdfGenerator/documentTemplates/DocketRecord.jsx');
const {
  GettingReadyForTrialChecklist,
} = require('../pdfGenerator/documentTemplates/GettingReadyForTrialChecklist.jsx');
const {
  NoticeOfChangeOfTrialJudge,
} = require('../pdfGenerator/documentTemplates/NoticeOfChangeOfTrialJudge.jsx');
const {
  NoticeOfChangeToInPersonProceeding,
} = require('../pdfGenerator/documentTemplates/NoticeOfChangeToInPersonProceeding');
const {
  NoticeOfChangeToRemoteProceeding,
} = require('../pdfGenerator/documentTemplates/NoticeOfChangeToRemoteProceeding.jsx');
const {
  NoticeOfDocketChange,
} = require('../pdfGenerator/documentTemplates/NoticeOfDocketChange.jsx');
const {
  NoticeOfReceiptOfPetition,
} = require('../pdfGenerator/documentTemplates/NoticeOfReceiptOfPetition.jsx');
const {
  NoticeOfTrialIssued,
} = require('../pdfGenerator/documentTemplates/NoticeOfTrialIssued.jsx');
const {
  NoticeOfTrialIssuedInPerson,
} = require('../pdfGenerator/documentTemplates/NoticeOfTrialIssuedInPerson.jsx');
const {
  PageMetaHeaderDocket,
} = require('../pdfGenerator/components/PageMetaHeaderDocket.jsx');
const {
  PendingReport,
} = require('../pdfGenerator/documentTemplates/PendingReport.jsx');
const {
  PractitionerCaseList,
} = require('../pdfGenerator/documentTemplates/PractitionerCaseList.jsx');
const {
  PretrialMemorandum,
} = require('../pdfGenerator/components/PretrialMemorandum.jsx');
const {
  PrintableTrialSessionWorkingCopyMetaHeader,
} = require('../pdfGenerator/components/PrintableTrialSessionWorkingCopyMetaHeader.jsx');
const {
  PrintableWorkingCopySessionList,
} = require('../pdfGenerator/documentTemplates/PrintableWorkingCopySessionList.jsx');
const {
  ReceiptOfFiling,
} = require('../pdfGenerator/documentTemplates/ReceiptOfFiling.jsx');
const {
  ReportsMetaHeader,
} = require('../pdfGenerator/components/ReportsMetaHeader.jsx');
const {
  StandingPretrialOrder,
} = require('../pdfGenerator/documentTemplates/StandingPretrialOrder.jsx');
const {
  StandingPretrialOrderForSmallCase,
} = require('../pdfGenerator/documentTemplates/StandingPretrialOrderForSmallCase.jsx');
const {
  TrialCalendar,
} = require('../pdfGenerator/documentTemplates/TrialCalendar.jsx');
const {
  TrialSessionPlanningReport,
} = require('../pdfGenerator/documentTemplates/TrialSessionPlanningReport.jsx');
const { Order } = require('../pdfGenerator/documentTemplates/Order.jsx');

// Emails
const {
  BouncedEmailAlert,
} = require('../emailGenerator/emailTemplates/BouncedEmailAlert');
const {
  DocumentService,
} = require('../emailGenerator/emailTemplates/DocumentService');
const {
  PetitionService,
} = require('../emailGenerator/emailTemplates/PetitionService.jsx');

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

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
  DocketRecord: DocketRecordOld,
} = require('../pdfGenerator/documentTemplates/DocketRecord.old.jsx');
const {
  NoticeOfDocketChange,
} = require('../pdfGenerator/documentTemplates/NoticeOfDocketChange.jsx');
const {
  NoticeOfDocketChange: NoticeOfDocketChangeOld,
} = require('../pdfGenerator/documentTemplates/NoticeOfDocketChange.old.jsx');
const {
  NoticeOfReceiptOfPetition,
} = require('../pdfGenerator/documentTemplates/NoticeOfReceiptOfPetition.jsx');
const {
  NoticeOfTrialIssued,
} = require('../pdfGenerator/documentTemplates/NoticeOfTrialIssued.jsx');
const {
  PageMetaHeaderDocket,
} = require('../pdfGenerator/components/PageMetaHeaderDocket.jsx');
const {
  PendingReport,
} = require('../pdfGenerator/documentTemplates/PendingReport.jsx');
const {
  ReceiptOfFiling,
} = require('../pdfGenerator/documentTemplates/ReceiptOfFiling.jsx');
const {
  ReportsMetaHeader,
} = require('../pdfGenerator/components/ReportsMetaHeader.jsx');
const {
  StandingPretrialNotice,
} = require('../pdfGenerator/documentTemplates/StandingPretrialNotice.jsx');
const {
  StandingPretrialOrder,
} = require('../pdfGenerator/documentTemplates/StandingPretrialOrder.jsx');
const {
  TrialCalendar,
} = require('../pdfGenerator/documentTemplates/TrialCalendar.jsx');
const {
  TrialSessionPlanningReport,
} = require('../pdfGenerator/documentTemplates/TrialSessionPlanningReport.jsx');
const { Order } = require('../pdfGenerator/documentTemplates/Order.jsx');

// Emails
const {
  DocumentService,
} = require('../emailGenerator/emailTemplates/DocumentService');
const {
  PetitionService,
} = require('../emailGenerator/emailTemplates/PetitionService.jsx');

const React = require('react');
const ReactDOM = require('react-dom/server');
const { isCodeEnabled } = require('../../../../../codeToggles.js');

const components = {
  AddressLabelCoverSheet,
  CaseInventoryReport,
  ChangeOfAddress,
  CoverSheet,
  DatePrintedFooter,
  DateServedFooter,
  DocketRecord: isCodeEnabled(7184) ? DocketRecord : DocketRecordOld,
  DocumentService,
  NoticeOfDocketChange: isCodeEnabled(6936)
    ? NoticeOfDocketChange
    : NoticeOfDocketChangeOld,
  NoticeOfReceiptOfPetition,
  NoticeOfTrialIssued,
  Order,
  PageMetaHeaderDocket,
  PendingReport,
  PetitionService,
  ReceiptOfFiling,
  ReportsMetaHeader,
  StandingPretrialNotice,
  StandingPretrialOrder,
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

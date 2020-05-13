require('regenerator-runtime');
require('@babel/register')({
  extensions: ['.jsx'],
  presets: ['@babel/preset-react', '@babel/preset-env'],
});

// Documents
const {
  CaseInventoryReport,
} = require('../pdfGenerator/documentTemplates/CaseInventoryReport.jsx');
const {
  ChangeOfAddress,
} = require('../pdfGenerator/documentTemplates/ChangeOfAddress.jsx');
const {
  DatePrintedFooter,
} = require('../pdfGenerator/components/DatePrintedFooter.jsx');
const {
  DocketRecord,
} = require('../pdfGenerator/documentTemplates/DocketRecord.jsx');
const {
  NoticeOfDocketChange,
} = require('../pdfGenerator/documentTemplates/NoticeOfDocketChange.jsx');
const {
  PageMetaHeaderDocket,
} = require('../pdfGenerator/components/PageMetaHeaderDocket.jsx');
const {
  ReceiptOfFiling,
} = require('../pdfGenerator/documentTemplates/ReceiptOfFiling.jsx');
const {
  ReportsMetaHeader,
} = require('../pdfGenerator/components/ReportsMetaHeader.jsx');
const {
  StandingPretrialOrder,
} = require('../pdfGenerator/documentTemplates/StandingPretrialOrder.jsx');

// Emails
const {
  PetitionService,
} = require('../emailGenerator/emailTemplates/PetitionService.jsx');

const React = require('react');
const ReactDOM = require('react-dom/server');

const components = {
  CaseInventoryReport,
  ChangeOfAddress,
  DatePrintedFooter,
  DocketRecord,
  NoticeOfDocketChange,
  PageMetaHeaderDocket,
  PetitionService,
  ReceiptOfFiling,
  ReportsMetaHeader,
  StandingPretrialOrder,
};

const reactTemplateGenerator = ({ componentName, data = {} }) => {
  const componentTemplate = ReactDOM.renderToString(
    React.createElement(components[componentName], data),
  );

  return componentTemplate;
};

module.exports = { reactTemplateGenerator };

require('regenerator-runtime');
require('@babel/register')({
  extensions: ['.jsx'],
  presets: ['@babel/preset-react', '@babel/preset-env'],
});

const {
  ChangeOfAddress,
} = require('../pdfGenerator/documentTemplates/ChangeOfAddress.jsx');
const {
  DocketRecord,
} = require('../pdfGenerator/documentTemplates/DocketRecord.jsx');
const {
  NoticeOfDocketChange,
} = require('../pdfGenerator/documentTemplates/NoticeOfDocketChange.jsx');
const {
  ReceiptOfFiling,
} = require('../pdfGenerator/documentTemplates/ReceiptOfFiling.jsx');
const {
  StandingPretrialOrder,
} = require('../pdfGenerator/documentTemplates/StandingPretrialOrder.jsx');

const {
  PageMetaHeaderDocket,
} = require('../pdfGenerator/components/PageMetaHeaderDocket.jsx');

const React = require('react');
const ReactDOM = require('react-dom/server');

const components = {
  ChangeOfAddress,
  DocketRecord,
  NoticeOfDocketChange,
  PageMetaHeaderDocket,
  ReceiptOfFiling,
  StandingPretrialOrder,
};

const reactTemplateGenerator = ({ componentName, data = {} }) => {
  const componentTemplate = ReactDOM.renderToString(
    React.createElement(components[componentName], data),
  );

  return componentTemplate;
};

module.exports = { reactTemplateGenerator };

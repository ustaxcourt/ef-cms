require('regenerator-runtime');
require('@babel/register')({
  presets: ['@babel/preset-react', '@babel/preset-env'],
});

const ChangeOfAddress = require('../pdfGenerator/documentTemplates/ChangeOfAddress.jsx')
  .default;
const DocketRecord = require('../pdfGenerator/documentTemplates/DocketRecord.jsx')
  .default;
const PageMetaHeaderDocket = require('../pdfGenerator/components/PageMetaHeaderDocket.jsx')
  .default;

const React = require('react');
const ReactDOM = require('react-dom/server');

const components = { ChangeOfAddress, DocketRecord, PageMetaHeaderDocket };

const reactTemplateGenerator = ({ componentName, data = {} }) => {
  const componentTemplate = ReactDOM.renderToString(
    React.createElement(components[componentName], data),
  );

  return componentTemplate;
};

module.exports = { reactTemplateGenerator };

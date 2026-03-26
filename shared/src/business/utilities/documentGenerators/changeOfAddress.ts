import {
  ChangeOfAddress,
  ChangeOfAddressParams,
} from '@shared/business/utilities/pdfGenerator/documentTemplates/ChangeOfAddress';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const computeChangeOptions = ({
  documentType,
}: {
  documentType: {
    title: string;
    eventCode: string;
  };
}) => {
  const options = {
    h3: documentType.title,
    isAddressAndPhoneChange: documentType.eventCode === 'NCAP',
    isAddressChange: ['NCA', 'NCAP'].includes(documentType.eventCode),
    isEmailChange: documentType.eventCode === 'NOCE',
    isPhoneChangeOnly: documentType.eventCode === 'NCP',
  };
  return options;
};

export const changeOfAddress = async ({
  applicationContext,
  content,
}: {
  applicationContext: ServerApplicationContext;
  content: Omit<ChangeOfAddressParams, 'options'> & {
    caseCaptionExtension: string;
    caseTitle: string;
    docketNumberWithSuffix: string;
    docketNumber: string;
    documentType: {
      title: string;
      eventCode: string;
    };
  };
}) => {
  const {
    caseCaptionExtension,
    caseTitle,
    docketNumberWithSuffix,
    name,
    newData,
    oldData,
  } = content;
  const options = computeChangeOptions(content);

  const changeOfAddressTemplate = ReactDOM.renderToString(
    React.createElement(ChangeOfAddress, {
      name,
      newData,
      oldData,
      options: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
        ...options,
      },
    }),
  );

  const { docketNumber } = content;

  applicationContext.logger.info(
    `Starting generate HTML template for change of address PDF for docket ${docketNumber}`,
  );

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: changeOfAddressTemplate,
  });

  applicationContext.logger.info(
    `Finished generate HTML template for change of address PDF for docket ${docketNumber}`,
  );

  applicationContext.logger.info(
    `Starting generate PDF from HTML for change of address for docket ${docketNumber}`,
  );

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber,
    });

  applicationContext.logger.info(
    `Finished generate PDF from HTML for change of address for docket ${docketNumber}`,
  );

  return pdf;
};

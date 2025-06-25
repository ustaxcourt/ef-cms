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
  content: ChangeOfAddressParams & {
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

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: changeOfAddressTemplate,
  });

  const { docketNumber } = content;

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: true,
      docketNumber,
    });

  return pdf;
};

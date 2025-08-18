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
    isAddressSealed: boolean;
  };
}) => {
  const {
    caseCaptionExtension,
    caseTitle,
    docketNumberWithSuffix,
    name,
    isAddressSealed,
    newData,
    oldData,
  } = content;
  const options = computeChangeOptions(content);

  if (!oldData.email && isAddressSealed) {
    oldData.email = ``;
  } else if (oldData.email && isAddressSealed) {
    oldData.email = 'SEALED BY COURT ORDER';
  } else if (!oldData.email) {
    oldData.email = 'No email provided';
  }

  newData.email = isAddressSealed ? 'SEALED BY COURT ORDER' : newData.email;

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

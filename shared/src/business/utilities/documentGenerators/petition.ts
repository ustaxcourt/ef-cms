import { FORMATS } from '@shared/business/utilities/DateHandler';
import { Petition } from '@shared/business/utilities/pdfGenerator/documentTemplates/Petition';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

export const petition = async ({ applicationContext, data }) => {
  const {
    caseCaptionExtension,
    caseDescription,
    caseTitle,
    contactPrimary,
    contactSecondary,
    irsNotices,
    noticeIssuedDate,
    partyType,
    petitionFacts,
    petitionReasons,
    preferredTrialCity,
    procedureType,
    taxYear,
  } = data;

  const date = applicationContext.getUtilities().formatNow(FORMATS.MMDDYY);

  const PetitionTemplate = ReactDOM.renderToString(
    React.createElement(Petition, {
      caseCaptionExtension,
      caseDescription,
      caseTitle,
      contactPrimary,
      contactSecondary,
      date,
      irsNotices,
      noticeIssuedDate,
      partyType,
      petitionFacts,
      petitionReasons,
      preferredTrialCity,
      procedureType,
      taxYear,
    }),
  );

  const pdfContentHtml = await generateHTMLTemplateForPDF({
    applicationContext,
    content: PetitionTemplate,
  });

  const pdf = await applicationContext
    .getUseCases()
    .generatePdfFromHtmlInteractor(applicationContext, {
      contentHtml: pdfContentHtml,
      displayHeaderFooter: false,
    });

  return pdf;
};

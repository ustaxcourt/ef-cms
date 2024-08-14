import {
  IrsNoticesWithCaseDescription,
  PetitionPdfBase,
} from '@shared/business/useCases/generatePetitionPdfInteractor';
import { Petition } from '@shared/business/utilities/pdfGenerator/documentTemplates/Petition';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { generateHTMLTemplateForPDF } from '../generateHTMLTemplateForPDF/generateHTMLTemplateForPDF';
import React from 'react';
import ReactDOM from 'react-dom/server';

export const petition = async ({
  applicationContext,
  data,
}: {
  applicationContext: ServerApplicationContext;
  data: PetitionPdfBase & {
    caseDescription: string;
    irsNotices: IrsNoticesWithCaseDescription[];
  };
}) => {
  const {
    caseCaptionExtension,
    caseDescription,
    caseTitle,
    contactCounsel,
    contactPrimary,
    contactSecondary,
    hasUploadedIrsNotice,
    irsNotices,
    partyType,
    petitionFacts,
    petitionReasons,
    preferredTrialCity,
    procedureType,
  } = data;
  const PetitionTemplate = ReactDOM.renderToString(
    React.createElement(Petition, {
      caseCaptionExtension,
      caseDescription,
      caseTitle,
      contactCounsel,
      contactPrimary,
      contactSecondary,
      hasUploadedIrsNotice,
      irsNotices,
      partyType,
      petitionFacts,
      petitionReasons,
      preferredTrialCity,
      procedureType,
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

import { Case } from '../../entities/cases/Case';
import {
  FORMATS,
  formatDateString,
  formatNow,
} from '../../utilities/DateHandler';
import { PetitionService } from '@shared/business/utilities/emailGenerator/emailTemplates/PetitionService';
import React from 'react';
import ReactDOM from 'react-dom/server';

export const sendIrsSuperuserPetitionEmail = async ({
  applicationContext,
  caseEntity,
  docketEntryId,
}) => {
  const docketEntryEntity = caseEntity.getDocketEntryById({ docketEntryId });

  if (docketEntryEntity.index === undefined) {
    throw new Error('Cannot serve a docket entry without an index.');
  }

  const caseDetail = applicationContext
    .getUtilities()
    .setServiceIndicatorsForCase(caseEntity);

  const {
    caseCaption,
    docketNumber,
    docketNumberWithSuffix,
    mailingDate,
    preferredTrialCity,
    privatePractitioners,
  } = caseDetail;

  const { documentType, eventCode, filingDate, servedAt } = docketEntryEntity;

  privatePractitioners.forEach(practitioner => {
    const representingFormatted = [];

    caseEntity.petitioners.forEach(p => {
      if (practitioner.isRepresenting(p.contactId)) {
        representingFormatted.push(p.name);
      }
    });

    practitioner.representingFormatted = representingFormatted.join(', ');
  });

  const currentDate = formatNow(FORMATS.MONTH_DAY_YEAR);

  const filingDateFormatted = formatDateString(filingDate, FORMATS.MMDDYY);

  const formattedMailingDate =
    mailingDate || `Electronically Filed ${filingDateFormatted}`;

  const templateHtml = ReactDOM.renderToString(
    React.createElement(PetitionService, {
      caseDetail: {
        caseTitle: Case.getCaseTitle(caseCaption),
        docketNumber,
        docketNumberWithSuffix,
        trialLocation: preferredTrialCity || 'No requested place of trial',
      },
      contactPrimary: caseDetail.petitioners[0],
      contactSecondary: caseDetail.petitioners[1],
      currentDate,
      docketEntryNumber: docketEntryEntity.index,
      documentDetail: {
        docketEntryId,
        documentTitle: documentType,
        eventCode,
        filingDate: filingDateFormatted,
        formattedMailingDate,
        servedAtFormatted: formatDateString(servedAt, FORMATS.DATE_TIME_TZ),
      },
      practitioners: privatePractitioners,
      taxCourtLoginUrl: `https://app.${process.env.EFCMS_DOMAIN}`,
    }),
  );

  const destination = {
    email: applicationContext.getIrsSuperuserEmail(),
    templateData: {
      docketNumber: docketNumberWithSuffix,
      emailContent: templateHtml,
    },
  };

  console.log('destination', destination);

  await applicationContext.getDispatchers().sendBulkTemplatedEmail({
    applicationContext,
    defaultTemplateData: {
      docketNumber: '',
      emailContent: 'A petition has been served.',
    },
    destinations: [destination],
    templateName: process.env.EMAIL_SERVED_PETITION_TEMPLATE,
  });

  applicationContext.logger.info('served a document to the irs', {
    destination,
    docketEntryId,
    docketNumber,
    eventCode,
  });
};

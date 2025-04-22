import { Case } from '@shared/business/entities/cases/Case';
import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { DocumentService } from '@shared/business/utilities/emailGenerator/emailTemplates/DocumentService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { cloneDeep } from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom/server';

type SendServedPartiesEmailsParams = {
  applicationContext: ServerApplicationContext;
  caseEntity: Case;
  docketEntryId: string;
  servedParties: {
    all: any[];
    paper: any[];
    electronic: Array<{ email: string; name: string }>;
  };
  skipEmailToIrs?: boolean;
};

export const sendServedPartiesEmails = async ({
  applicationContext,
  caseEntity,
  docketEntryId,
  servedParties,
  skipEmailToIrs = false,
}: SendServedPartiesEmailsParams) => {
  const { caseCaption, docketNumber, docketNumberWithSuffix } = caseEntity;
  const partiesToServe = cloneDeep(servedParties);

  const docketEntryEntity = caseEntity.getDocketEntryById({ docketEntryId });

  if (docketEntryEntity.index === undefined) {
    throw new Error('Cannot serve a docket entry without an index.');
  }

  const {
    documentTitle,
    documentType,
    eventCode,
    filedBy,
    index: docketEntryNumber,
    servedAt,
  } = docketEntryEntity;

  const currentDate = applicationContext
    .getUtilities()
    .formatNow('MONTH_DAY_YEAR');

  if (!skipEmailToIrs && caseEntity.status !== CASE_STATUS_TYPES.new) {
    partiesToServe.electronic.push({
      email: applicationContext.getIrsSuperuserEmail()!,
      name: 'IRS',
    });
  }

  const destinations = partiesToServe.electronic.map(party => ({
    email: party.email,
    templateData: {
      emailContent: ReactDOM.renderToString(
        React.createElement(DocumentService, {
          caseDetail: {
            caseTitle: Case.getCaseTitle(caseCaption),
            docketNumber,
            docketNumberWithSuffix,
          },
          currentDate,
          docketEntryNumber,
          documentDetail: {
            docketEntryId,
            documentTitle: documentTitle || documentType,
            eventCode,
            filedBy,
            servedAtFormatted: applicationContext
              .getUtilities()
              .formatDateString(servedAt, 'DATE_TIME_TZ'),
          },
          name: party.name,
          taxCourtLoginUrl: `https://app.${process.env.EFCMS_DOMAIN}`,
        }),
      ),
    },
  }));

  if (destinations.length > 0) {
    await applicationContext.getDispatchers().sendBulkTemplatedEmail({
      applicationContext,
      defaultTemplateData: {
        docketNumber: docketNumberWithSuffix,
        emailContent: '',
      },
      destinations,
      templateName: process.env.EMAIL_DOCUMENT_SERVED_TEMPLATE!,
    });
  }
};

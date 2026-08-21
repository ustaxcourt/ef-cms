import { ServerApplicationContext } from '@web-api/applicationContext';
import { NotFoundError } from '@web-api/errors/errors';
import { getMinuteSheet } from '@web-api/persistence/postgres/minuteSheets/getMinuteSheet';
import { formatMinuteSheet } from './formatMinuteSheet';
import { minuteSheet as minuteSheetDocumentGenerator } from '@web-api/business/utilities/documentGenerators/minuteSheet';
import { uploadDocument } from '@web-api/persistence/s3/uploadDocument';

export const createAndUploadMinuteSheet = async (
  applicationContext: ServerApplicationContext,
  { docketNumber, trialSessionId, aCase, trialSession, documentStorageId },
) => {
  const minuteSheet = await getMinuteSheet({ docketNumber, trialSessionId });

  if (!minuteSheet)
    throw new NotFoundError(
      `Minute sheet for trial session ${trialSessionId} case ${docketNumber} was not found.`,
    );

  const formattedMinuteSheet = formatMinuteSheet({
    aCase,
    minuteSheet: minuteSheet.content,
    trialSession,
  });

  const pdf = await minuteSheetDocumentGenerator({
    applicationContext,
    data: {
      formattedMinuteSheet,
    },
  });

  await uploadDocument({
    applicationContext,
    pdfData: pdf,
    key: documentStorageId,
  });

  return pdf;
};

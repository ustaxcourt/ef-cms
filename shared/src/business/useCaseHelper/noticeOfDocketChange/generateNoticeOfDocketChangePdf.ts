import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

export const generateNoticeOfDocketChangePdf = async ({
  applicationContext,
  docketChangeInfo,
}: {
  applicationContext: IApplicationContext;
  docketChangeInfo: {
    caseCaptionExtension: string;
    caseTitle: string;
    docketEntryIndex: string;
    docketNumber: string;
    filingParties: { after: string | undefined; before: string | undefined };
    filingsAndProceedings: { after: string; before: string };
  };
}): Promise<string> => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.UPLOAD_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const {
    caseCaptionExtension,
    caseTitle,
    docketEntryIndex,
    docketNumber,
    filingParties,
    filingsAndProceedings,
  } = docketChangeInfo;

  const noticePdf = await applicationContext
    .getDocumentGenerators()
    .noticeOfDocketChange({
      applicationContext,
      data: {
        caseCaptionExtension,
        caseTitle,
        docketEntryIndex,
        docketNumberWithSuffix: docketNumber,
        filingParties,
        filingsAndProceedings,
      },
    });

  const docketEntryId = applicationContext.getUniqueId();

  await new Promise<void>((resolve, reject) => {
    const documentsBucket = applicationContext.getDocumentsBucketName();
    const s3Client = applicationContext.getStorageClient();

    const params = {
      Body: noticePdf,
      Bucket: documentsBucket,
      ContentType: 'application/pdf',
      Key: docketEntryId,
    };

    s3Client.upload(params, function (err) {
      if (err) {
        applicationContext.logger.error(
          'An error occurred while attempting to upload to S3',
          err,
        );
        reject(err);
      }

      resolve();
    });
  });

  return docketEntryId;
};

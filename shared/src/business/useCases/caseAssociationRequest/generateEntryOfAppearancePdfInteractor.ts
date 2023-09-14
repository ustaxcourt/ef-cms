import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../../../web-api/src/errors/errors';

export const generateEntryOfAppearancePdfInteractor = async (
  applicationContext: IApplicationContext,
  {
    docketNumber,
    filers,
    petitioners,
  }: { docketNumber: string; filers: any[]; petitioners: any[] },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.ARCHIVE_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const practitionerInformation = await applicationContext
    .getPersistenceGateway()
    .getUserById({
      applicationContext,
      userId: user.userId,
    });

  const file = await applicationContext
    .getDocumentGenerators()
    .entryOfAppearance({
      applicationContext,
      data: {
        docketNumber,
        filers,
        petitioners,
        practitionerInformation,
      },
    });

  const docketEntryId = applicationContext.getUniqueId();

  await new Promise<void>((resolve, reject) => {
    const documentsBucket = applicationContext.getDocumentsBucketName();
    const s3Client = applicationContext.getStorageClient();

    const params = {
      Body: file,
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

  // return await saveFileAndGenerateUrl({
  //   applicationContext,
  //   file,
  //   useTempBucket: false,
  // });
};

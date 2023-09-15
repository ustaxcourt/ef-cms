import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../../../web-api/src/errors/errors';
import { saveFileAndGenerateUrl } from '@shared/business/useCaseHelper/saveFileAndGenerateUrl';

export const generateEntryOfAppearancePdfInteractor = async (
  applicationContext: IApplicationContext,
  {
    // docketNumber,
    caseCaptionExtension,
    caseTitle,
    docketNumberWithSuffix,
    filers,

    petitioners,
  }: {
    caseCaptionExtension: string;
    caseTitle: string;
    docketNumber: string;
    docketNumberWithSuffix: string;
    filers: string[];
    petitioners: {
      contactId: string;
      name: string;
    }[];
  },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.ASSOCIATE_SELF_WITH_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const practitionerInformation = await applicationContext
    .getPersistenceGateway()
    .getUserById({
      applicationContext,
      userId: user.userId,
    });

  const filersWithNames = filers
    .map(filerId => {
      const petitioner = petitioners.find(pe => pe.contactId === filerId);
      return petitioner ? petitioner.name : null;
    })
    .filter(Boolean);

  console.log('practitionerInformation, ', practitionerInformation);

  const file = await applicationContext
    .getDocumentGenerators()
    .entryOfAppearance({
      applicationContext,
      data: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
        filers: filersWithNames,
        // petitioners,
        practitionerInformation,
      },
    });

  // const docketEntryId = applicationContext.getUniqueId();

  // await new Promise<void>((resolve, reject) => {
  //   const documentsBucket = applicationContext.getDocumentsBucketName();
  //   const s3Client = applicationContext.getStorageClient();

  //   const params = {
  //     Body: file,
  //     Bucket: documentsBucket,
  //     ContentType: 'application/pdf',
  //     Key: docketEntryId,
  //   };

  //   s3Client.upload(params, function (err) {
  //     if (err) {
  //       applicationContext.logger.error(
  //         'An error occurred while attempting to upload to S3',
  //         err,
  //       );
  //       reject(err);
  //     }

  //     resolve();
  //   });
  // });

  return await saveFileAndGenerateUrl({
    applicationContext,
    file,
    useTempBucket: true,
  });
};

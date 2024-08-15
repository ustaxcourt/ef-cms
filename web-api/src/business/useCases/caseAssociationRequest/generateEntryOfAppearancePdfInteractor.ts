import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export type EntryOfAppearanceProps = {
  caseCaptionExtension: string;
  caseTitle: string;
  docketNumberWithSuffix: string;
  filers: string[];
  petitioners: {
    contactId: string;
    name: string;
  }[];
};

export const generateEntryOfAppearancePdfInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    caseCaptionExtension,
    caseTitle,
    docketNumberWithSuffix,
    filers,
    petitioners,
  }: EntryOfAppearanceProps,
  authorizedUser: UnknownAuthUser,
) => {
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.ASSOCIATE_SELF_WITH_CASE)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const practitionerInformation = await applicationContext
    .getPersistenceGateway()
    .getUserById({
      applicationContext,
      userId: authorizedUser.userId,
    });

  const filerNames: string[] =
    authorizedUser.role === ROLES.irsPractitioner
      ? ['Respondent']
      : (filers
          .map(filerId => {
            const petitioner = petitioners.find(pe => pe.contactId === filerId);
            return petitioner ? petitioner.name : null;
          })
          .filter(Boolean) as string[]);

  const file = await applicationContext
    .getDocumentGenerators()
    .entryOfAppearance({
      applicationContext,
      data: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
        filers: filerNames,
        practitionerInformation,
      },
    });

  // 24 hrs
  const urlTtl = 60 * 60 * 24;

  return await applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl({
    applicationContext,
    file,
    urlTtl,
    useTempBucket: true,
  });
};

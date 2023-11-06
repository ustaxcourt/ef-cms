import { ROLES } from '../../entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

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
  applicationContext: IApplicationContext,
  {
    caseCaptionExtension,
    caseTitle,
    docketNumberWithSuffix,
    filers,
    petitioners,
  }: EntryOfAppearanceProps,
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

  const filerNames: string[] =
    user.role === ROLES.irsPractitioner
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

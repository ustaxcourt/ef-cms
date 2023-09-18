import { ROLES } from '../../entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../../../web-api/src/errors/errors';
import { saveFileAndGenerateUrl } from '@shared/business/useCaseHelper/saveFileAndGenerateUrl';

export const generateEntryOfAppearancePdfInteractor = async (
  applicationContext: IApplicationContext,
  {
    caseCaptionExtension,
    caseTitle,
    docketNumberWithSuffix,
    filers,
    petitioners,
  }: {
    caseCaptionExtension: string;
    caseTitle: string;
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

  const filersWithNames: string[] =
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
        filers: filersWithNames,
        practitionerInformation,
      },
    });

  return await saveFileAndGenerateUrl({
    applicationContext,
    file,
    useTempBucket: true,
  });
};

// import {
//   isAuthorized,
//   ROLE_PERMISSIONS,
// } from '@shared/authorization/authorizationClientService';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { ROLES } from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';

export const generateNoticeOfWithdrawalPdfInteractor = async (
  applicationContext: ServerApplicationContext,
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
  authorizedUser: UnknownAuthUser,
): Promise<{ fileId: string; url: string }> => {
  // For now, just check that the user is logged in
  // use isAuthorized to check for type of user
  if (!authorizedUser) {
    throw new UnauthorizedError('Unauthorized');
  }

  const practitionerInformation = await getUserById({
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
    .noticeOfWithdrawal({
      applicationContext,
      data: {
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
        filers: filerNames,
        practitionerInformation,
      },
    });

  const urlTtl = 60 * 60 * 24;

  return await applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl({
    applicationContext,
    file,
    urlTtl,
    useTempBucket: true,
  });
};

import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

/**
 * generatePractitionerCaseListPdfInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.userId the practitioner's user id
 * @returns {Object} returns an object of the PDF's fileId and url
 */
export const generatePractitionerCaseListPdfInteractor = async (
  applicationContext: ServerApplicationContext,
  { userId }: { userId: string },
  authorizedUser: UnknownAuthUser,
) => {
  const practitionerUser = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId });

  if (!practitionerUser || !practitionerUser.barNumber) {
    throw new UnauthorizedError('Practitioner not found');
  }

  const { closedCases, openCases } = await applicationContext
    .getUseCases()
    .getPractitionerCasesInteractor(
      applicationContext,
      { userId },
      authorizedUser,
    );

  const { barNumber, name } = practitionerUser;

  const pdf = await applicationContext
    .getDocumentGenerators()
    .practitionerCaseList({
      applicationContext,
      data: {
        barNumber,
        closedCases,
        openCases,
        practitionerName: name,
      },
    });

  return await applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl({
    applicationContext,
    file: pdf,
    useTempBucket: true,
  });
};

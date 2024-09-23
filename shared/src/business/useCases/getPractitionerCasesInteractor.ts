import { Case, isClosed } from '../entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { partition } from 'lodash';

export const getPractitionerCasesInteractor = async (
  applicationContext: ServerApplicationContext,
  { userId }: { userId: string },
  authorizedUser: UnknownAuthUser,
) => {
  console.log('getPractitionerCasesInteractor?!');
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.VIEW_PRACTITIONER_CASE_LIST)
  ) {
    throw new UnauthorizedError('Unauthorized to view practitioners cases');
  }

  const practitionerUser = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId });

  if (!practitionerUser || !practitionerUser.barNumber) {
    throw new UnauthorizedError('Practitioner not found');
  }

  const docketNumbers = await applicationContext
    .getPersistenceGateway()
    .getDocketNumbersByUser({
      applicationContext,
      userId,
    });

  const cases = await applicationContext
    .getPersistenceGateway()
    .getCasesByDocketNumbers({ applicationContext, docketNumbers });

  console.log('CASES?!', cases);

  const [closedCases, openCases] = partition(
    Case.sortByDocketNumber(cases).reverse(),
    theCase => isClosed(theCase),
  );

  return { closedCases, openCases };
};

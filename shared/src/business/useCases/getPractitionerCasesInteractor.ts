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
  if (
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.VIEW_PRACTITIONER_CASE_LIST)
  ) {
    throw new UnauthorizedError('Unauthorized to view practitioners cases');
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

  cases.forEach(
    aCase => (aCase.caseTitle = Case.getCaseTitle(aCase.caseCaption)),
  );

  const [closedCases, openCases] = partition(
    Case.sortByDocketNumber(cases).reverse(),
    theCase => isClosed(theCase),
  );

  return { closedCases, openCases };
};

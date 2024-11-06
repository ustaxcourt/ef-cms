import { Case, isClosed } from '../entities/cases/Case';
import { PractitionerCaseDetail } from '@web-client/presenter/state';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { formatCase } from '@shared/business/utilities/getFormattedCaseDetail';
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

  const caseDetails: PractitionerCaseDetail[] = cases.map(c => {
    const formattedCase = formatCase(applicationContext, c, authorizedUser);

    const {
      caseTitle,
      consolidatedIconTooltipText,
      docketNumber,
      docketNumberWithSuffix,
      inConsolidatedGroup,
      isLeadCase,
      isSealed,
      status,
    } = formattedCase;

    return {
      caseTitle,
      consolidatedIconTooltipText,
      docketNumber,
      docketNumberWithSuffix,
      inConsolidatedGroup,
      isLeadCase,
      isSealed,
      status,
    };
  });

  const [closedCases, openCases] = partition(
    Case.sortByDocketNumber(caseDetails).reverse(),
    theCase => isClosed(theCase),
  );

  return { closedCases, openCases };
};

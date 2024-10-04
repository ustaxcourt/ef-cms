import { Case, isClosed } from '../entities/cases/Case';
import { PractitionerCaseDetail } from '@web-client/presenter/state';
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

  const caseDetails: PractitionerCaseDetail[] = cases.map(c => {
    return {
      caseTitle: c.caseTitle,
      consolidatedIconTooltipText: c.consolidatedIconTooltipText,
      docketNumber: c.docketNumber,
      docketNumberWithSuffix: c.docketNumberWithSuffix,
      inConsolidatedGroup: c.inConsolidatedGroup,
      isLeadCase: c.isLeadCase,
      isSealed: c.isSealed,
      leadDocketNumber: c.leadDocketNumber,
      sealedDate: c.sealedDate,
      sealedToTooltip: c.sealedToToolTip,
      status: c.status,
    };
  });

  const [closedCases, openCases] = partition(
    Case.sortByDocketNumber(caseDetails).reverse(),
    theCase => isClosed(theCase),
  );

  return { closedCases, openCases };
};

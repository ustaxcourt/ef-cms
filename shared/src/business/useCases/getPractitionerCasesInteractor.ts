import { Case, isClosed } from '@shared/business/entities/cases/Case';
import { PractitionerCaseDetail } from '@web-client/presenter/state';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { formatCase } from '@shared/business/utilities/getFormattedCaseDetail';
import { partition } from 'lodash';
import { getDocketNumbersByUser } from '@web-api/persistence/postgres/users/cases/getCasesForUser';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';

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

  const docketNumbers = await getDocketNumbersByUser({ userId });

  const cases = await getCasesByDocketNumbers({
    docketNumbers,
    excludeFields: [
      'docketEntries',
      'hearings',
      'correspondence',
      'privatePractitioners',
      'irsPractitioners',
    ],
  });

  const caseDetails: PractitionerCaseDetail[] = cases
    ? cases.map(c => {
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
      })
    : ([] as PractitionerCaseDetail[]);

  const [closedCases, openCases] = partition(
    Case.sortByDocketNumber(caseDetails).reverse(),
    theCase => isClosed(theCase),
  );

  return { closedCases, openCases };
};

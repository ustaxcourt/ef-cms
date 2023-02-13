import { UserCase } from '../entities/UserCase';
import { compareISODateStrings } from '../utilities/sortFunctions';
import { isClosed } from '../entities/cases/Case';

/**
 * getCasesForUserInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {object} A list of the open cases and a list of the closed cases for the user
 */
export const getCasesForUserInteractor = async (
  applicationContext: IApplicationContext,
) => {
  const { userId } = await applicationContext.getCurrentUser();

  let allUserCases = await applicationContext
    .getPersistenceGateway()
    .getCasesForUser({
      applicationContext,
      userId,
    });

  allUserCases = UserCase.validateRawCollection(allUserCases, {
    applicationContext,
  });

  const sortedClosedCases = allUserCases
    .filter(aCase => isClosed(aCase))
    .sort((a, b) => compareISODateStrings(a.closedDate, b.closedDate))
    .reverse();

  let filteredOpenCases = allUserCases.filter(aCase => !isClosed(aCase));

  let {
    casesAssociatedWithUserOrLeadCaseMap,
    leadDocketNumbersAssociatedWithUser,
    userAssociatedDocketNumbersMap,
  } = applicationContext
    .getUseCaseHelpers()
    .processUserAssociatedCases(filteredOpenCases);

  for (const leadDocketNumber of leadDocketNumbersAssociatedWithUser) {
    const consolidatedCases = await applicationContext
      .getUseCaseHelpers()
      .getConsolidatedCasesForLeadCase({
        applicationContext,
        leadDocketNumber,
      });

    if (!casesAssociatedWithUserOrLeadCaseMap[leadDocketNumber]) {
      casesAssociatedWithUserOrLeadCaseMap[leadDocketNumber] =
        applicationContext.getUseCaseHelpers().getUnassociatedLeadCase({
          consolidatedCases,
          leadDocketNumber,
        });
    }

    casesAssociatedWithUserOrLeadCaseMap[leadDocketNumber].consolidatedCases =
      applicationContext.getUseCaseHelpers().formatAndSortConsolidatedCases({
        consolidatedCases,
        leadDocketNumber,
        userAssociatedDocketNumbersMap,
      });
  }

  const foundOpenCases: any[] = Object.values(
    casesAssociatedWithUserOrLeadCaseMap,
  )
    .map((c: any) => {
      // explicitly unset the entityName because this is returning a composite entity and if an entityName
      // is set, the genericHandler will send it through the entity constructor for that entity and strip
      // out necessary data
      c.entityName = undefined;
      return c;
    })
    .sort((a, b) => compareISODateStrings(a.createdAt, b.createdAt))
    .reverse();

  return { closedCaseList: sortedClosedCases, openCaseList: foundOpenCases };
};

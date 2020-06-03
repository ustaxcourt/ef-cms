import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { orderBy } from 'lodash';
import { state } from 'cerebral';

/**
 * Fetches the cases (including consolidated) associated with the petitioner who created them or the respondent who is associated with them.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getCasesByUser use case
 * @param {object} providers.status the status determining the type of cases to be retrieved
 * @returns {object} contains the caseList returned from the getCasesByUser use case
 */
export const getConsolidatedCasesByUserAction = async ({
  applicationContext,
  get,
}) => {
  const status = get(state.currentViewMetadata.caseList.tab);

  let caseList;
  if (status !== Case.STATUS_TYPES.closed) {
    caseList = await applicationContext
      .getUseCases()
      .getOpenConsolidatedCasesInteractor({
        applicationContext,
      });
  } else {
    caseList = await applicationContext
      .getUseCases()
      .getClosedConsolidatedCasesInteractor({
        applicationContext,
      });
  }
  caseList = orderBy(caseList, 'createdAt', 'desc');
  return { caseList };
};

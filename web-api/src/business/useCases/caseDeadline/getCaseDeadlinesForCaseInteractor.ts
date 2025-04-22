import { CaseDeadline } from '../../../../../shared/src/business/entities/CaseDeadline';
import { getCaseDeadlinesByDocketNumber } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';

export const getCaseDeadlinesForCaseInteractor = async ({
  docketNumber,
}: {
  docketNumber: string;
}) => {
  const caseDeadlines = await getCaseDeadlinesByDocketNumber({
    docketNumber,
  });

  return CaseDeadline.validateRawCollection(caseDeadlines);
};

import {
  CaseDeadline,
  RawCaseDeadline,
} from '@shared/business/entities/CaseDeadline';
import { getCaseDeadlinesByDocketNumber } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';

export const getCaseDeadlinesForCaseInteractor = async ({
  docketNumber,
}: {
  docketNumber: string;
}): Promise<RawCaseDeadline[]> => {
  const caseDeadlines = await getCaseDeadlinesByDocketNumber({
    docketNumber,
  });

  return CaseDeadline.validateRawCollection(caseDeadlines);
};

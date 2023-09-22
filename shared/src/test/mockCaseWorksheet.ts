import { MOCK_CASE } from '@shared/test/mockCase';
import { RawCaseWorksheet } from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { STATUS_OF_MATTER_OPTIONS } from '@shared/business/entities/EntityConstants';

export const MOCK_CASE_WORKSHEET: RawCaseWorksheet = {
  docketNumber: MOCK_CASE.docketNumber,
  entityName: 'CaseWorksheet',
  finalBriefDueDate: '2023-07-29',
  primaryIssue: 'anything',
  statusOfMatter: STATUS_OF_MATTER_OPTIONS[0],
};

import {
  CaseWorksheet,
  RawCaseWorksheet,
} from '@shared/business/entities/caseWorksheet/CaseWorksheet';
import { MOCK_CASE } from '@shared/test/mockCase';

export const MOCK_CASE_WORKSHEET: RawCaseWorksheet = {
  docketNumber: MOCK_CASE.docketNumber,
  entityName: 'CaseWorksheet',
  finalBriefDueDate: '2023-07-29',
  primaryIssue: 'anything',
  statusOfMatter: CaseWorksheet.STATUS_OF_MATTER_OPTIONS[0],
};

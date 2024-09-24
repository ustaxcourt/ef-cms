import {
  CASE_TYPE_DESCRIPTIONS_WITHOUT_IRS_NOTICE,
  CASE_TYPE_DESCRIPTIONS_WITH_IRS_NOTICE,
} from '../entities/EntityConstants';

export const getCaseDescription = (
  hasIrsNotice: boolean,
  originalCaseType: string,
) => {
  if (hasIrsNotice) {
    return CASE_TYPE_DESCRIPTIONS_WITH_IRS_NOTICE[originalCaseType];
  }
  return CASE_TYPE_DESCRIPTIONS_WITHOUT_IRS_NOTICE[originalCaseType];
};

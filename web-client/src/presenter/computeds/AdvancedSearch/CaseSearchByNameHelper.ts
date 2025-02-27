import {
  formatNow,
  FORMATS,
} from '../../../../../shared/src/business/utilities/DateHandler';
import { CASE_TYPES_MAP } from '@shared/business/entities/EntityConstants';

export const caseSearchByNameHelper = (): {
  today: string;
  caseTypeOptions: { label: string; value: string }[];
} => {
  const today = formatNow(FORMATS.YYYYMMDD);
  const caseTypeOptions = [
    {
      label: CASE_TYPES_MAP.djExemptOrg,
      value: CASE_TYPES_MAP.djExemptOrg,
    },
    {
      label: CASE_TYPES_MAP.djRetirementPlan,
      value: CASE_TYPES_MAP.djRetirementPlan,
    },
    {
      label: CASE_TYPES_MAP.cdp,
      value: CASE_TYPES_MAP.cdp,
    },
    {
      label: CASE_TYPES_MAP.passport,
      value: CASE_TYPES_MAP.passport,
    },
    {
      label: CASE_TYPES_MAP.whistleblower,
      value: CASE_TYPES_MAP.whistleblower,
    },
  ];
  return {
    today,
    caseTypeOptions,
  };
};

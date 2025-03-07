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
      label: CASE_TYPES_MAP.deficiency,
      value: CASE_TYPES_MAP.deficiency,
    },
    {
      label: 'L - Collection (Lien/Levy)',
      value: CASE_TYPES_MAP.cdp,
    },
    {
      label: 'P - Passport',
      value: CASE_TYPES_MAP.passport,
    },
    {
      label: 'R - Declaratory Judgment (Retirement Plan)',
      value: CASE_TYPES_MAP.djRetirementPlan,
    },
    {
      label: 'W - Whistleblower',
      value: CASE_TYPES_MAP.whistleblower,
    },
    {
      label: 'X - Declaratory Judgment (Exempt Organization)',
      value: CASE_TYPES_MAP.djExemptOrg,
    },
  ];
  return {
    today,
    caseTypeOptions,
  };
};

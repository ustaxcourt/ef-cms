import { caseSearchByNameHelper } from '@web-client/presenter/computeds/AdvancedSearch/CaseSearchByNameHelper';
import { CASE_TYPES_MAP } from '@shared/business/entities/EntityConstants';
import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';

describe('caseSearchByNameHelper', () => {
  it('returns appropriate defaults if permissions are not defined in state', () => {
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

    const result = caseSearchByNameHelper();

    expect(result).toEqual({
      today: formatNow(FORMATS.YYYYMMDD),
      caseTypeOptions,
    });
  });
});

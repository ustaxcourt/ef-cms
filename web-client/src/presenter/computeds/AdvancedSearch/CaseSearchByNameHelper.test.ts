import { caseSearchByNameHelper } from '@web-client/presenter/computeds/AdvancedSearch/CaseSearchByNameHelper';
import { CASE_TYPES_MAP } from '@shared/business/entities/EntityConstants';
import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';

describe('caseSearchByNameHelper', () => {
  it('returns appropriate defaults if permissions are not defined in state', () => {
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

    const result = caseSearchByNameHelper();

    expect(result).toEqual({
      today: formatNow(FORMATS.YYYYMMDD),
      caseTypeOptions,
    });
  });
});

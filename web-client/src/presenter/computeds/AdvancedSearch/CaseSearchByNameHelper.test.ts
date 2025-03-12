import { caseSearchByNameHelper } from '@web-client/presenter/computeds/AdvancedSearch/CaseSearchByNameHelper';
import {
  CASE_TYPES_MAP,
  PROCEDURE_TYPES_MAP,
} from '@shared/business/entities/EntityConstants';
import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';
import { ALL_SELECTION } from '@shared/business/entities/cases/CaseSearch';

describe('caseSearchByNameHelper', () => {
  it('returns appropriate defaults if permissions are not defined in state', () => {
    const caseTypeOptions = [
      {
        label: CASE_TYPES_MAP.deficiency,
        value: CASE_TYPES_MAP.deficiency,
      },
      {
        label: `L - ${CASE_TYPES_MAP.cdp}`,
        value: CASE_TYPES_MAP.cdp,
      },
      {
        label: `P - ${CASE_TYPES_MAP.passport}`,
        value: CASE_TYPES_MAP.passport,
      },
      {
        label: `R - ${CASE_TYPES_MAP.djRetirementPlan}`,
        value: CASE_TYPES_MAP.djRetirementPlan,
      },
      {
        label: `W - ${CASE_TYPES_MAP.whistleblower}`,
        value: CASE_TYPES_MAP.whistleblower,
      },
      {
        label: `X - ${CASE_TYPES_MAP.djExemptOrg}`,
        value: CASE_TYPES_MAP.djExemptOrg,
      },
    ];
    const caseProcedureOptions = [
      {
        label: 'All',
        value: ALL_SELECTION,
      },
      {
        label: PROCEDURE_TYPES_MAP.regular,
        value: PROCEDURE_TYPES_MAP.regular,
      },
      {
        label: PROCEDURE_TYPES_MAP.small,
        value: PROCEDURE_TYPES_MAP.small,
      },
    ];

    const result = caseSearchByNameHelper();

    expect(result).toEqual({
      today: formatNow(FORMATS.YYYYMMDD),
      caseTypeOptions,
      caseProcedureOptions,
    });
  });
});

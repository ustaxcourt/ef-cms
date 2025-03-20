import { ALL_SELECTION } from '@shared/business/entities/cases/CaseSearch';
import {
  formatNow,
  FORMATS,
} from '../../../../../shared/src/business/utilities/DateHandler';
import {
  CASE_TYPES,
  CASE_TYPES_MAP,
  PROCEDURE_TYPES_MAP,
} from '@shared/business/entities/EntityConstants';

export const ALL_DEFICIENCY_CASES = 'ALL_DEFICIENCY_CASES';

export const caseSearchByNameHelper = (): {
  today: string;
  caseTypeOptions: { label: string; value: string | string[] }[];
  caseProcedureOptions: { label: string; value: string }[];
} => {
  const allDeficiencyTypes = CASE_TYPES.filter(ct => {
    const notADeficiency: string[] = [
      CASE_TYPES_MAP.cdp,
      CASE_TYPES_MAP.passport,
      CASE_TYPES_MAP.djRetirementPlan,
      CASE_TYPES_MAP.djRetirementPlan,
      CASE_TYPES_MAP.whistleblower,
      CASE_TYPES_MAP.djExemptOrg,
    ];
    return !notADeficiency.includes(ct);
  });

  const today = formatNow(FORMATS.YYYYMMDD);
  const caseTypeOptions = [
    {
      label: 'None',
      value: allDeficiencyTypes, //10569: The court wants "None" to signify all deficiency types or anything without a docket Number suffix relating to case type.
    },
    {
      label: `L - Lien/Levy`,
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

  const caseProcedureOptions: { label: string; value: string }[] =
    Object.values(PROCEDURE_TYPES_MAP).map(procedureType => ({
      label: procedureType,
      value: procedureType,
    }));
  caseProcedureOptions.unshift({ label: 'All', value: ALL_SELECTION });

  return {
    today,
    caseTypeOptions,
    caseProcedureOptions,
  };
};

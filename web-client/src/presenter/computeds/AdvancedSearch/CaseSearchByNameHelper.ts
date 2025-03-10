import { ALL_SELECTION } from '@shared/business/entities/cases/CaseSearch';
import {
  formatNow,
  FORMATS,
} from '../../../../../shared/src/business/utilities/DateHandler';
import {
  CASE_TYPES_MAP,
  PROCEDURE_TYPES_MAP,
} from '@shared/business/entities/EntityConstants';

export const caseSearchByNameHelper = (): {
  today: string;
  caseTypeOptions: { label: string; value: string }[];
  caseProcedureOptions: { label: string; value: string }[];
} => {
  const today = formatNow(FORMATS.YYYYMMDD);
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

import { setBlockedCaseReportProcedureTypeAction } from '@web-client/presenter/actions/Reports/BlockedCaseReport/setBlockedCaseReportProcedureTypeAction';

export const setBlockedCaseReportCaseTypeSequence = [
  setBlockedCaseReportProcedureTypeAction,
] as unknown as (props: { procedureType: string }) => void;

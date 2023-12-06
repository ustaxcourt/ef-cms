import { CaseStatus } from 'aws-sdk/clients/support';
import { CaseType } from '@shared/business/entities/EntityConstants';
import {
  CustomCaseFilingMethods,
  CustomCaseProcedureTypes,
} from '@shared/business/entities/customCaseReportSearch/CustomCaseReportSearch';
import { setCustomCaseReportFiltersAction } from '../actions/CaseInventoryReport/setCustomCaseReportFiltersAction';

export const setCustomCaseReportFiltersSequence = [
  setCustomCaseReportFiltersAction,
] as unknown as (props: {
  caseStatuses?: { action: 'add' | 'remove'; caseStatus: CaseStatus };
  caseTypes?: { action: 'add' | 'remove'; caseType: CaseType };
  endDate?: string;
  startDate?: string;
  filingMethod?: CustomCaseFilingMethods;
  preferredTrialCities?: {
    action: 'add' | 'remove';
    preferredTrialCity: string;
  };
  highPriority?: boolean;
  procedureType?: CustomCaseProcedureTypes;
  judges?: { action: 'add' | 'remove'; judge: string };
}) => void;

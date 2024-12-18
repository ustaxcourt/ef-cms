import { exportTrialLocationEligibleCasesToCsvAction } from '@web-client/presenter/actions/TrialSession/exportTrialLocationEligibleCasesToCsvAction';
import { getExportTypeAction } from '@web-client/presenter/actions/TrialSession/getExportTypeAction';

export const exportTrialLocationToCsvSequence = [
  getExportTypeAction,
  {
    blockedCases: [],
    eligibleCases: [exportTrialLocationEligibleCasesToCsvAction],
  },
] as unknown as (props: {}) => void;

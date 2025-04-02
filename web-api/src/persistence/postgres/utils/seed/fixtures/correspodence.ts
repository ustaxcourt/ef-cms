import { calculateDate } from '@shared/business/utilities/DateHandler';
import { NewCaseCorrespondenceKysely } from '@web-api/database-schema';

export const correspondence: NewCaseCorrespondenceKysely[] = [
  {
    correspondenceId: 'f1aa4aa3-c214-424c-8870-d0049c5744d7',
    docketNumber: '103-19',
    documentTitle: 'Internal Memo',
    filedBy: 'Test Petitionsclerk',
    filingDate: calculateDate({ dateString: '2019-08-14T20:35:52.915Z' }),
    userId: '3805d1ab-18d0-43ec-bafb-654e83405416',
  },
];

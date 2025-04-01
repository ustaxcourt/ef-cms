import { PENALTY_TYPES } from '@shared/business/entities/EntityConstants';
import {
  calculateDate,
  formatNow,
} from '@shared/business/utilities/DateHandler';
import { StatisticPenaltyKysely } from '@web-api/database-types';

export const statisticPenalties: StatisticPenaltyKysely[] = [
  {
    name: 'Marie de France',
    penaltyAmount: '100',
    penaltyId: 'db557362-50ee-4440-aaff-0a9f1bfa30ed',
    penaltyType: PENALTY_TYPES.IRS_PENALTY_AMOUNT,
    statisticId: 'cb557361-50ee-4440-aaff-0a9f1bfa30ed',
    updatedAt: calculateDate({ dateString: formatNow() }),
  },
  {
    name: 'Marie Antoinette',
    penaltyAmount: '50',
    penaltyId: 'cb557362-50ee-4440-aaff-0a9f1bfa30ed',
    penaltyType: PENALTY_TYPES.IRS_PENALTY_AMOUNT,
    statisticId: 'ab557361-50ee-4440-aaff-0a9f1bfa30ed',
    updatedAt: calculateDate({ dateString: formatNow() }),
  },
  {
    name: 'Marie du Font',
    penaltyAmount: '0.5',
    penaltyId: '48128812-53b7-4c53-acc2-33eb31ebc0ef',
    penaltyType: PENALTY_TYPES.IRS_PENALTY_AMOUNT,
    statisticId: '38128813-53b7-4c53-acc2-33eb31ebc0ef',
    updatedAt: calculateDate({ dateString: formatNow() }),
  },
];

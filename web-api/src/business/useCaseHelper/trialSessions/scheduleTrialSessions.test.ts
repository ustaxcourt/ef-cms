import {
  getFakeFile,
  testPdfDoc,
} from '../../../../../shared/src/business/test/getFakeFile';

import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { DocketEntry } from '../../../../../shared/src/business/entities/DocketEntry';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { SESSION_TYPES } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { scheduleTrialSessions } from './scheduleTrialSessions';
import { serveGeneratedNoticesOnCase } from './serveGeneratedNoticesOnCase';

const mockCases = [];
const mockSpecialSessions = [];
const mockEndDate = '2019-09-22T04:00:00.000Z';
const mockStartDate = '2019-08-22T04:00:00.000Z';

describe('scheduleTrialSessions', () => {
  it('should format case and trial sessions into calendar compatible format', () => {
    let params = {
      cases: mockCases,
      endDate: mockEndDate,
      specialSessions: mockSpecialSessions,
      startDate: mockStartDate,
    };

    let result = scheduleTrialSessions(params);

    expect(result).toEqual([
      {
        city: 'City A',
        sessionType: SESSION_TYPES.regular,
        weekOf: '01/01/01',
      },
      {
        city: 'City B',
        sessionType: SESSION_TYPES.small,
        weekOf: '01/07/01',
      },
    ]);
  });
});

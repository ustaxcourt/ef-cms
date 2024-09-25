import { SESSION_TYPES } from '@shared/business/entities/EntityConstants';
import { ScheduledTrialSession } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/assignSessionsToWeeks';
import { writeTrialSessionDataToExcel } from './writeTrialSessionDataToExcel';

let mockScheduledTrialSessions: ScheduledTrialSession[] = [];
const cities = ['cityA', 'cityB', 'cityC', 'cityD', 'cityE', 'cityF'];
const weeks = ['09/01', '09/08', '09/15', '09/45', '09/89', '09/37'];

describe('writeTrialSessionDataToExcel', () => {
  for (const city of cities) {
    for (const week of weeks) {
      mockScheduledTrialSessions.push({
        city,
        sessionType: SESSION_TYPES.regular,
        weekOf: week,
      });
    }
  }
  it('should produce a vaguely valid xlsx file', async () => {
    await writeTrialSessionDataToExcel({
      scheduledTrialSessions: mockScheduledTrialSessions,
      termName: 'The Best Term 2',
    });
  });
});

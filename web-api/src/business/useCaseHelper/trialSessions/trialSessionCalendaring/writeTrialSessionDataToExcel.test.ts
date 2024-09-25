import { SESSION_TYPES } from '@shared/business/entities/EntityConstants';
import { ScheduledTrialSession } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/assignSessionsToWeeks';
import { writeTrialSessionDataToExcel } from './writeTrialSessionDataToExcel';

const cities = ['cityA', 'cityB', 'cityC', 'cityD', 'cityE', 'cityF'];
const weeks = ['09/01', '09/08', '09/15', '09/45', '09/89', '09/37'];

describe('writeTrialSessionDataToExcel', () => {
  it('should produce a vaguely valid xlsx file', async () => {
    let mockScheduledTrialSessions: ScheduledTrialSession[] = [];
    for (const city of cities) {
      for (const week of weeks) {
        const randomType = Math.floor(Math.random() * 3);
        mockScheduledTrialSessions.push({
          city,
          sessionType: SESSION_TYPES[Object.keys(SESSION_TYPES)[randomType]],
          weekOf: week,
        });
      }
    }
    await writeTrialSessionDataToExcel({
      scheduledTrialSessions: mockScheduledTrialSessions,
      termName: 'The Best Term 1',
      weeks,
    });
  });

  it('should handle data that produces empty cells gracefully', async () => {
    let mockScheduledTrialSessions: ScheduledTrialSession[] = [];
    let counter = 1;
    for (const city of cities) {
      for (const week of weeks) {
        counter++;
        if (counter % 4 !== 0) {
          mockScheduledTrialSessions.push({
            city,
            sessionType: SESSION_TYPES.regular,
            weekOf: week,
          });
        }
      }
    }

    await writeTrialSessionDataToExcel({
      scheduledTrialSessions: mockScheduledTrialSessions,
      termName: 'The Best Term 2',
      weeks,
    });
  });
});

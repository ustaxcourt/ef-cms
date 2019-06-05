import { formattedTrialSessions as formattedTrialSessionsComputed } from './formattedTrialSessions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const formattedTrialSessions = withAppContextDecorator(
  formattedTrialSessionsComputed,
);

describe('formattedTrialSessions', () => {
  it('formats array of trial sessions into array of trial session weeks and their sessions, sorted by date with swing sessions last', async () => {
    const trialSessions = [
      {
        judge: '1',
        startDate: '2019-11-27T15:00:00.000Z',
        swingSession: true,
      },
      {
        judge: '2',
        startDate: '2019-11-25T15:00:00.000Z',
        swingSession: true,
      },
      {
        judge: '3',
        startDate: '2019-11-25T15:00:00.000Z',
      },
      {
        judge: '4',
        startDate: '2019-12-02T15:00:00.000Z',
      },
      {
        judge: '5',
        startDate: '2019-12-02T15:00:00.000Z',
      },
    ];
    const result = await runCompute(formattedTrialSessions, {
      state: {
        trialSessions,
      },
    });
    expect(result).toEqual([
      {
        dateFormatted: 'November 25, 2019',
        sessions: [
          {
            judge: '3',
            startDate: '11/25/19',
            startOfWeek: 'November 25, 2019',
          },
          {
            judge: '2',
            startDate: '11/25/19',
            startOfWeek: 'November 25, 2019',
            swingSession: true,
          },
          {
            judge: '1',
            startDate: '11/27/19',
            startOfWeek: 'November 25, 2019',
            swingSession: true,
          },
        ],
      },
      {
        dateFormatted: 'December 2, 2019',
        sessions: [
          {
            judge: '4',
            startDate: '12/02/19',
            startOfWeek: 'December 2, 2019',
          },
          {
            judge: '5',
            startDate: '12/02/19',
            startOfWeek: 'December 2, 2019',
          },
        ],
      },
    ]);
  });
});

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
    expect(result.formattedSessions).toEqual([
      {
        dateFormatted: 'November 25, 2019',
        sessions: [
          {
            formattedStartDate: '11/25/19',
            judge: '3',
            startDate: '2019-11-25T15:00:00.000Z',
            startOfWeek: 'November 25, 2019',
          },
          {
            formattedStartDate: '11/25/19',
            judge: '2',
            startDate: '2019-11-25T15:00:00.000Z',
            startOfWeek: 'November 25, 2019',
            swingSession: true,
          },
          {
            formattedStartDate: '11/27/19',
            judge: '1',
            startDate: '2019-11-27T15:00:00.000Z',
            startOfWeek: 'November 25, 2019',
            swingSession: true,
          },
        ],
      },
      {
        dateFormatted: 'December 2, 2019',
        sessions: [
          {
            formattedStartDate: '12/02/19',
            judge: '4',
            startDate: '2019-12-02T15:00:00.000Z',
            startOfWeek: 'December 2, 2019',
          },
          {
            formattedStartDate: '12/02/19',
            judge: '5',
            startDate: '2019-12-02T15:00:00.000Z',
            startOfWeek: 'December 2, 2019',
          },
        ],
      },
    ]);
  });

  it('returns sessionsByTerm with only sessions in that term if form.term is set', async () => {
    const trialSessions = [
      {
        judge: '1',
        startDate: '2019-11-25T15:00:00.000Z',
        term: 'Winter',
        trialLocation: 'Denver, CO',
      },
      {
        judge: '2',
        startDate: '2019-11-25T15:00:00.000Z',
        term: 'Spring',
        trialLocation: 'Jacksonville, FL',
      },
      {
        judge: '3',
        startDate: '2019-11-25T15:00:00.000Z',
        term: 'Fall',
        trialLocation: 'Houston, TX',
      },
      {
        judge: '4',
        startDate: '2019-11-25T15:00:00.000Z',
        term: 'Winter',
        trialLocation: 'Birmingham, AL',
      },
      {
        judge: '5',
        startDate: '2019-11-25T15:00:00.000Z',
        term: 'Winter',
        trialLocation: 'Seattle, WA',
      },
    ];
    const result = await runCompute(formattedTrialSessions, {
      state: {
        form: {
          term: 'Winter',
        },
        trialSessions,
      },
    });
    expect(result.sessionsByTerm).toEqual([
      {
        formattedStartDate: '11/25/19',
        judge: '4',
        startDate: '2019-11-25T15:00:00.000Z',
        startOfWeek: 'November 25, 2019',
        term: 'Winter',
        trialLocation: 'Birmingham, AL',
      },
      {
        formattedStartDate: '11/25/19',
        judge: '1',
        startDate: '2019-11-25T15:00:00.000Z',
        startOfWeek: 'November 25, 2019',
        term: 'Winter',
        trialLocation: 'Denver, CO',
      },
      {
        formattedStartDate: '11/25/19',
        judge: '5',
        startDate: '2019-11-25T15:00:00.000Z',
        startOfWeek: 'November 25, 2019',
        term: 'Winter',
        trialLocation: 'Seattle, WA',
      },
    ]);
  });
});

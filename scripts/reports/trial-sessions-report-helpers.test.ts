import { MOCK_TRIAL_REGULAR, MOCK_TRIAL_REMOTE } from '@shared/test/mockTrial';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import {
  getUniqueValues,
  trialSessionsReport,
} from './trial-sessions-report-helpers';
import fs from 'fs';

jest.spyOn(fs, 'existsSync').mockReturnValue(false);
const unlink = jest.spyOn(fs, 'unlinkSync').mockImplementation(jest.fn());
const append = jest.spyOn(fs, 'appendFileSync').mockImplementation(jest.fn());

describe('getUniqueValues', () => {
  it('counts instances of each unique value for a given key in an array of objects', () => {
    const arrayOfObjects = [
      {
        songwriter: 'McCartney',
        title: 'Love Me Do',
        year: 1962,
      },
      {
        songwriter: 'Lennon/McCartney',
        title: 'From Me to You',
        year: 1963,
      },
      {
        songwriter: 'Lennon/McCartney',
        title: 'I Want to Hold Your Hand',
        year: 1963,
      },
      {
        songwriter: 'Lennon',
        title: 'Ticket to Ride',
        year: 1965,
      },
      {
        songwriter: 'Lennon',
        title: 'All You Need is Love',
        year: 1967,
      },
      {
        songwriter: 'Harrison',
        title: 'While My Guitar Gently Weeps',
        year: 1968,
      },
      {
        songwriter: 'McCartney',
        title: 'Let it Be',
        year: 1970,
      },
    ];
    const expectedUniqueSongwriters = {
      Harrison: 1,
      Lennon: 2,
      'Lennon/McCartney': 2,
      McCartney: 2,
    };
    const uniqueSongwriters = getUniqueValues({
      arrayOfObjects,
      keyToFilter: 'songwriter',
    });
    const uniqueYears = getUniqueValues({
      arrayOfObjects,
      keyToFilter: 'year',
    });
    expect(uniqueSongwriters).toEqual(expectedUniqueSongwriters);
    expect(Object.keys(uniqueYears).length).toEqual(6);
  });
});

describe('trialSessionsReport', () => {
  const start = '2020-01-01T05:00:00Z';
  const end = '2021-01-01T05:00:00Z';
  const filename = '/tmp/2020-trial-sessions.csv';
  const mockTrialSessions = [MOCK_TRIAL_REMOTE, MOCK_TRIAL_REGULAR];

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessions.mockReturnValue(Promise.resolve(mockTrialSessions));
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('retrieves trial sessions and outputs a CSV file', async () => {
    await trialSessionsReport({
      applicationContext,
      end,
      filename,
      start,
      stats: false,
    });
    expect(
      applicationContext.getPersistenceGateway().getTrialSessions,
    ).toHaveBeenCalled();
    expect(unlink).not.toHaveBeenCalled();
    expect(append).toHaveBeenCalled();
  });

  it('retrieves trial sessions and returns aggregated statistics', async () => {
    await trialSessionsReport({
      applicationContext,
      end,
      filename,
      start,
      stats: true,
    });
    expect(
      applicationContext.getPersistenceGateway().getTrialSessions,
    ).not.toHaveBeenCalled(); // because the results were cached
  });
});

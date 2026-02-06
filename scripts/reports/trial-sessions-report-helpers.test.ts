import { MOCK_TRIAL_REGULAR, MOCK_TRIAL_REMOTE } from '@shared/test/mockTrial';
import '@web-api/persistence/postgres/trialSessions/mocks.jest';
import {
  clearTrialSessionsCache,
  getUniqueValues,
  trialSessionsReport,
} from './trial-sessions-report-helpers';
import fs from 'fs';
import { getTrialSessions as getTrialSessionsMock } from '@web-api/persistence/postgres/trialSessions/getTrialSessions';

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

  it('handles missing keys in objects', () => {
    const arrayOfObjects = [{ key1: 'value1' }, { key2: 'value2' }];
    const result = getUniqueValues({
      arrayOfObjects,
      keyToFilter: 'key1',
    });
    expect(result).toEqual({ value1: 1 });
  });
});

describe('trialSessionsReport', () => {
  const begin = '2020-01-01T05:00:00Z';
  const end = '2021-01-01T05:00:00Z';
  const filename = '/tmp/2020-trial-sessions.csv';
  const mockTrialSessions = [MOCK_TRIAL_REMOTE, MOCK_TRIAL_REGULAR];
  const getTrialSessions = jest.mocked(getTrialSessionsMock);

  beforeAll(() => {
    getTrialSessions.mockResolvedValue(mockTrialSessions);
  });

  beforeEach(() => {
    clearTrialSessionsCache();
  });

  it('retrieves trial sessions and outputs a CSV file', async () => {
    getTrialSessions.mockResolvedValue([
      {
        ...MOCK_TRIAL_REMOTE,
        startDate: '2020-05-01T05:00:00Z',
        trialClerk: { name: 'Test Clerk', userId: '123' },
      },
      {
        ...MOCK_TRIAL_REGULAR,
        alternateTrialClerkName: 'Alternate Clerk',
        judge: { name: 'Judge Buch', userId: '456' },
        startDate: '2020-06-01T05:00:00Z',
        trialClerk: undefined,
      },
      {
        ...MOCK_TRIAL_REGULAR,
        alternateTrialClerkName: undefined,
        judge: { name: 'Judge Cohen', userId: '789' },
        startDate: '2020-07-01T05:00:00Z',
        trialClerk: {} as any,
      },
    ]);

    await trialSessionsReport({
      begin,
      end,
      filename,
      stats: false,
    });
    expect(getTrialSessions).toHaveBeenCalled();
    expect(unlink).not.toHaveBeenCalled();
    expect(append).toHaveBeenCalled();
  });

  it('retrieves trial sessions and returns aggregated statistics', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    getTrialSessions.mockResolvedValue([
      {
        ...MOCK_TRIAL_REGULAR,
        judge: { name: 'Judge Cohen', userId: '1' },
        proceedingType: 'In Person',
        sessionType: 'Regular',
        startDate: '2020-01-10T05:00:00Z',
        trialLocation: 'Z-City, Alabama',
      },
      {
        ...MOCK_TRIAL_REGULAR,
        judge: { name: 'Judge Buch', userId: '2' },
        proceedingType: 'In Person',
        sessionType: 'Small',
        startDate: '2020-01-11T05:00:00Z',
        trialLocation: 'Mobile, Alabama',
      },
      {
        ...MOCK_TRIAL_REGULAR,
        judge: undefined,
        proceedingType: 'Remote',
        sessionType: 'Small',
        startDate: '2020-01-12T05:00:00Z',
        trialLocation: 'Mobile, Alabama',
      },
      {
        ...MOCK_TRIAL_REGULAR,
        judge: { name: '', userId: '3' },
        proceedingType: 'Remote',
        sessionType: 'Small',
        startDate: '2020-01-13T05:00:00Z',
        trialLocation: 'Mobile, Alabama',
      },
      {
        ...MOCK_TRIAL_REGULAR,
        judge: { name: 'Judge Aardvark', userId: '4' },
        proceedingType: 'Remote',
        sessionType: 'Small',
        startDate: '2020-01-14T05:00:00Z',
        trialLocation: 'Anchorage, Alaska',
      },
    ]);

    await trialSessionsReport({
      begin,
      end,
      filename,
      stats: true,
    });

    const outputCall = logSpy.mock.calls.find(
      call => call[0] && call[0].total === 5,
    );
    if (!outputCall) {
      console.log('Log calls:', logSpy.mock.calls);
      throw new Error('Could not find expected log call');
    }
    const stats = outputCall[0];

    expect(Object.keys(stats.locations)).toEqual([
      'Mobile, Alabama',
      'Z-City, Alabama',
      'Anchorage, Alaska',
    ]);

    expect(Object.keys(stats.sessionTypes)).toEqual(['Small', 'Regular']);

    expect(Object.keys(stats.proceedingTypes)).toEqual(['In Person', 'Remote']);

    expect(Object.keys(stats.judges)).toEqual([
      'Aardvark',
      'Buch',
      'Cohen',
      '',
    ]);

    logSpy.mockClear();
    getTrialSessions.mockResolvedValue([
      {
        ...MOCK_TRIAL_REGULAR,
        judge: undefined,
        startDate: '2020-01-10T05:00:00Z',
      },
      {
        ...MOCK_TRIAL_REGULAR,
        judge: { name: 'Judge Buch', userId: '2' },
        startDate: '2020-01-11T05:00:00Z',
      },
    ]);
    clearTrialSessionsCache();
    await trialSessionsReport({
      begin,
      end,
      filename,
      stats: true,
    });
    const { judges } = logSpy.mock.calls[0][0];
    expect(Object.keys(judges)).toEqual(['Buch', '']); // sessions without a judge appear last in the stats
  });

  it('verifies that trial sessions are cached', async () => {
    getTrialSessions.mockClear();
    getTrialSessions.mockResolvedValue([
      { ...MOCK_TRIAL_REGULAR, startDate: begin },
    ]);

    await trialSessionsReport({
      begin,
      end,
      filename,
      stats: true,
    });
    expect(getTrialSessions).toHaveBeenCalledTimes(1);

    await trialSessionsReport({
      begin,
      end,
      filename,
      stats: true,
    });
    expect(getTrialSessions).toHaveBeenCalledTimes(1); // not called a second time because the results are cached
  });
});

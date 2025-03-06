import { MOCK_TRIAL_REGULAR } from '@shared/test/mockTrial';
import { generateMinuteSheetFilename } from './generateMinuteSheetFilename';
describe('generateMinuteSheetFilename', () => {
  it('generates a filename for a trial location containing a city that is one word', () => {
    const mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      trialLocation: 'Birmingham, Alabama',
      startDate: '2032-03-01T05:00:00.000Z',
    };
    const expectedFilename = `Minutes-Birmingham_Alabama 03_01_2032`;

    const result = generateMinuteSheetFilename({
      trialSession: mockTrialSession,
    });

    expect(result).toBe(expectedFilename);
  });

  it('generates a filename for a trial location containing a city that is two words', () => {
    const mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      trialLocation: 'San Francisco, California',
      startDate: '2037-03-01T05:00:00.000Z',
    };
    const expectedFilename = `Minutes-San Francisco_California 03_01_2037`;

    const result = generateMinuteSheetFilename({
      trialSession: mockTrialSession,
    });

    expect(result).toBe(expectedFilename);
  });

  it('generates a filename when a trial location is not included in the trial session', () => {
    const mockTrialSession = {
      ...MOCK_TRIAL_REGULAR,
      trialLocation: undefined,
      state: 'CA',
      startDate: '2037-03-01T05:00:00.000Z',
    };
    const expectedFilename = `Minutes-03_01_2037`;

    const result = generateMinuteSheetFilename({
      trialSession: mockTrialSession,
    });

    expect(result).toBe(expectedFilename);
  });
});

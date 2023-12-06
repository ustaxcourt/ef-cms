import { runCompute } from '@web-client/presenter/test.cerebral';
import { sessionAssignmentHelper } from './sessionAssignmentHelper';

const trialClerks = [
  { name: 'Ed the Horse', userId: 12345 },
  { name: 'He-man', userId: 67890 },
];

describe('sessionAssignmentHelper', () => {
  it('should add alternateTrialClerk of "Other" to formattedTrialClerks', () => {
    const result = runCompute(sessionAssignmentHelper, {
      state: { trialClerks },
    });
    expect(result.formattedTrialClerks[0]).toEqual({
      name: 'Other',
      userId: 'Other',
    });
    expect(result.showAlternateTrialClerkField).toEqual(false);
  });

  it('should set showAlternateTrialClerkField to true when "Other" is selected', () => {
    const result = runCompute(sessionAssignmentHelper, {
      state: { form: { trialClerkId: 'Other' }, trialClerks },
    });
    expect(result.showAlternateTrialClerkField).toEqual(true);
  });

  it('should set showAlternateTrialClerkField to false when "Other" is NOT selected', () => {
    const result = runCompute(sessionAssignmentHelper, {
      state: { form: { trialClerkId: 's0m3th1ng' }, trialClerks },
    });
    expect(result.showAlternateTrialClerkField).toEqual(false);
  });
});

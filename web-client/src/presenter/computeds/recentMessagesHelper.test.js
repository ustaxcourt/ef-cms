import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { recentMessagesHelper as recentMessagesHelperComputed } from './recentMessagesHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const recentMessagesHelper = withAppContextDecorator(
  recentMessagesHelperComputed,
);

describe('recentMessagesHelper', () => {
  const { STATUS_TYPES, TRIAL_SESSION_SCOPE_TYPES } =
    applicationContext.getConstants();

  it('returns 5 most recent messages', () => {
    const result = runCompute(recentMessagesHelper, {
      state: {
        messages: [
          {
            createdAt: '2019-01-01T00:00:00.000Z',
            docketNumber: '102-20',
            message: 'This is a test message',
          },
          {
            createdAt: '2019-01-02T00:00:00.000Z',
            docketNumber: '102-20',
            isCompleted: true,
            message: 'This is a test message',
          },
          {
            createdAt: '2019-01-03T00:00:00.000Z',
            docketNumber: '102-20',
            message: 'This is a test message',
          },
          {
            createdAt: '2019-01-04T00:00:00.000Z',
            docketNumber: '102-20',
            message: 'This is a test message',
          },
          {
            createdAt: '2019-01-05T00:00:00.000Z',
            docketNumber: '102-20',
            message: 'This is a test message',
          },
          {
            createdAt: '2019-01-06T00:00:00.000Z',
            docketNumber: '102-20',
            message: 'This is a test message',
          },
        ],
      },
    });

    expect(result).toMatchObject({
      recentMessages: [
        {
          createdAt: '2019-01-06T00:00:00.000Z',
          docketNumber: '102-20',
          message: 'This is a test message',
        },
        {
          createdAt: '2019-01-05T00:00:00.000Z',
          docketNumber: '102-20',
          message: 'This is a test message',
        },
        {
          createdAt: '2019-01-04T00:00:00.000Z',
          docketNumber: '102-20',
          message: 'This is a test message',
        },
        {
          createdAt: '2019-01-03T00:00:00.000Z',
          docketNumber: '102-20',
          message: 'This is a test message',
        },
        {
          createdAt: '2019-01-02T00:00:00.000Z',
          docketNumber: '102-20',
          message: 'This is a test message',
        },
      ],
    });
  });

  it('returns an empty array for recentMessages if state.messages is undefined', () => {
    const result = runCompute(recentMessagesHelper, {
      state: {
        messages: undefined,
      },
    });

    expect(result).toMatchObject({
      recentMessages: [],
    });
  });

  it('should set showTrialInformation to true when caseStatus is calendared', () => {
    const mockCalendaredMessage = {
      caseStatus: STATUS_TYPES.calendared,
      completedAt: '2019-01-02T16:29:13.122Z',
      createdAt: '2019-01-01T16:29:13.122Z',
      docketNumber: '101-20',
      message: 'This is a test message',
      trialDate: '2025-01-01T16:29:13.122Z',
      trialLocation: 'Austin, TX',
    };
    const result = runCompute(recentMessagesHelper, {
      state: {
        messageBoxToDisplay: {
          box: 'outbox',
        },
        messages: [mockCalendaredMessage],
        screenMetadata: {},
        user: {
          role: 'adc',
        },
      },
    });

    expect(result.recentMessages[0].showTrialInformation).toBe(true);
  });

  it('should set showTrialInformation to false when caseStatus is NOT calendared', () => {
    const mockCalendaredMessage = {
      caseStatus: STATUS_TYPES.new,
      completedAt: '2019-01-02T16:29:13.122Z',
      createdAt: '2019-01-01T16:29:13.122Z',
      docketNumber: '101-20',
      message: 'This is a test message',
    };

    const result = runCompute(recentMessagesHelper, {
      state: {
        messageBoxToDisplay: {
          box: 'outbox',
        },
        messages: [mockCalendaredMessage],
        screenMetadata: {},
        user: {
          role: 'adc',
        },
      },
    });

    expect(result.recentMessages[0].showTrialInformation).toBe(false);
  });

  it('should format the trialDate and trialLocation on the message when caseStatus is Calendared', () => {
    const mockCalendaredMessage = {
      caseStatus: STATUS_TYPES.calendared,
      completedAt: '2019-01-02T16:29:13.122Z',
      createdAt: '2019-01-01T16:29:13.122Z',
      docketNumber: '101-20',
      message: 'This is a test message',
      trialDate: '2019-01-01T16:29:13.122Z',
      trialLocation: 'Houston, Texas',
    };

    const result = runCompute(recentMessagesHelper, {
      state: {
        messageBoxToDisplay: {
          box: 'outbox',
        },
        messages: [mockCalendaredMessage],
        screenMetadata: {},
        user: {
          role: 'adc',
        },
      },
    });

    expect(result.recentMessages[0]).toMatchObject({
      formattedTrialDate: '01/01/19',
      formattedTrialLocation: 'Houston, TX',
    });
  });

  it(`should not abbreviate trialLocation when it is ${TRIAL_SESSION_SCOPE_TYPES.standaloneRemote}`, () => {
    const mockCalendaredMessage = {
      caseStatus: STATUS_TYPES.calendared,
      completedAt: '2019-01-02T16:29:13.122Z',
      createdAt: '2019-01-01T16:29:13.122Z',
      docketNumber: '101-20',
      message: 'This is a test message',
      trialDate: '2019-01-01T16:29:13.122Z',
      trialLocation: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
    };

    const result = runCompute(recentMessagesHelper, {
      state: {
        messageBoxToDisplay: {
          box: 'outbox',
        },
        messages: [mockCalendaredMessage],
        screenMetadata: {},
        user: {
          role: 'adc',
        },
      },
    });

    expect(
      applicationContext.getUtilities().abbreviateState,
    ).not.toHaveBeenCalled();
    expect(result.recentMessages[0]).toMatchObject({
      formattedTrialLocation: TRIAL_SESSION_SCOPE_TYPES.standaloneRemote,
    });
  });
});

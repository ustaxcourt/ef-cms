import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { recentMessagesHelper as recentMessagesHelperComputed } from './recentMessagesHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

const recentMessagesHelper = withAppContextDecorator(
  recentMessagesHelperComputed,
);

describe('recentMessagesHelper', () => {
  const { STATUS_TYPES } = applicationContext.getConstants();

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
      caseStatus: 'Calendared - 01/01/19 Houston, TX',
    });
  });
});

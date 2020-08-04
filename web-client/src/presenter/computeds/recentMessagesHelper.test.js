import { recentMessagesHelper as recentMessagesHelperComputed } from './recentMessagesHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const recentMessagesHelper = withAppContextDecorator(
  recentMessagesHelperComputed,
);

describe('recentMessagesHelper', () => {
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
});

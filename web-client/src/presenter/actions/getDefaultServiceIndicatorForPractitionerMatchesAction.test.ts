import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getDefaultServiceIndicatorForPractitionerMatchesAction } from './getDefaultServiceIndicatorForPractitionerMatchesAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getDefaultServiceIndicatorForPractitionerMatchesAction', () => {
  const { SERVICE_INDICATOR_TYPES } = applicationContext.getConstants();

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('returns electronic if the selected practitioner has an email address', async () => {
    const result = await runAction(
      getDefaultServiceIndicatorForPractitionerMatchesAction('practitioners'),
      {
        modules: {
          presenter,
        },
        state: {
          modal: {
            practitioners: [
              { email: 'test1@example.com', userId: '1' },
              { email: 'test2@example.com', userId: '2' },
              { userId: '3' },
            ],
            user: {
              userId: '2',
            },
          },
        },
      },
    );

    expect(result.output).toEqual({
      defaultServiceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    });
  });

  it('returns paper if the selected practitioner does NOT have an email address', async () => {
    const result = await runAction(
      getDefaultServiceIndicatorForPractitionerMatchesAction('practitioners'),
      {
        modules: {
          presenter,
        },
        state: {
          modal: {
            practitioners: [
              { email: 'test1@example.com', userId: '1' },
              { email: 'test2@example.com', userId: '2' },
              { userId: '3' },
            ],
            user: {
              userId: '3',
            },
          },
        },
      },
    );

    expect(result.output).toEqual({
      defaultServiceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    });
  });

  it('returns null if there are no matches', async () => {
    const result = await runAction(
      getDefaultServiceIndicatorForPractitionerMatchesAction(
        'definitely_not_a_match',
      ),
      {
        modules: {
          presenter,
        },
        state: {
          modal: {
            practitioners: [
              { email: 'test1@example.com', userId: '1' },
              { email: 'test2@example.com', userId: '2' },
              { userId: '3' },
            ],
            user: {
              userId: '1',
            },
          },
        },
      },
    );

    expect(result.output).toEqual({
      defaultServiceIndicator: null,
    });
  });
  it('returns null if there is no selected practitioner', async () => {
    const result = await runAction(
      getDefaultServiceIndicatorForPractitionerMatchesAction('practitioners'),
      {
        modules: {
          presenter,
        },
        state: {
          modal: {
            practitioners: [
              { email: 'test1@example.com', userId: '1' },
              { email: 'test2@example.com', userId: '2' },
              { userId: '3' },
            ],
            user: {},
          },
        },
      },
    );

    expect(result.output).toEqual({
      defaultServiceIndicator: null,
    });
  });
});

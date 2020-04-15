import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-public';
import { runAction } from 'cerebral/test';
import { submitPublicOrderAdvancedSearchAction } from './submitPublicOrderAdvancedSearchAction';

describe('submitPublicOrderAdvancedSearchAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('gets the public order information', async () => {
    await runAction(submitPublicOrderAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: {
        advancedSearchForm: {
          orderSearch: {
            orderKeyword: 'a',
          },
        },
      },
    });

    expect(
      applicationContext.getUseCases().orderPublicSearchInteractor,
    ).toBeCalled();
    expect(
      applicationContext.getUseCases().orderPublicSearchInteractor.mock
        .calls[0][0],
    ).toMatchObject({
      searchParams: {
        orderKeyword: 'a',
      },
    });
  });
});

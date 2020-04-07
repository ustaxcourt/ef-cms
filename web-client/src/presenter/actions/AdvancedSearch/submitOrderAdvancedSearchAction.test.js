import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { submitOrderAdvancedSearchAction } from './submitOrderAdvancedSearchAction';

presenter.providers.applicationContext = applicationContext;

describe('submitOrderAdvancedSearchAction', () => {
  it('should call orderAdvancedSearchInteractor with the state.advancedSearchForm as searchParams', async () => {
    await runAction(submitOrderAdvancedSearchAction, {
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

    console.log(
      applicationContext.getUseCases().orderAdvancedSearchInteractor.mock
        .calls[0][0],
    );

    expect(
      applicationContext.getUseCases().orderAdvancedSearchInteractor.mock.calls
        .length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().orderAdvancedSearchInteractor.mock
        .calls[0][0],
    ).toMatchObject({
      searchParams: 'a',
    });
  });
});

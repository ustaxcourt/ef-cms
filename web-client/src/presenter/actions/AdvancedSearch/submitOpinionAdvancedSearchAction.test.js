import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { submitOpinionAdvancedSearchAction } from './submitOpinionAdvancedSearchAction';

presenter.providers.applicationContext = applicationContext;

describe('submitOpinionAdvancedSearchAction', () => {
  it('should call opinionAdvancedSearchInteractor with the state.advancedSearchForm as searchParams', async () => {
    await runAction(submitOpinionAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: {
        advancedSearchForm: {
          opinionSearch: {
            opinionKeyword: 'a',
          },
        },
      },
    });

    expect(
      applicationContext.getUseCases().opinionAdvancedSearchInteractor.mock
        .calls.length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().opinionAdvancedSearchInteractor.mock
        .calls[0][0],
    ).toMatchObject({
      searchParams: {
        opinionKeyword: 'a',
      },
    });
  });
});

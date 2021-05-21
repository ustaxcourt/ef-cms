import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { submitOpinionAdvancedSearchAction } from './submitOpinionAdvancedSearchAction';

describe('submitOpinionAdvancedSearchAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should call opinionAdvancedSearchInteractor with the state.advancedSearchForm as searchParams', async () => {
    await runAction(submitOpinionAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: {
        advancedSearchForm: {
          opinionSearch: {
            keyword: 'a',
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
        .calls[0][1],
    ).toMatchObject({
      searchParams: {
        keyword: 'a',
      },
    });
  });

  it('should remove the docketNumberSuffix when a docket number is present', async () => {
    await runAction(submitOpinionAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: {
        advancedSearchForm: {
          opinionSearch: {
            docketNumber: '105-20L',
            keyword: 'a',
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
        .calls[0][1],
    ).toMatchObject({
      searchParams: {
        docketNumber: '105-20',
        keyword: 'a',
      },
    });
  });
});

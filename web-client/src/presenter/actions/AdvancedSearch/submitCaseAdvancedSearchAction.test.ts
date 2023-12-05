import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { submitCaseAdvancedSearchAction } from './submitCaseAdvancedSearchAction';

describe('submitCaseAdvancedSearchAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should call caseAdvancedSearchInteractor with the state.advancedSearchForm as searchParams', async () => {
    await runAction(submitCaseAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: {
        advancedSearchForm: {
          caseSearchByName: {
            countryType: 'c',
            petitionerName: 'a',
            petitionerState: 'b',
            yearFiledMax: '2',
            yearFiledMin: '1',
          },
        },
      },
    });

    expect(
      applicationContext.getUseCases().caseAdvancedSearchInteractor.mock.calls
        .length,
    ).toEqual(1);
    expect(
      applicationContext.getUseCases().caseAdvancedSearchInteractor.mock
        .calls[0][1].searchParams,
    ).toEqual({
      countryType: 'c',
      petitionerName: 'a',
      petitionerState: 'b',
      yearFiledMax: '2',
      yearFiledMin: '1',
    });
  });
});

import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { submitCaseAdvancedSearchAction } from './submitCaseAdvancedSearchAction';

presenter.providers.applicationContext = applicationContext;

describe('submitCaseAdvancedSearchAction', () => {
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
        .calls[0][0].searchParams,
    ).toEqual({
      countryType: 'c',
      petitionerName: 'a',
      petitionerState: 'b',
      yearFiledMax: '2',
      yearFiledMin: '1',
    });
  });
});

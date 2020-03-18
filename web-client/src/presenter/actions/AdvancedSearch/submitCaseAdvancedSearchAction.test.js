import { applicationContext } from '../../../applicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { submitCaseAdvancedSearchAction } from './submitCaseAdvancedSearchAction';

describe('submitCaseAdvancedSearchAction', () => {
  let caseAdvancedSearchInteractorStub;

  beforeEach(() => {
    caseAdvancedSearchInteractorStub = jest.fn();

    presenter.providers.applicationContext = {
      ...applicationContext,
      getUseCases: () => ({
        caseAdvancedSearchInteractor: caseAdvancedSearchInteractorStub,
      }),
    };
  });

  it('should call caseAdvancedSearchInteractor with the state.advancedSearchForm as searchParams', async () => {
    await runAction(submitCaseAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: {
        advancedSearchForm: {
          countryType: 'c',
          petitionerName: 'a',
          petitionerState: 'b',
          yearFiledMax: '2',
          yearFiledMin: '1',
        },
      },
    });

    expect(caseAdvancedSearchInteractorStub.mock.calls.length).toEqual(1);
    expect(
      caseAdvancedSearchInteractorStub.mock.calls[0][0].searchParams,
    ).toEqual({
      countryType: 'c',
      petitionerName: 'a',
      petitionerState: 'b',
      yearFiledMax: '2',
      yearFiledMin: '1',
    });
  });
});

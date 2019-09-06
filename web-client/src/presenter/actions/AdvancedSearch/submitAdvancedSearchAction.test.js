import { applicationContext } from '../../../applicationContext';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { submitAdvancedSearchAction } from './submitAdvancedSearchAction';
import sinon from 'sinon';

describe('submitAdvancedSearchAction', () => {
  let caseSearchInteractorStub;

  beforeEach(() => {
    caseSearchInteractorStub = sinon.stub();

    presenter.providers.applicationContext = {
      ...applicationContext,
      getUseCases: () => ({
        caseSearchInteractor: caseSearchInteractorStub,
      }),
    };
  });

  it('should call caseSearchInteractor with the state.form as searchParams', async () => {
    await runAction(submitAdvancedSearchAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          countryType: 'c',
          petitionerName: 'a',
          petitionerState: 'b',
          yearFiledMax: '2',
          yearFiledMin: '1',
        },
      },
    });

    expect(caseSearchInteractorStub.calledOnce).toEqual(true);
    expect(caseSearchInteractorStub.getCall(0).args[0].searchParams).toEqual({
      countryType: 'c',
      petitionerName: 'a',
      petitionerState: 'b',
      yearFiledMax: '2',
      yearFiledMin: '1',
    });
  });
});

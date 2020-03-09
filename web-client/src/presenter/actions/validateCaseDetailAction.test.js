import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { validateCaseDetailAction } from './validateCaseDetailAction';
import sinon from 'sinon';

const validateCaseDetailStub = sinon.stub().returns(null);
const successStub = sinon.stub();
const errorStub = sinon.stub();

presenter.providers.applicationContext = {
  getUseCases: () => ({
    validateCaseDetailInteractor: validateCaseDetailStub,
  }),
};

presenter.providers.path = {
  error: errorStub,
  success: successStub,
};

describe('validateCaseDetail', () => {
  it('should call the success path when no errors are found', async () => {
    await runAction(validateCaseDetailAction, {
      modules: {
        presenter,
      },
      props: {
        combinedCaseDetailWithForm: {
          caseId: '123',
          irsNoticeDate: '2009-10-13',
        },
      },
      state: {},
    });
    expect(validateCaseDetailStub.getCall(0).args[0].caseDetail).toMatchObject({
      caseId: '123',
      irsNoticeDate: '2009-10-13',
    });
    expect(successStub.calledOnce).toEqual(true);
  });

  it('should call the error path when any errors are found', async () => {
    validateCaseDetailStub.returns('error');
    await runAction(validateCaseDetailAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          caseId: '123',
        },
        form: {
          irsDay: '13',
          irsMonth: '10',
          irsYear: '2009',
        },
      },
    });
    expect(errorStub.calledOnce).toEqual(true);
  });
});

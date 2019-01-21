import { runAction } from 'cerebral/test';
import { CerebralTest } from 'cerebral/test';

import presenter from '../presenter';
import sinon from 'sinon';
import validateCaseDetail from '../presenter/actions/validateCaseDetailAction';

const validateCaseDetailStub = sinon.stub().returns(null);
const successStub = sinon.stub();
const errorStub = sinon.stub();

presenter.providers.applicationContext = {
  getUseCases: () => ({
    validateCaseDetail: validateCaseDetailStub,
  }),
};

presenter.providers.path = {
  success: successStub,
  error: errorStub,
};

const test = CerebralTest(presenter);

describe('validateCaseDetail', async () => {
  it('should call the path succes when no errors are found', async () => {
    await runAction(validateCaseDetail, {
      state: {
        form: {
          year: '2009',
          month: '10',
          day: '13',
        },
        caseDetail: {
          caseId: '123',
        },
      },
      modules: {
        presenter,
      },
    });
    expect(validateCaseDetailStub.getCall(0).args[0].caseDetail).toMatchObject({
      caseId: '123',
      irsNoticeDate: '2009-10-13',
    });
    expect(successStub.calledOnce).toEqual(true);
  });

  it('should call the path error when any errors are found', async () => {
    validateCaseDetailStub.returns('error');
    const { state } = await runAction(validateCaseDetail, {
      state: {
        form: {
          year: '2009',
          month: '10',
          day: '13',
        },
        caseDetail: {
          caseId: '123',
        },
      },
      modules: {
        presenter,
      },
    });
    expect(state.caseDetailErrors).toEqual('error');
    expect(errorStub.calledOnce).toEqual(true);
  });
});

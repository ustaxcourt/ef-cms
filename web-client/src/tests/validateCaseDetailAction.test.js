import { runAction } from 'cerebral/test';

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

describe('validateCaseDetail', async () => {
  it('should call the path success when no errors are found', async () => {
    await runAction(validateCaseDetail, {
      state: {},
      modules: {
        presenter,
      },
      props: {
        combinedCaseDetailWithForm: {
          caseId: '123',
          irsNoticeDate: '2009-10-13',
          payGovDate: '2010-01-01',
        },
      },
    });
    expect(validateCaseDetailStub.getCall(0).args[0].caseDetail).toMatchObject({
      caseId: '123',
      irsNoticeDate: '2009-10-13',
      payGovDate: '2010-01-01',
    });
    expect(successStub.calledOnce).toEqual(true);
  });

  it('should call the path error when any errors are found', async () => {
    validateCaseDetailStub.returns('error');
    const { state } = await runAction(validateCaseDetail, {
      state: {
        form: {
          irsYear: '2009',
          irsMonth: '10',
          irsDay: '13',
          payGovYear: '2010',
          payGovMonth: '01',
          payGovDay: '01',
        },
        caseDetail: {
          caseId: '123',
        },
      },
      modules: {
        presenter,
      },
    });
    expect(errorStub.calledOnce).toEqual(true);
  });
});

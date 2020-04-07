import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { validateCaseDetailAction } from './validateCaseDetailAction';

let validateCaseDetailStub = jest.fn().mockReturnValue(null);
const successStub = jest.fn();
const errorStub = jest.fn();

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
        formWithComputedDates: {
          caseId: '123',
          irsNoticeDate: '2009-10-13',
        },
      },
      state: {},
    });
    expect(validateCaseDetailStub.mock.calls[0][0].caseDetail).toMatchObject({
      caseId: '123',
      irsNoticeDate: '2009-10-13',
    });
    expect(successStub.mock.calls.length).toEqual(1);
  });

  it('should call the error path when any errors are found', async () => {
    validateCaseDetailStub = jest.fn().mockReturnValue('error');
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
    expect(errorStub.mock.calls.length).toEqual(1);
  });
});

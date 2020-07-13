import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { validateCreateCaseMessageAction } from './validateCreateCaseMessageAction';

describe('validateCreateCaseMessageAction', () => {
  let successStub;
  let errorStub;

  beforeAll(() => {
    successStub = jest.fn();
    errorStub = jest.fn();

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: errorStub,
      success: successStub,
    };

    applicationContext
      .getUseCases()
      .validateCreateCaseMessageInteractor.mockReturnValue(null);
  });

  it('should call the success path when no errors are found', async () => {
    await runAction(validateCreateCaseMessageAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        modal: {
          form: {
            caseId: 'fa1179bd-04f5-4934-a716-964d8d7babc6',
            from: 'yup',
            fromSection: 'yup',
            fromUserId: 'fa1179bd-04f5-4934-a716-964d8d7babc6',
            message: 'yup',
            subject: 'hi',
            to: 'yup',
            toSection: 'yup',
            toUserId: 'fa1179bd-04f5-4934-a716-964d8d7babc6',
          },
        },
      },
    });
    expect(
      applicationContext.getUseCases().validateCreateCaseMessageInteractor.mock
        .calls[0][0].message,
    ).toMatchObject({
      caseId: 'fa1179bd-04f5-4934-a716-964d8d7babc6',
      from: 'yup',
      fromSection: 'yup',
      fromUserId: 'fa1179bd-04f5-4934-a716-964d8d7babc6',
      message: 'yup',
      subject: 'hi',
      to: 'yup',
      toSection: 'yup',
      toUserId: 'fa1179bd-04f5-4934-a716-964d8d7babc6',
    });
    expect(successStub.mock.calls.length).toEqual(1);
  });

  it('should call the error path when any errors are found', async () => {
    applicationContext
      .getUseCases()
      .validateCreateCaseMessageInteractor.mockReturnValue('error');

    await runAction(validateCreateCaseMessageAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          form: {
            caseId: 'fa1179bd-04f5-4934-a716-964d8d7babc6',
            from: 'yup',
            fromSection: 'yup',
            fromUserId: 'fa1179bd-04f5-4934-a716-964d8d7babc6',
            message: 'yup',
            to: 'yup',
            toSection: 'yup',
            toUserId: 'fa1179bd-04f5-4934-a716-964d8d7babc6',
          },
        },
      },
    });
    expect(errorStub.mock.calls.length).toEqual(1);
  });
});

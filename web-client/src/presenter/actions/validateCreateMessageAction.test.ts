import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateCreateMessageAction } from './validateCreateMessageAction';

describe('validateCreateMessageAction', () => {
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
      .validateCreateMessageInteractor.mockReturnValue(null);
  });

  it('should call the success path when no errors are found', async () => {
    await runAction(validateCreateMessageAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        modal: {
          form: {
            docketNumber: '123-45',
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
      applicationContext.getUseCases().validateCreateMessageInteractor.mock
        .calls[0][0].message,
    ).toMatchObject({
      docketNumber: '123-45',
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
      .validateCreateMessageInteractor.mockReturnValue('error');

    await runAction(validateCreateMessageAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          form: {
            docketNumber: '123-45',
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

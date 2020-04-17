import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { createPractitionerUserAction } from './createPractitionerUserAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

const { createPractitionerUserInteractor } = applicationContext.getUseCases();

describe('createPractitionerUserAction', () => {
  let successMock;
  let errorMock;

  beforeAll(() => {
    successMock = jest.fn();
    errorMock = jest.fn();

    presenter.providers.path = {
      error: errorMock,
      success: successMock,
    };
  });
  it('calls the create practitioner user interactor', async () => {
    await runAction(createPractitionerUserAction, {
      modules: {
        presenter,
      },
      props: {
        computedDate: '2019-03-01T21:40:46.415Z',
      },
      state: {
        form: {
          user: {},
        },
      },
    });

    expect(createPractitionerUserInteractor).toHaveBeenCalled();
  });

  it('returns path.error if the use case throws an error', async () => {
    createPractitionerUserInteractor.mockImplementation(() => {
      throw new Error('bad!');
    });

    await runAction(createPractitionerUserAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          user: {},
        },
      },
    });

    expect(createPractitionerUserInteractor).toHaveBeenCalled();
    expect(errorMock).toHaveBeenCalled();
  });
});

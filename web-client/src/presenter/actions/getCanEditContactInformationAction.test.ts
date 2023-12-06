import { getCanEditContactInformationAction } from './getCanEditContactInformationAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getCanEditContactInformationAction', () => {
  let mockYes;
  let mockNo;

  beforeAll(() => {
    mockYes = jest.fn();
    mockNo = jest.fn();

    presenter.providers.path = {
      no: mockNo,
      yes: mockYes,
    };
  });

  it('should return the no path when the user already has a contact information change processing', async () => {
    await runAction(getCanEditContactInformationAction, {
      modules: {
        presenter,
      },
      props: {
        user: {
          isUpdatingInformation: true,
        },
      },
    });

    expect(mockNo).toHaveBeenCalled();
  });

  it('should return an error message when the user already has a contact information change processing', async () => {
    await runAction(getCanEditContactInformationAction, {
      modules: {
        presenter,
      },
      props: {
        user: {
          isUpdatingInformation: true,
        },
      },
    });

    expect(mockNo.mock.calls[0][0]).toMatchObject({
      alertError: {
        message: 'Update already in progress. Please try again later.',
        title: 'Update Error',
      },
    });
  });

  it('should return the yes path when the user does not have a contact information change processing', async () => {
    await runAction(getCanEditContactInformationAction, {
      modules: {
        presenter,
      },
      props: {
        user: {
          isUpdatingInformation: false,
        },
      },
    });

    expect(mockYes).toHaveBeenCalled();
  });
});

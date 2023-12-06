import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateFileSizeAction } from './validateFileSizeAction';

describe('validateFileSizeAction', () => {
  let mockValid;
  let mockInvalid;
  let fakeFile;

  beforeAll(() => {
    mockValid = jest.fn();
    mockInvalid = jest.fn();

    global.alert = () => null;
    fakeFile = {
      name: 'fakefile.pdf',
      size: 1048576,
    };

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      invalid: mockInvalid,
      valid: mockValid,
    };
  });

  it('should return the valid() path if the file size is less than the limit', async () => {
    await runAction(validateFileSizeAction, {
      modules: {
        presenter,
      },
      props: {
        file: { ...fakeFile, size: 1 },
      },
      state: {},
    });
    expect(mockValid).toHaveBeenCalled();
  });

  it('should return the valid() path if the file size is equal to the limit', async () => {
    await runAction(validateFileSizeAction, {
      modules: {
        presenter,
      },
      props: {
        file: fakeFile,
      },
      state: {},
    });
    expect(mockValid).toHaveBeenCalled();
  });

  it('should return the invalid() path if the file size is greater than the limit', async () => {
    await runAction(validateFileSizeAction, {
      modules: {
        presenter,
      },
      props: {
        file: { ...fakeFile, size: 1048576000 },
      },
      state: {},
    });
    expect(mockInvalid).toHaveBeenCalled();
  });
});

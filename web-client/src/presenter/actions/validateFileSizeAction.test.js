import { applicationContext } from '../../applicationContext';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { validateFileSizeAction } from './validateFileSizeAction';

presenter.providers.applicationContext = applicationContext;

const fakeFile = {
  name: 'fakefile.pdf',
  size: 1048576,
};

const mockValid = jest.fn();
const mockInvalid = jest.fn();

global.alert = () => null;

presenter.providers.path = {
  invalid: mockInvalid,
  valid: mockValid,
};

describe('validateFileSizeAction', () => {
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

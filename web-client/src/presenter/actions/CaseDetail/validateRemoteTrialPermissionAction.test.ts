import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { validateRemoteTrialPermissionAction } from './validateRemoteTrialPermissionAction';

describe('validateRemoteTrialPermissionAction', () => {
  const pathSuccessStub = jest.fn();
  const pathErrorStub = jest.fn();

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = {
      error: pathErrorStub,
      success: pathSuccessStub,
    };
  });

  beforeEach(() => {
    pathSuccessStub.mockReset();
    pathErrorStub.mockReset();
  });

  it('should return error when remoteTrialGrantedDate is empty and there is no existing date', async () => {
    await runAction(validateRemoteTrialPermissionAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          remoteTrialGrantedDate: null,
        },
        modal: {
          remoteTrialGrantedDate: '',
        },
      },
    });

    expect(pathErrorStub).toHaveBeenCalledWith({
      errors: { remoteTrialGrantedDate: 'Enter a valid date' },
    });
    expect(pathSuccessStub).not.toHaveBeenCalled();
  });

  it('should return success when remoteTrialGrantedDate is empty and there is an existing date to clear', async () => {
    await runAction(validateRemoteTrialPermissionAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          remoteTrialGrantedDate: '2024-01-14T05:00:00.000+00:00',
        },
        modal: {
          remoteTrialGrantedDate: '',
        },
      },
    });

    expect(pathSuccessStub).toHaveBeenCalled();
    expect(pathErrorStub).not.toHaveBeenCalled();
  });

  it('should return error when remoteTrialGrantedDate is undefined and there is no existing date', async () => {
    await runAction(validateRemoteTrialPermissionAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          remoteTrialGrantedDate: null,
        },
        modal: {},
      },
    });

    expect(pathErrorStub).toHaveBeenCalledWith({
      errors: { remoteTrialGrantedDate: 'Enter a valid date' },
    });
    expect(pathSuccessStub).not.toHaveBeenCalled();
  });

  it('should return success when remoteTrialGrantedDate is undefined and there is an existing date to clear', async () => {
    await runAction(validateRemoteTrialPermissionAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          remoteTrialGrantedDate: '2024-01-14T05:00:00.000+00:00',
        },
        modal: {},
      },
    });

    expect(pathSuccessStub).toHaveBeenCalled();
    expect(pathErrorStub).not.toHaveBeenCalled();
  });

  it('should return error when remoteTrialGrantedDate is only whitespace and there is no existing date', async () => {
    await runAction(validateRemoteTrialPermissionAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          remoteTrialGrantedDate: null,
        },
        modal: {
          remoteTrialGrantedDate: '   ',
        },
      },
    });

    expect(pathErrorStub).toHaveBeenCalledWith({
      errors: { remoteTrialGrantedDate: 'Enter a valid date' },
    });
    expect(pathSuccessStub).not.toHaveBeenCalled();
  });

  it('should return success when remoteTrialGrantedDate is only whitespace and there is an existing date to clear', async () => {
    await runAction(validateRemoteTrialPermissionAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          remoteTrialGrantedDate: '2024-01-14T05:00:00.000+00:00',
        },
        modal: {
          remoteTrialGrantedDate: '   ',
        },
      },
    });

    expect(pathSuccessStub).toHaveBeenCalled();
    expect(pathErrorStub).not.toHaveBeenCalled();
  });

  it('should return the error path when remoteTrialGrantedDate is not a valid ISO date', async () => {
    await runAction(validateRemoteTrialPermissionAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          remoteTrialGrantedDate: 'not-a-valid-date',
        },
      },
    });

    expect(pathErrorStub).toHaveBeenCalledWith({
      errors: { remoteTrialGrantedDate: 'Format date as MM/DD/YYYY' },
    });
  });

  it('should return the error path when remoteTrialGrantedDate has invalid format', async () => {
    await runAction(validateRemoteTrialPermissionAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          remoteTrialGrantedDate: '13/45/2023',
        },
      },
    });

    expect(pathErrorStub).toHaveBeenCalledWith({
      errors: { remoteTrialGrantedDate: 'Format date as MM/DD/YYYY' },
    });
  });

  it('should return the success path when remoteTrialGrantedDate is a valid ISO date in the past', async () => {
    await runAction(validateRemoteTrialPermissionAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          remoteTrialGrantedDate: '2024-01-14T05:00:00.000+00:00',
        },
      },
    });

    expect(pathSuccessStub).toHaveBeenCalled();
  });

  it('should return the error path when remoteTrialGrantedDate is in the future', async () => {
    await runAction(validateRemoteTrialPermissionAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          remoteTrialGrantedDate: '2099-12-31T05:00:00.000+00:00',
        },
      },
    });

    expect(pathErrorStub).toHaveBeenCalledWith({
      errors: { remoteTrialGrantedDate: 'Date cannot be in the future' },
    });
  });
});

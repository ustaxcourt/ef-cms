import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { editRemoteStatusAction } from './editRemoteStatusAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('editRemoteStatusAction', () => {
  const mockDocketNumber = '123-45';
  const mockRemoteTrialGrantedDate = '2023-10-14T00:00:00.000Z';

  presenter.providers.applicationContext = applicationContext;

  it('should call updateCaseDetailsInteractor with remoteTrialGranted set to true when a date is provided', async () => {
    const mockUpdatedCase = {
      docketNumber: mockDocketNumber,
      remoteTrialGranted: true,
      remoteTrialGrantedDate: mockRemoteTrialGrantedDate,
    };

    applicationContext
      .getUseCases()
      .updateCaseDetailsInteractor.mockResolvedValue(mockUpdatedCase);

    const result = await runAction(editRemoteStatusAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
          status: 'General Docket - At Issue (Ready for Trial)',
        },
        modal: {
          remoteTrialGrantedDate: mockRemoteTrialGrantedDate,
        },
      },
    });

    expect(
      applicationContext.getUseCases().updateCaseDetailsInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().updateCaseDetailsInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      caseDetails: {
        remoteTrialGranted: true,
        remoteTrialGrantedDate: mockRemoteTrialGrantedDate,
      },
      docketNumber: mockDocketNumber,
    });

    expect(result.output).toEqual({
      alertSuccess: {
        message: 'Successfully updated motion to proceed remotely date.',
      },
      caseDetail: mockUpdatedCase,
    });
  });

  it('should call updateCaseDetailsInteractor with remoteTrialGranted set to false when date is empty', async () => {
    const mockUpdatedCase = {
      docketNumber: mockDocketNumber,
      remoteTrialGranted: false,
      remoteTrialGrantedDate: null,
    };

    applicationContext
      .getUseCases()
      .updateCaseDetailsInteractor.mockResolvedValue(mockUpdatedCase);

    const result = await runAction(editRemoteStatusAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
          status: 'General Docket - At Issue (Ready for Trial)',
        },
        modal: {
          remoteTrialGrantedDate: '',
        },
      },
    });

    expect(
      applicationContext.getUseCases().updateCaseDetailsInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().updateCaseDetailsInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      caseDetails: {
        remoteTrialGranted: false,
        remoteTrialGrantedDate: null,
      },
      docketNumber: mockDocketNumber,
    });

    expect(result.output).toEqual({
      alertSuccess: {
        message: 'Successfully updated motion to proceed remotely date.',
      },
      caseDetail: mockUpdatedCase,
    });
  });

  it('should call updateCaseDetailsInteractor with remoteTrialGranted set to false when date is only whitespace', async () => {
    const mockUpdatedCase = {
      docketNumber: mockDocketNumber,
      remoteTrialGranted: false,
      remoteTrialGrantedDate: null,
    };

    applicationContext
      .getUseCases()
      .updateCaseDetailsInteractor.mockResolvedValue(mockUpdatedCase);

    const result = await runAction(editRemoteStatusAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
          status: 'General Docket - At Issue (Ready for Trial)',
        },
        modal: {
          remoteTrialGrantedDate: '   ',
        },
      },
    });

    expect(
      applicationContext.getUseCases().updateCaseDetailsInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().updateCaseDetailsInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      caseDetails: {
        remoteTrialGranted: false,
        remoteTrialGrantedDate: null,
      },
      docketNumber: mockDocketNumber,
    });

    expect(result.output.caseDetail).toEqual(mockUpdatedCase);
  });

  it('should only send remoteTrialGranted fields to avoid payload size issues', async () => {
    const existingCaseDetails = {
      docketNumber: mockDocketNumber,
      status: 'General Docket - At Issue (Ready for Trial)',
      caseCaption: 'Test Caption',
      leadDocketNumber: '456-78',
      preferredTrialCity: 'Seattle, Washington',
    };

    const mockUpdatedCase = {
      ...existingCaseDetails,
      remoteTrialGranted: true,
      remoteTrialGrantedDate: mockRemoteTrialGrantedDate,
    };

    applicationContext
      .getUseCases()
      .updateCaseDetailsInteractor.mockResolvedValue(mockUpdatedCase);

    await runAction(editRemoteStatusAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: existingCaseDetails,
        modal: {
          remoteTrialGrantedDate: mockRemoteTrialGrantedDate,
        },
      },
    });

    expect(
      applicationContext.getUseCases().updateCaseDetailsInteractor,
    ).toHaveBeenCalled();
    // Only remoteTrialGranted fields should be sent to avoid 413 errors on large cases
    expect(
      applicationContext.getUseCases().updateCaseDetailsInteractor.mock
        .calls[0][1],
    ).toMatchObject({
      caseDetails: {
        remoteTrialGranted: true,
        remoteTrialGrantedDate: mockRemoteTrialGrantedDate,
      },
      docketNumber: mockDocketNumber,
    });
  });
});

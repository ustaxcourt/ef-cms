import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updateRemoteTrialPermissionAction } from './updateRemoteTrialPermissionAction';

describe('updateRemoteTrialPermissionAction', () => {
  const mockDocketNumber = '123-45';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  beforeEach(() => {
    applicationContext.getUseCases().updateCaseDetailsInteractor.mockReset();
  });

  it('should call updateCaseDetailsInteractor with remoteTrialGranted set to true and convert date format from MM/DD/YYYY to ISO', async () => {
    const mockUpdatedCase = {
      docketNumber: mockDocketNumber,
      remoteTrialGranted: true,
      remoteTrialGrantedDate: '2023-10-14T00:00:00.000Z',
    };

    applicationContext
      .getUseCases()
      .updateCaseDetailsInteractor.mockResolvedValue(mockUpdatedCase);

    const { output } = await runAction(updateRemoteTrialPermissionAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
          status: 'General Docket - At Issue (Ready for Trial)',
        },
        modal: {
          remoteTrialGrantedDate: '10/14/2023',
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
      caseDetails: expect.objectContaining({
        docketNumber: mockDocketNumber,
        remoteTrialGranted: true,
      }),
      docketNumber: mockDocketNumber,
    });
    // Check that the date was converted to ISO format (allowing for timezone differences)
    expect(
      applicationContext.getUseCases().updateCaseDetailsInteractor.mock
        .calls[0][1].caseDetails.remoteTrialGrantedDate,
    ).toMatch(/2023-10-14T\d{2}:00:00\.000Z/);

    expect(output).toEqual({
      alertSuccess: {
        message: 'Remote proceeding permission updated.',
      },
      caseDetail: mockUpdatedCase,
    });
  });

  it('should handle date in M/D/YYYY format', async () => {
    const mockUpdatedCase = {
      docketNumber: mockDocketNumber,
      remoteTrialGranted: true,
      remoteTrialGrantedDate: '2023-03-05T00:00:00.000Z',
    };

    applicationContext
      .getUseCases()
      .updateCaseDetailsInteractor.mockResolvedValue(mockUpdatedCase);

    const result = await runAction(updateRemoteTrialPermissionAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
        modal: {
          remoteTrialGrantedDate: '3/5/2023',
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
      caseDetails: expect.objectContaining({
        remoteTrialGranted: true,
      }),
      docketNumber: mockDocketNumber,
    });
    // Check that the date was converted to ISO format (allowing for timezone differences)
    expect(
      applicationContext.getUseCases().updateCaseDetailsInteractor.mock
        .calls[0][1].caseDetails.remoteTrialGrantedDate,
    ).toMatch(/2023-03-05T\d{2}:00:00\.000Z/);
    expect(result).toBeDefined();
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

    const { output } = await runAction(updateRemoteTrialPermissionAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
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
      caseDetails: expect.objectContaining({
        remoteTrialGranted: false,
        remoteTrialGrantedDate: null,
      }),
      docketNumber: mockDocketNumber,
    });

    expect(output.alertSuccess.message).toEqual(
      'Remote proceeding permission updated.',
    );
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

    const result = await runAction(updateRemoteTrialPermissionAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
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
      caseDetails: expect.objectContaining({
        remoteTrialGranted: false,
        remoteTrialGrantedDate: null,
      }),
      docketNumber: mockDocketNumber,
    });
    expect(result).toBeDefined();
  });

  it('should preserve other case details when updating remote trial permission', async () => {
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
      remoteTrialGrantedDate: '2023-10-14T00:00:00.000Z',
    };

    applicationContext
      .getUseCases()
      .updateCaseDetailsInteractor.mockResolvedValue(mockUpdatedCase);

    const result = await runAction(updateRemoteTrialPermissionAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: existingCaseDetails,
        modal: {
          remoteTrialGrantedDate: '10/14/2023',
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
      caseDetails: expect.objectContaining({
        ...existingCaseDetails,
        remoteTrialGranted: true,
      }),
      docketNumber: mockDocketNumber,
    });
    // Check that the date was converted to ISO format (allowing for timezone differences)
    expect(
      applicationContext.getUseCases().updateCaseDetailsInteractor.mock
        .calls[0][1].caseDetails.remoteTrialGrantedDate,
    ).toMatch(/2023-10-14T\d{2}:00:00\.000Z/);
    expect(result).toBeDefined();
  });

  it('should handle date in MM/DD/YYYY format with leading zeros', async () => {
    const mockUpdatedCase = {
      docketNumber: mockDocketNumber,
      remoteTrialGranted: true,
      remoteTrialGrantedDate: '2023-01-05T05:00:00.000Z',
    };

    applicationContext
      .getUseCases()
      .updateCaseDetailsInteractor.mockResolvedValue(mockUpdatedCase);

    const result = await runAction(updateRemoteTrialPermissionAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          docketNumber: mockDocketNumber,
        },
        modal: {
          remoteTrialGrantedDate: '01/05/2023',
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
      caseDetails: expect.objectContaining({
        remoteTrialGranted: true,
      }),
      docketNumber: mockDocketNumber,
    });
    // Check that the date was converted to ISO format (allowing for timezone differences)
    expect(
      applicationContext.getUseCases().updateCaseDetailsInteractor.mock
        .calls[0][1].caseDetails.remoteTrialGrantedDate,
    ).toMatch(/2023-01-05T\d{2}:00:00\.000Z/);
    expect(result).toBeDefined();
  });
});

jest.mock('@web-client/presenter/utilities/pollForCoversheetComplete');
import { PETITION_TYPES } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import {
  mockPetitionerUser,
  mockPrivatePractitionerUser,
} from '@shared/test/mockAuthUsers';
import { pollForCoversheetComplete } from '@web-client/presenter/utilities/pollForCoversheetComplete';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { saveAndSubmitCaseAction } from '@web-client/presenter/actions/saveAndSubmitCaseAction';

describe('saveAndSubmitCaseAction', () => {
  const mockPollForCoversheetComplete = jest.mocked(pollForCoversheetComplete);
  let path: { error: jest.Mock; success: jest.Mock };
  let docketEntries: any[];

  beforeEach(() => {
    docketEntries = [];
    path = {
      error: jest.fn(),
      success: jest.fn(),
    };

    mockPollForCoversheetComplete.mockReset();
    mockPollForCoversheetComplete.mockResolvedValue(undefined);

    applicationContext.getUseCases().generateDocumentIds.mockImplementation(
      () =>
        new Promise(resolve => {
          resolve({
            attachmentToPetitionFileIds: ['TEST_attachmentToPetitionFileId'],
            corporateDisclosureFileId: 'TEST_corporateDisclosureFileId',
            petitionFileId: 'INTERACTOR_TEST_petitionFileId',
            stinFileId: 'TEST_stinFileId',
          });
        }),
    );

    applicationContext.getUseCases().createCaseInteractor.mockImplementation(
      () =>
        new Promise(resolve => {
          resolve({
            docketEntries,
            docketNumber: 'TEST_docketNumber',
          });
        }),
    );

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = path;
  });

  it('generates document Ids, creates case, polls processing status, and calls success path for a user uploaded petition', async () => {
    docketEntries.push({ docketEntryId: '1', isFileAttached: true });
    docketEntries.push({ docketEntryId: '2', isFileAttached: true });
    docketEntries.push({ docketEntryId: '3', isFileAttached: false });

    await runAction(saveAndSubmitCaseAction, {
      modules: {
        presenter,
      },
      props: {
        fileUploadProgressMap: {
          attachmentToPetition: ['TEST_attachmentToPetition'],
          corporateDisclosure: 'TEST_corporateDisclosure',
          petition: 'TEST_petition',
          stin: 'TEST_stin',
        },
      },
      state: {
        petitionFormatted: {
          petitionFileId: 'STATE_TEST_petitionFileId',
          petitionFormatted: 'petitionFormattedData',
          petitionType: PETITION_TYPES.userUploaded,
        },
        user: mockPetitionerUser,
      },
    });

    const generateDocumentIdsCalls =
      applicationContext.getUseCases().generateDocumentIds.mock.calls;
    expect(generateDocumentIdsCalls.length).toEqual(1);
    expect(generateDocumentIdsCalls[0][1]).toEqual({
      attachmentToPetitionUploadProgress: ['TEST_attachmentToPetition'],
      corporateDisclosureUploadProgress: 'TEST_corporateDisclosure',
      petitionUploadProgress: 'TEST_petition',
      stinUploadProgress: 'TEST_stin',
    });

    const createCaseInteractorCalls =
      applicationContext.getUseCases().createCaseInteractor.mock.calls;
    expect(createCaseInteractorCalls.length).toEqual(1);
    expect(createCaseInteractorCalls[0][1]).toEqual({
      attachmentToPetitionFileIds: ['TEST_attachmentToPetitionFileId'],
      corporateDisclosureFileId: 'TEST_corporateDisclosureFileId',
      petitionFileId: 'INTERACTOR_TEST_petitionFileId',
      petitionMetadata: {
        petitionFileId: 'STATE_TEST_petitionFileId',
        petitionFormatted: 'petitionFormattedData',
        petitionType: 'userUploaded',
      },
      stinFileId: 'TEST_stinFileId',
    });

    expect(mockPollForCoversheetComplete).toHaveBeenCalledTimes(1);
    expect(mockPollForCoversheetComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        docketEntryIds: ['1', '2', 'TEST_stinFileId'],
        docketNumber: 'TEST_docketNumber',
      }),
    );

    const successCalls = path.success.mock.calls;
    expect(successCalls.length).toEqual(1);
    expect(successCalls[0][0]).toEqual({
      alertSuccess: {
        message:
          'Your case has been created and your documents were sent to the U.S. Tax Court.',
        title: 'Your case has been assigned docket number TEST_docketNumber',
      },
      caseDetail: {
        docketEntries,
        docketNumber: 'TEST_docketNumber',
      },
    });
  });

  it('generates document Ids, creates case, polls processing status, and calls success path for a generated petition', async () => {
    docketEntries.push({ docketEntryId: '1', isFileAttached: true });
    docketEntries.push({ docketEntryId: '2', isFileAttached: true });
    docketEntries.push({ docketEntryId: '3', isFileAttached: false });

    await runAction(saveAndSubmitCaseAction, {
      modules: {
        presenter,
      },
      props: {
        fileUploadProgressMap: {
          attachmentToPetition: ['TEST_attachmentToPetition'],
          corporateDisclosure: 'TEST_corporateDisclosure',
          petition: 'TEST_petition',
          stin: 'TEST_stin',
        },
      },
      state: {
        petitionFormatted: {
          petitionFileId: 'STATE_TEST_petitionFileId',
          petitionFormatted: 'petitionFormattedData',
          petitionType: PETITION_TYPES.autoGenerated,
        },
        user: mockPetitionerUser,
      },
    });

    const createCaseInteractorCalls =
      applicationContext.getUseCases().createCaseInteractor.mock.calls;
    expect(createCaseInteractorCalls.length).toEqual(1);
    expect(createCaseInteractorCalls[0][1]).toEqual({
      attachmentToPetitionFileIds: ['TEST_attachmentToPetitionFileId'],
      corporateDisclosureFileId: 'TEST_corporateDisclosureFileId',
      petitionFileId: 'STATE_TEST_petitionFileId',
      petitionMetadata: {
        petitionFileId: 'STATE_TEST_petitionFileId',
        petitionFormatted: 'petitionFormattedData',
        petitionType: 'autoGenerated',
      },
      stinFileId: 'TEST_stinFileId',
    });

    expect(mockPollForCoversheetComplete).toHaveBeenCalledTimes(1);
    expect(mockPollForCoversheetComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        docketEntryIds: ['1', '2', 'TEST_stinFileId'],
        docketNumber: 'TEST_docketNumber',
      }),
    );

    const successCalls = path.success.mock.calls;
    expect(successCalls.length).toEqual(1);
    expect(successCalls[0][0]).toEqual({
      alertSuccess: {
        message:
          'Your case has been created and your documents were sent to the U.S. Tax Court.',
        title: 'Your case has been assigned docket number TEST_docketNumber',
      },
      caseDetail: {
        docketEntries,
        docketNumber: 'TEST_docketNumber',
      },
    });
  });

  it('sets the correct success message when a case is filed by a private practitioner', async () => {
    await runAction(saveAndSubmitCaseAction, {
      modules: {
        presenter,
      },
      props: {
        fileUploadProgressMap: {
          attachmentToPetition: ['TEST_attachmentToPetition'],
          corporateDisclosure: 'TEST_corporateDisclosure',
          petition: 'TEST_petition',
          stin: 'TEST_stin',
        },
      },
      state: {
        petitionFormatted: {
          petitionFileId: 'STATE_TEST_petitionFileId',
          petitionFormatted: 'petitionFormattedData',
          petitionType: PETITION_TYPES.autoGenerated,
        },
        user: mockPrivatePractitionerUser,
      },
    });

    const successCalls = path.success.mock.calls;
    expect(successCalls.length).toEqual(1);
    expect(successCalls[0][0]).toEqual({
      alertSuccess: {
        message:
          'The case has been created and documents were sent to the U.S. Tax Court.',
        title: 'The case has been assigned docket number TEST_docketNumber',
      },
      caseDetail: {
        docketEntries,
        docketNumber: 'TEST_docketNumber',
      },
    });
  });

  it('runs the error path if there was an error thrown in the interactor', async () => {
    applicationContext
      .getUseCases()
      .generateDocumentIds.mockImplementation(
        () => new Promise((_resolve, reject) => reject(new Error())),
      );

    const originalError = console.error;
    console.error = jest.fn();

    await runAction(saveAndSubmitCaseAction, {
      modules: {
        presenter,
      },
      props: {
        fileUploadProgressMap: {
          attachmentToPetition: 'TEST_attachmentToPetition',
          corporateDisclosure: 'TEST_corporateDisclosure',
          petition: 'TEST_petition',
          stin: 'TEST_stin',
        },
      },
      state: {
        petitionFormatted: {
          petitionFileId: 'STATE_TEST_petitionFileId',
          petitionFormatted: 'petitionFormattedData',
          petitionType: PETITION_TYPES.autoGenerated,
        },
        user: mockPetitionerUser,
      },
    });

    const errorCalls = path.error.mock.calls;
    expect(errorCalls.length).toEqual(1);

    const generateDocumentIdsCalls =
      applicationContext.getUseCases().generateDocumentIds.mock.calls;
    expect(generateDocumentIdsCalls.length).toEqual(1);

    const createCaseInteractorCalls =
      applicationContext.getUseCases().createCaseInteractor.mock.calls;
    expect(createCaseInteractorCalls.length).toEqual(0);

    expect(mockPollForCoversheetComplete).not.toHaveBeenCalled();
    console.error = originalError;
  });

  it('runs the error path if the coversheet poll rejects', async () => {
    docketEntries.push({ docketEntryId: '1', isFileAttached: true });
    mockPollForCoversheetComplete.mockRejectedValue(new Error('poll timeout'));

    const originalError = console.error;
    console.error = jest.fn();

    await runAction(saveAndSubmitCaseAction, {
      modules: { presenter },
      props: {
        fileUploadProgressMap: {
          attachmentToPetition: ['TEST_attachmentToPetition'],
          corporateDisclosure: 'TEST_corporateDisclosure',
          petition: 'TEST_petition',
          stin: 'TEST_stin',
        },
      },
      state: {
        petitionFormatted: {
          petitionFileId: 'STATE_TEST_petitionFileId',
          petitionFormatted: 'petitionFormattedData',
          petitionType: PETITION_TYPES.autoGenerated,
        },
        user: mockPetitionerUser,
      },
    });

    expect(path.error).toHaveBeenCalledTimes(1);
    expect(path.success).not.toHaveBeenCalled();
    console.error = originalError;
  });
});

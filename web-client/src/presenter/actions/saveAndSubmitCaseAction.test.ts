import { PETITION_TYPES } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import {
  mockPetitionerUser,
  mockPrivatePractitionerUser,
} from '@shared/test/mockAuthUsers';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { saveAndSubmitCaseAction } from '@web-client/presenter/actions/saveAndSubmitCaseAction';

describe('saveAndSubmitCaseAction', () => {
  let path: { error: jest.Mock; success: jest.Mock };
  let docketEntries: any[];

  beforeEach(() => {
    docketEntries = [];
    path = {
      error: jest.fn(),
      success: jest.fn(),
    };

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

    applicationContext
      .getUseCases()
      .addCoversheetInteractor.mockImplementation(() => {});

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.path = path;
  });

  it('should generate document Ids, create case, add coversheets to all docket entries and call success path for a user uploaded petition', async () => {
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

    const addCoversheetInteractorCalls =
      applicationContext.getUseCases().addCoversheetInteractor.mock.calls;
    expect(addCoversheetInteractorCalls.length).toEqual(3);
    expect(addCoversheetInteractorCalls[0][1]).toEqual({
      docketEntryId: '1',
      docketNumber: 'TEST_docketNumber',
    });
    expect(addCoversheetInteractorCalls[1][1]).toEqual({
      docketEntryId: '2',
      docketNumber: 'TEST_docketNumber',
    });
    expect(addCoversheetInteractorCalls[2][1]).toEqual({
      docketEntryId: 'TEST_stinFileId',
      docketNumber: 'TEST_docketNumber',
    });

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

  it('should generate document Ids, create case, add coversheets to all docket entries and call success path for a generated petition', async () => {
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
      petitionFileId: 'STATE_TEST_petitionFileId',
      petitionMetadata: {
        petitionFileId: 'STATE_TEST_petitionFileId',
        petitionFormatted: 'petitionFormattedData',
        petitionType: 'autoGenerated',
      },
      stinFileId: 'TEST_stinFileId',
    });

    const addCoversheetInteractorCalls =
      applicationContext.getUseCases().addCoversheetInteractor.mock.calls;
    expect(addCoversheetInteractorCalls.length).toEqual(3);
    expect(addCoversheetInteractorCalls[0][1]).toEqual({
      docketEntryId: '1',
      docketNumber: 'TEST_docketNumber',
    });
    expect(addCoversheetInteractorCalls[1][1]).toEqual({
      docketEntryId: '2',
      docketNumber: 'TEST_docketNumber',
    });
    expect(addCoversheetInteractorCalls[2][1]).toEqual({
      docketEntryId: 'TEST_stinFileId',
      docketNumber: 'TEST_docketNumber',
    });

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

  it('should set correct success message case is filed by private practitioner', async () => {
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

  it('should run the error path if there was an error thrown in the interactor', async () => {
    applicationContext
      .getUseCases()
      .generateDocumentIds.mockImplementation(
        () => new Promise((_resolve, reject) => reject(null)),
      );

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
    expect(generateDocumentIdsCalls[0][1]).toEqual({
      attachmentToPetitionUploadProgress: 'TEST_attachmentToPetition',
      corporateDisclosureUploadProgress: 'TEST_corporateDisclosure',
      petitionUploadProgress: 'TEST_petition',
      stinUploadProgress: 'TEST_stin',
    });

    const createCaseInteractorCalls =
      applicationContext.getUseCases().createCaseInteractor.mock.calls;
    expect(createCaseInteractorCalls.length).toEqual(0);

    const addCoversheetInteractorCalls =
      applicationContext.getUseCases().addCoversheetInteractor.mock.calls;
    expect(addCoversheetInteractorCalls.length).toEqual(0);
  });
});

import { CASE_STATUS_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { saveCaseDetailInternalEditAction } from './saveCaseDetailInternalEditAction';

const { INITIAL_DOCUMENT_TYPES } = applicationContext.getConstants();

describe('saveCaseDetailInternalEditAction', () => {
  beforeAll(() => {
    applicationContext
      .getUseCases()
      .uploadDocumentAndMakeSafe.mockImplementation(({ documentId }) => {
        if (documentId) {
          return documentId;
        } else {
          return '999'; //generated document id from upload
        }
      });

    presenter.providers.applicationContext = applicationContext;
  });

  it('should replace a petition document file', async () => {
    const caseDetail = {
      ...MOCK_CASE,
      createdAt: '2019-03-01T21:40:46.415Z',
      status: CASE_STATUS_TYPES.new,
    };
    applicationContext
      .getUseCases()
      .saveCaseDetailInternalEditInteractor.mockReturnValue(caseDetail);

    await runAction(saveCaseDetailInternalEditAction, {
      modules: {
        presenter,
      },
      props: {
        formWithComputedDates: {
          ...caseDetail,
          petitionFile: {},
        },
      },
      state: {
        caseDetail: {
          ...caseDetail,
          documents: [
            {
              documentId: '123',
              eventCode: INITIAL_DOCUMENT_TYPES.petition.eventCode,
            },
          ],
        },
      },
    });

    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafe.mock
        .calls[0][0].documentId,
    ).toEqual('123');
  });

  it('should not replace an initial filing document if it is not a petition document file', async () => {
    const caseDetail = {
      ...MOCK_CASE,
      createdAt: '2019-03-01T21:40:46.415Z',
      status: CASE_STATUS_TYPES.new,
    };
    applicationContext
      .getUseCases()
      .saveCaseDetailInternalEditInteractor.mockReturnValue(caseDetail);

    const formWithComputedDates = {
      ...caseDetail,
      ownershipDisclosureFile: {},
    };

    await runAction(saveCaseDetailInternalEditAction, {
      modules: {
        presenter,
      },
      props: {
        formWithComputedDates,
      },
      state: {
        caseDetail,
      },
    });

    const uploadedDocument = formWithComputedDates.documents.find(
      document =>
        document.documentType ===
        INITIAL_DOCUMENT_TYPES.ownershipDisclosure.documentType,
    );

    expect(
      applicationContext.getUseCases().uploadDocumentAndMakeSafe.mock
        .calls[0][0].documentId,
    ).toBeUndefined();

    expect(uploadedDocument).toEqual({
      documentId: '999',
      documentType: INITIAL_DOCUMENT_TYPES.ownershipDisclosure.documentType,
    });
  });

  it('should call the updateCaseTrialSortTags use case if case status is ready for trial', async () => {
    const caseDetail = {
      ...MOCK_CASE,
      createdAt: '2019-03-01T21:40:46.415Z',
      status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
    };
    applicationContext
      .getUseCases()
      .saveCaseDetailInternalEditInteractor.mockReturnValue(caseDetail);

    await runAction(saveCaseDetailInternalEditAction, {
      modules: {
        presenter,
      },
      props: { formWithComputedDates: caseDetail },
      state: {
        caseDetail,
      },
    });
    expect(
      applicationContext.getUseCases().updateCaseTrialSortTagsInteractor.mock
        .calls[0][0].docketNumber,
    ).toEqual(MOCK_CASE.docketNumber);
  });

  it('should not call the updateCaseTrialSortTags use case if case status is not ready for trial', async () => {
    const caseDetail = {
      ...MOCK_CASE,
      status: CASE_STATUS_TYPES.new,
    };
    applicationContext
      .getUseCases()
      .saveCaseDetailInternalEditInteractor.mockReturnValue(caseDetail);

    await runAction(saveCaseDetailInternalEditAction, {
      modules: {
        presenter,
      },
      props: { formWithComputedDates: caseDetail },
      state: {
        caseDetail,
      },
    });
    expect(
      applicationContext.getUseCases().updateCaseTrialSortTagsInteractor,
    ).not.toBeCalled();
  });
});

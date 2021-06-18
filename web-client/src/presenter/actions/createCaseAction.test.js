import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { createCaseAction } from './createCaseAction';
import { getContactPrimary } from '../../../../shared/src/business/entities/cases/Case';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('createCaseAction', () => {
  const errorStub = jest.fn();
  const successStub = jest.fn();

  presenter.providers.applicationContext = applicationContext;

  presenter.providers.path = {
    error: errorStub,
    success: successStub,
  };

  const { US_STATES } = applicationContext.getConstants();

  const { addCoversheetInteractor, filePetitionInteractor } =
    applicationContext.getUseCases();

  applicationContext.getCurrentUser.mockReturnValue({
    email: 'petitioner1@example.com',
  });

  it('should call filePetitionInteractor and addCoversheetInteractor TWICE with the petition metadata and files and call the success path when finished', async () => {
    filePetitionInteractor.mockReturnValue({
      caseDetail: {
        ...MOCK_CASE,
        docketEntries: [
          {
            createdAt: '2020-12-21T17:21:39.718Z',
            docketEntryId: 'ed1cb5ff-4761-4cca-b8ca-9464e540fee4',
            documentTitle: 'Petition',
            documentType: 'Petition',
            entityName: 'DocketEntry',
            eventCode: 'P',
            filedBy: 'Petr. Mark Mikecotte',
            filingDate: '2020-12-21T17:21:39.717Z',
            index: 1,
            isFileAttached: true,
            isMinuteEntry: false,
            isOnDocketRecord: true,
            isStricken: false,
            partyPrimary: true,
            partySecondary: false,
            privatePractitioners: [],
            processingStatus: 'pending',
            receivedAt: '2020-12-21T17:21:39.718Z',
            userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          },
          {
            createdAt: '2020-12-21T17:21:39.719Z',
            docketEntryId: '2b1e5fb3-e7f2-48c4-9a43-4f856ae46d66',
            documentTitle:
              'Request for Place of Trial at Little Rock, Arkansas',
            documentType: 'Request for Place of Trial',
            entityName: 'DocketEntry',
            eventCode: 'RQT',
            filingDate: '2020-12-21T17:21:39.717Z',
            index: 2,
            isFileAttached: false,
            isMinuteEntry: true,
            isOnDocketRecord: true,
            isStricken: false,
            processingStatus: 'complete',
            receivedAt: '2020-12-21T17:21:39.720Z',
            userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          },
        ],
      },
      stinFileId: '123',
    });

    await runAction(createCaseAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          ownershipDisclosureFile: {},
          petitionFile: {},
          stinFile: {},
          trialCities: [{ city: 'Birmingham', state: US_STATES.AL }],
          ...MOCK_CASE,
          contactPrimary: {
            ...getContactPrimary(MOCK_CASE),
          },
        },
      },
    });

    expect(filePetitionInteractor).toBeCalled();
    expect(filePetitionInteractor.mock.calls[0][1]).toMatchObject({
      ownershipDisclosureFile: {},
      petitionFile: {},
      petitionMetadata: {
        ...MOCK_CASE,
      },
      stinFile: {},
    });
    expect(addCoversheetInteractor).toHaveBeenCalledTimes(2);
    expect(successStub).toBeCalled();
  });

  it('should call filePetitionInteractor and addCoversheetInteractor THREE times (when we have an ODS form) with the petition metadata and files and call the success path  finished', async () => {
    filePetitionInteractor.mockReturnValue({
      caseDetail: {
        ...MOCK_CASE,
        docketEntries: [
          {
            createdAt: '2020-12-21T17:21:39.718Z',
            docketEntryId: 'ed1cb5ff-4761-4cca-b8ca-9464e540fee4',
            documentTitle: 'Petition',
            documentType: 'Petition',
            entityName: 'DocketEntry',
            eventCode: 'P',
            filedBy: 'Petr. Com Pan Nee',
            filingDate: '2020-12-21T17:21:39.717Z',
            index: 1,
            isFileAttached: true,
            isMinuteEntry: false,
            isOnDocketRecord: true,
            isStricken: false,
            partyPrimary: true,
            partySecondary: false,
            privatePractitioners: [],
            processingStatus: 'pending',
            receivedAt: '2020-12-21T17:21:39.718Z',
            userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          },
          {
            createdAt: '2020-12-21T17:21:39.719Z',
            docketEntryId: '2b1e5fb3-e7f2-48c4-9a43-4f856ae46d66',
            documentTitle:
              'Request for Place of Trial at Little Rock, Arkansas',
            documentType: 'Request for Place of Trial',
            entityName: 'DocketEntry',
            eventCode: 'RQT',
            filingDate: '2020-12-21T17:21:39.717Z',
            index: 2,
            isFileAttached: false,
            isMinuteEntry: true,
            isOnDocketRecord: true,
            isStricken: false,
            processingStatus: 'complete',
            receivedAt: '2020-12-21T17:21:39.720Z',
            userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          },
          {
            createdAt: '2020-12-21T22:13:58.658Z',
            docketEntryId: 'aaec01d8-98e7-4534-959f-6c384c4cf0e0',
            documentTitle: 'Ownership Disclosure Statement',
            documentType: 'Ownership Disclosure Statement',
            entityName: 'DocketEntry',
            eventCode: 'DISC',
            filedBy: 'Petr. Com Pan Nee',
            filingDate: '2020-12-21T22:13:58.655Z',
            index: 3,
            isFileAttached: true,
            isMinuteEntry: false,
            isOnDocketRecord: true,
            isStricken: false,
            partyPrimary: true,
            partySecondary: false,
            privatePractitioners: [],
            processingStatus: 'pending',
            receivedAt: '2020-12-21T22:13:58.658Z',
            userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
          },
        ],
      },
      stinFileId: '123',
    });

    await runAction(createCaseAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          ownershipDisclosureFile: {},
          petitionFile: {},
          stinFile: {},
          trialCities: [{ city: 'Birmingham', state: US_STATES.AL }],
          ...MOCK_CASE,
          contactPrimary: {
            ...getContactPrimary(MOCK_CASE),
          },
        },
      },
    });

    expect(filePetitionInteractor).toBeCalled();
    expect(filePetitionInteractor.mock.calls[0][1]).toMatchObject({
      ownershipDisclosureFile: {},
      petitionFile: {},
      petitionMetadata: {
        ...MOCK_CASE,
      },
      stinFile: {},
    });
    expect(addCoversheetInteractor).toHaveBeenCalledTimes(3); // STIN, Petition, and ODS
    expect(successStub).toBeCalled();
  });

  it('should call filePetitionInteractor and call path.error when finished if it throws an error', async () => {
    filePetitionInteractor.mockImplementation(() => {
      throw new Error('error');
    });

    await runAction(createCaseAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          ownershipDisclosureFile: {},
          petitionFile: {},
          stinFile: {},
          trialCities: [{ city: 'Birmingham', state: US_STATES.AL }],
          ...MOCK_CASE,
          contactPrimary: {
            ...getContactPrimary(MOCK_CASE),
          },
        },
      },
    });

    expect(filePetitionInteractor).toBeCalled();
    expect(filePetitionInteractor.mock.calls[0][1]).toMatchObject({
      ownershipDisclosureFile: {},
      petitionFile: {},
      petitionMetadata: {
        ...MOCK_CASE,
      },
      stinFile: {},
    });
    expect(addCoversheetInteractor).not.toBeCalled();
    expect(errorStub).toBeCalled();
  });
});

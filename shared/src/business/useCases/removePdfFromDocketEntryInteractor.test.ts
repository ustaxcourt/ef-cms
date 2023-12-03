import {
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
  ROLES,
} from '../entities/EntityConstants';
import { MOCK_LOCK } from '../../test/mockLock';
import { ServiceUnavailableError } from '@web-api/errors/errors';

import { applicationContext } from '../test/createTestApplicationContext';
import { removePdfFromDocketEntryInteractor } from './removePdfFromDocketEntryInteractor';

describe('removePdfFromDocketEntryInteractor', () => {
  const MOCK_CASE = {
    caseCaption: 'Caption',
    caseType: CASE_TYPES_MAP.other,
    createdAt: applicationContext.getUtilities().createISODateString(),
    docketEntries: [
      {
        docketEntryId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        docketNumber: '56789-18',
        documentType: 'Answer',
        eventCode: 'A',
        filedBy: 'Test Petitioner',
        filedByRole: ROLES.petitioner,
        isFileAttached: true,
        userId: '50c62fa0-dd90-4244-b7c7-9cb2302d7688',
      },
      {
        docketEntryId: '1905d1ab-18d0-43ec-bafb-654e83405491',
        docketNumber: '56789-18',
        documentType: 'Answer',
        eventCode: 'A',
        filedBy: 'Test Petitioner',
        filedByRole: ROLES.petitioner,
        isFileAttached: false,
        userId: '50c62fa0-dd90-4244-b7c7-9cb2302d7688',
      },
    ],
    docketNumber: '56789-18',
    filingType: 'Myself',
    partyType: PARTY_TYPES.petitioner,
    petitioners: [
      {
        address1: '123 Main St',
        city: 'Somewhere',
        contactType: CONTACT_TYPES.primary,
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'fieri@example.com',
        name: 'Guy Fieri',
        phone: '1234567890',
        postalCode: '12345',
        state: 'CA',
      },
    ],
    preferredTrialCity: 'Washington, District of Columbia',
    procedureType: 'Regular',
    status: CASE_STATUS_TYPES.new,
    userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
  };

  const docketClerkUser = {
    name: 'docket clerk',
    role: ROLES.docketClerk,
    userId: '54cddcd9-d012-4874-b74f-73732c95d42b',
  };
  let mockLock;

  beforeAll(() => {
    applicationContext.getPersistenceGateway().deleteDocumentFile = jest.fn();

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(docketClerkUser);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

    applicationContext
      .getPersistenceGateway()
      .updateCase.mockImplementation(caseDetail => caseDetail);
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);
    mockLock = undefined;
  });

  it('should throw an error if the user is unauthorized to update a case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'nope',
      userId: 'nope',
    });

    await expect(
      removePdfFromDocketEntryInteractor(applicationContext, {
        docketEntryId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow('Unauthorized for update case');
  });

  it('should fetch the case by the provided docketNumber', async () => {
    await removePdfFromDocketEntryInteractor(applicationContext, {
      docketEntryId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
  });

  it('should delete the pdf from s3 and update the case if the docketEntry has a file attached', async () => {
    await removePdfFromDocketEntryInteractor(applicationContext, {
      docketEntryId: '7805d1ab-18d0-43ec-bafb-654e83405416', // entry with isFileAttached: true
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().deleteDocumentFile,
    ).toHaveBeenCalled();

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
  });

  it('should set the docketEntry isFileAttached flag to false', async () => {
    await removePdfFromDocketEntryInteractor(applicationContext, {
      docketEntryId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      docketNumber: MOCK_CASE.docketNumber,
    });

    const docketEntry = applicationContext
      .getPersistenceGateway()
      .updateCase.mock.calls[0][0].caseToUpdate.docketEntries.find(
        entry => entry.docketEntryId === '7805d1ab-18d0-43ec-bafb-654e83405416',
      );

    expect(docketEntry.isFileAttached).toEqual(false);
  });

  it('does not modify the docketEntry or case if the isFileAttachedFlag is false', async () => {
    await removePdfFromDocketEntryInteractor(applicationContext, {
      docketEntryId: '1905d1ab-18d0-43ec-bafb-654e83405491', // entry with isFileAttached: false
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().deleteDocumentFile,
    ).not.toHaveBeenCalled();

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).not.toHaveBeenCalled();
  });

  it('does not modify the docketEntry or case if the docketEntry can not be found on the case', async () => {
    await removePdfFromDocketEntryInteractor(applicationContext, {
      docketEntryId: 'nope',
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().deleteDocumentFile,
    ).not.toHaveBeenCalled();

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).not.toHaveBeenCalled();
  });
  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockLock = MOCK_LOCK;

    await expect(
      removePdfFromDocketEntryInteractor(applicationContext, {
        docketEntryId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await removePdfFromDocketEntryInteractor(applicationContext, {
      docketEntryId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().createLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: `case|${MOCK_CASE.docketNumber}`,
      ttl: 30,
    });

    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifiers: [`case|${MOCK_CASE.docketNumber}`],
    });
  });
});

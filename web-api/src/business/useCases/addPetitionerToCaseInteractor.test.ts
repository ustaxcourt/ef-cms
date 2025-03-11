import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/messages/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  SERVICE_INDICATOR_TYPES,
} from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_LOCK } from '@shared/test/mockLock';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { addPetitionerToCaseInteractor } from './addPetitionerToCaseInteractor';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import {
  mockDocketClerkUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { updateCase as updateCaseMock } from '@web-api/persistence/postgres/cases/updateCase';

describe('addPetitionerToCaseInteractor', () => {
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const updateCase = jest.mocked(updateCaseMock);
  let mockContact;
  let mockLock;

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });

  beforeEach(() => {
    mockLock = undefined;
    mockContact = {
      address1: '2729 Chicken St',
      city: 'Eggyolk',
      contactType: CONTACT_TYPES.otherPetitioner,
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: 'Eggy Egg',
      phone: '123456',
      postalCode: '55555',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      state: 'CO',
    };

    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      status: CASE_STATUS_TYPES.generalDocket,
    });
    updateCase.mockImplementation(({ caseToUpdate }) =>
      Promise.resolve(caseToUpdate),
    );
  });

  it('should throw an unauthorized error when the user is not authorized to add petitioner to case', async () => {
    await expect(
      addPetitionerToCaseInteractor(
        applicationContext,
        {
          caseCaption: MOCK_CASE.caseCaption,
          contact: mockContact,
          docketNumber: MOCK_CASE.docketNumber,
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow('Unauthorized for adding petitioner to case');
  });

  it('should throw an error if case status is new', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      status: CASE_STATUS_TYPES.new,
    });

    await expect(
      addPetitionerToCaseInteractor(
        applicationContext,
        {
          caseCaption: MOCK_CASE.caseCaption,
          contact: mockContact,
          docketNumber: MOCK_CASE.docketNumber,
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(
      `Case with docketNumber ${MOCK_CASE.docketNumber} has not been served`,
    );
  });

  it('should add the petitioner to the case and send the updated case to persistence, and return the updated case', async () => {
    await addPetitionerToCaseInteractor(
      applicationContext,
      {
        caseCaption: MOCK_CASE.caseCaption,

        contact: {
          ...mockContact,
          country: 'Georgia',
          countryType: COUNTRY_TYPES.INTERNATIONAL,
        },
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(
      updateCase.mock.calls[0][0].caseToUpdate.petitioners[1],
    ).toMatchObject({
      ...mockContact,
      countryType: COUNTRY_TYPES.INTERNATIONAL,
    });
  });

  it('should add the petitioner to the case and return the updated case', async () => {
    const updatedCase = await addPetitionerToCaseInteractor(
      applicationContext,
      {
        caseCaption: MOCK_CASE.caseCaption,
        contact: mockContact,
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(updatedCase.petitioners.length).toEqual(2);
    expect(updatedCase.petitioners[1]).toMatchObject(mockContact);
  });

  it('should update the case caption', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      status: CASE_STATUS_TYPES.generalDocket,
    });

    const mockUpdatedCaption = 'An updated caption';

    await addPetitionerToCaseInteractor(
      applicationContext,
      {
        caseCaption: mockUpdatedCaption,
        contact: mockContact,
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(updateCase.mock.calls[0][0].caseToUpdate.caseCaption).toEqual(
      mockUpdatedCaption,
    );
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockLock = MOCK_LOCK;

    await expect(
      addPetitionerToCaseInteractor(
        applicationContext,
        {
          caseCaption: MOCK_CASE.caseCaption,
          contact: mockContact,
          docketNumber: MOCK_CASE.docketNumber,
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(getCaseByDocketNumber).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await addPetitionerToCaseInteractor(
      applicationContext,
      {
        caseCaption: MOCK_CASE.caseCaption,
        contact: mockContact,
        docketNumber: MOCK_CASE.docketNumber,
      },
      mockDocketClerkUser,
    );

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

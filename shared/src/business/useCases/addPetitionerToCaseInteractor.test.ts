import {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '../entities/EntityConstants';
import { MOCK_CASE } from '../../test/mockCase';
import { MOCK_LOCK } from '../../test/mockLock';
import {
  ServiceUnavailableError,
  UnauthorizedError,
} from '@web-api/errors/errors';
import { addPetitionerToCaseInteractor } from './addPetitionerToCaseInteractor';
import { applicationContext } from '../test/createTestApplicationContext';

describe('addPetitionerToCaseInteractor', () => {
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

    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'docketClerk',
    });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.generalDocket,
      });
  });

  it('should throw an unauthorized error when the user is not authorized to add petitioner to case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    });

    await expect(
      addPetitionerToCaseInteractor(applicationContext, {
        caseCaption: MOCK_CASE.caseCaption,
        contact: mockContact,
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow('Unauthorized for adding petitioner to case');
  });

  it('should throw an error if case status is new', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.new,
      });

    await expect(
      addPetitionerToCaseInteractor(applicationContext, {
        caseCaption: MOCK_CASE.caseCaption,
        contact: mockContact,
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow(
      `Case with docketNumber ${MOCK_CASE.docketNumber} has not been served`,
    );
  });

  it('should add the petitioner to the case and send the updated case to persistence, and return the updated case', async () => {
    await addPetitionerToCaseInteractor(applicationContext, {
      caseCaption: MOCK_CASE.caseCaption,

      contact: {
        ...mockContact,
        country: 'Georgia',
        countryType: COUNTRY_TYPES.INTERNATIONAL,
      },
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.petitioners[1],
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
    );

    expect(updatedCase.petitioners.length).toEqual(2);
    expect(updatedCase.petitioners[1]).toMatchObject(mockContact);
  });

  it('should update the case caption', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.generalDocket,
      });

    const mockUpdatedCaption = 'An updated caption';

    await addPetitionerToCaseInteractor(applicationContext, {
      caseCaption: mockUpdatedCaption,
      contact: mockContact,
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.caseCaption,
    ).toEqual(mockUpdatedCaption);
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockLock = MOCK_LOCK;

    await expect(
      addPetitionerToCaseInteractor(applicationContext, {
        caseCaption: MOCK_CASE.caseCaption,
        contact: mockContact,
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await addPetitionerToCaseInteractor(applicationContext, {
      caseCaption: MOCK_CASE.caseCaption,
      contact: mockContact,
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

  it('should throw an Unauthorized error if the user is not authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      addPetitionerToCaseInteractor(applicationContext, {
        caseCaption: MOCK_CASE.caseCaption,
        contact: mockContact,
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });
});

import { applicationContext } from '../../test/createTestApplicationContext';
import { associateIrsPractitionerToCase } from './associateIrsPractitionerToCase';

import {
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
  SERVICE_INDICATOR_TYPES,
} from '../../entities/EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import { MOCK_USERS, irsPractitionerUser } from '../../../test/mockUsers';
import { cloneDeep } from 'lodash';

describe('associateIrsPractitionerToCase', () => {
  let caseRecord1 = {
    caseCaption: 'Caption',
    caseType: CASE_TYPES_MAP.deficiency,
    docketEntries: MOCK_CASE.docketEntries,
    docketNumber: '123-19',
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
    preferredTrialCity: 'Fresno, California',
    procedureType: 'Regular',
    status: CASE_STATUS_TYPES.new,
    userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
  };
  let caseRecord2 = {
    caseCaption: 'Caption',
    caseType: CASE_TYPES_MAP.deficiency,
    docketEntries: MOCK_CASE.docketEntries,
    docketNumber: '124-19',
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
    preferredTrialCity: 'Fresno, California',
    procedureType: 'Regular',
    status: CASE_STATUS_TYPES.new,
    userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
  };

  const mockIrsPractitioner: RawIrsPractitioner =
    cloneDeep(irsPractitionerUser);

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(
      MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
    );

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue(caseRecord1);
  });

  it('should not add mapping if already there', async () => {
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(true);

    await associateIrsPractitionerToCase({
      applicationContext,
      docketNumber: caseRecord1.docketNumber,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      user: mockIrsPractitioner,
    });

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCase,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).not.toHaveBeenCalled();
  });

  it('should add mapping for an irsPractitioner', async () => {
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(false);

    await associateIrsPractitionerToCase({
      applicationContext,
      docketNumber: caseRecord1.docketNumber,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      user: mockIrsPractitioner,
    });

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0].caseToUpdate,
    ).toMatchObject({
      irsPractitioners: [
        {
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          userId: mockIrsPractitioner.userId,
        },
      ],
    });
  });

  it('should add mapping to all cases in a consolidated group for an irsPractitioner', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValueOnce(caseRecord1)
      .mockResolvedValueOnce(caseRecord2);

    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockReturnValue(false);

    await associateIrsPractitionerToCase({
      applicationContext,
      consolidatedCasesDocketNumbers: [
        caseRecord1.docketNumber,
        caseRecord2.docketNumber,
      ],
      docketNumber: caseRecord1.docketNumber,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      user: mockIrsPractitioner,
    });

    expect(
      applicationContext.getPersistenceGateway().associateUserWithCase,
    ).toHaveBeenCalledTimes(2);
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).toHaveBeenCalledTimes(2);
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0].caseToUpdate,
    ).toMatchObject({
      irsPractitioners: [
        {
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          userId: mockIrsPractitioner.userId,
        },
      ],
    });
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[1][0].caseToUpdate,
    ).toMatchObject({
      irsPractitioners: [
        {
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          userId: mockIrsPractitioner.userId,
        },
      ],
    });
  });
});

import {
  CASE_STATUS_TYPES,
  COUNTRY_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '../../entities/EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';
import { docketClerkUser } from '../../../test/mockUsers';
import { generateChangeOfAddress } from './generateChangeOfAddress';

jest.mock('../addCoversheetInteractor', () => ({
  addCoverToPdf: jest.fn().mockReturnValue({
    pdfData: '',
  }),
}));

describe('generateChangeOfAddress', () => {
  const { docketNumber } = MOCK_CASE;
  const mockIrsPractitioner = {
    admissionsDate: '2019-04-10',
    admissionsStatus: 'Active',
    barNumber: 'PT5432',
    birthYear: '2011',
    contact: {
      address1: '234 Main St!',
      address2: 'Apartment 4',
      address3: 'Under the stairs',
      city: 'Chicago',
      country: 'USA',
      countryType: COUNTRY_TYPES.DOMESTIC,
      phone: '+1 (555) 555-5555',
      postalCode: '61234',
      state: 'IL',
    },

    email: 'irspractitioner1@example.com',
    entityName: 'IrsPractitioner',
    firstName: 'rick',
    lastName: 'james',
    name: 'Test IRS Practitioner',
    originalBarState: 'FL',
    practiceType: 'IRS',
    practitionerType: 'Attorney',
    role: ROLES.irsPractitioner,
    section: 'irsPractitioner',
    serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
    userId: '35db9c50-0384-4830-a004-115001e86652',
  };

  const mockCaseWithIrsPractitioner = {
    ...MOCK_CASE,
    irsPractitioners: [mockIrsPractitioner],

    status: CASE_STATUS_TYPES.generalDocket,
  };

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    applicationContext
      .getUseCaseHelpers()
      .updateCaseAndAssociations.mockImplementation(
        ({ caseToUpdate }) => caseToUpdate,
      );

    applicationContext
      .getPersistenceGateway()
      .getCasesForUser.mockReturnValue([{ docketNumber }]);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCaseWithIrsPractitioner);

    applicationContext
      .getPersistenceGateway()
      .setChangeOfAddressCaseAsDone.mockReturnValue({ remaining: 0 });

    applicationContext
      .getUtilities()
      .getDocumentTypeForAddressChange.mockReturnValue({
        eventCode: 'NCA',
        title: 'Notice of Change of Address',
      });
  });

  it('should run a change of address when address1 changes for an irs practitioner', async () => {
    await generateChangeOfAddress({
      applicationContext,
      bypassDocketEntry: false,
      contactInfo: {
        ...mockIrsPractitioner.contact,
        address1: '23456 Main St',
      } as any,
      firmName: 'my firm',
      requestUserId: 'abc',
      updatedEmail: 'new@exaple.com',
      updatedName: 'rich',
      user: mockIrsPractitioner as any,
      websocketMessagePrefix: 'user',
    });

    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).toHaveBeenCalled();
    expect(
      applicationContext
        .getUseCaseHelpers()
        .updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.docketEntries.find(
          docketEntry => docketEntry.eventCode === 'NCA',
        ),
    ).toMatchObject({
      partyIrsPractitioner: true,
    });
  });

  it('should not set partyIrsPractitioner if role is not irsPractitioner', async () => {
    await generateChangeOfAddress({
      applicationContext,
      bypassDocketEntry: false,
      contactInfo: {
        ...mockIrsPractitioner.contact,
        address1: '23456 Main St',
      } as any,
      firmName: 'my firm',
      requestUserId: 'abc',
      updatedEmail: 'new@exaple.com',
      updatedName: 'rich',
      user: { ...mockIrsPractitioner, role: ROLES.adc } as any,
      websocketMessagePrefix: 'user',
    });

    const changeOfAddressDocketEntry = applicationContext
      .getUseCaseHelpers()
      .updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.docketEntries.find(
        entry => entry.eventCode === 'NCA',
      );
    expect(changeOfAddressDocketEntry.partyIrsPractitioner).toBeUndefined();
  });

  it('should send a notification to the user initially and after each case is updated', async () => {
    await generateChangeOfAddress({
      applicationContext,
      bypassDocketEntry: false,
      contactInfo: {
        ...mockIrsPractitioner.contact,
        address1: '234 Main St',
      } as any,
      firmName: 'my firm',
      requestUserId: 'abc',
      updatedEmail: 'new@exaple.com',
      updatedName: 'rich',
      user: mockIrsPractitioner as any,
      websocketMessagePrefix: 'user',
    });

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).toHaveBeenCalledTimes(3);
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message,
    ).toEqual({
      action: 'user_contact_update_progress',
      completedCases: 0,
      totalCases: 1,
    });
    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[1][0].message,
    ).toEqual({
      action: 'user_contact_update_progress',
    });
  });

  it('should NOT send a notification to the user if they have no associated cases', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCasesForUser.mockReturnValueOnce([]);

    await generateChangeOfAddress({
      applicationContext,
      bypassDocketEntry: false,
      contactInfo: {
        ...mockIrsPractitioner.contact,
        address1: '234 Main St',
      } as any,
      firmName: 'my firm',
      requestUserId: 'abc',
      updatedEmail: 'new@exaple.com',
      updatedName: 'rich',
      user: {} as any,
      websocketMessagePrefix: 'user',
    });

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).not.toHaveBeenCalled();
  });

  it('should calculate the number of pages in the generated change of address pdf', async () => {
    const mockNumberOfPages = 999;
    applicationContext
      .getUseCaseHelpers()
      .countPagesInDocument.mockReturnValue(mockNumberOfPages);

    await generateChangeOfAddress({
      applicationContext,
      bypassDocketEntry: false,
      contactInfo: {
        ...mockIrsPractitioner.contact,
        address1: '234 Main St',
      } as any,
      firmName: 'my firm',
      requestUserId: 'abc',
      updatedEmail: 'new@exaple.com',
      updatedName: 'rich',
      user: mockIrsPractitioner as any,
      websocketMessagePrefix: 'user',
    });

    expect(
      applicationContext
        .getUseCaseHelpers()
        .updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.docketEntries.find(
          docketEntry => docketEntry.eventCode === 'NCA',
        ),
    ).toMatchObject({
      numberOfPages: mockNumberOfPages,
    });
    expect(
      applicationContext.getUseCaseHelpers().countPagesInDocument,
    ).toHaveBeenCalledTimes(1);
  });

  it('should set isAutoGenerated to true on the generated "Notice of Change of Address" document', async () => {
    await generateChangeOfAddress({
      applicationContext,
      bypassDocketEntry: false,
      contactInfo: {
        ...mockIrsPractitioner.contact,
        address1: '234 Main St',
      } as any,
      firmName: 'my firm',
      requestUserId: 'abc',
      updatedEmail: 'new@exaple.com',
      updatedName: 'rich',
      user: mockIrsPractitioner as any,
      websocketMessagePrefix: 'user',
    });

    expect(
      applicationContext
        .getUseCaseHelpers()
        .updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.docketEntries.find(
          docketEntry =>
            docketEntry.documentTitle === 'Notice of Change of Address',
        ),
    ).toMatchObject({
      isAutoGenerated: true,
    });
  });
});

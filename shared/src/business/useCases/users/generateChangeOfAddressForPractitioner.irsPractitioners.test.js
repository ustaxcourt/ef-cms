const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  COUNTRY_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} = require('../../entities/EntityConstants');
const { docketClerkUser } = require('../../../test/mockUsers');
const { generateChangeOfAddress } = require('./generateChangeOfAddress');
const { MOCK_CASE } = require('../../../test/mockCase');
jest.mock('../addCoversheetInteractor', () => ({
  addCoverToPdf: jest.fn().mockReturnValue({
    pdfData: '',
  }),
}));

describe('generateChangeOfAddress', () => {
  const { docketNumber } = MOCK_CASE;
  const mockIrsPractitioner = {
    barNumber: 'PT5432',
    contact: {
      address1: '234 Main St!',
      address2: 'Apartment 4',
      address3: 'Under the stairs',
      city: 'Chicago',
      countryType: COUNTRY_TYPES.DOMESTIC,
      phone: '+1 (555) 555-5555',
      postalCode: '61234',
      state: 'IL',
    },
    email: 'irsPractitioner1@example.com',
    name: 'Test IRS Practitioner',
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
      .getPersistenceGateway()
      .getCasesByUserId.mockReturnValue([{ docketNumber }]);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCaseWithIrsPractitioner);

    applicationContext
      .getUtilities()
      .getDocumentTypeForAddressChange.mockReturnValue({
        eventCode: 'NCA',
        title: 'Notice of Change of Address',
      });
  });

  it('should run a change of address when address1 changes for an irs practitioner', async () => {
    const cases = await generateChangeOfAddress({
      applicationContext,
      contactInfo: {
        ...mockIrsPractitioner.contact,
        address1: '23456 Main St',
      },
      user: mockIrsPractitioner,
    });

    expect(
      applicationContext.getDocumentGenerators().changeOfAddress,
    ).toHaveBeenCalled();
    expect(cases).toMatchObject([expect.objectContaining({ docketNumber })]);
    const changeOfAddressDocketEntry = applicationContext
      .getPersistenceGateway()
      .updateCase.mock.calls[0][0].caseToUpdate.docketEntries.find(
        entry => entry.eventCode === 'NCA',
      );
    expect(changeOfAddressDocketEntry.partyIrsPractitioner).toEqual(true);
  });

  it('should not set partyIrsPractitioner if role is not irsPractitioner', async () => {
    await generateChangeOfAddress({
      applicationContext,
      contactInfo: {
        ...mockIrsPractitioner.contact,
        address1: '23456 Main St',
      },
      user: { ...mockIrsPractitioner, role: ROLES.adc },
    });

    const changeOfAddressDocketEntry = applicationContext
      .getPersistenceGateway()
      .updateCase.mock.calls[0][0].caseToUpdate.docketEntries.find(
        entry => entry.eventCode === 'NCA',
      );
    expect(changeOfAddressDocketEntry.partyIrsPractitioner).toBeUndefined();
  });

  it('should send a notification to the user initially and after each case is updated', async () => {
    await generateChangeOfAddress({
      applicationContext,
      contactInfo: {
        ...mockIrsPractitioner.contact,
        address1: '234 Main St',
      },
      user: {},
    });

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser,
    ).toBeCalledTimes(2);
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
      completedCases: 1,
      totalCases: 1,
    });
  });

  it('should NOT send a notification to the user if they have no associated cases', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCasesByUserId.mockReturnValueOnce([]);

    await generateChangeOfAddress({
      applicationContext,
      contactInfo: {
        ...mockIrsPractitioner.contact,
        address1: '234 Main St',
      },
      user: {},
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
      contactInfo: {
        ...mockIrsPractitioner.contact,
        address1: '234 Main St',
      },
      user: mockIrsPractitioner,
    });

    const changeOfAddressDocketEntry = applicationContext
      .getPersistenceGateway()
      .updateCase.mock.calls[0][0].caseToUpdate.docketEntries.find(
        entry => entry.eventCode === 'NCA',
      );
    expect(
      applicationContext.getUseCaseHelpers().countPagesInDocument,
    ).toBeCalledTimes(1);
    expect(changeOfAddressDocketEntry.numberOfPages).toBe(mockNumberOfPages);
  });

  it('should set isAutoGenerated to true on the generated "Notice of Change of Address" document', async () => {
    const cases = await generateChangeOfAddress({
      applicationContext,
      contactInfo: {
        ...mockIrsPractitioner.contact,
        address1: '234 Main St',
      },
      user: mockIrsPractitioner,
    });

    const noticeOfChangeOfAddressDocument = cases[0].docketEntries.find(
      d => d.documentType === 'Notice of Change of Address',
    );

    expect(noticeOfChangeOfAddressDocument).toMatchObject({
      isAutoGenerated: true,
    });
  });
});

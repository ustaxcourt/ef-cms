const {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  ROLES,
} = require('../entities/EntityConstants');
const {
  getContactPrimary,
  getPetitionerById,
} = require('../entities/cases/Case');
const {
  removePetitionerFromCaseInteractor,
} = require('./removePetitionerFromCaseInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { MOCK_CASE } = require('../../test/mockCase');

describe('removePetitionerFromCaseInteractor', () => {
  let mockCase;
  let petitionerToRemove;
  const SECONDARY_CONTACT_ID = '56387318-0092-49a3-8cc1-921b0432bd16';
  beforeEach(() => {
    petitionerToRemove = {
      address1: '2729 Chicken St',
      city: 'Eggyolk',
      contactId: SECONDARY_CONTACT_ID,
      contactType: CONTACT_TYPES.secondary,
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: 'Eggy Egg',
      phone: '123456',
      postalCode: '55555',
      state: 'CO',
    };

    mockCase = {
      ...MOCK_CASE,
      petitioners: [getContactPrimary(MOCK_CASE), petitionerToRemove],
      status: CASE_STATUS_TYPES.generalDocket,
    };
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'docketClerk',
    });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(() => mockCase);
  });

  it('should throw an unauthorized error when the current user does not have permission to edit petitioners', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'petitionsClerk',
    });
    await expect(
      removePetitionerFromCaseInteractor(applicationContext, {
        caseCaption: MOCK_CASE.caseCaption,
        contactId: '7805d1ab-18d0-43ec-bafb-654e83405416',
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow('');
  });

  it('should throw an error if the case status is new', async () => {
    mockCase = {
      ...mockCase,
      status: CASE_STATUS_TYPES.new,
    };

    await expect(
      removePetitionerFromCaseInteractor(applicationContext, {
        caseCaption: MOCK_CASE.caseCaption,
        contactId: SECONDARY_CONTACT_ID,
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow(
      `Case with docketNumber ${mockCase.docketNumber} has not been served`,
    );
  });

  it('should update the case caption', async () => {
    const mockUpdatedCaption = 'An updated caption';

    await removePetitionerFromCaseInteractor(applicationContext, {
      caseCaption: mockUpdatedCaption,
      contactId: SECONDARY_CONTACT_ID,
      docketNumber: MOCK_CASE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.caseCaption,
    ).toEqual(mockUpdatedCaption);
  });

  it('should remove the specified petitioner form the case petitioners array', async () => {
    await removePetitionerFromCaseInteractor(applicationContext, {
      caseCaption: MOCK_CASE.caseCaption,
      contactId: petitionerToRemove.contactId,
      docketNumber: MOCK_CASE.docketNumber,
    });

    const {
      caseToUpdate,
    } = applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock.calls[0][0];

    expect(
      getPetitionerById(caseToUpdate, petitionerToRemove.contactId),
    ).toBeUndefined();
  });
});

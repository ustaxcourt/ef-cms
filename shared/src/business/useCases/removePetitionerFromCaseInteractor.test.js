const {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  ROLES,
} = require('../entities/EntityConstants');
const {
  removePetitionerFromCaseInteractor,
} = require('./removePetitionerFromCaseInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { MOCK_CASE } = require('../../test/mockCase');

describe('removePetitionerFromCaseInteractor', () => {
  let mockCase;
  // const PRIMARY_CONTACT_ID = '661beb76-f9f3-40db-af3e-60ab5c9287f6';
  const SECONDARY_CONTACT_ID = '56387318-0092-49a3-8cc1-921b0432bd16';
  beforeEach(() => {
    // mockContact = {
    //   address1: '2729 Chicken St',
    //   city: 'Eggyolk',
    //   contactType: CONTACT_TYPES.otherPetitioner,
    //   countryType: COUNTRY_TYPES.DOMESTIC,
    //   name: 'Eggy Egg',
    //   phone: '123456',
    //   postalCode: '55555',
    //   state: 'CO',
    // };
    mockCase = {
      ...MOCK_CASE,
      petitioners: [{}],
      status: CASE_STATUS_TYPES.new,
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

  it('should throw an unauthorized error when the current user does not have permission to edit petitioners', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: 'petitionsClerk',
    });
    await expect(
      removePetitionerFromCaseInteractor(applicationContext, {
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
        contactId: SECONDARY_CONTACT_ID,
        docketNumber: MOCK_CASE.docketNumber,
      }),
    ).rejects.toThrow(
      `Case with docketNumber ${mockCase.docketNumber} has not been served`,
    );
  });
});

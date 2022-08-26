const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  ROLES,
  SERVICE_INDICATOR_TYPES,
} = require('../../entities/EntityConstants');
const {
  updatePractitionerCases,
} = require('./verifyUserPendingEmailInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');
const { validUser } = require('../../../test/mockUsers');

describe('verifyUserPendingEmailInteractor updatePractitionerCases', () => {
  let mockPractitionerUser;
  const UPDATED_EMAIL = 'hello@example.com';

  beforeEach(() => {
    mockPractitionerUser = {
      ...validUser,
      barNumber: 'SS8888',
      email: UPDATED_EMAIL,
      role: ROLES.privatePractitioner,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    };

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByUser.mockReturnValue(['101-19']);
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        privatePractitioners: [mockPractitionerUser],
      });
    applicationContext
      .getUseCaseHelpers()
      .updateCaseAndAssociations.mockReturnValue();
    applicationContext
      .getNotificationGateway()
      .sendNotificationToUser.mockReturnValue();
  });

  describe('updatePractitionerCases', () => {
    it('should set the service serviceIndicator to ELECTRONIC when confirming the email', async () => {
      await updatePractitionerCases({
        applicationContext,
        user: mockPractitionerUser,
      });

      expect(
        applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
          .calls[0][0].caseToUpdate.privatePractitioners[0].serviceIndicator,
      ).toEqual(SERVICE_INDICATOR_TYPES.SI_ELECTRONIC);
      expect(
        applicationContext.getNotificationGateway().sendNotificationToUser,
      ).toHaveBeenCalledTimes(2);
    });
  });
});

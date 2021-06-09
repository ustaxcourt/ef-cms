const {
  generatePractitionerCaseListPdfInteractor,
} = require('./generatePractitionerCaseListPdfInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { CASE_STATUS_TYPES, ROLES } = require('../entities/EntityConstants');
const { MOCK_CASE } = require('../../test/mockCase');

describe('generatePractitionerCaseListPdfInteractor', () => {
  it('returns an unauthorized error on non internal users', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
    });

    await expect(
      generatePractitionerCaseListPdfInteractor(applicationContext, {
        userId: 'a54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('generates the practitioner case list PDF', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
    });

    applicationContext
      .getPersistenceGateway()
      .getDocketNumbersByUser.mockResolvedValue([
        {
          ...MOCK_CASE,
          status: CASE_STATUS_TYPES.closed,
        },
        { ...MOCK_CASE },
      ]);

    applicationContext.getDocumentGenerators().practitionerCaseList = jest
      .fn()
      .mockResolvedValue('pdf');

    await generatePractitionerCaseListPdfInteractor(applicationContext, {
      userId: 'a54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().getDocketNumbersByUser,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().practitionerCaseList.mock
        .calls[0][0].data.closedCases,
    ).toEqual([{ ...MOCK_CASE, status: CASE_STATUS_TYPES.closed }]);
    expect(
      applicationContext.getDocumentGenerators().practitionerCaseList.mock
        .calls[0][0].data.openCases,
    ).toEqual([{ ...MOCK_CASE }]);
  });
});

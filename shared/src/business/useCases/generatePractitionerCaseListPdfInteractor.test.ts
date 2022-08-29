const {
  generatePractitionerCaseListPdfInteractor,
} = require('./generatePractitionerCaseListPdfInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { CASE_STATUS_TYPES, ROLES } = require('../entities/EntityConstants');
const { MOCK_CASE } = require('../../test/mockCase');

describe('generatePractitionerCaseListPdfInteractor', () => {
  beforeAll(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
    });
  });

  beforeEach(() => {
    applicationContext.getPersistenceGateway().getUserById.mockResolvedValue({
      barNumber: 'PT1234',
      name: 'Ben Matlock',
    });
  });

  it('returns an unauthorized error on non internal users', async () => {
    applicationContext.getCurrentUser.mockReturnValueOnce({
      role: ROLES.petitioner,
    });

    await expect(
      generatePractitionerCaseListPdfInteractor(applicationContext, {
        userId: 'a54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('looks up the practitioner by the given userId', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCasesAssociatedWithUser.mockResolvedValue([
        {
          ...MOCK_CASE,
          docketNumber: '108-07',
          status: CASE_STATUS_TYPES.closed,
        },
        {
          ...MOCK_CASE,
          docketNumber: '101-17',
          status: CASE_STATUS_TYPES.closed,
        },
        { ...MOCK_CASE, docketNumber: '201-07' },
        { ...MOCK_CASE, docketNumber: '202-17' },
      ]);

    applicationContext.getDocumentGenerators().practitionerCaseList = jest
      .fn()
      .mockResolvedValue('pdf');

    await generatePractitionerCaseListPdfInteractor(applicationContext, {
      userId: 'a54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().getUserById,
    ).toHaveBeenCalledWith({
      applicationContext,
      userId: 'a54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });

  it('throws an error if a practitioner user with the given userId does not exist', async () => {
    applicationContext.getPersistenceGateway().getUserById.mockResolvedValue({
      firstName: 'Nadia',
      lastName: 'Practitioner',
    });

    await expect(
      generatePractitionerCaseListPdfInteractor(applicationContext, {
        userId: 'a54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow('Practitioner not found');
  });

  it('sorts open and closed cases before sending them to document generator', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCasesAssociatedWithUser.mockResolvedValue([
        {
          ...MOCK_CASE,
          docketNumber: '108-07',
          status: CASE_STATUS_TYPES.closed,
        },
        {
          ...MOCK_CASE,
          docketNumber: '2001-17',
          status: CASE_STATUS_TYPES.closed,
        },
        {
          ...MOCK_CASE,
          docketNumber: '501-17',
          status: CASE_STATUS_TYPES.closed,
        },
        { ...MOCK_CASE, docketNumber: '201-07' },
        { ...MOCK_CASE, docketNumber: '1002-17' },
        { ...MOCK_CASE, docketNumber: '902-17' },
      ]);

    applicationContext.getDocumentGenerators().practitionerCaseList = jest
      .fn()
      .mockResolvedValue('pdf');

    await generatePractitionerCaseListPdfInteractor(applicationContext, {
      userId: 'a54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().getCasesAssociatedWithUser,
    ).toHaveBeenCalled();

    const caseData =
      applicationContext.getDocumentGenerators().practitionerCaseList.mock
        .calls[0][0].data;

    // sends cases sorted by descending docket number
    expect(caseData).toMatchObject({
      closedCases: expect.arrayContaining([
        expect.objectContaining({ docketNumber: '2001-17' }),
        expect.objectContaining({ docketNumber: '501-17' }),
        expect.objectContaining({ docketNumber: '108-07' }),
      ]),
      openCases: expect.arrayContaining([
        expect.objectContaining({ docketNumber: '1002-17' }),
        expect.objectContaining({ docketNumber: '902-17' }),
        expect.objectContaining({ docketNumber: '201-07' }),
      ]),
    });
  });

  it('generates the practitioner case list PDF', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCasesAssociatedWithUser.mockResolvedValue([
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
      applicationContext.getPersistenceGateway().getCasesAssociatedWithUser,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getDocumentGenerators().practitionerCaseList.mock
        .calls[0][0].data.closedCases,
    ).toEqual([
      {
        ...MOCK_CASE,
        caseTitle: 'Test Petitioner',
        status: CASE_STATUS_TYPES.closed,
      },
    ]);
    expect(
      applicationContext.getDocumentGenerators().practitionerCaseList.mock
        .calls[0][0].data.openCases,
    ).toEqual([{ ...MOCK_CASE, caseTitle: 'Test Petitioner' }]);
  });
});

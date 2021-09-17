const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('../../entities/cases/Case');
const { generateAndServeDocketEntry } = require('./createChangeItems');
const { MOCK_CASE } = require('../../../test/mockCase');
const { SERVICE_INDICATOR_TYPES } = require('../../entities/EntityConstants');

describe('generateAndServeDocketEntry', () => {
  let testCaseEntity;
  let testArguments;
  let testUser;

  beforeEach(() => {
    testUser = {
      name: 'Test Admissionsclerk',
      role: 'Admissionsclerk',
    };
    testCaseEntity = new Case(MOCK_CASE, { applicationContext });
    testArguments = {
      applicationContext,
      barNumber: 'DD44444',
      caseEntity: testCaseEntity,
      contactName: 'Test Petitioner',
      docketMeta: {
        docketNumber: '101-20',
        documentId: '123',
      },
      documentType: 'Petition',
      isContactRepresented: false,
      newData: {
        contactPrimary: {
          address1: '123 Main St',
          city: 'Somewhere',
          countryType: 'domestic',
        },
        contactSecondary: {
          address1: '123 Main St',
          city: 'Somewhere',
          countryType: 'domestic',
        },
      },
      oldData: {
        contactPrimary: {
          address1: '123 Main St',
          city: 'Somewhere',
        },
      },
      servedParties: [
        {
          name: 'Test Petitioner',
        },
      ],
    };
  });

  it('should send service emails', async () => {
    await generateAndServeDocketEntry({
      ...testArguments,
      caseEntity: testCaseEntity,
      isContactRepresented: true,
      user: testUser,
    });
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenCalled();
  });

  it('should NOT create a work item when admissions clerk updates a represented petitioner email', async () => {
    await generateAndServeDocketEntry({
      ...testArguments,
      caseEntity: testCaseEntity,
      isContactRepresented: true,
      user: testUser,
    });
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).not.toHaveBeenCalled();
  });

  it('should create a work item when admissions clerk updates a unrepresented petitioner email', async () => {
    await generateAndServeDocketEntry({
      ...testArguments,
      caseEntity: testCaseEntity,
      isContactRepresented: false,
      user: testUser,
    });
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toHaveBeenCalled();
  });

  it('should create a work item when admissions clerk updates a petitioner email on a case with a party with paper service', async () => {
    await generateAndServeDocketEntry({
      ...testArguments,
      caseEntity: new Case(
        {
          ...testCaseEntity,
          petitioners: [
            {
              ...testCaseEntity.petitioners[0],
              serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
            },
          ],
        },
        { applicationContext },
      ),
      isContactRepresented: true,
      user: testUser,
    });
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toHaveBeenCalled();
  });

  it('should NOT create a work item when admissions clerk updates a petitioner email on a case with no parties having paper service', async () => {
    await generateAndServeDocketEntry({
      ...testArguments,
      caseEntity: new Case(
        {
          ...testCaseEntity,
          petitioners: [
            {
              ...testCaseEntity.petitioners[0],
              serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
            },
          ],
        },
        { applicationContext },
      ),
      isContactRepresented: true,
      user: testUser,
    });
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).not.toHaveBeenCalled();
  });
});

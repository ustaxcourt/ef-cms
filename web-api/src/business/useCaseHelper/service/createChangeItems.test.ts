import '@web-api/persistence/postgres/workitems/mocks.jest';
import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import {
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { generateAndServeDocketEntry } from './createChangeItems';
import { mockAdmissionsClerkUser } from '@shared/test/mockAuthUsers';

describe('generateAndServeDocketEntry', () => {
  let testCaseEntity;
  let testArguments;
  let testUser;

  beforeEach(() => {
    testUser = {
      name: 'Test Admissionsclerk',
      role: 'Admissionsclerk',
    };
    testCaseEntity = new Case(MOCK_CASE, {
      authorizedUser: mockAdmissionsClerkUser,
    });
    testArguments = {
      applicationContext,
      authorizedUser: mockAdmissionsClerkUser,
      barNumber: 'DD44444',
      caseEntity: testCaseEntity,
      contactName: 'Test Petitioner',
      docketMeta: {
        docketNumber: '101-20',
        documentId: '123',
      },
      documentType: 'Petition',
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
      privatePractitionersRepresentingContact: false,
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
      privatePractitionersRepresentingContact: true,
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
      privatePractitionersRepresentingContact: true,
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
      privatePractitionersRepresentingContact: false,
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
        { authorizedUser: mockAdmissionsClerkUser },
      ),
      privatePractitionersRepresentingContact: true,
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
        { authorizedUser: mockAdmissionsClerkUser },
      ),
      privatePractitionersRepresentingContact: true,
      user: testUser,
    });
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).not.toHaveBeenCalled();
  });

  it('should NOT create a work item when privatePractitioner updates their email and no parties have paper service', async () => {
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
        { authorizedUser: mockAdmissionsClerkUser },
      ),
      user: {
        ...testUser,
        role: ROLES.privatePractitioner,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      },
    });
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).not.toHaveBeenCalled();
  });

  it('should create a work item when privatePractitioner updates their email and their service was set to paper', async () => {
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
        { authorizedUser: mockAdmissionsClerkUser },
      ),
      user: {
        ...testUser,
        role: ROLES.privatePractitioner,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      },
    });
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toHaveBeenCalled();
  });

  it('should pass the number of docket entries on the docket Record + 1 to the coverSheet', async () => {
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
        { authorizedUser: mockAdmissionsClerkUser },
      ),
      user: {
        ...testUser,
        role: ROLES.privatePractitioner,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      },
    });

    expect(
      applicationContext.getDocumentGenerators().coverSheet,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          index: 2,
        }),
      }),
    );
  });

  it('does not throw an error if docketMeta is undefined', async () => {
    await expect(
      generateAndServeDocketEntry({
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
          { authorizedUser: mockAdmissionsClerkUser },
        ),
        docketMeta: undefined,
        user: {
          ...testUser,
          role: ROLES.privatePractitioner,
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        },
      }),
    ).resolves.toBeTruthy();
  });
});

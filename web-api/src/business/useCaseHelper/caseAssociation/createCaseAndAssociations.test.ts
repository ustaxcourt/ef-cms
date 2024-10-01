import '@web-api/persistence/postgres/cases/mocks.jest';
import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { MOCK_DOCUMENTS } from '../../../../../shared/src/test/mockDocketEntry';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createCaseAndAssociations } from './createCaseAndAssociations';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';

describe('createCaseAndAssociations', () => {
  let createCaseMock = jest.fn();
  let validMockCase;

  beforeAll(() => {
    validMockCase = new Case(
      {
        ...MOCK_CASE,
        archivedCorrespondences: [
          {
            correspondenceId: applicationContext.getUniqueId(),
            documentTitle: 'Inverted Yield Curve',
            userId: applicationContext.getUniqueId(),
          },
        ],
        correspondence: [
          {
            correspondenceId: applicationContext.getUniqueId(),
            documentTitle: 'Deflationary Spending',
            userId: applicationContext.getUniqueId(),
          },
        ],
      },
      { authorizedUser: mockDocketClerkUser },
    )
      .validate()
      .toRawObject();

    applicationContext
      .getPersistenceGateway()
      .createCase.mockImplementation(createCaseMock);
  });

  it('always sends valid entities to the createCase persistence method', async () => {
    await createCaseAndAssociations({
      applicationContext,
      authorizedUser: mockDocketClerkUser,
      caseToCreate: validMockCase,
    });
    expect(createCaseMock).toHaveBeenCalled();
    const updateArgs = createCaseMock.mock.calls[0][0];

    expect(updateArgs.caseToCreate.isValidated).toBe(true);
  });

  describe('docket entries', () => {
    it('throws an error if docket entries are invalid', async () => {
      const caseToCreate = {
        ...validMockCase,
        docketEntries: [{ docketNumber: 'peaches' }],
      };
      await expect(
        createCaseAndAssociations({
          applicationContext,
          authorizedUser: mockDocketClerkUser,
          caseToCreate,
        }),
      ).rejects.toThrow('entity was invalid');
    });

    it('calls updateDocketEntry for each docket entry which has been added or changed', async () => {
      const firstDocketEntry = MOCK_DOCUMENTS[0];
      const caseToCreate = {
        ...validMockCase,
        docketEntries: MOCK_DOCUMENTS,
      };

      await createCaseAndAssociations({
        applicationContext,
        authorizedUser: mockDocketClerkUser,
        caseToCreate,
      });

      expect(
        applicationContext.getPersistenceGateway().createCase.mock.calls[0][0],
      ).toMatchObject({ applicationContext, caseToCreate });

      expect(
        applicationContext.getPersistenceGateway().updateDocketEntry,
      ).toHaveBeenCalledTimes(MOCK_DOCUMENTS.length);

      expect(
        applicationContext.getPersistenceGateway().updateDocketEntry.mock
          .calls[0][0],
      ).toMatchObject({
        applicationContext: expect.anything(),
        docketEntryId: firstDocketEntry.docketEntryId,
        docketNumber: caseToCreate.docketNumber,
        document: firstDocketEntry,
      });
    });
  });

  describe('IRS practitioners', () => {
    const practitionerId = applicationContext.getUniqueId();
    const practitioner = {
      barNumber: 'BT007',
      name: 'Bobby Tables',
      role: 'irsPractitioner',
      userId: practitionerId,
    };
    const mockCaseWithIrsPractitioners = new Case(
      {
        ...MOCK_CASE,
        irsPractitioners: [practitioner],
      },
      { authorizedUser: mockDocketClerkUser },
    );

    it('throws an error if IRS practitioners are invalid', async () => {
      const caseToCreate = {
        ...validMockCase,
        irsPractitioners: [{ barNumber: 0, role: 'spring', userId: 'yoohoo' }],
      };
      await expect(
        createCaseAndAssociations({
          applicationContext,
          authorizedUser: mockDocketClerkUser,
          caseToCreate,
        }),
      ).rejects.toThrow('entity was invalid');
    });

    it('calls updateIrsPractitionerOnCase once for each IRS practitioner on the case', async () => {
      await createCaseAndAssociations({
        applicationContext,
        authorizedUser: mockDocketClerkUser,
        caseToCreate: mockCaseWithIrsPractitioners,
      });

      expect(
        applicationContext.getPersistenceGateway().updateIrsPractitionerOnCase,
      ).toHaveBeenCalledTimes(1);
      expect(
        applicationContext.getPersistenceGateway().updateIrsPractitionerOnCase
          .mock.calls[0][0],
      ).toMatchObject({
        docketNumber: mockCaseWithIrsPractitioners.docketNumber,
        practitioner,
        userId: practitionerId,
      });
    });
  });

  describe('Private practitioners', () => {
    const practitionerId = applicationContext.getUniqueId();
    const practitioner = {
      barNumber: 'TB009',
      name: 'Tammy Burns',
      role: 'privatePractitioner',
      userId: practitionerId,
    };

    const mockCaseWithPrivatePractitioners = new Case(
      {
        ...MOCK_CASE,
        privatePractitioners: [practitioner],
      },
      { authorizedUser: mockDocketClerkUser },
    );

    it('throws an error if IRS practitioners are invalid', async () => {
      const caseToCreate = {
        ...validMockCase,
        privatePractitioners: [
          { barNumber: 0, role: 'spring', userId: 'yoohoo' },
        ],
      };
      await expect(
        createCaseAndAssociations({
          applicationContext,
          authorizedUser: mockDocketClerkUser,
          caseToCreate,
        }),
      ).rejects.toThrow('entity was invalid');
    });

    it('calls updateprivatePractitionerOnCase once for each private practitioner on the case', async () => {
      await createCaseAndAssociations({
        applicationContext,
        authorizedUser: mockDocketClerkUser,
        caseToCreate: mockCaseWithPrivatePractitioners,
      });

      expect(
        applicationContext.getPersistenceGateway()
          .updatePrivatePractitionerOnCase,
      ).toHaveBeenCalledTimes(1);
      expect(
        applicationContext.getPersistenceGateway()
          .updatePrivatePractitionerOnCase.mock.calls[0][0],
      ).toMatchObject({
        docketNumber: mockCaseWithPrivatePractitioners.docketNumber,
        practitioner,
        userId: practitionerId,
      });
    });
  });
});

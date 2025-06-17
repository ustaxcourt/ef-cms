import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/users/mocks.jest';
import '@web-api/persistence/postgres/docketEntries/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import { Case } from '@shared/business/entities/cases/Case';
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_DOCUMENTS } from '@shared/test/mockDocketEntry';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { createCaseAndAssociations } from './createCaseAndAssociations';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { createCase as createCaseMock } from '@web-api/persistence/postgres/cases/createCase';
import { upsertDocketEntries as upsertDocketEntriesMock } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntries';
import { associateUserWithCase as associateUserWithCaseMock } from '@web-api/persistence/postgres/users/cases/associateUserWithCase';

const createCase = createCaseMock as jest.Mock;
const associateUserWithCase = associateUserWithCaseMock as jest.Mock;
const upsertDocketEntries = jest.mocked(upsertDocketEntriesMock);

describe('createCaseAndAssociations', () => {
  const createCaseMock = jest.fn();
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

    createCase.mockImplementation(createCaseMock);
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

    it('calls upsertDocketEntries for each docket entry which has been added or changed', async () => {
      const caseToCreate = {
        ...validMockCase,
        docketEntries: MOCK_DOCUMENTS,
      };

      await createCaseAndAssociations({
        applicationContext,
        authorizedUser: mockDocketClerkUser,
        caseToCreate,
      });

      expect(createCase.mock.calls[0][0]).toMatchObject({
        caseToCreate,
      });

      expect(upsertDocketEntries).toHaveBeenCalledWith(
        MOCK_DOCUMENTS.map(d => ({
          ...d,
          isDraft: !!d.isDraft,
          isStricken: !!d.isStricken,
          addToCoversheet: !!d.addToCoversheet,
        })),
      );
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

      expect(associateUserWithCase).toHaveBeenCalledTimes(1);
      expect(associateUserWithCase.mock.calls[0][0]).toMatchObject({
        docketNumber: mockCaseWithIrsPractitioners.docketNumber,
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

      expect(associateUserWithCase).toHaveBeenCalledTimes(1);
      expect(associateUserWithCase.mock.calls[0][0]).toMatchObject({
        docketNumber: mockCaseWithPrivatePractitioners.docketNumber,
        userId: practitionerId,
      });
    });
  });
});

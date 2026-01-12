import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/docketEntries/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
jest.mock(
  '@web-api/persistence/postgres/cases/userOnCase/associateUsersWithCases',
);
import { Case } from '@shared/business/entities/cases/Case';
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_DOCUMENTS } from '@shared/test/mockDocketEntry';
import { createCaseAndAssociations } from './createCaseAndAssociations';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { createCase as createCaseMock } from '@web-api/persistence/postgres/cases/createCase';
import { upsertDocketEntries as upsertDocketEntriesMock } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntries';
import { getUniqueId } from '@shared/sharedAppContext';
import { associateUsersWithCases as associateUsersWithCasesMock } from '@web-api/persistence/postgres/cases/userOnCase/associateUsersWithCases';

const createCase = createCaseMock as jest.Mock;
const upsertDocketEntries = jest.mocked(upsertDocketEntriesMock);

describe('createCaseAndAssociations', () => {
  const createCaseMock = jest.fn();
  const associateUsersWithCases = jest.mocked(associateUsersWithCasesMock);
  let validMockCase;

  beforeAll(() => {
    validMockCase = new Case(
      {
        ...MOCK_CASE,
        archivedCorrespondences: [
          {
            correspondenceId: getUniqueId(),
            documentTitle: 'Inverted Yield Curve',
            userId: getUniqueId(),
          },
        ],
        correspondence: [
          {
            correspondenceId: getUniqueId(),
            documentTitle: 'Deflationary Spending',
            userId: getUniqueId(),
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
    const practitionerId = getUniqueId();
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
          authorizedUser: mockDocketClerkUser,
          caseToCreate,
        }),
      ).rejects.toThrow('entity was invalid');
    });

    it('calls associateUsersWithCases once for each IRS practitioner on the case', async () => {
      await createCaseAndAssociations({
        authorizedUser: mockDocketClerkUser,
        caseToCreate: mockCaseWithIrsPractitioners,
      });

      expect(associateUsersWithCases).toHaveBeenCalledTimes(3);
      expect(associateUsersWithCases.mock.calls[0][0][0]).toMatchObject({
        docketNumber: mockCaseWithIrsPractitioners.docketNumber,
        userId: practitionerId,
      });
    });
  });

  describe('Private practitioners', () => {
    const practitionerId = getUniqueId();
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
          authorizedUser: mockDocketClerkUser,
          caseToCreate,
        }),
      ).rejects.toThrow('entity was invalid');
    });

    it('calls updateprivatePractitionerOnCase once for each private practitioner on the case', async () => {
      await createCaseAndAssociations({
        authorizedUser: mockDocketClerkUser,
        caseToCreate: mockCaseWithPrivatePractitioners,
      });

      expect(associateUsersWithCases).toHaveBeenCalledTimes(3);
      expect(associateUsersWithCases.mock.calls[1][0][0]).toMatchObject({
        docketNumber: mockCaseWithPrivatePractitioners.docketNumber,
        userId: practitionerId,
      });
    });
  });
});

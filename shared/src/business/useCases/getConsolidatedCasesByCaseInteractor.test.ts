import { MOCK_CASE } from '../../test/mockCase';
import { MOCK_USERS } from '../../test/mockUsers';
import { applicationContext } from '../test/createTestApplicationContext';
import { getConsolidatedCasesByCaseInteractor } from './getConsolidatedCasesByCaseInteractor';

const petitionerUser = MOCK_USERS['d7d90c05-f6cd-442c-a168-202db587f16f'];
const privatePractitionerUser =
  MOCK_USERS['330d4b65-620a-489d-8414-6623653ebc4f'];
const irsPractitionerUser = MOCK_USERS['f7d90c05-f6cd-442c-a168-202db587f16f'];

describe('getConsolidatedCasesByCaseInteractor', () => {
  beforeAll(() => {
    applicationContext.getCurrentUser.mockResolvedValue(
      MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
    );
    applicationContext
      .getPersistenceGateway()
      .getCasesByLeadDocketNumber.mockResolvedValue([
        {
          ...MOCK_CASE,
          caseCaption: 'Guy Fieri vs. Bobby Flay',
          docketNumber: '101-20',
        },
        {
          ...MOCK_CASE,
          caseCaption: 'Guy Fieri vs. Gordon Ramsay',
          docketNumber: '102-20',
          leadDocketNumber: '101-20',
        },
      ]);
  });

  it.skip('returns consolidated cases by the leadDocketNumber for internal users', async () => {
    let cases = await getConsolidatedCasesByCaseInteractor(applicationContext, {
      docketNumber: '101-20',
    });

    expect(cases).toMatchObject([
      {
        caseCaption: 'Guy Fieri vs. Bobby Flay',
        docketNumber: '101-20',
        entityName: 'Case',
      },
      {
        caseCaption: 'Guy Fieri vs. Gordon Ramsay',
        docketNumber: '102-20',
        entityName: 'Case',
      },
    ]);

    expect(
      applicationContext.getPersistenceGateway().getCasesByLeadDocketNumber,
    ).toHaveBeenCalled();

    const petitionsClerkUser =
      MOCK_USERS['c7d90c05-f6cd-442c-a168-202db587f16f'];
    applicationContext.getCurrentUser.mockResolvedValue(petitionsClerkUser);

    cases = await getConsolidatedCasesByCaseInteractor(applicationContext, {
      docketNumber: '101-20',
    });

    expect(cases).toMatchObject([
      {
        caseCaption: 'Guy Fieri vs. Bobby Flay',
        docketNumber: '101-20',
        entityName: 'Case',
      },
      {
        caseCaption: 'Guy Fieri vs. Gordon Ramsay',
        docketNumber: '102-20',
        entityName: 'Case',
      },
    ]);

    expect(
      applicationContext.getPersistenceGateway().getCasesByLeadDocketNumber,
    ).toHaveBeenCalled();
  });

  it.skip('returns consolidated cases by the docketnumber for external users', async () => {
    // 1. if associated, return the list of cases with   entityName: 'Case',
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockResolvedValue(true);

    applicationContext.getCurrentUser.mockResolvedValue(petitionerUser);

    let cases = await getConsolidatedCasesByCaseInteractor(applicationContext, {
      docketNumber: '101-20',
    });

    expect(cases).toMatchObject([
      {
        caseCaption: 'Guy Fieri vs. Bobby Flay',
        docketNumber: '101-20',
        entityName: 'Case',
      },
      {
        caseCaption: 'Guy Fieri vs. Gordon Ramsay',
        docketNumber: '102-20',
        entityName: 'Case',
      },
    ]);

    applicationContext.getCurrentUser.mockResolvedValue(
      privatePractitionerUser,
    );

    cases = await getConsolidatedCasesByCaseInteractor(applicationContext, {
      docketNumber: '101-20',
    });

    expect(cases).toMatchObject([
      {
        caseCaption: 'Guy Fieri vs. Bobby Flay',
        docketNumber: '101-20',
        entityName: 'Case',
      },
      {
        caseCaption: 'Guy Fieri vs. Gordon Ramsay',
        docketNumber: '102-20',
        entityName: 'Case',
      },
    ]);

    applicationContext.getCurrentUser.mockResolvedValue(irsPractitionerUser);

    cases = await getConsolidatedCasesByCaseInteractor(applicationContext, {
      docketNumber: '101-20',
    });

    expect(cases).toMatchObject([
      {
        caseCaption: 'Guy Fieri vs. Bobby Flay',
        docketNumber: '101-20',
        entityName: 'Case',
      },
      {
        caseCaption: 'Guy Fieri vs. Gordon Ramsay',
        docketNumber: '102-20',
        entityName: 'Case',
      },
    ]);
  });

  [petitionerUser, privatePractitionerUser, irsPractitionerUser].forEach(
    externalUser => {
      it(`returns consolidated cases by the lead docketnumber for ${externalUser.name}`, async () => {
        // 2. if associated, return the list of cases with   entityName: 'Public Case',
        applicationContext
          .getPersistenceGateway()
          .verifyCaseForUser.mockResolvedValueOnce(true)
          .mockResolvedValue(false);

        applicationContext.getCurrentUser.mockResolvedValue(externalUser);

        let cases = await getConsolidatedCasesByCaseInteractor(
          applicationContext,
          {
            docketNumber: '101-20',
          },
        );

        console.log(
          applicationContext.getPersistenceGateway().verifyCaseForUser.mock
            .calls.length,
        );

        expect(cases).toMatchObject([
          {
            caseCaption: 'Guy Fieri vs. Bobby Flay',
            docketNumber: '101-20',
            entityName: 'PublicCase',
          },
          {
            caseCaption: 'Guy Fieri vs. Gordon Ramsay',
            docketNumber: '102-20',
            entityName: 'Case',
          },
        ]);
      });
    },
  );
});

import { MOCK_CASE } from '../../test/mockCase';
import {
  MOCK_EXTERNAL_USERS,
  MOCK_INTERNAL_USERS,
  MOCK_USERS,
} from '../../test/mockUsers';
import { ROLES } from '../entities/EntityConstants';
import { User } from '../entities/User';
import { applicationContext } from '../test/createTestApplicationContext';
import { getConsolidatedCasesByCaseInteractor } from './getConsolidatedCasesByCaseInteractor';

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
        },
      ]);
  });

  it('returns consolidated cases by the leadDocketNumber for internal users', async () => {
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
    const externalUsers = Object.keys(MOCK_EXTERNAL_USERS);
    applicationContext
      .getPersistenceGateway()
      .verifyCaseForUser.mockResolvedValue(true);
    externalUsers.forEach(async extUser => {
      applicationContext.getCurrentUser.mockResolvedValue(extUser);

      const cases = await getConsolidatedCasesByCaseInteractor(
        applicationContext,
        {
          docketNumber: '101-20',
        },
      );

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

    // 2. if associated, return the list of cases with   entityName: 'Public Case',
  });
});

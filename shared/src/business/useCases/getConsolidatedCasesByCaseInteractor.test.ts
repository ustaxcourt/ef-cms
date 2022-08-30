import { MOCK_CASE } from '../../test/mockCase';
import { MOCK_USERS } from '../../test/mockUsers';
import { applicationContext } from '../test/createTestApplicationContext';
import { getConsolidatedCasesByCaseInteractor } from './getConsolidatedCasesByCaseInteractor';

describe('getConsolidatedCasesByCaseInteractor', () => {
  let getCasesByLeadDocketNumberStub;

  beforeEach(() => {
    getCasesByLeadDocketNumberStub = jest.fn().mockResolvedValue([
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

    applicationContext.getCurrentUser.mockResolvedValue(
      MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
    );
    applicationContext
      .getPersistenceGateway()
      .getCasesByLeadDocketNumber.mockImplementation(
        getCasesByLeadDocketNumberStub,
      );
  });

  it('returns cases by the leadDocketNumber', async () => {
    const cases = await getConsolidatedCasesByCaseInteractor(
      applicationContext,
      {
        docketNumber: '101-20',
      },
    );

    expect(
      applicationContext.getPersistenceGateway().getCasesByLeadDocketNumber,
    ).toHaveBeenCalled();
    expect(cases).toMatchObject([
      {
        caseCaption: 'Guy Fieri vs. Bobby Flay',
        docketNumber: '101-20',
      },
      {
        caseCaption: 'Guy Fieri vs. Gordon Ramsay',
        docketNumber: '102-20',
      },
    ]);
  });
});

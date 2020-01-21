import { getConsolidatedCasesByUserAction } from './getConsolidatedCasesByUserAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('getConsolidatedCasesByUserAction', () => {
  let getConsolidatedCasesByUserInteractorStub;

  beforeEach(() => {
    getConsolidatedCasesByUserInteractorStub = jest.fn().mockReturnValue([
      {
        caseId: 'case-id-234',
        createdAt: '2019-07-20T20:20:15.680Z',
      },
      {
        caseId: 'case-id-123',
        createdAt: '2019-07-19T20:20:15.680Z',
      },
      {
        caseId: 'case-id-345',
        createdAt: '2019-07-21T20:20:15.680Z',
      },
    ]);

    presenter.providers.applicationContext = {
      getCurrentUser: () => ({
        userId: 'abc-123',
      }),
      getUseCases: () => ({
        getConsolidatedCasesByUserInteractor: getConsolidatedCasesByUserInteractorStub,
      }),
    };
  });

  it('gets the consolidated cases by userId', async () => {
    const { output } = await runAction(getConsolidatedCasesByUserAction, {
      modules: { presenter },
    });

    expect(output).toMatchObject({
      caseList: [
        { caseId: 'case-id-345', createdAt: '2019-07-21T20:20:15.680Z' },
        { caseId: 'case-id-234', createdAt: '2019-07-20T20:20:15.680Z' },
        { caseId: 'case-id-123', createdAt: '2019-07-19T20:20:15.680Z' },
      ],
    });
  });
});

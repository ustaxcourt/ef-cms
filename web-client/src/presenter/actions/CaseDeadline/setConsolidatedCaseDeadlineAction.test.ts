import { setConsolidatedCaseDeadlineAction } from './setConsolidatedCaseDeadlineAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { STATE_KEYS } from '@shared/business/entities/EntityConstants';

describe('setConsolidatedCaseDeadlineAction', () => {
  it('should set the consolidated cases in state', async () => {
    const consolidatedCaseDeadlines = [
      { docketNumber: '101-25' },
      { docketNumber: '102-25' },
      { docketNumber: '103-25' },
      { docketNumber: '104-25' },
      { docketNumber: '105-25' },
    ];

    const { state } = await runAction(setConsolidatedCaseDeadlineAction, {
      modules: {
        presenter,
      },
      props: {
        consolidatedCaseDeadlines,
      },
      state: {
        [STATE_KEYS.CONSOLIDATED_CASE_DEADLINES]: undefined,
      },
    });

    expect(state[STATE_KEYS.CONSOLIDATED_CASE_DEADLINES]).toEqual(
      consolidatedCaseDeadlines,
    );
  });
});

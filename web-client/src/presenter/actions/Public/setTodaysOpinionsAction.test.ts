import { runAction } from '@web-client/presenter/test.cerebral';
import { setTodaysOpinionsAction } from './setTodaysOpinionsAction';

describe('setTodaysOpinionsAction', () => {
  it('sets state.todaysOpions from props.todaysOpinions', async () => {
    const mockTodaysOpinions = [
      {
        docketEntryId: '1234',
        documentTitle: 'An opinion',
      },
      {
        docketEntryId: '5678',
        documentTitle: 'Another opinion',
      },
    ];

    const { state } = await runAction(setTodaysOpinionsAction, {
      props: {
        todaysOpinions: mockTodaysOpinions,
      },
      state: {
        todaysOpinions: [],
      },
    });

    expect(state.todaysOpinions).toMatchObject(mockTodaysOpinions);
  });
});

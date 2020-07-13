import { runAction } from 'cerebral/test';
import { setTodaysOpinionsAction } from './setTodaysOpinionsAction';

describe('setTodaysOpinionsAction', () => {
  it('sets state.todaysOpions from props.todaysOpinions', async () => {
    const mockTodaysOpinions = [
      {
        documentId: '1234',
        documentTitle: 'An opinion',
      },
      {
        documentId: '5678',
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

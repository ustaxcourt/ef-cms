import { runAction } from 'cerebral/test';
import { setSectionForWorkQueueAction } from './setSectionForWorkQueueAction';

describe('setSectionForWorkQueueAction', () => {
  it('sets state.workQueueToDisplay.section from props', async () => {
    const mockSection = 'docket';
    const { state } = await runAction(setSectionForWorkQueueAction, {
      props: {
        section: mockSection,
      },
    });

    expect(state.workQueueToDisplay.section).toEqual(mockSection);
  });
});

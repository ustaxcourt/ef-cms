import { DOCKET_SECTION } from '../../../../shared/src/business/entities/EntityConstants';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setSectionForWorkQueueAction } from './setSectionForWorkQueueAction';

describe('setSectionForWorkQueueAction', () => {
  it('sets state.workQueueToDisplay.section from props', async () => {
    const mockSection = DOCKET_SECTION;
    const { state } = await runAction(setSectionForWorkQueueAction, {
      props: {
        section: mockSection,
      },
    });

    expect(state.workQueueToDisplay.section).toEqual(mockSection);
  });

  it('preserves existing section when props.section is undefined', async () => {
    const { state } = await runAction(setSectionForWorkQueueAction, {
      props: {},
      state: {
        workQueueToDisplay: {
          section: DOCKET_SECTION,
        },
      },
    });

    expect(state.workQueueToDisplay.section).toEqual(DOCKET_SECTION);
  });
});

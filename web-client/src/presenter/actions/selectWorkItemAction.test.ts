import { runAction } from '@web-client/presenter/test.cerebral';
import { selectWorkItemAction } from './selectWorkItemAction';

describe('selectWorkItemAction', () => {
  it('removes the props.workItem from state.selectedWorkItems if props.workItem is already present in state.selectedWorkItems', async () => {
    const { state } = await runAction(selectWorkItemAction, {
      props: {
        workItem: {
          workItemId: 1,
        },
      },
      state: {
        formattedWorkQueue: [
          {
            workItemId: 1,
          },
          {
            workItemId: 2,
          },
        ],
        selectedWorkItems: [
          {
            workItemId: 1,
          },
          {
            workItemId: 2,
          },
        ],
      },
    });

    expect(state.selectedWorkItems).toEqual([
      {
        workItemId: 2,
      },
    ]);
  });

  it('adds the props.workItem to state.selectedWorkItems if props.workItem is NOT already present in state.selectedWorkItems', async () => {
    const { state } = await runAction(selectWorkItemAction, {
      props: {
        workItem: {
          workItemId: 1,
        },
      },
      state: {
        formattedWorkQueue: [
          {
            workItemId: 1,
          },
          {
            workItemId: 2,
          },
        ],
        selectedWorkItems: [
          {
            workItemId: 2,
          },
        ],
      },
    });

    expect(state.selectedWorkItems).toEqual([
      {
        workItemId: 2,
      },
      {
        workItemId: 1,
      },
    ]);
  });

  it('sets the state.workitemAllCheckbox boolean to false when unchecking any selected workitem', async () => {
    const { state } = await runAction(selectWorkItemAction, {
      props: {
        workItem: {
          workItemId: 1,
        },
      },
      state: {
        formattedWorkQueue: [
          {
            workItemId: 1,
          },
        ],
        selectedWorkItems: [
          {
            workItemId: 1,
          },
        ],
        workitemAllCheckbox: true,
      },
    });

    expect(state.workitemAllCheckbox).toBe(false);
  });

  it('sets workitemAllCheckbox to true if all checkboxes are selected', async () => {
    const { state } = await runAction(selectWorkItemAction, {
      props: {
        workItem: {
          workItemId: 1,
        },
      },
      state: {
        formattedWorkQueue: [
          {
            workItemId: 1,
          },
        ],
        selectedWorkItems: [],
        workitemAllCheckbox: false,
      },
    });

    expect(state.workitemAllCheckbox).toBe(true);
  });
});

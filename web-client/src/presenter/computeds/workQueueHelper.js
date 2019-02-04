import { state } from 'cerebral';

export default get => {
  const selectedWorkItems = get(state.selectedWorkItems);
  const workQueueToDisplay = get(state.workQueueToDisplay);

  return {
    showInbox: workQueueToDisplay.box === 'inbox',
    showIndividualWorkQueue: workQueueToDisplay.queue === 'my',
    showOutbox: workQueueToDisplay.box === 'outbox',
    showSectionWorkQueue: workQueueToDisplay.queue === 'section',
    showSendToBar: selectedWorkItems.length > 0,
  };
};

import { state } from 'cerebral';

export default get => {
  const selectedWorkItems = get(state.selectedWorkItems);
  const workQueueToDisplay = get(state.workQueueToDisplay);

  return {
    showSendToBar: selectedWorkItems.length > 0,
    showSectionWorkQueue: workQueueToDisplay.queue === 'section',
    showIndividualWorkQueue: workQueueToDisplay.queue === 'my',
    showInbox: workQueueToDisplay.box === 'inbox',
    showOutbox: workQueueToDisplay.box === 'outbox',
  };
};

import { state } from 'cerebral';

export default get => {
  const selectedWorkItems = get(state.selectedWorkItems);
  const workQueueToDisplay = get(state.workQueueToDisplay);

  return {
    showSendToBar: selectedWorkItems.length > 0,
    selectedInbox: workQueueToDisplay.box === 'inbox',
    selectedOutbox: workQueueToDisplay.box === 'outbox',
    showSectionWorkQueue: workQueueToDisplay.queue === 'section',
    showIndividualWorkQueue: workQueueToDisplay.queue === 'my',
  };
};

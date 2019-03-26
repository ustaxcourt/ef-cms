import { state } from 'cerebral';

export default get => {
  const selectedWorkItems = get(state.selectedWorkItems);
  const workQueueToDisplay = get(state.workQueueToDisplay);
  const userSection = get(state.user.section);

  return {
    showInbox: workQueueToDisplay.box === 'inbox',
    showIndividualWorkQueue: workQueueToDisplay.queue === 'my',
    showOutbox: workQueueToDisplay.box === 'outbox',
    showRunBatchIRSProcessButton: userSection === 'petitions',
    showSectionWorkQueue: workQueueToDisplay.queue === 'section',
    showSendToBar: selectedWorkItems.length > 0,
  };
};

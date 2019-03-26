import { state } from 'cerebral';
import { mapValueHelper } from './mapValueHelper';

export const workQueueHelper = get => {
  const selectedWorkItems = get(state.selectedWorkItems);
  const workQueueToDisplay = get(state.workQueueToDisplay);
  const userSection = get(state.user.section);
  const userRole = get(state.user.role);
  const userRoleMap = mapValueHelper(userRole);

  return {
    showInbox: workQueueToDisplay.box === 'inbox',
    showIndividualWorkQueue: workQueueToDisplay.queue === 'my',
    showOutbox: workQueueToDisplay.box === 'outbox',
    showRunBatchIRSProcessButton: userSection === 'petitions',
    showSectionWorkQueue: workQueueToDisplay.queue === 'section',
    showSendToBar: selectedWorkItems.length > 0,
    showStartCaseButton: !!userRoleMap.petitionsclerk,
  };
};

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IndividualWorkQueueInProgress } from './IndividualWorkQueueInProgress';
import { IndividualWorkQueueInbox } from './IndividualWorkQueueInbox';
import { IndividualWorkQueueOutbox } from './IndividualWorkQueueOutbox';
import { PaperServiceConfirmModal } from '../CaseDetail/PaperServiceConfirmModal';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { WorkQueueActionButtons } from './WorkQueueActionButtons';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

const WorkQueueLoadingSpinner = () => (
  <div className="padding-4 text-center">
    <FontAwesomeIcon className="fa-spin spinner" icon="spinner" size="2x" />
  </div>
);

export const IndividualWorkQueue = connect(
  {
    isLoadingWorkQueue: state.workQueuePage.isLoadingWorkQueue,
    queue: state.workQueueToDisplay.queue,
    showModal: state.modal.showModal,
    switchWorkQueueTabSequence: sequences.switchWorkQueueTabSequence,
    workQueueHelper: state.workQueueHelper,
  },
  function IndividualWorkQueue({
    isLoadingWorkQueue,
    queue,
    showModal,
    switchWorkQueueTabSequence,
    workQueueHelper,
  }) {
    return (
      <>
        <Tabs
          bind="workQueueToDisplay.box"
          onSelect={box => {
            switchWorkQueueTabSequence({
              box,
              queue,
            });
          }}
        >
          <WorkQueueActionButtons />
          <Tab
            id="individual-inbox-tab"
            tabName="inbox"
            title={`Inbox (${workQueueHelper.individualInboxCount})`}
          >
            <div id="individual-inbox-tab-content">
              {isLoadingWorkQueue ? (
                <WorkQueueLoadingSpinner />
              ) : (
                <IndividualWorkQueueInbox />
              )}
            </div>
          </Tab>
          {workQueueHelper.showInProgressTab && (
            <Tab
              data-testid="individual-work-queue-in-progress-button"
              tabName="inProgress"
              title={`In Progress (${workQueueHelper.individualInProgressCount})`}
            >
              {isLoadingWorkQueue ? (
                <WorkQueueLoadingSpinner />
              ) : (
                <IndividualWorkQueueInProgress />
              )}
            </Tab>
          )}
          <Tab
            id="individual-sent-tab"
            tabName="outbox"
            title={workQueueHelper.sentTitle}
          >
            <div id="individual-sent-tab-content">
              {isLoadingWorkQueue ? (
                <WorkQueueLoadingSpinner />
              ) : (
                <IndividualWorkQueueOutbox />
              )}
            </div>
          </Tab>
        </Tabs>
        {showModal === 'PaperServiceConfirmModal' && (
          <PaperServiceConfirmModal />
        )}
      </>
    );
  },
);

IndividualWorkQueue.displayName = 'IndividualWorkQueue';

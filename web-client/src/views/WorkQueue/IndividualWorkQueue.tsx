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

export const IndividualWorkQueue = connect(
  {
    navigateToPathSequence: sequences.navigateToPathSequence,
    queue: state.workQueueToDisplay.queue,
    section: state.workQueueToDisplay.section,
    showModal: state.modal.showModal,
    workQueueHelper: state.workQueueHelper,
  },
  function IndividualWorkQueue({
    navigateToPathSequence,
    queue,
    section,
    showModal,
    workQueueHelper,
  }) {
    return (
      <>
        <Tabs
          bind="workQueueToDisplay.box"
          onSelect={box => {
            navigateToPathSequence({
              path: workQueueHelper.documentQCNavigationPath({
                box,
                queue,
                section,
              }),
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
              <IndividualWorkQueueInbox />
            </div>
          </Tab>
          {workQueueHelper.showInProgressTab && (
            <Tab
              id="section-in-progress-tab"
              tabName="inProgress"
              title={`In Progress (${workQueueHelper.individualInProgressCount})`}
            >
              <div id="section-in-progress-tab-content">
                <IndividualWorkQueueInProgress />
              </div>
            </Tab>
          )}
          <Tab
            id="individual-sent-tab"
            tabName="outbox"
            title={workQueueHelper.sentTitle}
          >
            <div id="individual-sent-tab-content">
              <IndividualWorkQueueOutbox />
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

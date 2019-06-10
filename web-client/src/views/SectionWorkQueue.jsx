import { SectionWorkQueueBatched } from './SectionWorkQueueBatched';
import { SectionWorkQueueInbox } from './SectionWorkQueueInbox';
import { SectionWorkQueueOutbox } from './SectionWorkQueueOutbox';
import { Tab, Tabs } from '../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SectionWorkQueue = connect(
  {
    navigateToPathSequence: sequences.navigateToPathSequence,
    queue: state.workQueueToDisplay.queue,
    workQueueHelper: state.workQueueHelper,
  },
  ({ navigateToPathSequence, queue, workQueueHelper }) => {
    return (
      <Tabs
        className="classic-horizontal-header3 tab-border"
        bind="workQueueToDisplay.box"
        onSelect={box => {
          navigateToPathSequence({
            path: workQueueHelper.getQueuePath({
              box,
              queue,
            }),
          });
        }}
      >
        <Tab tabName="inbox" title="Inbox" id="section-inbox-tab">
          <div id="section-inbox-tab-content">
            <SectionWorkQueueInbox />
          </div>
        </Tab>
        {workQueueHelper.showBatchedForIRSTab && (
          <Tab
            tabName="batched"
            title="Batched for IRS"
            id="section-batched-for-irs-tab"
          >
            <div id="section-batched-for-irs-tab-content">
              <SectionWorkQueueBatched />
            </div>
          </Tab>
        )}
        {workQueueHelper.showSectionSentTab && (
          <Tab
            tabName="outbox"
            title={workQueueHelper.sentTitle}
            id="section-sent-tab"
          >
            <div id="section-sent-tab-content">
              <SectionWorkQueueOutbox />
            </div>
          </Tab>
        )}
      </Tabs>
    );
  },
);

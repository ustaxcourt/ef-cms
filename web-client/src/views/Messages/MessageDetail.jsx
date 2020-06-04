import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const MessageDetail = connect(
  {
    formattedMessageDetail: state.formattedMessageDetail,
  },
  function MessageDetail({ formattedMessageDetail }) {
    return (
      <>
        <CaseDetailHeader />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <h1>Message</h1>

          <div className="bg-base-lightest padding-top-2 padding-bottom-2 padding-left-3 padding-right-3">
            <div className="grid-row">
              <div className="grid-col-2">
                <span className="text-semibold margin-right-1">Received</span>{' '}
                {formattedMessageDetail.createdAtFormatted}
              </div>
              <div className="grid-col-2">
                <span className="text-semibold margin-right-1">From</span>{' '}
                {formattedMessageDetail.from}
              </div>
              <div className="grid-col-2">
                <span className="text-semibold margin-right-1">To</span>{' '}
                {formattedMessageDetail.to}
              </div>
              <div className="grid-col-6">
                <span className="text-semibold margin-right-1">Subject</span>{' '}
                {formattedMessageDetail.subject}
              </div>
            </div>
            <div className="grid-row margin-top-2">
              <span className="text-semibold margin-right-1">Message</span>{' '}
              {formattedMessageDetail.message}
            </div>
          </div>

          <h2 className="margin-top-5">Attachments</h2>

          <div className="grid-row grid-gap-5">
            <div className="grid-col-4">
              <div className="padding-2 border border-base-lighter message-detail--attachments">
                There are no attachments
              </div>
            </div>
            <div className="grid-col-8">
              <div className="padding-2 border border-base-lighter message-detail--attachments">
                There are no attachments to preview
              </div>
            </div>
          </div>
        </section>
      </>
    );
  },
);

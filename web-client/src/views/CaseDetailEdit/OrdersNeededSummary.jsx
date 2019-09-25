import { CaseDetailHeader } from '../CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const OrdersNeededSummary = connect(
  {
    formattedCaseDetail: state.formattedCaseDetail,
  },
  ({ formattedCaseDetail }) => {
    return (
      <>
        <CaseDetailHeader />
        <section className="grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <div>
            <h1>Orders Needed</h1>
          </div>
          <div>
            <ul className="usa-list">
              {formattedCaseDetail.orderForAmendedPetition && (
                <li>Order for Amended Petition</li>
              )}
              {formattedCaseDetail.orderForAmendedPetitionAndFilingFee && (
                <li>Order for Amended Petition and Filing Fee</li>
              )}
              {formattedCaseDetail.orderForFilingFee && (
                <li>Order for Filing Fee</li>
              )}
              {formattedCaseDetail.orderForOds && (
                <li>Order for Ownership Disclosure Statement</li>
              )}
              {formattedCaseDetail.orderForRatification && (
                <li>Order for Radification of Petition</li>
              )}
              {formattedCaseDetail.orderToShowCause && (
                <li>Order to Show Cause</li>
              )}
              {formattedCaseDetail.noticeOfAttachments && (
                <li>Notice of Attachments in the Nature of Evidence</li>
              )}
            </ul>
          </div>
        </section>
      </>
    );
  },
);

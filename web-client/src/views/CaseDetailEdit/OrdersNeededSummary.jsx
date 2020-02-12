import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const OrdersNeededSummary = connect(
  {
    formattedCaseDetail: state.formattedCaseDetail,
    openCreateOrderChooseTypeModalSequence:
      sequences.openCreateOrderChooseTypeModalSequence,
  },
  ({ formattedCaseDetail, openCreateOrderChooseTypeModalSequence }) => {
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
                <li>Order for Ratification of Petition</li>
              )}
              {formattedCaseDetail.orderDesignatingPlaceOfTrial && (
                <li>Order to Change Designated Place of Trial</li>
              )}
              {formattedCaseDetail.orderToShowCause && (
                <li>Order to Show Cause</li>
              )}
              {formattedCaseDetail.noticeOfAttachments && (
                <li>Notice of Attachments in the Nature of Evidence</li>
              )}
            </ul>
          </div>

          <div className="margin-top-3">
            <Button
              icon="clipboard-list"
              id="button-create-order"
              onClick={() => openCreateOrderChooseTypeModalSequence()}
            >
              Create Order or Notice
            </Button>
          </div>
        </section>
      </>
    );
  },
);

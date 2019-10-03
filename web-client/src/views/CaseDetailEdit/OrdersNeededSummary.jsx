import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetailHeader';
import { ErrorNotification } from '../ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const OrdersNeededSummary = connect(
  {
    formattedCaseDetail: state.formattedCaseDetail,
    openCreateOrderChooseTypeModalSequence:
      sequences.openCreateOrderChooseTypeModalSequence,
    printFromBrowserSequence: sequences.printFromBrowserSequence,
  },
  ({
    formattedCaseDetail,
    openCreateOrderChooseTypeModalSequence,
    printFromBrowserSequence,
  }) => {
    return (
      <>
        <CaseDetailHeader />
        <section className="grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <div>
            <h1>
              Orders Needed{' '}
              <div className="display-inline-block margin-left-2 margin-top-neg-1">
                <Button
                  link
                  onClick={() => {
                    printFromBrowserSequence();
                  }}
                >
                  <FontAwesomeIcon icon="print" size="sm" />
                  Print
                </Button>
              </div>
            </h1>
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
              id="button-create-order"
              onClick={() => openCreateOrderChooseTypeModalSequence()}
            >
              <FontAwesomeIcon icon="clipboard-list" size="1x" /> Create Order
            </Button>
          </div>
        </section>
      </>
    );
  },
);

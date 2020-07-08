import { Button } from '../../ustc-ui/Button/Button';
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

export const OrdersNeededSummary = ({ caseInformation }) => {
  const summaryRef = useRef(null);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const summary = summaryRef.current;
    if (summary) {
      window.scrollTo(0, 0);
    }
  });

  return (
    <>
      {!closed && (
        <div
          aria-live="polite"
          className={classNames('usa-alert', 'usa-alert--warning')}
          ref={summaryRef}
          role="alert"
        >
          <div className="usa-alert__body">
            <div className="grid-container padding-x-0">
              <div className="grid-row">
                <div className="tablet:grid-col-10">
                  <p className="heading-3 usa-alert__heading padding-top-0">
                    Orders/Notices Needed
                  </p>
                  {caseInformation.noticeOfAttachments && (
                    <div>Notice of Attachments in the Nature of Evidence</div>
                  )}
                  {caseInformation.orderForAmendedPetition && (
                    <div>Order for Amended Petition</div>
                  )}
                  {caseInformation.orderForAmendedPetitionAndFilingFee && (
                    <div>Order for Amended Petition and Filing Fee</div>
                  )}
                  {caseInformation.orderForFilingFee && (
                    <div>Order for Filing Fee</div>
                  )}
                  {caseInformation.orderForOds && (
                    <div>Order for Ownership Disclosure Statement</div>
                  )}
                  {caseInformation.orderForRatification && (
                    <div>Order for Ratification of Petition</div>
                  )}
                  {caseInformation.orderDesignatingPlaceOfTrial && (
                    <div>Order Designating Place of Trial</div>
                  )}
                  {caseInformation.orderToShowCause && (
                    <div>Order to Show Cause</div>
                  )}
                </div>
                <div className="tablet:grid-col-2 usa-alert__action">
                  <Button
                    link
                    className="no-underline padding-0"
                    icon="times-circle"
                    iconRight={true}
                    onClick={() => setClosed(true)}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

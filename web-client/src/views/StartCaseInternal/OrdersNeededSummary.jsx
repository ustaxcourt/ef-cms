import { Button } from '../../ustc-ui/Button/Button';
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

export const OrdersNeededSummary = ({ reviewSavedPetitionHelper }) => {
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
                  {reviewSavedPetitionHelper.ordersAndNoticesNeeded.length >
                    0 && (
                    <p className="heading-3 usa-alert__heading padding-top-0">
                      Orders/Notices Needed
                    </p>
                  )}
                  {reviewSavedPetitionHelper.ordersAndNoticesNeeded.map(
                    order => (
                      <div key={order}>{order}</div>
                    ),
                  )}

                  {reviewSavedPetitionHelper.ordersAndNoticesInDraft.length >
                    0 && (
                    <p
                      className="heading-3 usa-alert__heading padding-top-2"
                      id="orders-notices-autocreate-header"
                    >
                      Orders/Notices Automatically Created In Drafts
                    </p>
                  )}

                  {reviewSavedPetitionHelper.ordersAndNoticesInDraft.map(
                    order => (
                      <div key={order}>{order}</div>
                    ),
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

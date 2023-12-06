import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

export const OrdersNeededSummary = connect(
  {
    reviewSavedPetitionHelper: state.reviewSavedPetitionHelper,
  },
  function OrdersNeededSummary({ reviewSavedPetitionHelper }) {
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
                    {reviewSavedPetitionHelper.showOrdersAndNoticesNeededHeader && (
                      <p
                        className="heading-4 padding-top-0"
                        id="orders-notices-needed-header"
                      >
                        Orders/Notices Needed
                      </p>
                    )}
                    {reviewSavedPetitionHelper.ordersAndNoticesNeeded.map(
                      order => (
                        <div
                          className="margin-0 font-weight-normal"
                          key={order}
                        >
                          {order}
                        </div>
                      ),
                    )}

                    {reviewSavedPetitionHelper.showOrdersAndNoticesInDraftHeader && (
                      <p
                        className={classNames(
                          'heading-4',
                          reviewSavedPetitionHelper.ordersAndNoticesNeeded
                            .length && 'padding-top-2',
                        )}
                        id="orders-notices-auto-created-in-draft"
                      >
                        Orders/Notices Automatically Created in Drafts After
                        Service
                      </p>
                    )}

                    {reviewSavedPetitionHelper.ordersAndNoticesInDraft.map(
                      order => (
                        <div
                          className="margin-0 font-weight-normal"
                          key={order}
                        >
                          {order}
                        </div>
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
  },
);

OrdersNeededSummary.displayName = 'OrdersNeededSummary';

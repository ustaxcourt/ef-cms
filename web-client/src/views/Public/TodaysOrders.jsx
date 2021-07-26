import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const TodaysOrders = connect(
  {
    loadMoreTodaysOrdersSequence: sequences.loadMoreTodaysOrdersSequence,
    openCaseDocumentDownloadUrlSequence:
      sequences.openCaseDocumentDownloadUrlSequence,
    sortTodaysOrdersSequence: sequences.sortTodaysOrdersSequence,
    todaysOrdersHelper: state.todaysOrdersHelper,
  },
  function TodaysOrders({
    loadMoreTodaysOrdersSequence,
    openCaseDocumentDownloadUrlSequence,
    sortTodaysOrdersSequence,
    todaysOrdersHelper,
  }) {
    return (
      <>
        <BigHeader text="Today’s Orders" />

        <section className="usa-section grid-container todays-orders">
          <h1 className="margin-bottom-0">
            {todaysOrdersHelper.formattedCurrentDate}
          </h1>

          <div className="grid-row margin-bottom-105">
            <div className="tablet:grid-col-10">
              <p>Note: Orders in sealed cases will not be displayed.</p>
            </div>
            {todaysOrdersHelper.hasResults && (
              <div className="tablet:grid-col-2 float-right text-right text-middle-margin">
                {todaysOrdersHelper.totalCount} Order(s)
              </div>
            )}
          </div>

          {!todaysOrdersHelper.hasResults && (
            <h3 className="margin-top-1">No orders have been issued today.</h3>
          )}

          {todaysOrdersHelper.hasResults && (
            <>
              <NonMobile>
                <div className="tablet:grid-col-2">
                  <select
                    aria-label="Today’s Orders Sort"
                    className="usa-select margin-top-0 margin-bottom-2 sort"
                    name="todaysOrdersSort"
                    value={todaysOrdersHelper.todaysOrdersSort}
                    onChange={e => {
                      sortTodaysOrdersSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  >
                    {todaysOrdersHelper.sortOptions.map(({ label, value }) => (
                      <option key={value} value={value}>
                        Sort by {label}
                      </option>
                    ))}
                  </select>
                </div>
                <table
                  aria-label="todays orders"
                  className="usa-table gray-header todays-orders responsive-table row-border-only"
                >
                  <thead>
                    <tr>
                      <th aria-hidden="true" />
                      <th aria-hidden="true" />
                      <th aria-label="Docket Number">Docket No.</th>
                      <th>Case Title</th>
                      <th>Order</th>
                      <th>Pages</th>
                      <th>Judge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todaysOrdersHelper.formattedOrders.map((order, idx) => (
                      <tr key={`todays-orders-${order.docketEntryId}`}>
                        <td className="center-column">{idx + 1}</td>
                        <td aria-hidden="true"></td>
                        <td>
                          <CaseLink formattedCase={order} />
                        </td>
                        <td>{order.caseCaption}</td>
                        <td>
                          <Button
                            link
                            aria-label={`View PDF: ${order.documentTitle}`}
                            className="text-left line-height-standard padding-0"
                            onClick={() => {
                              openCaseDocumentDownloadUrlSequence({
                                docketEntryId: order.docketEntryId,
                                docketNumber: order.docketNumber,
                                isPublic: true,
                                useSameTab: true,
                              });
                            }}
                          >
                            {order.documentTitle}
                          </Button>
                        </td>
                        <td>{order.numberOfPagesFormatted}</td>
                        <td>{order.formattedJudgeName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </NonMobile>

              <Mobile>
                <table
                  aria-label="todays orders"
                  className="usa-table gray-header todays-orders responsive-table row-border-only"
                >
                  <thead>
                    <tr>
                      <th aria-label="Docket Number">Docket No.</th>
                      <th>Case Title</th>
                      <th>Order Type</th>
                      <th>Pages</th>
                      <th>Judge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todaysOrdersHelper.formattedOrders.map(order => (
                      <tr key={`todays-orders-mobile-${order.docketEntryId}`}>
                        <td className="padding-5 margin-top-2">
                          <CaseLink formattedCase={order} />
                        </td>
                        <td className="padding-5">{order.caseCaption}</td>
                        <td>
                          <Button
                            link
                            aria-label={`View PDF: ${order.documentTitle}`}
                            className="text-left"
                            overrideMargin={true}
                            onClick={() => {
                              openCaseDocumentDownloadUrlSequence({
                                docketEntryId: order.docketEntryId,
                                docketNumber: order.docketNumber,
                                isPublic: true,
                                useSameTab: true,
                              });
                            }}
                          >
                            {order.documentTitle}
                          </Button>
                        </td>
                        <td className="padding-5">
                          Pages {order.numberOfPagesFormatted}
                        </td>
                        <td className="padding-5 margin-bottom-2">
                          Judge {order.formattedJudgeName}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Mobile>
            </>
          )}
          {todaysOrdersHelper.showLoadMoreButton && (
            <Button
              secondary
              aria-label={'load more results'}
              onClick={() => loadMoreTodaysOrdersSequence()}
            >
              Load More
            </Button>
          )}
        </section>
      </>
    );
  },
);

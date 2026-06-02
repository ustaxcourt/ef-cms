import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app-public.cerebral';
import { state } from '@web-client/presenter/app-public.cerebral';
import React, { useEffect, useRef } from 'react';
import {
  formatDateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';
import { SortableColumn } from '@web-client/ustc-ui/Table/SortableColumn';
import {
  ASCENDING,
  SORT_ASCENDING_TEXT,
  SORT_DESCENDING_TEXT,
  TODAYS_ORDERS_PAGE_SIZE,
} from '@shared/business/entities/EntityConstants';
import { columnData } from './TodaysOrdersConstants';
import { Paginator } from '@web-client/ustc-ui/Pagination/Paginator';
import { focusPaginatorTop } from '@web-client/presenter/utilities/focusPaginatorTop';

export const TodaysOrders = connect(
  {
    openCaseDocumentDownloadUrlSequence:
      sequences.openCaseDocumentDownloadUrlSequence,
    setTodaysOrdersCurrentPaginationPageSequence:
      sequences.setTodaysOrdersCurrentPaginationPageSequence,
    sortTodaysOrdersSequence: sequences.sortTodaysOrdersSequence,
    tableSort: state.todaysOrdersTableSort,
    todaysOrdersCurrentPaginationPage: state.todaysOrdersCurrentPaginationPage,
    todaysOrdersHelper: state.todaysOrdersHelper,
  },
  function TodaysOrders({
    openCaseDocumentDownloadUrlSequence,
    setTodaysOrdersCurrentPaginationPageSequence,
    sortTodaysOrdersSequence,
    tableSort,
    todaysOrdersCurrentPaginationPage,
    todaysOrdersHelper,
  }: {
    openCaseDocumentDownloadUrlSequence: any;
    setTodaysOrdersCurrentPaginationPageSequence: any;
    sortTodaysOrdersSequence: any;
    tableSort: {
      sortField: string;
      sortOrder: 'asc' | 'desc';
      sortKey: string;
    };
    todaysOrdersCurrentPaginationPage: number;
    todaysOrdersHelper: {
      formattedCurrentDate: string;
      formattedOrders: Array<{
        docketNumber: string;
        docketEntryId: string;
        filingDate: string;
        caseCaption: string;
        documentTitle: string;
        numberOfPagesFormatted: string | number;
        formattedJudgeName: string;
      }>;
      hasResults: boolean;
      totalCount: number;
      sortOptions: Array<{
        label: string;
        sortField: string;
        sortOrder: string;
      }>;
    };
  }) {
    const paginatorTop = useRef(null);
    const results = todaysOrdersHelper.formattedOrders;
    const { totalCount } = todaysOrdersHelper;
    const currentPaginationPage = todaysOrdersCurrentPaginationPage;

    const totalPages = Math.ceil(totalCount / TODAYS_ORDERS_PAGE_SIZE);

    useEffect(() => {
      if (currentPaginationPage >= totalPages && totalPages > 0) {
        setTodaysOrdersCurrentPaginationPageSequence({
          currentPaginationPage: 0,
        });
      }
    }, [results.length, currentPaginationPage, totalPages]);

    return (
      <>
        <BigHeader text="Today's Orders" />

        <section className="usa-section grid-container todays-orders">
          <h1 className="margin-bottom-0">
            {todaysOrdersHelper.formattedCurrentDate}
          </h1>

          <div className="grid-row margin-bottom-105">
            <div className="tablet:grid-col-12">
              <p>Note: Orders in sealed cases will not be displayed.</p>
            </div>
          </div>

          {!todaysOrdersHelper.hasResults && (
            <h3 className="margin-top-1">No orders have been issued today.</h3>
          )}

          <div ref={paginatorTop} aria-live="polite">
            {todaysOrdersHelper.hasResults && (
              <>
                <NonMobile>
                  <div className="grid-row results-header-row align-items-center">
                    <div className="tablet:grid-col-4"></div>

                    <div className="tablet:grid-col-4 margin-bottom-2">
                      {totalPages > 1 && (
                        <Paginator
                          currentPageIndex={currentPaginationPage}
                          totalPages={totalPages}
                          onPageChange={currentPage => {
                            setTodaysOrdersCurrentPaginationPageSequence({
                              currentPaginationPage: currentPage,
                            });
                            focusPaginatorTop(paginatorTop);
                          }}
                        />
                      )}
                    </div>

                    <div
                      className={`tablet:grid-col-4 text-right${totalPages < 2 ? ' padding-bottom-1' : ''}`}
                    >
                      <span>
                        {todaysOrdersHelper.totalCount.toLocaleString()}{' '}
                        Order(s)
                      </span>
                    </div>
                  </div>

                  <table
                    aria-label="todays orders"
                    className="usa-table ustc-table"
                  >
                    <thead>
                      <tr>
                        {columnData.map((col, idx) => {
                          return (
                            <TodaysOrdersColumnHeader
                              columnData={col}
                              key={idx}
                              orderListId={idx.toString()}
                              onSort={sortTodaysOrdersSequence}
                              tableSort={tableSort}
                            />
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((order, idx) => {
                        return (
                          <TodaysOrdersRow
                            key={`order${idx}`}
                            order={order}
                            openCaseDocumentDownloadUrlSequence={
                              openCaseDocumentDownloadUrlSequence
                            }
                          />
                        );
                      })}
                    </tbody>
                  </table>
                </NonMobile>

                <Mobile>
                  <div className="tablet:grid-col-2">
                    <select
                      aria-label="Today’s Orders Sort"
                      className="usa-select margin-top-0 margin-bottom-2 sort"
                      name="todaysOrdersSort"
                      value={`${tableSort.sortField}|${tableSort.sortOrder}`}
                      onChange={e => {
                        const [sortField, sortOrder] =
                          e.target.value.split('|');
                        sortTodaysOrdersSequence({
                          sortField,
                          sortOrder: sortOrder as 'asc' | 'desc',
                          stateKey: tableSort.sortKey,
                        });
                      }}
                    >
                      {todaysOrdersHelper.sortOptions.map(
                        ({ label, sortField, sortOrder }) => (
                          <option
                            key={label}
                            value={`${sortField}|${sortOrder}`}
                          >
                            Sort by {label}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  {totalPages > 1 && (
                    <div className="margin-bottom-4 tablet:grid-col">
                      <Paginator
                        currentPageIndex={currentPaginationPage}
                        totalPages={totalPages}
                        onPageChange={currentPage => {
                          setTodaysOrdersCurrentPaginationPageSequence({
                            currentPaginationPage: currentPage,
                          });
                          focusPaginatorTop(paginatorTop);
                        }}
                      />
                    </div>
                  )}

                  {todaysOrdersHelper.hasResults && (
                    <div className="margin-bottom-2 text-right">
                      {todaysOrdersHelper.totalCount} Order(s)
                    </div>
                  )}

                  <table
                    aria-label="todays orders"
                    className="usa-table gray-header responsive-table row-only todays-orders-mobile"
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
                      {results.map(order => (
                        <tr
                          key={`todays-orders-mobile-${order.docketNumber}-${order.docketEntryId}`}
                        >
                          <td className="docket-number-head">
                            <CaseLink formattedCase={order} />
                          </td>
                          <th>Time Filed</th>
                          <td className="divider">
                            {formatDateString(
                              order.filingDate,
                              FORMATS.TIME_TZ,
                            )}
                          </td>
                          <th>Case Title</th>
                          <td className="divider">{order.caseCaption}</td>
                          <th>Order</th>
                          <td className="divider">
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
                          <th>Pages</th>
                          <td className="divider">
                            {order.numberOfPagesFormatted}
                          </td>
                          <th>Judge</th>
                          <td>{order.formattedJudgeName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Mobile>
              </>
            )}

            {totalPages > 1 && todaysOrdersHelper.hasResults && (
              <Paginator
                currentPageIndex={currentPaginationPage}
                totalPages={totalPages}
                onPageChange={currentPage => {
                  setTodaysOrdersCurrentPaginationPageSequence({
                    currentPaginationPage: currentPage,
                  });
                  focusPaginatorTop(paginatorTop);
                }}
              />
            )}
          </div>
        </section>
      </>
    );
  },
);

const TodaysOrdersColumnHeader = ({
  columnData,
  orderListId,
  onSort,
  tableSort,
}: {
  orderListId: string;
  columnData: {
    columnName: string;
    sortFieldInfo: {
      sortField: string;
      sortType: string;
    };
  };
  tableSort: {
    sortField: string;
    sortOrder: 'asc' | 'desc';
    sortKey: string;
  };
  onSort: ({
    sortField,
    sortOrder,
    stateKey,
  }: {
    sortField: string;
    sortOrder: 'asc' | 'desc';
    stateKey: string;
  }) => void;
}) => {
  return (
    <th aria-label={columnData.columnName} className="min-width-150">
      <SortableColumn
        ascText={SORT_ASCENDING_TEXT[columnData.sortFieldInfo.sortType]}
        currentlySortedField={tableSort.sortField}
        currentlySortedOrder={tableSort.sortOrder}
        data-testid={`${orderListId}-${columnData.sortFieldInfo.sortField}-header-button`}
        defaultSortOrder={ASCENDING}
        descText={SORT_DESCENDING_TEXT[columnData.sortFieldInfo.sortType]}
        hasRows={true}
        sortField={columnData.sortFieldInfo.sortField}
        title={columnData.columnName}
        onClickSequence={({ sortField, sortOrder }) =>
          onSort({
            sortField,
            sortOrder,
            stateKey: tableSort.sortKey,
          })
        }
      />
    </th>
  );
};

const TodaysOrdersRow = ({
  order,
  openCaseDocumentDownloadUrlSequence,
}: {
  order: {
    docketNumber: string;
    docketEntryId: string;
    filingDate: string;
    caseCaption: string;
    documentTitle: string;
    numberOfPagesFormatted: string | number;
    formattedJudgeName: string;
  };
  openCaseDocumentDownloadUrlSequence: any;
}) => {
  return (
    <tr key={`todays-orders-${order.docketNumber}-${order.docketEntryId}`}>
      <td>{formatDateString(order.filingDate, FORMATS.TIME_TZ)}</td>
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
  );
};

TodaysOrders.displayName = 'TodaysOrders';

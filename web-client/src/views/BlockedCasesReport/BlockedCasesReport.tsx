import { BigHeader } from '../BigHeader';
import { BlockedFormattedCase } from '@web-client/presenter/computeds/blockedCasesReportHelper';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { ErrorNotification } from '../ErrorNotification';
import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import { SelectCriteria } from './SelectCriteria';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useRef, useState } from 'react';
import { ConsolidatedCaseIcon } from '@web-client/ustc-ui/Icon/ConsolidatedCaseIcon';
import classNames from 'classnames';
import { Paginator } from '@web-client/ustc-ui/Pagination/Paginator';
import { useClientSidePaginator } from '@web-client/utilities/useClientSidePaginator';
import { focusPaginatorTop } from '@web-client/presenter/utilities/focusPaginatorTop';

export const BlockedCasesReport = connect(
  {
    blockedCaseReportFilter: state.blockedCaseReportFilter,
    blockedCasesReportHelper: state.blockedCasesReportHelper,
  },
  function BlockedCasesReport({
    blockedCaseReportFilter,
    blockedCasesReportHelper,
  }) {
    const [isSubmitDebounced, setIsSubmitDebounced] = useState(false);
    const paginatorTop = useRef(null);

    const { activePage, pageRecords, setActivePage, totalPages } =
      useClientSidePaginator(
        blockedCasesReportHelper.blockedCasesFormatted,
        100,
      );

    const debounceSubmit = (timeout: number) => {
      setIsSubmitDebounced(true);
      setTimeout(() => {
        setIsSubmitDebounced(false);
      }, timeout);
    };

    return (
      <>
        <BigHeader text="Reports" />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <div className="title grid-row flex-justify">
            <h1>Blocked Cases</h1>
            <span>
              <Button
                link
                aria-label="export pending report"
                className="margin-top-2"
                data-testid="export-blocked-case-report"
                disabled={!blockedCasesReportHelper.blockedCasesCount}
                icon="file-export"
                onClick={() => {
                  if (isSubmitDebounced) return;
                  debounceSubmit(1000);
                  exportBlockedCasesReportCsv({
                    blockedCases:
                      blockedCasesReportHelper.blockedCasesFormatted,
                    trialLocation: blockedCaseReportFilter.trialLocationFilter,
                  });
                }}
              >
                Export
              </Button>
            </span>
          </div>
          <div className="grid-row grid-gap">
            <div className="grid-col-3">
              <SelectCriteria />
            </div>
            <div className="grid-col-9">
              {blockedCaseReportFilter.trialLocationFilter && (
                <>
                  <div>
                    <div>
                      <h2>{blockedCaseReportFilter.trialLocationFilter}</h2>
                    </div>
                    <div className="grid-row flex-align-center flex-wrap margin-bottom-3">
                      <div className="grid-col-2"></div>
                      <div ref={paginatorTop} className="grid-col">
                        {totalPages > 1 && (
                          <Paginator
                            currentPageIndex={activePage}
                            totalPages={totalPages}
                            onPageChange={pageChange => {
                              setActivePage(pageChange);
                              focusPaginatorTop(paginatorTop);
                            }}
                          />
                        )}
                      </div>
                      <div className="grid-col-2 text-right margin-top-3 padding-0">
                        <span className="text-semibold">Count: </span>
                        <span data-testid="blocked-cases-count">
                          {blockedCasesReportHelper.blockedCasesCount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {blockedCasesReportHelper.blockedCasesCount > 0 && (
                    <table
                      className="usa-table subsection ustc-table deadlines"
                      data-testid="blocked-cases-report-table"
                    >
                      <thead>
                        <tr>
                          <th
                            aria-hidden="true"
                            className="consolidated-case-column"
                          ></th>
                          <th aria-label="Docket Number" className="small">
                            <span className="padding-left-2px">Docket No.</span>
                          </th>
                          <th>Date Blocked</th>
                          <th>Case Title</th>
                          <th>Case Status</th>
                          <th>Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pageRecords.map(item => (
                          <tr
                            data-testid={`blocked-case-${item.docketNumber}-row`}
                            key={item.docketNumber}
                          >
                            <td className="consolidated-case-column">
                              <span
                                className={classNames({
                                  'margin-left-2':
                                    item.inConsolidatedGroup &&
                                    !item.isLeadCase,
                                })}
                              >
                                <ConsolidatedCaseIcon
                                  consolidatedIconTooltipText={
                                    item.consolidatedIconTooltipText
                                  }
                                  inConsolidatedGroup={item.inConsolidatedGroup}
                                  showLeadCaseIcon={item.isLeadCase}
                                />
                              </span>
                            </td>
                            <td>
                              <CaseLink formattedCase={item} />
                            </td>
                            <td>{item.blockedDateEarliest}</td>
                            <td>{item.caseTitle}</td>
                            <td>{item.status}</td>
                            <td>
                              {item.blockedReason}
                              {item.blockedReason &&
                                item.automaticBlockedReason && <br />}
                              {item.automaticBlockedReason}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  {blockedCasesReportHelper.blockedCasesFormatted.length ===
                    0 && (
                    <p>There are no blocked cases for this set of critieria.</p>
                  )}
                </>
              )}
              {!blockedCaseReportFilter.trialLocationFilter && (
                <p className="margin-0 text-semibold">
                  Select a trial location to view blocked cases
                </p>
              )}

              {totalPages > 1 && (
                <Paginator
                  currentPageIndex={activePage}
                  totalPages={totalPages}
                  onPageChange={pageChange => {
                    setActivePage(pageChange);
                    focusPaginatorTop(paginatorTop);
                  }}
                />
              )}
            </div>
          </div>
        </section>
      </>
    );
  },
);

function exportBlockedCasesReportCsv({
  blockedCases,
  trialLocation,
}: {
  blockedCases: Pick<
    BlockedFormattedCase,
    | 'docketNumber'
    | 'blockedDateEarliest'
    | 'caseTitle'
    | 'status'
    | 'blockedReason'
    | 'automaticBlockedReason'
  >[];
  trialLocation: string;
}): void {
  const [city, usState] = trialLocation.split(', ');
  const date = formatNow(FORMATS.MMDDYYYY_UNDERSCORED);
  const fileName = `Blocked Cases Report - ${city}_${usState} ${date}`;
  const csvConfig = mkConfig({
    columnHeaders: [
      {
        displayLabel: 'Docket No.',
        key: 'docketNumber',
      },
      {
        displayLabel: 'Date Blocked',
        key: 'blockedDateEarliest',
      },
      {
        displayLabel: 'Case Title',
        key: 'caseTitle',
      },
      {
        displayLabel: 'Case Status',
        key: 'status',
      },
      {
        displayLabel: 'Reason',
        key: 'allReasons',
      },
    ],
    filename: fileName,
    useKeysAsHeaders: false,
  });

  const formatString = (s: string | undefined) =>
    (s || '').split('\n').join(' ').trim();

  const formattedBlockedCases = blockedCases.map(c => ({
    ...c,
    allReasons: `${formatString(c.blockedReason)} ${formatString(c.automaticBlockedReason)}`,
  }));

  const csv = generateCsv(csvConfig)(formattedBlockedCases);

  download(csvConfig)(csv);
}

BlockedCasesReport.displayName = 'BlockedCasesReport';

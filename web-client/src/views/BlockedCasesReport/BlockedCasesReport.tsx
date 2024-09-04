import { BigHeader } from '../BigHeader';
import { BlockedFormattedCase } from '@web-client/presenter/computeds/blockedCasesReportHelper';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { ErrorNotification } from '../ErrorNotification';
import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { SelectCriteria } from './SelectCriteria';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { download, generateCsv, mkConfig } from 'export-to-csv';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useState } from 'react';

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
                  <div className="grid-row">
                    <div className="grid-col-6">
                      <h2>{blockedCaseReportFilter.trialLocationFilter}</h2>
                    </div>
                    <div className="grid-col-6 text-right margin-top-1">
                      <span className="text-semibold">
                        Count:{' '}
                        <span data-testid="blocked-cases-count">
                          {blockedCasesReportHelper.blockedCasesCount}
                        </span>
                      </span>
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
                        {blockedCasesReportHelper.blockedCasesFormatted.map(
                          item => (
                            <tr
                              data-testid={`blocked-case-${item.docketNumber}-row`}
                              key={item.docketNumber}
                            >
                              <td className="consolidated-case-column">
                                {item.inConsolidatedGroup && (
                                  <span
                                    className="fa-layers fa-fw"
                                    title={item.consolidatedIconTooltipText}
                                  >
                                    <Icon
                                      aria-label={
                                        item.consolidatedIconTooltipText
                                      }
                                      className="fa-icon-blue"
                                      icon="copy"
                                    />
                                    {item.isLeadCase && (
                                      <span className="fa-inverse lead-case-icon-text">
                                        L
                                      </span>
                                    )}
                                  </span>
                                )}
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
                          ),
                        )}
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

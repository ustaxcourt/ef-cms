import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app-public.cerebral';
import { state } from '@web-client/presenter/app-public.cerebral';
import React from 'react';
import { SortableColumn } from '@web-client/ustc-ui/Table/SortableColumn';
import {
  ASCENDING,
  SORT_ASCENDING_TEXT,
  SORT_DESCENDING_TEXT,
} from '@shared/business/entities/EntityConstants';
import { columnData } from './TodaysOpinionsConstants';

export const TodaysOpinions = connect(
  {
    openCaseDocumentDownloadUrlSequence:
      sequences.openCaseDocumentDownloadUrlSequence,
    sortTableSequence: sequences.sortTableSequence,
    tableSort: state.todaysOpinionsTableSort,
    todaysOpinionsHelper: state.todaysOpinionsHelper,
  },
  function TodaysOpinions({
    openCaseDocumentDownloadUrlSequence,
    sortTableSequence,
    tableSort,
    todaysOpinionsHelper,
  }: {
    openCaseDocumentDownloadUrlSequence: any;
    sortTableSequence: any;
    tableSort: {
      sortField: string;
      sortOrder: 'asc' | 'desc';
      sortKey: string;
    };
    todaysOpinionsHelper: {
      formattedCurrentDate: string;
      formattedOpinions: Array<{
        docketEntryId: string;
        docketNumber: string;
        caseCaption: string;
        documentType: string;
        numberOfPagesFormatted: string | number;
        formattedFilingDate: string;
        formattedJudgeName: string;
        descriptionDisplay?: string;
      }>;
      sortOptions: Array<{
        label: string;
        sortField: string;
        sortOrder: string;
      }>;
    };
  }) {
    return (
      <>
        <BigHeader text="Today’s Opinions" />

        <section className="usa-section grid-container todays-opinions">
          <h1>{todaysOpinionsHelper.formattedCurrentDate}</h1>

          <p>
            Any online sourced citations in these opinions can be viewed
            directly from the associated docket record.
          </p>

          {todaysOpinionsHelper.formattedOpinions.length === 0 && (
            <h3 className="maxw-tablet">
              Opinions are generally filed at 3:00 PM. If you are receiving this
              message after 3:00 PM, there are no opinions today.
            </h3>
          )}

          {todaysOpinionsHelper.formattedOpinions.length > 0 && (
            <>
              <NonMobile>
                <table
                  aria-label="todays opinions"
                  className="usa-table ustc-table"
                >
                  <thead>
                    <tr>
                      <th aria-hidden="true" />
                      {columnData.map((col, idx) => (
                        <TodaysOpinionsColumnHeader
                          columnData={col}
                          key={idx}
                          opinionListId={idx.toString()}
                          tableSort={tableSort}
                          onSort={sortTableSequence}
                        />
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {todaysOpinionsHelper.formattedOpinions.map(
                      (opinion, idx) => (
                        <tr key={`opinion-row-${opinion.docketEntryId}-${idx}`}>
                          <td className="center-column">{idx + 1}</td>
                          <td>
                            <CaseLink formattedCase={opinion} />
                          </td>
                          <td>{opinion.caseCaption}</td>
                          <td>
                            <Button
                              overrideReadOnly
                              link
                              aria-label={`View PDF: ${opinion.descriptionDisplay}`}
                              className="text-left line-height-standard padding-0"
                              onClick={() => {
                                openCaseDocumentDownloadUrlSequence({
                                  docketEntryId: opinion.docketEntryId,
                                  docketNumber: opinion.docketNumber,
                                  isPublic: true,
                                  useSameTab: true,
                                });
                              }}
                            >
                              {opinion.documentType}
                            </Button>
                          </td>
                          <td>{opinion.numberOfPagesFormatted}</td>
                          <td>{opinion.formattedFilingDate}</td>
                          <td>{opinion.formattedJudgeName}</td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </NonMobile>

              <Mobile>
                <div className="tablet:grid-col-2">
                  <select
                    aria-label="Today's Opinions Sort"
                    className="usa-select margin-top-0 margin-bottom-2 sort"
                    name="todaysOpinionsSort"
                    value={`${tableSort.sortField}|${tableSort.sortOrder}`}
                    onChange={e => {
                      const [sortField, sortOrder] = e.target.value.split('|');
                      sortTableSequence({
                        sortField,
                        sortOrder: sortOrder as 'asc' | 'desc',
                        stateKey: tableSort.sortKey,
                      });
                    }}
                  >
                    {todaysOpinionsHelper.sortOptions.map(
                      ({ label, sortField, sortOrder }) => (
                        <option key={label} value={`${sortField}|${sortOrder}`}>
                          Sort by {label}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                <table
                  aria-label="todays opinions"
                  className="usa-table gray-header responsive-table row-border-only todays-opinions-mobile"
                >
                  <thead>
                    <tr>
                      <th aria-hidden="true" />
                      <th aria-label="Docket Number">Docket No.</th>
                      <th>Case Title</th>
                      <th>Opinion Type</th>
                      <th>Pages</th>
                      <th>Date</th>
                      <th>Judge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todaysOpinionsHelper.formattedOpinions.map(
                      (opinion, idx) => (
                        <tr key={`opinion-row-${opinion.docketEntryId}-${idx}`}>
                          <td className="center-column">{idx + 1}</td>
                          <td>
                            <CaseLink formattedCase={opinion} />
                          </td>
                          <td>{opinion.caseCaption}</td>
                          <td>
                            <Button
                              overrideReadOnly
                              link
                              aria-label={`View PDF: ${opinion.descriptionDisplay}`}
                              className="text-left line-height-standard padding-0"
                              onClick={() => {
                                openCaseDocumentDownloadUrlSequence({
                                  docketEntryId: opinion.docketEntryId,
                                  docketNumber: opinion.docketNumber,
                                  isPublic: true,
                                  useSameTab: true,
                                });
                              }}
                            >
                              {opinion.documentType}
                            </Button>
                          </td>
                          <td>{opinion.numberOfPagesFormatted}</td>
                          <td>{opinion.formattedFilingDate}</td>
                          <td>{opinion.formattedJudgeName}</td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </Mobile>
            </>
          )}
        </section>
      </>
    );
  },
);

const TodaysOpinionsColumnHeader = ({
  columnData,
  opinionListId,
  onSort,
  tableSort,
}: {
  opinionListId: string;
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
        data-testid={`${opinionListId}-${columnData.sortFieldInfo.sortField}-header-button`}
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

TodaysOpinions.displayName = 'TodaysOpinions';

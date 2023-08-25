import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '../../ustc-ui/Icon/ConsolidatedCaseIcon';
import { DateRangePickerComponent } from '../../ustc-ui/DateInput/DateRangePickerComponent';
import { ErrorNotification } from '../ErrorNotification';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { Paginator } from '../../ustc-ui/Pagination/Paginator';
import { SelectSearch } from '../../ustc-ui/Select/SelectSearch';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { focusPaginatorTop } from '@web-client/ustc-ui/Pagination/paginatorHelper';
import { formatNumber } from '../../../../shared/src/business/utilities/formatNumber';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useRef, useState } from 'react';

export const CustomCaseReport = connect(
  {
    clearOptionalCustomCaseInventoryFilterSequence:
      sequences.clearOptionalCustomCaseInventoryFilterSequence,
    customCaseInventoryFilters: state.customCaseInventory.filters,
    customCaseInventoryReportHelper: state.customCaseInventoryReportHelper,
    getCustomCaseInventoryReportSequence:
      sequences.getCustomCaseInventoryReportSequence,
    setCustomCaseInventoryReportFiltersSequence:
      sequences.setCustomCaseInventoryReportFiltersSequence,
    totalCases: state.customCaseInventory.totalCases,
    validationErrors: state.validationErrors,
  },
  function CustomCaseReport({
    clearOptionalCustomCaseInventoryFilterSequence,
    customCaseInventoryFilters,
    customCaseInventoryReportHelper,
    getCustomCaseInventoryReportSequence,
    setCustomCaseInventoryReportFiltersSequence,
    totalCases,
    validationErrors,
  }) {
    const [hasRunCustomCaseReport, setHasRunCustomCaseReport] = useState(false);
    const [activePage, setActivePage] = useState(0);
    const paginatorTop = useRef(null);

    return (
      <>
        <BigHeader text="Reports" />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <div className="title">
            <h1>Custom Case Report</h1>
          </div>
          <div className="grid-col-12 blue-container margin-bottom-4">
            <div className="grid-col-auto margin-x-3">
              <DateRangePickerComponent
                endDateErrorText={validationErrors.endDate}
                endLabel="Case created end date"
                endName="caseCreationEndDate"
                endPickerCls={'grid-col-6 padding-left-2'}
                endValue=""
                formGroupCls={'margin-bottom-0'}
                maxDate={customCaseInventoryReportHelper.today}
                rangePickerCls={'grid-row '}
                startDateErrorText={validationErrors.startDate}
                startLabel="Case created start date"
                startName="caseCreationStartDate"
                startPickerCls={'grid-col-6 padding-right-2'}
                startValue=""
                onChangeEnd={e => {
                  setCustomCaseInventoryReportFiltersSequence({
                    endDate: e.target.value,
                  });
                }}
                onChangeStart={e => {
                  setCustomCaseInventoryReportFiltersSequence({
                    startDate: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className="grid-row desktop:grid-col-8 tablet:grid-col-12">
            <div className="desktop:grid-col desktop:margin-right-4 tablet:grid-col-6">
              <div className="usa-radio usa-radio__inline">
                <legend>Petition filing method</legend>
                <input
                  aria-describedby="petition-filing-method-radios"
                  checked={customCaseInventoryFilters.filingMethod === 'all'}
                  className="usa-radio__input"
                  id="petitionFilingMethod-all"
                  name="filingMethod"
                  type="radio"
                  onChange={() => {
                    setCustomCaseInventoryReportFiltersSequence({
                      filingMethod: 'all',
                    });
                  }}
                />
                <label
                  className="usa-radio__label"
                  htmlFor="petitionFilingMethod-all"
                >
                  All
                </label>
              </div>
              <div className="usa-radio usa-radio__inline">
                <input
                  aria-describedby="petition-filing-method-radios"
                  checked={
                    customCaseInventoryFilters.filingMethod === 'electronic'
                  }
                  className="usa-radio__input"
                  id="petitionFilingMethod-electronic"
                  name="filingMethod"
                  type="radio"
                  onChange={() => {
                    setCustomCaseInventoryReportFiltersSequence({
                      filingMethod: 'electronic',
                    });
                  }}
                />
                <label
                  className="usa-radio__label"
                  htmlFor="petitionFilingMethod-electronic"
                >
                  Electronic
                </label>
              </div>
              <div className="usa-radio usa-radio__inline">
                <input
                  aria-describedby="case-procedure-type-radios"
                  checked={customCaseInventoryFilters.filingMethod === 'paper'}
                  className="usa-radio__input"
                  id="petitionFilingMethod-paper"
                  name="filingMethod"
                  type="radio"
                  onChange={() => {
                    setCustomCaseInventoryReportFiltersSequence({
                      filingMethod: 'paper',
                    });
                  }}
                />
                <label
                  className="usa-radio__label"
                  htmlFor="petitionFilingMethod-paper"
                >
                  Paper
                </label>
              </div>
            </div>
            <div className="grid-col">
              <div className="usa-radio usa-radio__inline">
                <legend>Case procedure</legend>
                <input
                  aria-describedby="case-procedure-type-radios"
                  checked={customCaseInventoryFilters.procedureType === 'All'}
                  className="usa-radio__input"
                  id="caseProcedureType-all"
                  name="procedureType"
                  type="radio"
                  onChange={() => {
                    setCustomCaseInventoryReportFiltersSequence({
                      procedureType: 'All',
                    });
                  }}
                />
                <label
                  className="usa-radio__label"
                  htmlFor="caseProcedureType-all"
                >
                  All
                </label>
              </div>
              <div className="usa-radio usa-radio__inline">
                <input
                  aria-describedby="case-procedure-type-radios"
                  checked={
                    customCaseInventoryFilters.procedureType === 'Regular'
                  }
                  className="usa-radio__input"
                  id="caseProcedureType-regular"
                  name="procedureType"
                  type="radio"
                  onChange={() => {
                    setCustomCaseInventoryReportFiltersSequence({
                      procedureType: 'Regular',
                    });
                  }}
                />
                <label
                  className="usa-radio__label"
                  htmlFor="caseProcedureType-regular"
                >
                  Regular
                </label>
              </div>
              <div className="usa-radio usa-radio__inline">
                <input
                  aria-describedby="case-procedure-type-radios"
                  checked={customCaseInventoryFilters.procedureType === 'Small'}
                  className="usa-radio__input"
                  id="caseProcedureType-small"
                  name="procedureType"
                  type="radio"
                  onChange={() => {
                    setCustomCaseInventoryReportFiltersSequence({
                      procedureType: 'Small',
                    });
                  }}
                />
                <label
                  className="usa-radio__label"
                  htmlFor="caseProcedureType-small"
                >
                  Small
                </label>
              </div>
            </div>
          </div>
          <div className="desktop:grid-col-8 tablet:grid-col-12">
            <div className="grid-row margin-top-4 margin-bottom-2">
              <div className="grid-col margin-right-4">
                <label
                  className="usa-label"
                  htmlFor="case-status"
                  id="case-status-label"
                >
                  Case status{' '}
                  <span className="optional-light-text">(optional)</span>
                </label>
                <SelectSearch
                  aria-labelledby="case-status-label"
                  id="case-status"
                  name="caseStatus"
                  options={customCaseInventoryReportHelper.caseStatuses}
                  placeholder="- Select one or more -"
                  value={'Select one or more'}
                  onChange={inputValue => {
                    if (inputValue) {
                      setCustomCaseInventoryReportFiltersSequence({
                        caseStatuses: {
                          action: 'add',
                          caseStatus: inputValue.value,
                        },
                      });
                    }
                  }}
                />
              </div>
              <div className="grid-col">
                <label
                  className="usa-label"
                  htmlFor="case-type"
                  id="case-type-label"
                >
                  Case types{' '}
                  <span className="optional-light-text">(optional)</span>
                </label>
                <SelectSearch
                  aria-labelledby="case-type-label"
                  id="case-type"
                  name="eventCode"
                  options={customCaseInventoryReportHelper.caseTypes}
                  placeholder="- Select one or more -"
                  value="Select one or more"
                  onChange={inputValue => {
                    if (inputValue) {
                      setCustomCaseInventoryReportFiltersSequence({
                        caseTypes: {
                          action: 'add',
                          caseType: inputValue.value,
                        },
                      });
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div className="desktop:grid-col-8 tablet:grid-col-12">
            <div className="grid-row margin-top-4 margin-bottom-2">
              <div className="grid-col margin-right-4">
                <label className="usa-label" htmlFor="judges" id="judges-label">
                  Assigned judge{' '}
                  <span className="optional-light-text">(optional)</span>
                </label>
                <SelectSearch
                  aria-labelledby="judges-label"
                  id="judges"
                  name="judges"
                  options={customCaseInventoryReportHelper.judges}
                  placeholder="- Select one or more -"
                  value={'Select one or more'}
                  onChange={inputValue => {
                    if (inputValue) {
                      setCustomCaseInventoryReportFiltersSequence({
                        judges: {
                          action: 'add',
                          judge: inputValue.value,
                        },
                      });
                    }
                  }}
                />
              </div>
              <div className="grid-col">
                <label
                  className="usa-label"
                  htmlFor="trial-location"
                  id="requested-place-of-trial-label"
                >
                  Requested place of trial{' '}
                  <span className="optional-light-text">(optional)</span>
                </label>
                <SelectSearch
                  aria-labelledby="requested-place-of-trial-label"
                  id="trial-location"
                  name="requestedPlaceOfTrial"
                  options={customCaseInventoryReportHelper.trialCitiesByState}
                  placeholder="- Select one or more -"
                  searchableOptions={
                    customCaseInventoryReportHelper.searchableTrialCities
                  }
                  value="Select one or more"
                  onChange={inputValue => {
                    if (inputValue) {
                      setCustomCaseInventoryReportFiltersSequence({
                        preferredTrialCities: {
                          action: 'add',
                          preferredTrialCity: inputValue.value,
                        },
                      });
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div className="grid-col-12">
            <div className="grid-row">
              {customCaseInventoryFilters.caseStatuses.map(status => (
                <span className="blue-pill" key={status}>
                  {status}
                  <Icon
                    aria-label={`remove ${status} selection`}
                    className="margin-left-1 cursor-pointer"
                    icon="times"
                    size="1x"
                    onClick={() => {
                      setCustomCaseInventoryReportFiltersSequence({
                        caseStatuses: {
                          action: 'remove',
                          caseStatus: status,
                        },
                      });
                    }}
                  />
                </span>
              ))}

              {customCaseInventoryFilters.caseTypes.map(caseType => {
                return (
                  <span className="blue-pill" key={caseType}>
                    {caseType}
                    <Icon
                      aria-label={`remove ${caseType} selection`}
                      className="margin-left-1 cursor-pointer"
                      icon="times"
                      size="1x"
                      onClick={() => {
                        setCustomCaseInventoryReportFiltersSequence({
                          caseTypes: {
                            action: 'remove',
                            caseType,
                          },
                        });
                      }}
                    />
                  </span>
                );
              })}

              {customCaseInventoryFilters.judges.map(judge => {
                return (
                  <span className="blue-pill" key={judge}>
                    {judge}
                    <Icon
                      aria-label={`remove ${judge} selection`}
                      className="margin-left-1 cursor-pointer"
                      icon="times"
                      size="1x"
                      onClick={() => {
                        setCustomCaseInventoryReportFiltersSequence({
                          judges: {
                            action: 'remove',
                            judge,
                          },
                        });
                      }}
                    />
                  </span>
                );
              })}
              {customCaseInventoryFilters.preferredTrialCities.map(city => {
                return (
                  <span className="blue-pill" key={city}>
                    {city}
                    <Icon
                      aria-label={`remove ${city} selection`}
                      className="margin-left-1 cursor-pointer"
                      icon="times"
                      size="1x"
                      onClick={() => {
                        setCustomCaseInventoryReportFiltersSequence({
                          preferredTrialCities: {
                            action: 'remove',
                            city,
                          },
                        });
                      }}
                    />
                  </span>
                );
              })}
            </div>
          </div>
          <div className="usa-checkbox">
            <input
              aria-label="Select calendaring high priority"
              checked={customCaseInventoryFilters.highPriority}
              className="usa-checkbox__input"
              id="high-priority-checkbox"
              type="checkbox"
              onChange={() => {
                setCustomCaseInventoryReportFiltersSequence({
                  highPriority: 'highPriority',
                });
              }}
            />
            <label
              className="usa-checkbox__label desktop:grid-col-2 tablet:grid-col-6 padding-bottom-1"
              htmlFor="high-priority-checkbox"
              id={'label-high-priority'}
            >
              Calendaring high priority
            </label>
          </div>
          <Button
            disabled={customCaseInventoryReportHelper.runReportButtonIsDisabled}
            id="run-custom-case-report"
            tooltip="Run Report"
            onClick={() => {
              setHasRunCustomCaseReport(true);
              getCustomCaseInventoryReportSequence({ selectedPage: 0 });
              setActivePage(0);
            }}
          >
            Run Report
          </Button>
          <Button
            link
            disabled={customCaseInventoryReportHelper.clearFiltersIsDisabled}
            tooltip="Clear Filters"
            onClick={() => clearOptionalCustomCaseInventoryFilterSequence()}
          >
            Clear Filters
          </Button>
          <hr className="margin-top-3 margin-bottom-3 border-top-1px border-base-lighter" />
          <div ref={paginatorTop}>
            {customCaseInventoryReportHelper.pageCount > 1 && (
              <Paginator
                breakClassName="hide"
                forcePage={activePage}
                marginPagesDisplayed={0}
                pageCount={customCaseInventoryReportHelper.pageCount}
                pageRangeDisplayed={0}
                onPageChange={async pageChange => {
                  setActivePage(pageChange.selected);
                  await getCustomCaseInventoryReportSequence({
                    selectedPage: pageChange.selected,
                  });
                  focusPaginatorTop(paginatorTop);
                }}
              />
            )}
          </div>
          <div className="text-right margin-bottom-2">
            <span className="text-bold" id="custom-case-result-count">
              Count: &nbsp;
            </span>
            {formatNumber(totalCases)}
          </div>
          <ReportTable
            cases={customCaseInventoryReportHelper.cases}
            hasRunCustomCaseReport={hasRunCustomCaseReport}
            totalCases={totalCases}
          />
          {customCaseInventoryReportHelper.pageCount > 1 && (
            <Paginator
              breakClassName="hide"
              forcePage={activePage}
              marginPagesDisplayed={0}
              pageCount={customCaseInventoryReportHelper.pageCount}
              pageRangeDisplayed={0}
              onPageChange={async pageChange => {
                setActivePage(pageChange.selected);
                await getCustomCaseInventoryReportSequence({
                  selectedPage: pageChange.selected,
                });
                focusPaginatorTop(paginatorTop);
              }}
            />
          )}
        </section>
      </>
    );
  },
);

const ReportTable = ({
  cases,
  hasRunCustomCaseReport,
  totalCases,
}: {
  cases: any[];
  hasRunCustomCaseReport: boolean;
  totalCases: number;
}) => {
  return (
    <>
      <table
        aria-label="custom case inventory record"
        className="usa-table case-detail ustc-table responsive-table"
        id="custom-case-report-table"
      >
        <thead>
          <tr>
            <th></th>
            <th>Docket No.</th>
            <th>Date Created</th>
            <th>Case Title</th>
            <th>Case Status</th>
            <th>Case Type</th>
            <th>Judge</th>
            <th>
              Requested Place <br /> of Trial
            </th>
            <th>
              Calendaring <br />
              High Priority
            </th>
          </tr>
        </thead>
        {cases.length !== 0 && (
          <tbody id="custom-case-report-table-body">
            {cases.map(entry => (
              <tr key={`${entry.docketNumber}-${entry.caseCreationEndDate}`}>
                <td>
                  <ConsolidatedCaseIcon
                    consolidatedIconTooltipText={
                      entry.consolidatedIconTooltipText
                    }
                    inConsolidatedGroup={entry.inConsolidatedGroup}
                    showLeadCaseIcon={entry.inLeadCase}
                  />
                </td>
                <td>
                  <CaseLink
                    formattedCase={entry}
                    rel="noopener noreferrer"
                    target="_blank"
                  />
                </td>
                <td>{entry.receivedAt}</td>
                <td>{entry.caseCaption}</td>
                <td>{entry.status}</td>
                <td>{entry.caseType}</td>
                <td>{entry.associatedJudge}</td>
                <td>{entry.preferredTrialCity}</td>
                <td>
                  {entry.highPriority && (
                    <Icon
                      aria-label={'High priority calendaring'}
                      className="margin-left-5 mini-success margin-top-1"
                      icon="check"
                      size="1x"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      {hasRunCustomCaseReport && totalCases === 0 && (
        <p>There are no cases for the selected criteria.</p>
      )}
    </>
  );
};

CustomCaseReport.displayName = 'CustomCaseReport';

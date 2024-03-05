import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseInventory } from '@web-api/business/useCases/caseInventoryReport/getCustomCaseReportInteractor';
import { CaseLink } from '../../ustc-ui/CaseLink/CaseLink';
import { ConsolidatedCaseIcon } from '../../ustc-ui/Icon/ConsolidatedCaseIcon';
import { DateRangePickerComponent } from '../../ustc-ui/DateInput/DateRangePickerComponent';
import { ErrorNotification } from '../ErrorNotification';
import { Icon } from '../../ustc-ui/Icon/Icon';
import { Paginator } from '../../ustc-ui/Pagination/Paginator';
import { SelectSearch } from '../../ustc-ui/Select/SelectSearch';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { focusPaginatorTop } from '@web-client/presenter/utilities/focusPaginatorTop';
import { formatPositiveNumber } from '@shared/business/utilities/formatPositiveNumber';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useRef, useState } from 'react';

export const CustomCaseReport = connect(
  {
    clearOptionalCustomCaseReportFilterSequence:
      sequences.clearOptionalCustomCaseReportFilterSequence,
    customCaseReportFilters: state.customCaseReport.filters,
    customCaseReportHelper: state.customCaseReportHelper,
    exportCsvCustomCaseReportSequence:
      sequences.exportCsvCustomCaseReportSequence,
    getCustomCaseReportSequence: sequences.getCustomCaseReportSequence,
    setCustomCaseReportFiltersSequence:
      sequences.setCustomCaseReportFiltersSequence,
    totalCases: state.customCaseReport.totalCases,
    validationErrors: state.validationErrors,
  },
  function CustomCaseReport({
    clearOptionalCustomCaseReportFilterSequence,
    customCaseReportFilters,
    customCaseReportHelper,
    exportCsvCustomCaseReportSequence,
    getCustomCaseReportSequence,
    setCustomCaseReportFiltersSequence,
    totalCases,
    validationErrors,
  }) {
    const [hasRunCustomCaseReport, setHasRunCustomCaseReport] = useState(false);
    const [activePage, setActivePage] = useState(0);
    const paginatorTop = useRef(null);

    const [isSubmitDebounced, setIsSubmitDebounced] = useState(false);

    const debounceSubmit = timeout => {
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
          <div className="title">
            <h1>Custom Case Report</h1>
          </div>
          <div className="grid-row desktop:grid-col-8 tablet:grid-col-12">
            <div className="desktop:grid-col desktop:margin-right-4 tablet:grid-col-6">
              <div className="usa-radio usa-radio__inline">
                <legend>Petition filing method</legend>
                <input
                  aria-describedby="petition-filing-method-radios"
                  checked={customCaseReportFilters.filingMethod === 'all'}
                  className="usa-radio__input"
                  id="petitionFilingMethod-all"
                  name="filingMethod"
                  type="radio"
                  onChange={() => {
                    setCustomCaseReportFiltersSequence({
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
                    customCaseReportFilters.filingMethod === 'electronic'
                  }
                  className="usa-radio__input"
                  id="petitionFilingMethod-electronic"
                  name="filingMethod"
                  type="radio"
                  onChange={() => {
                    setCustomCaseReportFiltersSequence({
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
                  checked={customCaseReportFilters.filingMethod === 'paper'}
                  className="usa-radio__input"
                  id="petitionFilingMethod-paper"
                  name="filingMethod"
                  type="radio"
                  onChange={() => {
                    setCustomCaseReportFiltersSequence({
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
                  checked={customCaseReportFilters.procedureType === 'All'}
                  className="usa-radio__input"
                  id="caseProcedureType-all"
                  name="procedureType"
                  type="radio"
                  onChange={() => {
                    setCustomCaseReportFiltersSequence({
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
                  checked={customCaseReportFilters.procedureType === 'Regular'}
                  className="usa-radio__input"
                  id="caseProcedureType-regular"
                  name="procedureType"
                  type="radio"
                  onChange={() => {
                    setCustomCaseReportFiltersSequence({
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
                  checked={customCaseReportFilters.procedureType === 'Small'}
                  className="usa-radio__input"
                  id="caseProcedureType-small"
                  name="procedureType"
                  type="radio"
                  onChange={() => {
                    setCustomCaseReportFiltersSequence({
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
          <div className="grid-col-auto">
            <DateRangePickerComponent
              endDateErrorText={validationErrors.endDate}
              endLabel={
                <span>
                  Case created end date{' '}
                  <span className="optional-light-text">(optional)</span>
                </span>
              }
              endName="caseCreationEndDate"
              endPickerCls={'grid-col-6 padding-left-2 margin-top-4'}
              endValue=""
              formGroupCls="margin-bottom-0"
              maxDate={customCaseReportHelper.today}
              rangePickerCls={'grid-row '}
              startDateErrorText={validationErrors.startDate}
              startLabel={
                <span>
                  Case created start date{' '}
                  <span className="optional-light-text">(optional)</span>
                </span>
              }
              startName="caseCreationStartDate"
              startPickerCls={'grid-col-6 padding-right-2 margin-top-4'}
              startValue=""
              onChangeEnd={e => {
                setCustomCaseReportFiltersSequence({
                  endDate: e.target.value,
                });
              }}
              onChangeStart={e => {
                setCustomCaseReportFiltersSequence({
                  startDate: e.target.value,
                });
              }}
            />
          </div>
          <div className="desktop:grid-col-8 tablet:grid-col-12 margin-top-1 margin-bottom-2">
            <div className="grid-row">
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
                  options={customCaseReportHelper.caseStatuses}
                  placeholder="- Select one or more -"
                  value={'Select one or more'}
                  onChange={inputValue => {
                    if (inputValue) {
                      setCustomCaseReportFiltersSequence({
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
                  options={customCaseReportHelper.caseTypes}
                  placeholder="- Select one or more -"
                  value="Select one or more"
                  onChange={inputValue => {
                    if (inputValue) {
                      setCustomCaseReportFiltersSequence({
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

          <div className="desktop:grid-col-8 tablet:grid-col-12 margin-top-4 margin-bottom-2">
            <div className="grid-row">
              <div className="grid-col margin-right-4">
                <label className="usa-label" htmlFor="judges" id="judges-label">
                  Assigned judge{' '}
                  <span className="optional-light-text">(optional)</span>
                </label>
                <SelectSearch
                  aria-labelledby="judges-label"
                  id="judges"
                  name="judges"
                  options={customCaseReportHelper.judges}
                  placeholder="- Select one or more -"
                  value={'Select one or more'}
                  onChange={inputValue => {
                    if (inputValue) {
                      setCustomCaseReportFiltersSequence({
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
                  options={customCaseReportHelper.trialCitiesByState}
                  placeholder="- Select one or more -"
                  searchableOptions={
                    customCaseReportHelper.searchableTrialCities
                  }
                  value="Select one or more"
                  onChange={inputValue => {
                    if (inputValue) {
                      setCustomCaseReportFiltersSequence({
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
              {customCaseReportFilters.caseStatuses.map(status => (
                <span className="blue-pill" key={status}>
                  {status}
                  <Icon
                    aria-label={`remove ${status} selection`}
                    className="margin-left-1 cursor-pointer"
                    icon="times"
                    size="1x"
                    onClick={() => {
                      setCustomCaseReportFiltersSequence({
                        caseStatuses: {
                          action: 'remove',
                          caseStatus: status,
                        },
                      });
                    }}
                  />
                </span>
              ))}

              {customCaseReportFilters.caseTypes.map(caseType => {
                return (
                  <span className="blue-pill" key={caseType}>
                    {caseType}
                    <Icon
                      aria-label={`remove ${caseType} selection`}
                      className="margin-left-1 cursor-pointer"
                      icon="times"
                      size="1x"
                      onClick={() => {
                        setCustomCaseReportFiltersSequence({
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

              {customCaseReportFilters.judges.map(judge => {
                return (
                  <span className="blue-pill" key={judge}>
                    {judge}
                    <Icon
                      aria-label={`remove ${judge} selection`}
                      className="margin-left-1 cursor-pointer"
                      icon="times"
                      size="1x"
                      onClick={() => {
                        setCustomCaseReportFiltersSequence({
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
              {customCaseReportFilters.preferredTrialCities.map(city => {
                return (
                  <span className="blue-pill" key={city}>
                    {city}
                    <Icon
                      aria-label={`remove ${city} selection`}
                      className="margin-left-1 cursor-pointer"
                      icon="times"
                      size="1x"
                      onClick={() => {
                        setCustomCaseReportFiltersSequence({
                          preferredTrialCities: {
                            action: 'remove',
                            preferredTrialCity: city,
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
              checked={customCaseReportFilters.highPriority}
              className="usa-checkbox__input"
              id="high-priority-checkbox"
              type="checkbox"
              onChange={() => {
                setCustomCaseReportFiltersSequence({
                  highPriority: true,
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
            id="run-custom-case-report"
            tooltip="Run Report"
            onClick={() => {
              setHasRunCustomCaseReport(true);
              getCustomCaseReportSequence({ selectedPage: 0 });
              setActivePage(0);
            }}
          >
            Run Report
          </Button>
          <Button
            link
            disabled={customCaseReportHelper.clearFiltersIsDisabled}
            tooltip="Clear Filters"
            onClick={() => clearOptionalCustomCaseReportFilterSequence()}
          >
            Clear Filters
          </Button>
          <hr className="margin-top-3 margin-bottom-3 border-top-1px border-base-lighter" />
          <div ref={paginatorTop}>
            {customCaseReportHelper.pageCount > 1 && (
              <Paginator
                breakClassName="hide"
                forcePage={activePage}
                marginPagesDisplayed={0}
                pageCount={customCaseReportHelper.pageCount}
                pageRangeDisplayed={0}
                onPageChange={async pageChange => {
                  setActivePage(pageChange.selected);
                  await getCustomCaseReportSequence({
                    selectedPage: pageChange.selected,
                  });
                  focusPaginatorTop(paginatorTop);
                }}
              />
            )}
          </div>
          <div className="text-right margin-bottom-2">
            <Button
              link
              aria-label="export pending report"
              className="margin-top-2"
              data-testid="export-pending-report"
              disabled={
                isSubmitDebounced || +formatPositiveNumber(totalCases) === 0
              }
              icon="file-export"
              onClick={() => {
                debounceSubmit(200);
                exportCsvCustomCaseReportSequence();
              }}
            >
              Export
            </Button>
            <span className="text-bold" id="custom-case-result-count">
              Count: &nbsp;
            </span>
            {formatPositiveNumber(totalCases)}
          </div>
          <ReportTable
            cases={customCaseReportHelper.cases}
            hasRunCustomCaseReport={hasRunCustomCaseReport}
            totalCases={totalCases}
          />
          {customCaseReportHelper.pageCount > 1 && (
            <Paginator
              breakClassName="hide"
              forcePage={activePage}
              marginPagesDisplayed={0}
              pageCount={customCaseReportHelper.pageCount}
              pageRangeDisplayed={0}
              onPageChange={async pageChange => {
                setActivePage(pageChange.selected);
                await getCustomCaseReportSequence({
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
  cases: (CaseInventory & {
    inConsolidatedGroup: boolean;
    consolidatedIconTooltipText: string;
    shouldIndent: boolean;
    isLeadCase: boolean;
  })[];
  hasRunCustomCaseReport: boolean;
  totalCases: number;
}) => {
  return (
    <>
      <table
        aria-label="custom case record"
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
              <tr key={`${entry.docketNumber}-${entry.receivedAt}`}>
                <td>
                  <ConsolidatedCaseIcon
                    consolidatedIconTooltipText={
                      entry.consolidatedIconTooltipText
                    }
                    inConsolidatedGroup={entry.inConsolidatedGroup}
                    showLeadCaseIcon={entry.isLeadCase}
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

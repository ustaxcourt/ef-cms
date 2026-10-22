import { BigHeader } from '../BigHeader';
import { ClerkOfCourtChartStatus } from './ClerkOfCourtChartStatus';
import { ClerkOfCourtHtmlView } from './ClerkOfCourtHtmlView';
import { ClerkOfCourtTrialSessionsSummary } from '../TrialSessions/ClerkOfCourtTrialSessionsSummary';
import {
  ClerkOfCourtDashboardStatsStatus,
  DashboardClerkOfTheCourtHelper,
} from '@web-client/presenter/clerkOfCourtDashboardState';
import { ErrorNotification } from '../ErrorNotification';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { MultiBarGraph } from '@web-client/views/Public/DawsonLibrary/BarGraph';
import { PieGraph } from '@web-client/views/Public/DawsonLibrary/PieGraph';
import { RecentMessagesCotC } from '../WorkQueue/RecentMessagesCotC';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '@web-client/ustc-ui/Tabs/Tabs';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

const CHART_WIDTH = 1300;

type ClerkOfCourtDashboardYearOption =
  'casesByYearIsFiscal' | 'petitionsByYearIsFiscal';

const calendarAndFiscalYearSelectors = ({
  idPrefix = '',
  isFiscal,
  isMobile = false,
  optionKey,
  setClerkOfCourtDashboardOptionsSequence,
}: {
  idPrefix?: string;
  isFiscal: boolean;
  isMobile?: boolean;
  optionKey: ClerkOfCourtDashboardYearOption;
  setClerkOfCourtDashboardOptionsSequence: Function;
}) => {
  return (
    <div
      className={classNames(
        `${isMobile ? 'tw:justify-center' : 'tw:justify-end'}`,
        `${isMobile ? 'tw:mb-2' : 'tw:mb-4'}`,
        'tw:flex',
      )}
    >
      <div>
        <input
          checked={!isFiscal}
          type="radio"
          className="usa-radio__input"
          id={`${idPrefix}calendar-year-to-date`}
          name={`${idPrefix}is-fiscal`}
          value="false"
          onChange={() =>
            setClerkOfCourtDashboardOptionsSequence({
              key: optionKey,
              value: false,
            })
          }
        ></input>
        <label
          className="usa-radio__label tw:mt-0 tw:xs:text-lg/6 tw:text-base"
          htmlFor={`${idPrefix}calendar-year-to-date`}
          id={`${idPrefix}calendar-year-to-date-label`}
          data-testid={`${idPrefix}calendar-year-to-date`}
        >
          YTD
        </label>
      </div>
      <div className={`${isMobile ? 'tw:pl-8' : 'tw:pl-10'}`}>
        <input
          checked={isFiscal}
          type="radio"
          className="usa-radio__input"
          id={`${idPrefix}fiscal-year-to-date`}
          name={`${idPrefix}is-fiscal`}
          value="true"
          onChange={() =>
            setClerkOfCourtDashboardOptionsSequence({
              key: optionKey,
              value: true,
            })
          }
        ></input>
        <label
          className="usa-radio__label tw:mt-0 tw:xs:text-lg/6 tw:text-base"
          htmlFor={`${idPrefix}fiscal-year-to-date`}
          id={`${idPrefix}fiscal-year-to-date-label`}
          data-testid={`${idPrefix}fiscal-year-to-date`}
        >
          FYTD
        </label>
      </div>
    </div>
  );
};

const CASES_CLOSED_AND_ON_APPEAL_TITLE =
  'Closed/Closed - Dismissed & Changed to On Appeal';

const ALL_OPEN_CASES_TITLE = 'All Open Cases';

const ALL_OPEN_CASES_BY_TYPE_TITLE = 'All Open Cases by type';

const ALL_OPEN_CASES_BY_TYPE_HTML_TITLE = 'All Open Cases by Type';

const PETITIONS_BY_MONTH_TITLE = 'Petitions: Total Petitions by Month';

// pie chart columns, wide enough for the legend and the HTML view button
const PIE_COLUMN_CLASS = 'tw:w-162 tw:max-w-full';

const casesData = ({
  casesByYearIsFiscal,
  dashboardClerkOfTheCourtHelper,
  isMobile = false,
  setClerkOfCourtDashboardOptionsSequence,
  statsStatus,
}: {
  casesByYearIsFiscal: boolean;
  dashboardClerkOfTheCourtHelper: DashboardClerkOfTheCourtHelper;
  isMobile?: boolean;
  setClerkOfCourtDashboardOptionsSequence: Function;
  statsStatus: ClerkOfCourtDashboardStatsStatus;
}) => {
  const {
    casesClosedAndOnAppealByMonthChartData,
    casesClosedAndOnAppealLegendTotals,
    casesClosedPieData,
    casesMonths,
    openCasesByTypeTableRows,
    openCasesPieData,
    totalCasesClosed,
    totalOpenCases,
    casesYearLabel,
  } = dashboardClerkOfTheCourtHelper;

  return (
    <ClerkOfCourtChartStatus status={statsStatus}>
      <div
        className={isMobile ? undefined : 'tw:mt-4'}
        data-testid="cases-data-div"
      >
        {/* the year toggle applies to the closed and On Appeal data; All Open Cases counts every open case */}
        {calendarAndFiscalYearSelectors({
          idPrefix: 'cases-',
          isFiscal: casesByYearIsFiscal,
          isMobile,
          optionKey: 'casesByYearIsFiscal',
          setClerkOfCourtDashboardOptionsSequence,
        })}
        {/* heading margins account for the PieGraph's built-in top padding so the heading-to-legend gap is 2rem */}
        <div className="tw:flex tw:flex-wrap tw:gap-x-12 tw:xs:gap-y-12 tw:gap-y-8">
          <div className={PIE_COLUMN_CLASS}>
            <h2
              className="tw:xs:text-2xl tw:text-lg tw:xs:mb-4.75 tw:mb-2"
              data-testid="open-cases-header"
            >
              {ALL_OPEN_CASES_TITLE}:{' '}
              <span className="tw:font-normal">{totalOpenCases}</span>
            </h2>
            <PieGraph
              data={openCasesPieData}
              title={ALL_OPEN_CASES_TITLE}
              showTitle={false}
              tooltipTitle={ALL_OPEN_CASES_TITLE}
            />
          </div>
          <div className={PIE_COLUMN_CLASS}>
            <h2
              className="tw:xs:text-2xl tw:text-lg tw:xs:mb-4.75 tw:mb-2"
              data-testid="cases-closed-header"
            >
              Cases changed to Closed/Closed - Dismissed:{' '}
              <span className="tw:font-normal">{totalCasesClosed}</span>
            </h2>
            <PieGraph
              data={casesClosedPieData}
              title={`Cases Changed to Closed/Closed - Dismissed in ${casesYearLabel}`}
              showTitle={false}
              tooltipTitle="Cases Changed"
            />
          </div>
        </div>
        {/* open cases by type has no chart, only an HTML view of all open cases */}
        <div className="tw:xs:mt-12 tw:mt-8">
          <ClerkOfCourtHtmlView
            htmlTitle={ALL_OPEN_CASES_BY_TYPE_HTML_TITLE}
            labelHeader="Type of Case"
            rows={openCasesByTypeTableRows}
            title={ALL_OPEN_CASES_BY_TYPE_TITLE}
          />
        </div>
        <div className="tw:xs:mt-12 tw:mt-8">
          <MultiBarGraph
            showLabels={false}
            width={CHART_WIDTH}
            datasets={casesClosedAndOnAppealByMonthChartData}
            labels={casesMonths}
            legendTotals={casesClosedAndOnAppealLegendTotals}
            htmlTitle={`${CASES_CLOSED_AND_ON_APPEAL_TITLE} in ${casesYearLabel}`}
            title={CASES_CLOSED_AND_ON_APPEAL_TITLE}
            xLabelRotation={45}
            xAxisLabel="Months"
          />
        </div>
      </div>
    </ClerkOfCourtChartStatus>
  );
};

export const DashboardClerkOfCourt = connect(
  {
    dashboardClerkOfTheCourtHelper: state.dashboardClerkOfTheCourtHelper,
    user: state.user,
    casesByYearIsFiscal: state.clerkOfCourtDashboardOptions.casesByYearIsFiscal,
    loadClerkOfCourtDashboardChartsSequence:
      sequences.loadClerkOfCourtDashboardChartsSequence,
    petitionsByYearIsFiscal:
      state.clerkOfCourtDashboardOptions.petitionsByYearIsFiscal,
    setClerkOfCourtDashboardOptionsSequence:
      sequences.setClerkOfCourtDashboardOptionsSequence,
    statsStatus: state.clerkOfCourtDashboardStatsStatus,
  },
  function DashboardClerkOfCourt({
    casesByYearIsFiscal,
    dashboardClerkOfTheCourtHelper,
    loadClerkOfCourtDashboardChartsSequence,
    user,
    petitionsByYearIsFiscal,
    setClerkOfCourtDashboardOptionsSequence,
    statsStatus,
  }) {
    // load the chart stats outside the route's sequence, so navigation never waits for them
    useEffect(() => {
      loadClerkOfCourtDashboardChartsSequence();
    }, []);

    const {
      petitionsByMonthAndServiceTypeChartData,
      petitionsByRepresentationPieData,
      petitionsByServiceTypePieData,
      totalPetitions,
      months,
      petitionsYearLabel,
    } = dashboardClerkOfTheCourtHelper;

    const [mobileSection, setMobileSection] = useState('petitions');

    return (
      <>
        <BigHeader text={`Welcome, ${user.name}`} />
        <section className="usa-section grid-container tw:pt-7 tw:xs:pb-12 tw:pb-8 tw:xs:px-12 tw:px-3">
          <div data-testid="inbox-tab-content">
            <SuccessNotification />
            <ErrorNotification />

            <ClerkOfCourtTrialSessionsSummary />
            <NonMobile>
              <Tabs className="margin-top-6" marginBottom={false}>
                <Tab tabName="petitions" title="Petitions">
                  <ClerkOfCourtChartStatus status={statsStatus}>
                    <div className="tw:mt-4" data-testid="petitions-data-div">
                      {calendarAndFiscalYearSelectors({
                        isFiscal: petitionsByYearIsFiscal,
                        optionKey: 'petitionsByYearIsFiscal',
                        setClerkOfCourtDashboardOptionsSequence,
                      })}
                      <h2
                        className="tw:xs:text-2xl tw:text-lg tw:mb-5"
                        data-testid="petitions-data-header"
                      >
                        Total petitions created in {petitionsYearLabel}:{' '}
                        <span className="tw:font-normal">{totalPetitions}</span>
                      </h2>
                      <div className="tw:flex tw:flex-wrap tw:gap-12">
                        <PieGraph
                          data={petitionsByServiceTypePieData}
                          title={`Petitions Created in ${petitionsYearLabel}`}
                          showTitle={false}
                          tooltipTitle="Petitions Created"
                        />
                        <PieGraph
                          data={petitionsByRepresentationPieData}
                          title={`Petitions Created in ${petitionsYearLabel}`}
                          showTitle={false}
                          tooltipTitle="Petitions Created"
                        />
                      </div>
                      <div>
                        <MultiBarGraph
                          showLabels={false}
                          width={CHART_WIDTH}
                          datasets={petitionsByMonthAndServiceTypeChartData}
                          labels={months}
                          stacked={true}
                          title={PETITIONS_BY_MONTH_TITLE}
                          xLabelRotation={45}
                          xAxisLabel="Months"
                        />
                      </div>
                    </div>
                  </ClerkOfCourtChartStatus>
                </Tab>
                <Tab tabName="cases" title="Cases">
                  {casesData({
                    casesByYearIsFiscal,
                    dashboardClerkOfTheCourtHelper,
                    setClerkOfCourtDashboardOptionsSequence,
                    statsStatus,
                  })}
                </Tab>
                <Tab tabName="recentMessages" title="Recent Messages">
                  <RecentMessagesCotC />
                </Tab>
              </Tabs>
            </NonMobile>
            <Mobile>
              <div className="tw:mt-6 tw:mb-3">
                <select
                  aria-label="dashboard section"
                  className="usa-select dashboard-clerk-of-court-mobile-selector"
                  data-testid="dashboard-clerk-of-court-mobile-selector"
                  value={mobileSection}
                  onChange={e => setMobileSection(e.target.value)}
                >
                  <option value="petitions">Petitions</option>
                  <option value="cases">Cases</option>
                  <option value="recentMessages">Recent Messages</option>
                </select>
              </div>
              {mobileSection === 'recentMessages' && (
                <div>
                  <RecentMessagesCotC />
                </div>
              )}
              {mobileSection === 'cases' &&
                casesData({
                  casesByYearIsFiscal,
                  dashboardClerkOfTheCourtHelper,
                  isMobile: true,
                  setClerkOfCourtDashboardOptionsSequence,
                  statsStatus,
                })}
              {mobileSection === 'petitions' && (
                <ClerkOfCourtChartStatus status={statsStatus}>
                  <div>
                    {calendarAndFiscalYearSelectors({
                      isFiscal: petitionsByYearIsFiscal,
                      isMobile: true,
                      optionKey: 'petitionsByYearIsFiscal',
                      setClerkOfCourtDashboardOptionsSequence,
                    })}
                    <h2
                      className="tw:xs:text-2xl tw:text-lg tw:mb-2"
                      data-testid="petitions-data-header"
                    >
                      Total petitions created in {petitionsYearLabel}:{' '}
                      <span className="tw:font-normal">{totalPetitions}</span>
                    </h2>
                    <div className="tw:mb-8">
                      <PieGraph
                        data={petitionsByServiceTypePieData}
                        title={`Petitions Created in ${petitionsYearLabel}`}
                        showTitle={false}
                        tooltipTitle="Petitions Created"
                      />
                    </div>
                    <div className="tw:mb-6">
                      <PieGraph
                        data={petitionsByRepresentationPieData}
                        title={`Petitions Created in ${petitionsYearLabel}`}
                        showTitle={false}
                        tooltipTitle="Petitions Created"
                      />
                    </div>
                    <div>
                      <MultiBarGraph
                        showLabels={false}
                        width={CHART_WIDTH}
                        datasets={petitionsByMonthAndServiceTypeChartData}
                        labels={months}
                        stacked={true}
                        xLabelRotation={45}
                        title={PETITIONS_BY_MONTH_TITLE}
                      />
                    </div>
                  </div>
                </ClerkOfCourtChartStatus>
              )}
            </Mobile>
          </div>
        </section>
      </>
    );
  },
);

DashboardClerkOfCourt.displayName = 'DashboardClerkOfCourt';

import { BigHeader } from '../BigHeader';
import { ClerkOfCourtTrialSessionsSummary } from '../TrialSessions/ClerkOfCourtTrialSessionsSummary';
import { ErrorNotification } from '../ErrorNotification';
import { LineGraph } from '@web-client/views/Public/DawsonLibrary/LineGraph';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import {
  MultiBarGraph,
  SingleBarGraph,
} from '@web-client/views/Public/DawsonLibrary/BarGraph';
import { PieGraph } from '@web-client/views/Public/DawsonLibrary/PieGraph';
import { RecentMessagesCotC } from '../WorkQueue/RecentMessagesCotC';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '@web-client/ustc-ui/Tabs/Tabs';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useState } from 'react';

const CHART_WIDTH = 1344;

export const DashboardClerkOfCourt = connect(
  {
    clerkOfCourtDashboard: state.clerkOfCourtDashboard,
    user: state.user,
  },
  function DashboardClerkOfCourt({ clerkOfCourtDashboard, user }) {
    const shouldDisplayChartTabs =
      process.env.STAGE !== 'prod' && process.env.STAGE !== 'test';

    const {
      caseTypeBreakdownDatasets,
      caseTypeBreakdownLabels,
      casesFiledDatasets,
      casesFiledLabels,
      closedCasesDatasets,
      closedCasesLabels,
      petitionsByMonthDatasets,
      petitionsByMonthLabels,
      procedureTypePieData,
      sessionTypePieData,
      specialSessionsByLocation,
      totalSessionsScheduled,
    } = clerkOfCourtDashboard;

    const [mobileSection, setMobileSection] = useState('recentMessages');

    return (
      <>
        <BigHeader text={`Welcome, ${user.name}`} />
        <section className="usa-section grid-container">
          <div data-testid="inbox-tab-content">
            <SuccessNotification />
            <ErrorNotification />

            <ClerkOfCourtTrialSessionsSummary />
            <NonMobile>
              <Tabs className="margin-top-6" marginBottom={false}>
                <Tab tabName="recentMessages" title="Recent Messages">
                  <RecentMessagesCotC />
                </Tab>
                {shouldDisplayChartTabs && (
                  <Tab tabName="pieChart" title="Pie Chart">
                    <div className="tw:mt-6 tw:mx-4">
                      <h2 className="tw:xs:text-2xl tw:text-lg">
                        Total sessions scheduled: {totalSessionsScheduled}
                      </h2>
                      <div className="tw:flex tw:flex-wrap tw:gap-12 tw:mt-4">
                        <PieGraph
                          title="Procedure Type"
                          data={procedureTypePieData}
                        />
                        <PieGraph
                          title="Session Type"
                          data={sessionTypePieData}
                        />
                      </div>
                    </div>
                  </Tab>
                )}
                {shouldDisplayChartTabs && (
                  <Tab tabName="barGraph" title="Bar Graph">
                    <div className="tw:mt-6">
                      <SingleBarGraph
                        showLabels={false}
                        title="Created Special Sessions by Location"
                        width={CHART_WIDTH}
                        data={specialSessionsByLocation}
                      />
                      <div className="tw:mt-12" />
                      <MultiBarGraph
                        showLabels={false}
                        stacked
                        title="Total Petitions by Month"
                        width={CHART_WIDTH}
                        xLabelRotation={45}
                        datasets={petitionsByMonthDatasets}
                        labels={petitionsByMonthLabels}
                      />
                      <div className="tw:mt-12" />
                      <MultiBarGraph
                        showLabels={false}
                        title="Closed/Closed - Dismissed &amp; Changed to On Appeal"
                        width={CHART_WIDTH}
                        xLabelRotation={45}
                        datasets={closedCasesDatasets}
                        labels={closedCasesLabels}
                      />
                    </div>
                  </Tab>
                )}
                {shouldDisplayChartTabs && (
                  <Tab tabName="lineGraph" title="Line Graph">
                    <div className="tw:mt-6">
                      <LineGraph
                        smooth
                        title="Cases Filed Over Time"
                        width={CHART_WIDTH}
                        xAxisLabel="Month"
                        xLabelRotation={45}
                        yAxisLabel="Number of Cases"
                        datasets={casesFiledDatasets}
                        labels={casesFiledLabels}
                      />
                      <div className="tw:mt-[6.25rem]" />
                      <LineGraph
                        title="Case Type Breakdown by Quarter"
                        width={CHART_WIDTH}
                        xAxisLabel="Quarter"
                        yAxisLabel="Number of Cases"
                        datasets={caseTypeBreakdownDatasets}
                        labels={caseTypeBreakdownLabels}
                      />
                    </div>
                  </Tab>
                )}
              </Tabs>
            </NonMobile>
            <Mobile>
              <div className="margin-top-6 margin-bottom-3">
                <select
                  aria-label="dashboard section"
                  className="usa-select dashboard-clerk-of-court-mobile-selector"
                  data-testid="dashboard-clerk-of-court-mobile-selector"
                  value={mobileSection}
                  onChange={e => setMobileSection(e.target.value)}
                >
                  <option value="recentMessages">Recent Messages</option>
                  {shouldDisplayChartTabs && (
                    <>
                      <option value="pieChart">Pie Chart</option>
                      <option value="barGraph">Bar Graph</option>
                      <option value="lineGraph">Line Graph</option>
                    </>
                  )}
                </select>
              </div>
              {mobileSection === 'recentMessages' && (
                <div>
                  <RecentMessagesCotC />
                </div>
              )}
              {mobileSection === 'pieChart' && (
                <div className="tw:mt-6 tw:mx-4">
                  <h2 className="tw:xs:text-2xl tw:text-lg tw:xs:mb-8 tw:mb-5">
                    Total sessions scheduled: {totalSessionsScheduled}
                  </h2>
                  <div className="tw:flex tw:flex-wrap tw:gap-12 tw:mt-4">
                    <PieGraph
                      title="Procedure Type"
                      data={procedureTypePieData}
                    />
                    <PieGraph title="Session Type" data={sessionTypePieData} />
                  </div>
                </div>
              )}
              {mobileSection === 'barGraph' && (
                <div className="tw:mt-6">
                  <SingleBarGraph
                    showLabels={false}
                    title="Created Special Sessions by Location"
                    width={CHART_WIDTH}
                    data={specialSessionsByLocation}
                  />
                  <div className="tw:mt-12" />
                  <MultiBarGraph
                    showLabels={false}
                    stacked
                    title="Total Petitions by Month"
                    width={CHART_WIDTH}
                    xLabelRotation={45}
                    datasets={petitionsByMonthDatasets}
                    labels={petitionsByMonthLabels}
                  />
                  <div className="tw:mt-12" />
                  <MultiBarGraph
                    showLabels={false}
                    title="Closed/Closed - Dismissed &amp; Changed to On Appeal"
                    width={CHART_WIDTH}
                    xLabelRotation={45}
                    datasets={closedCasesDatasets}
                    labels={closedCasesLabels}
                  />
                </div>
              )}
              {mobileSection === 'lineGraph' && (
                <div className="tw:mt-6">
                  <LineGraph
                    smooth
                    title="Cases Filed Over Time"
                    width={CHART_WIDTH}
                    xAxisLabel="Month"
                    xLabelRotation={45}
                    yAxisLabel="Number of Cases"
                    datasets={casesFiledDatasets}
                    labels={casesFiledLabels}
                  />
                  <div className="tw:mt-12" />
                  <LineGraph
                    title="Case Type Breakdown by Quarter"
                    width={CHART_WIDTH}
                    xAxisLabel="Quarter"
                    yAxisLabel="Number of Cases"
                    datasets={caseTypeBreakdownDatasets}
                    labels={caseTypeBreakdownLabels}
                  />
                </div>
              )}
            </Mobile>
          </div>
        </section>
      </>
    );
  },
);

DashboardClerkOfCourt.displayName = 'DashboardClerkOfCourt';

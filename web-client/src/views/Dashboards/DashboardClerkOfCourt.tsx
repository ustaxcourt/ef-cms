import { BigHeader } from '../BigHeader';
import { ClerkOfCourtTrialSessionsSummary } from '../TrialSessions/ClerkOfCourtTrialSessionsSummary';
import { ErrorNotification } from '../ErrorNotification';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { MultiBarGraph } from '@web-client/views/Public/DawsonLibrary/BarGraph';
import { PieGraph } from '@web-client/views/Public/DawsonLibrary/PieGraph';
import { RecentMessagesCotC } from '../WorkQueue/RecentMessagesCotC';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '@web-client/ustc-ui/Tabs/Tabs';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React, { useState } from 'react';
import classNames from 'classnames';

const CHART_WIDTH = 1300;

const calendarAndFiscalYearSelectors = ({
  petitionsByYearIsFiscal,
  setClerkOfCourtDashboardOptionsSequence,
  isMobile = false,
}: {
  petitionsByYearIsFiscal: boolean;
  setClerkOfCourtDashboardOptionsSequence: Function;
  isMobile?: boolean;
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
          checked={!petitionsByYearIsFiscal}
          type="radio"
          className="usa-radio__input"
          id="calendar-year-to-date"
          name="is-fiscal"
          value="false"
          onChange={() =>
            setClerkOfCourtDashboardOptionsSequence({
              key: 'petitionsByYearIsFiscal',
              value: false,
            })
          }
        ></input>
        <label
          className="usa-radio__label tw:mt-0 tw:xs:text-lg/6 tw:text-base"
          htmlFor="calendar-year-to-date"
          id="calendar-year-to-date-label"
          data-testid="calendar-year-to-date"
        >
          YTD
        </label>
      </div>
      <div className={`${isMobile ? 'tw:pl-8' : 'tw:pl-10'}`}>
        <input
          checked={petitionsByYearIsFiscal}
          type="radio"
          className="usa-radio__input"
          id="fiscal-year-to-date"
          name="is-fiscal"
          value="true"
          onChange={() =>
            setClerkOfCourtDashboardOptionsSequence({
              key: 'petitionsByYearIsFiscal',
              value: true,
            })
          }
        ></input>
        <label
          className="usa-radio__label tw:mt-0 tw:xs:text-lg/6 tw:text-base"
          htmlFor="fiscal-year-to-date"
          id="fiscal-year-to-date-label"
          data-testid="fiscal-year-to-date"
        >
          FYTD
        </label>
      </div>
    </div>
  );
};

export const DashboardClerkOfCourt = connect(
  {
    dashboardClerkOfTheCourtHelper: state.dashboardClerkOfTheCourtHelper,
    user: state.user,
    petitionsByYearIsFiscal:
      state.clerkOfCourtDashboardOptions.petitionsByYearIsFiscal,
    setClerkOfCourtDashboardOptionsSequence:
      sequences.setClerkOfCourtDashboardOptionsSequence,
  },
  function DashboardClerkOfCourt({
    dashboardClerkOfTheCourtHelper,
    user,
    petitionsByYearIsFiscal,
    setClerkOfCourtDashboardOptionsSequence,
  }) {
    const {
      petitionsByMonthAndServiceTypeChartData,
      petitionsByRepresentationPieData,
      petitionsByServiceTypePieData,
      totalPetitions,
      months,
      year,
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
                  <div className="tw:mt-4" data-testid="petitions-data-div">
                    {calendarAndFiscalYearSelectors({
                      petitionsByYearIsFiscal,
                      setClerkOfCourtDashboardOptionsSequence,
                    })}
                    <h2
                      className="tw:xs:text-2xl tw:text-lg tw:mb-5"
                      data-testid="petitions-data-header"
                    >
                      Total petitions created in{' '}
                      {petitionsByYearIsFiscal ? 'FYTD' : 'YTD'} {year}:{' '}
                      <span className="tw:font-normal">{totalPetitions}</span>
                    </h2>
                    <div className="tw:flex tw:flex-wrap tw:gap-12">
                      <PieGraph
                        data={petitionsByServiceTypePieData}
                        title={`Petitions Created in ${petitionsByYearIsFiscal ? 'FYTD' : 'YTD'} ${year}`}
                        showTitle={false}
                        tooltipTitle="Petitions Created"
                      />
                      <PieGraph
                        data={petitionsByRepresentationPieData}
                        title={`Petitions Created in ${petitionsByYearIsFiscal ? 'FYTD' : 'YTD'} ${year}`}
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
                        title="Petitions: Total Petitions by Month"
                        xLabelRotation={45}
                      />
                    </div>
                  </div>
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
                  <option value="recentMessages">Recent Messages</option>
                </select>
              </div>
              {mobileSection === 'recentMessages' && (
                <div>
                  <RecentMessagesCotC />
                </div>
              )}
              {mobileSection === 'petitions' && (
                <div>
                  {calendarAndFiscalYearSelectors({
                    petitionsByYearIsFiscal,
                    setClerkOfCourtDashboardOptionsSequence,
                    isMobile: true,
                  })}
                  <h2
                    className="tw:xs:text-2xl tw:text-lg tw:mb-2"
                    data-testid="petitions-data-header"
                  >
                    Total petitions created in{' '}
                    {petitionsByYearIsFiscal ? 'FYTD' : 'YTD'} {year}:{' '}
                    <span className="tw:font-normal">{totalPetitions}</span>
                  </h2>
                  <div className="tw:mb-8">
                    <PieGraph
                      data={petitionsByServiceTypePieData}
                      tooltipTitle="Petitions Created"
                    />
                  </div>
                  <div className="tw:mb-6">
                    <PieGraph
                      data={petitionsByRepresentationPieData}
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
                      title="Petitions: Total Petitions by Month"
                    />
                  </div>
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

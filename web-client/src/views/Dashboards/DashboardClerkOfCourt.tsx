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

const CHART_WIDTH = 1300;

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
                <Tab tabName="petitions" title="Petitions">
                  <div className="tw:mt-6 tw:mx-4">
                    <div className="tw:flex tw:justify-end">
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
                          className="usa-radio__label"
                          htmlFor="calendar-year-to-date"
                          id="calendar-year-to-date-label"
                        >
                          YTD
                        </label>
                      </div>
                      <div className="tw:pl-4">
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
                          className="usa-radio__label"
                          htmlFor="fiscal-year-to-date"
                          id="fiscal-year-to-date-label"
                        >
                          FYTD
                        </label>
                      </div>
                    </div>
                    <h2 className="tw:xs:text-2xl tw:text-lg">
                      Total petitions created in{' '}
                      {petitionsByYearIsFiscal ? 'FYTD' : 'YTD'} {year}:{' '}
                      <span className="tw:font-normal">{totalPetitions}</span>
                    </h2>
                    <div className="tw:flex tw:flex-wrap tw:gap-12 tw:mt-4">
                      <PieGraph data={petitionsByServiceTypePieData} />
                      <PieGraph data={petitionsByRepresentationPieData} />
                    </div>

                    <h2 className="tw:xs:text-2xl tw:text-lg">
                      Total Petitions by Month
                    </h2>

                    <div>
                      <MultiBarGraph
                        showLabels={false}
                        width={CHART_WIDTH}
                        datasets={petitionsByMonthAndServiceTypeChartData}
                        labels={months}
                        stacked={true}
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
              <div className="margin-top-6 margin-bottom-3">
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
                  <div>
                    <PieGraph data={petitionsByServiceTypePieData} />
                  </div>
                  <PieGraph data={petitionsByRepresentationPieData} />
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

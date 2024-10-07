import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { CreateTermModal } from '@web-client/views/CreateTermModal';
import { DateRangePickerComponent } from '@web-client/ustc-ui/DateInput/DateRangePickerComponent';
import { ErrorNotification } from '../ErrorNotification';
import { PillButton } from '@web-client/ustc-ui/Button/PillButton';
import {
  SESSION_STATUS_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
  TrialSessionProceedingType,
  TrialSessionTypes,
} from '@shared/business/entities/EntityConstants';
import { SelectSearch } from '@web-client/ustc-ui/Select/SelectSearch';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { TrialSessionsTable } from './TrialSessionsTable';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const TrialSessions = connect(
  {
    openCreateTermModalSequence: sequences.openCreateTermModalSequence,
    openTrialSessionPlanningModalSequence:
      sequences.openTrialSessionPlanningModalSequence,
    resetTrialSessionsFiltersSequence:
      sequences.resetTrialSessionsFiltersSequence,
    showModal: state.modal.showModal,
    trialSessionsHelper: state.trialSessionsHelper,
  },
  function TrialSessions({
    openCreateTermModalSequence,
    openTrialSessionPlanningModalSequence,
    resetTrialSessionsFiltersSequence,
    showModal,
    trialSessionsHelper,
  }) {
    return (
      <>
        <BigHeader text="Trial Sessions" />
        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />
          <div className="display-flex flex-justify-end flex-align-center flex-wrap gap-1">
            <div>
              {trialSessionsHelper.showCreateTermButton && (
                <Button
                  link
                  className="margin-top-1"
                  data-testid="open-create-term-modal-button"
                  icon={['far', 'calendar']}
                  onClick={() => openCreateTermModalSequence()}
                >
                  Create Term
                </Button>
              )}
            </div>
            <div>
              <Button
                link
                noMargin
                className="margin-right-0"
                icon="print"
                onClick={() => openTrialSessionPlanningModalSequence()}
              >
                Trial Session Planning Report
              </Button>
            </div>
            {trialSessionsHelper.showNewTrialSession && (
              <div>
                <Button
                  noMargin
                  className="margin-right-0"
                  data-testid="add-trial-session-button"
                  href="/add-a-trial-session"
                  icon="plus-circle"
                >
                  Add Trial Session
                </Button>
              </div>
            )}
          </div>
          <Tabs
            bind="trialSessionsPage.filters.currentTab"
            defaultActiveTab={'calendared'}
            headingLevel="2"
            id="trial-sessions-tabs"
            onSelect={tabName => {
              resetTrialSessionsFiltersSequence({ currentTab: tabName });
            }}
          >
            {trialSessionsHelper.showNewTrialSession && (
              <Tab
                data-testid="new-trial-sessions-tab"
                id="new-trial-sessions-tab"
                key="new"
                tabName="new"
                title="New"
              >
                <TrialSessionFilters />
                <TrialSessionsTable />
              </Tab>
            )}
            <Tab
              data-testid="calendared-trial-sessions-tab"
              id="calendared-trial-sessions-tab"
              key="calendared"
              tabName="calendared"
              title="Calendared"
            >
              <TrialSessionFilters />
              <TrialSessionsTable />
            </Tab>
          </Tabs>
        </section>
        {showModal === 'CreateTermModal' && <CreateTermModal />}
      </>
    );
  },
);

const TrialSessionFilters = connect(
  {
    resetTrialSessionsFiltersSequence:
      sequences.resetTrialSessionsFiltersSequence,
    setTrialSessionsFiltersSequence: sequences.setTrialSessionsFiltersSequence,
    trialSessionsHelper: state.trialSessionsHelper,
    trialSessionsPage: state.trialSessionsPage,
  },
  function TrialSessionFilters({
    resetTrialSessionsFiltersSequence,
    setTrialSessionsFiltersSequence,
    trialSessionsHelper,
    trialSessionsPage,
  }) {
    return (
      <>
        <div className="grid-row gap-3 flex-align-center trial-sessions-filters">
          {trialSessionsHelper.showSessionStatus && (
            <fieldset className="usa-fieldset">
              <legend className="usa-legend">Session status</legend>
              <div className="usa-radio usa-radio__inline">
                {[
                  'All',
                  SESSION_STATUS_TYPES.open,
                  SESSION_STATUS_TYPES.closed,
                ].map(statusOption => (
                  <React.Fragment key={statusOption}>
                    <input
                      checked={
                        trialSessionsPage.filters.sessionStatus === statusOption
                      }
                      className="usa-radio__input"
                      id={`sessionStatus-${statusOption}`}
                      name="sessionStatus"
                      type="radio"
                      value={statusOption}
                      onChange={e => {
                        setTrialSessionsFiltersSequence({
                          sessionStatus: e.target.value,
                        });
                      }}
                    />
                    <label
                      className="usa-radio__label"
                      data-testid={`sessionStatus-${statusOption}`}
                      htmlFor={`sessionStatus-${statusOption}`}
                    >
                      {statusOption}
                    </label>
                  </React.Fragment>
                ))}
              </div>
            </fieldset>
          )}
          <fieldset className="usa-fieldset">
            <legend className="usa-legend">Proceeding type</legend>
            <div className="usa-radio usa-radio__inline">
              {['All', ...Object.values(TRIAL_SESSION_PROCEEDING_TYPES)].map(
                proceedingOption => (
                  <React.Fragment key={proceedingOption}>
                    <input
                      checked={
                        trialSessionsPage.filters.proceedingType ===
                        proceedingOption
                      }
                      className="usa-radio__input"
                      id={`proceedingType-${proceedingOption}`}
                      name="proceedingType"
                      type="radio"
                      value={proceedingOption}
                      onChange={e => {
                        setTrialSessionsFiltersSequence({
                          proceedingType: e.target
                            .value as TrialSessionProceedingType,
                        });
                      }}
                    />
                    <label
                      className="usa-radio__label"
                      data-testid={`proceedingType-${proceedingOption}`}
                      htmlFor={`proceedingType-${proceedingOption}`}
                    >
                      {proceedingOption}
                    </label>
                  </React.Fragment>
                ),
              )}
            </div>
          </fieldset>
          <DateRangePickerComponent
            endDateErrorText={trialSessionsHelper.endDateErrorMessage}
            endLabel={
              <span>
                Last start date{' '}
                <span className="optional-light-text">(optional)</span>
              </span>
            }
            endName="trialSessionLastStartDate"
            endValue={trialSessionsPage.filters.endDate}
            rangePickerCls={'display-flex flex-wrap gap-2'}
            startDateErrorText={trialSessionsHelper.startDateErrorMessage}
            startLabel={
              <span>
                First start date{' '}
                <span className="optional-light-text">(optional)</span>
              </span>
            }
            startName="trialSessionFirstStartDate"
            startValue={trialSessionsPage.filters.startDate}
            onBlurEnd={e => {
              setTrialSessionsFiltersSequence({
                endDate: e.target.value,
              });
            }}
            onBlurStart={e => {
              setTrialSessionsFiltersSequence({
                startDate: e.target.value,
              });
            }}
          />
        </div>
        <div className="padding-y-2"></div>
        <div className="margin-bottom-2 grid-row flex-row gap-2">
          <div className="tablet:grid-col grid-col-12">
            <div className="margin-bottom-1">
              <label
                className="usa-label"
                htmlFor="session-type-filter"
                id="session-type-filter-label"
              >
                Session type{' '}
                <span className="optional-light-text">(optional)</span>
              </label>
              <SelectSearch
                aria-labelledby="session-type-filter-label"
                data-testid="trial-session-type-filter-search"
                id="session-type-filter"
                name="sessionType"
                options={trialSessionsHelper.sessionTypeOptions}
                placeholder="- Select one or more -"
                value={{
                  label: '- Select one or more -',
                  value: '' as TrialSessionTypes,
                }}
                onChange={sessionType => {
                  if (sessionType) {
                    setTrialSessionsFiltersSequence({
                      sessionTypes: {
                        action: 'add',
                        sessionType: sessionType.value,
                      },
                    });
                  }
                }}
              />
            </div>
            <div>
              {Object.values(trialSessionsPage.filters.sessionTypes).map(
                sessionType => (
                  <PillButton
                    key={sessionType}
                    text={sessionType}
                    onRemove={() => {
                      setTrialSessionsFiltersSequence({
                        sessionTypes: {
                          action: 'remove',
                          sessionType,
                        },
                      });
                    }}
                  />
                ),
              )}
            </div>
          </div>
          <div className="tablet:grid-col grid-col-12">
            <div className="margin-bottom-1">
              <label
                className="usa-label"
                htmlFor="location-filter"
                id="location-filter-label"
              >
                Location <span className="optional-light-text">(optional)</span>
              </label>
              <SelectSearch
                aria-labelledby="location-filter-label"
                data-testid="trial-session-location-filter-search"
                id="location-filter"
                name="location"
                options={trialSessionsHelper.trialCitiesByState}
                placeholder="- Select one or more -"
                value={{
                  label: '- Select one or more -',
                  value: '',
                }}
                onChange={location => {
                  if (location) {
                    setTrialSessionsFiltersSequence({
                      trialLocations: {
                        action: 'add',
                        trialLocation: location.value,
                      },
                    });
                  }
                }}
              />
            </div>
            <div>
              {Object.values(trialSessionsPage.filters.trialLocations).map(
                location => (
                  <PillButton
                    key={location}
                    text={location}
                    onRemove={() => {
                      setTrialSessionsFiltersSequence({
                        trialLocations: {
                          action: 'remove',
                          trialLocation: location,
                        },
                      });
                    }}
                  />
                ),
              )}
            </div>
          </div>
          <div className="tablet:grid-col grid-col-12">
            <div className="margin-bottom-1">
              <label
                className="usa-label"
                htmlFor="judge-filter"
                id="judges-filter-label"
              >
                Judge <span className="optional-light-text">(optional)</span>
              </label>
              <SelectSearch
                aria-labelledby="judges-filter-label"
                data-testid="trial-session-judge-filter-search"
                id="judges"
                name="judges"
                options={trialSessionsHelper.trialSessionJudgeOptions}
                placeholder="- Select one or more -"
                value={{
                  label: '- Select one or more -',
                  value: { name: '', userId: '' },
                }}
                onChange={inputValue => {
                  if (inputValue) {
                    setTrialSessionsFiltersSequence({
                      judges: {
                        action: 'add',
                        judge: inputValue.value,
                      },
                    });
                  }
                }}
              />
            </div>
            <div>
              {Object.values(trialSessionsPage.filters.judges).map(judge => (
                <PillButton
                  key={judge.userId}
                  text={judge.name}
                  onRemove={() => {
                    setTrialSessionsFiltersSequence({
                      judges: {
                        action: 'remove',
                        judge,
                      },
                    });
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <Button
          link
          disabled={trialSessionsHelper.isResetFiltersDisabled}
          tooltip="Reset Filters"
          onClick={() =>
            resetTrialSessionsFiltersSequence({
              currentTab: trialSessionsPage.filters.currentTab,
            })
          }
        >
          Reset Filters
        </Button>
      </>
    );
  },
);

TrialSessions.displayName = 'TrialSessions';

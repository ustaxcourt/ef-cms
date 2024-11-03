import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { NonMobile } from '@web-client/ustc-ui/Responsive/Responsive';
import { PillButton } from '@web-client/ustc-ui/Button/PillButton';
import { SelectSearch } from '@web-client/ustc-ui/Select/SelectSearch';
import { TRIAL_SESSION_PROCEEDING_TYPES } from '@shared/business/entities/EntityConstants';
import { props as cerebralProps } from 'cerebral';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app-public.cerebral';
import React from 'react';

type PublicTrialSessionsFiltersProps = {
  ROOT: string;
};

const props = cerebralProps as unknown as PublicTrialSessionsFiltersProps;

const PublicTrialSessionsFiltersDeps = {
  displayProgressSpinnerSequence: sequences.displayProgressSpinnerSequence,
  publicTrialSessionData: state[props.ROOT],
  publicTrialSessionsHelper: state.publicTrialSessionsHelper,
  updateFormValueSequence: sequences.updateFormValueSequence,
};

export const PublicTrialSessionsFilters = connect<
  PublicTrialSessionsFiltersProps,
  typeof PublicTrialSessionsFiltersDeps
>(
  PublicTrialSessionsFiltersDeps,
  function ({
    displayProgressSpinnerSequence,
    publicTrialSessionData,
    publicTrialSessionsHelper,
    ROOT,
    updateFormValueSequence,
  }) {
    const PROCEEDING_TYPES = Object.entries({
      all: 'All',
      ...TRIAL_SESSION_PROCEEDING_TYPES,
    });

    const {
      judges = {},
      locations = {},
      proceedingType = 'All',
      sessionTypes = {},
    } = publicTrialSessionData;

    const publicTrialsSessionUpdateFormValueSequence = (
      ...args: Parameters<typeof updateFormValueSequence>
    ) => {
      displayProgressSpinnerSequence({ timeInSeconds: 0.25 });
      updateFormValueSequence(...args);
      updateFormValueSequence({
        key: 'pageNumber',
        root: ROOT,
        value: 0,
      });
    };

    function proceedingTypeRadioOption(key: string, value: string) {
      return (
        <div className="usa-radio usa-radio__inline padding-right-1" key={key}>
          <input
            aria-describedby="proceeding-type-legend"
            checked={proceedingType === value}
            className="usa-radio__input"
            id={`${key}-proceeding`}
            name="proceedingType"
            type="radio"
            value={value}
            onChange={e => {
              publicTrialsSessionUpdateFormValueSequence({
                key: e.target.name,
                root: ROOT,
                value: e.target.value,
              });
            }}
          />
          <label
            aria-label={value}
            className="smaller-padding-right usa-radio__label"
            data-testid={`${value}-proceeding-label`}
            htmlFor={`${key}-proceeding`}
            id={`${key}-proceeding-label`}
          >
            {value}
          </label>
        </div>
      );
    }

    return (
      <>
        <FormGroup>
          <fieldset
            className="usa-fieldset margin-top-2"
            data-testid="proceeding-type-filter"
          >
            <legend className="usa-legend" id="proceeding-type-legend">
              Proceeding type
            </legend>
            {PROCEEDING_TYPES.map(([key, value]) =>
              proceedingTypeRadioOption(key, value),
            )}
          </fieldset>
        </FormGroup>

        <div className="desktop:grid-col grid-col-12">
          <div className="grid-row">
            <div
              className="desktop:grid-col-4 grid-col-12 tablet:padding-right-2"
              data-testid="session-type-filter"
            >
              <div className="margin-bottom-4">
                <label className="usa-label" htmlFor="session-type-filter">
                  Session type{' '}
                  <span className="optional-light-text">(optional)</span>
                </label>
                <SelectSearch
                  aria-labelledby="session-type-filter-label"
                  data-testid="session-type-filter-select"
                  inputId="session-type-filter"
                  name="sessionType"
                  options={publicTrialSessionsHelper.sessionTypeOptions}
                  placeholder="- Select one or more -"
                  value={{
                    label: '- Select one or more -',
                    value: '',
                  }}
                  onChange={sessionType => {
                    if (sessionType) {
                      publicTrialsSessionUpdateFormValueSequence({
                        key: `sessionTypes.${sessionType.value}`,
                        root: ROOT,
                        value: sessionType.label,
                      });
                    }
                  }}
                />
              </div>
              <NonMobile>
                {Object.entries(
                  sessionTypes as {
                    [key: string]: string;
                  },
                ).map(([sessionTypeKey, sessionTypeLabel]) => (
                  <PillButton
                    data-testid={`session-${sessionTypeLabel}-pill-button`}
                    key={sessionTypeLabel}
                    text={sessionTypeLabel}
                    onRemove={() => {
                      publicTrialsSessionUpdateFormValueSequence({
                        key: `sessionTypes.${sessionTypeKey}`,
                        root: ROOT,
                        value: undefined,
                      });
                    }}
                  />
                ))}
              </NonMobile>
            </div>
            <div
              className="desktop:grid-col-4 grid-col-12 tablet:padding-right-2"
              data-testid="location-filter"
            >
              <div className="margin-bottom-4">
                <label
                  className="usa-label"
                  htmlFor="location-filter"
                  id="location-filter-label"
                >
                  Location{' '}
                  <span className="optional-light-text">(optional)</span>
                </label>
                <SelectSearch
                  aria-labelledby="location-filter-label"
                  data-testid="location-filter-search"
                  inputId="location-filter"
                  name="location"
                  options={publicTrialSessionsHelper.trialCitiesByState}
                  placeholder="- Select one or more -"
                  value={{
                    label: '- Select one or more -',
                    value: '',
                  }}
                  onChange={location => {
                    if (location) {
                      publicTrialsSessionUpdateFormValueSequence({
                        key: `locations.${location.value}`,
                        root: ROOT,
                        value: location.label,
                      });
                    }
                  }}
                />
              </div>
              <NonMobile>
                {Object.entries(
                  locations as {
                    [key: string]: string;
                  },
                ).map(([locationKey, locationLabel]) => (
                  <PillButton
                    data-testid={`location-${locationLabel}-pill-button`}
                    key={locationLabel}
                    text={locationLabel}
                    onRemove={() => {
                      publicTrialsSessionUpdateFormValueSequence({
                        key: `locations.${locationKey}`,
                        root: ROOT,
                        value: undefined,
                      });
                    }}
                  />
                ))}
              </NonMobile>
            </div>
            <div
              className="desktop:grid-col-4 grid-col-12 tablet:padding-right-2"
              data-testid="judge-filter"
            >
              <div className="margin-bottom-1">
                <label
                  className="usa-label"
                  htmlFor="judges-filter"
                  id="judges-filter-label"
                >
                  Judge <span className="optional-light-text">(optional)</span>
                </label>
                <SelectSearch
                  aria-labelledby="judges-filter-label"
                  data-testid="judge-filter-search"
                  inputId="judges-filter"
                  name="judges"
                  options={publicTrialSessionsHelper.trialSessionJudgeOptions}
                  placeholder="- Select one or more -"
                  value={{
                    label: '- Select one or more -',
                    value: { name: '', userId: '' },
                  }}
                  onChange={judgeInfo => {
                    if (judgeInfo) {
                      publicTrialsSessionUpdateFormValueSequence({
                        key: `judges.${judgeInfo.value.name}`,
                        root: ROOT,
                        value: judgeInfo.value.name,
                      });
                    }
                  }}
                />
              </div>
              <NonMobile>
                {Object.entries(judges as { [key: string]: string }).map(
                  ([judgeKey, judgeLabel]) => (
                    <PillButton
                      data-testid={`judge-${judgeLabel}-pill-button`}
                      key={judgeKey}
                      text={judgeLabel}
                      onRemove={() => {
                        publicTrialsSessionUpdateFormValueSequence({
                          key: `judges.${judgeKey}`,
                          root: ROOT,
                          value: undefined,
                        });
                      }}
                    />
                  ),
                )}
              </NonMobile>
            </div>
          </div>
        </div>
      </>
    );
  },
);

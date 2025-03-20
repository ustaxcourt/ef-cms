import { Button } from '../../ustc-ui/Button/Button';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import {
  ADMISSIONS_STATUS_OPTIONS,
  ALL_STATE_OPTIONS,
  PRACTICE_TYPE_OPTIONS,
  PRACTITIONER_TYPE_OPTIONS,
} from '@shared/business/entities/EntityConstants';
import { SelectSearch } from '@web-client/ustc-ui/Select/SelectSearch';
import { PillButton } from '@web-client/ustc-ui/Button/PillButton';

export const PractitionerSearchByName = connect(
  {
    advancedSearchForm: state.advancedSearchForm,
    clearAdvancedSearchFormSequence: sequences.clearAdvancedSearchFormSequence,
    submitPractitionerNameSearchSequence:
      sequences.submitPractitionerNameSearchSequence,
    updateAdvancedSearchFormValueSequence:
      sequences.updateAdvancedSearchFormValueSequence,
    validatePractitionerSearchByNameFormSequence:
      sequences.validatePractitionerSearchByNameFormSequence,
    validationErrors: state.validationErrors,
  },
  function PractitionerSearchByName({
    advancedSearchForm,
    clearAdvancedSearchFormSequence,
    submitPractitionerNameSearchSequence,
    updateAdvancedSearchFormValueSequence,
    validatePractitionerSearchByNameFormSequence,
    validationErrors,
  }) {
    return (
      <>
        <div
          className="header-with-blue-background display-flex flex-justify"
          id="search-by-name"
        >
          <h3>Search by Name</h3>
        </div>
        <div className="blue-container">
          <form>
            <div className="grid-row grid-gap">
              <div className="tablet:grid-col-6">
                <FormGroup errorText={validationErrors.practitionerName}>
                  <label className="usa-label" htmlFor="practitioner-name">
                    Practitioner name{' '}
                    <span className="usa-hint">(required)</span>
                  </label>
                  <input
                    className="usa-input"
                    data-testid="practitioner-name-input"
                    id="practitioner-name"
                    name="practitionerName"
                    type="text"
                    value={
                      advancedSearchForm.practitionerSearchByName
                        .practitionerName || ''
                    }
                    onBlur={() => {
                      validatePractitionerSearchByNameFormSequence();
                    }}
                    onChange={e => {
                      updateAdvancedSearchFormValueSequence({
                        formType: 'practitionerSearchByName',
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </FormGroup>
              </div>
            </div>
            <div className="grid-row grid-gap">
              <fieldset className="usa-fieldset">
                <legend className="usa-legend">
                  Practitioner type <span className="usa-hint">(optional)</span>
                </legend>
                {['All', ...PRACTITIONER_TYPE_OPTIONS].map(type => (
                  <div className="usa-radio usa-radio__inline" key={type}>
                    <input
                      checked={
                        advancedSearchForm.practitionerSearchByName
                          .practitionerType === type
                      }
                      className="usa-radio__input"
                      id={`practitioner-type-${type}`}
                      name="practitionerType"
                      type="radio"
                      value={type}
                      onChange={e => {
                        updateAdvancedSearchFormValueSequence({
                          formType: 'practitionerSearchByName',
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    />
                    <label
                      className="usa-radio__label"
                      data-testid={`practitioner-type-${type}-radio`}
                      htmlFor={`practitioner-type-${type}`}
                    >
                      {type}
                    </label>
                  </div>
                ))}
              </fieldset>
            </div>
            <div className="grid-row grid-gap">
              <fieldset className="usa-fieldset">
                <legend className="usa-legend">
                  Practice Type <span className="usa-hint">(optional)</span>
                </legend>
                <div style={{ display: 'flex', gap: '30px' }}>
                  {PRACTICE_TYPE_OPTIONS.map(practiceType => {
                    return (
                      <div className="usa-checkbox" key={practiceType}>
                        <input
                          checked={advancedSearchForm.practitionerSearchByName.practiceType?.includes(
                            practiceType,
                          )}
                          className="usa-checkbox__input"
                          id={`practiceType.${practiceType}`}
                          name={`practiceType`}
                          type="checkbox"
                          value={practiceType}
                          onChange={e => {
                            updateAdvancedSearchFormValueSequence({
                              formType: 'practitionerSearchByName',
                              key: 'practiceType',
                              value: e.target.value,
                              isArray: true,
                            });
                          }}
                        />
                        <label
                          className="usa-checkbox__label"
                          htmlFor={`practiceType.${practiceType}`}
                        >
                          {practiceType}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </fieldset>
            </div>

            <div className="grid-row grid-gap">
              <div className="tablet:grid-col-6">
                <div className="margin-bottom-1">
                  <label
                    className="usa-label"
                    htmlFor="admission-status"
                    id="admission-status-label"
                  >
                    Session type <span className="usa-hint">(optional)</span>
                  </label>
                  <SelectSearch
                    aria-labelledby="admission-status-label"
                    data-testid="admission-status-filter"
                    inputId="admission-status"
                    name="admissionStatus"
                    options={ADMISSIONS_STATUS_OPTIONS.map(admissionStatus => ({
                      label: admissionStatus,
                      value: admissionStatus,
                    }))}
                    placeholder="- Select one or more -"
                    value={{
                      label: '- Select one or more -',
                      value: '',
                    }}
                    onChange={admissionStatus => {
                      updateAdvancedSearchFormValueSequence({
                        formType: 'practitionerSearchByName',
                        key: 'admissionStatus',
                        value: admissionStatus?.value,
                        isArray: true,
                      });
                    }}
                  />
                </div>
                <div>
                  {advancedSearchForm.practitionerSearchByName.admissionStatus?.map(
                    admissionStatus => (
                      <PillButton
                        key={admissionStatus}
                        text={admissionStatus}
                        onRemove={() => {
                          updateAdvancedSearchFormValueSequence({
                            formType: 'practitionerSearchByName',
                            key: 'admissionStatus',
                            value: admissionStatus,
                            isArray: true,
                          });
                        }}
                      />
                    ),
                  )}
                </div>
              </div>
              <div className="tablet:grid-col-6">
                <div className="margin-bottom-1">
                  <label
                    className="usa-label"
                    htmlFor="original-bar-state"
                    id="original-bar-state-label"
                  >
                    Original Bar State{' '}
                    <span className="usa-hint">(optional)</span>
                  </label>
                  <SelectSearch
                    aria-labelledby="original-bar-state-label"
                    data-testid="original-bar-state-filter"
                    inputId="original-bar-state"
                    name="originalBarState"
                    options={Object.keys(ALL_STATE_OPTIONS).map(state => {
                      const stateLabel = ALL_STATE_OPTIONS[state];
                      return {
                        label: stateLabel,
                        value: state,
                      };
                    })}
                    placeholder="- Select one or more -"
                    value={{
                      label: '- Select one or more -',
                      value: '',
                    }}
                    onChange={originalBarState => {
                      updateAdvancedSearchFormValueSequence({
                        formType: 'practitionerSearchByName',
                        key: 'originalBarState',
                        value: originalBarState?.value,
                        isArray: true,
                      });
                    }}
                  />
                </div>
                <div>
                  {advancedSearchForm.practitionerSearchByName.originalBarState?.map(
                    originalBarState => {
                      return (
                        <PillButton
                          key={originalBarState}
                          text={ALL_STATE_OPTIONS[originalBarState]}
                          onRemove={() => {
                            updateAdvancedSearchFormValueSequence({
                              formType: 'practitionerSearchByName',
                              key: 'originalBarState',
                              value: originalBarState,
                              isArray: true,
                            });
                          }}
                        />
                      );
                    },
                  )}
                </div>
              </div>
            </div>
            <div className="grid-row margin-top-4">
              <div className="button-container">
                <Button
                  aria-describedby="search-by-name"
                  className="margin-bottom-0"
                  data-testid="practitioner-search-by-name-button"
                  id="practitioner-search-by-name-button"
                  onClick={e => {
                    e.preventDefault();
                    submitPractitionerNameSearchSequence({
                      selectedPage: 0,
                    });
                  }}
                >
                  Search
                </Button>
                <Button
                  link
                  aria-describedby="search-by-name"
                  className="margin-bottom-0 mobile:margin-top-2 tablet:margin-top-0 tablet:margin-left-205"
                  onClick={e => {
                    e.preventDefault();
                    clearAdvancedSearchFormSequence({
                      formType: 'practitionerSearchByName',
                    });
                  }}
                >
                  Clear Search
                </Button>
              </div>
            </div>
          </form>
        </div>
      </>
    );
  },
);

PractitionerSearchByName.displayName = 'PractitionerSearchByName';

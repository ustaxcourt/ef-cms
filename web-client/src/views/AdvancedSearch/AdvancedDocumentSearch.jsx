import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { Button } from '../../ustc-ui/Button/Button';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { SearchDateRangePickerComponent } from './SearchDateRangePickerComponent';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const AdvancedDocumentSearch = connect(
  {
    advancedSearchForm: state.advancedSearchForm,
    clearAdvancedSearchFormSequence: sequences.clearAdvancedSearchFormSequence,
    opinionDocumentTypes: state.opinionDocumentTypes,
  },
  function AdvancedDocumentSearch({
    advancedSearchForm,
    clearAdvancedSearchFormSequence,
    formType,
    judges,
    opinionDocumentTypes,
    updateSequence,
    validateSequence,
    validationErrors,
  }) {
    const narrowYourSearch = () => {
      return (
        <>
          <FormGroup
            className="margin-bottom-0 right-gray-border advanced-search-full-width padding-top-4 padding-right-9 padding-left-2"
            errorText={validationErrors.chooseOneValue}
          >
            <div className="grid-row nowrap-large-screens grid-gap-3">
              <div className="margin-bottom-3 desktop:margin-bottom-0">
                <label className="usa-label" htmlFor="docket-number">
                  Docket number
                </label>
                <input
                  className="usa-input"
                  id="docket-number"
                  name="docketNumber"
                  type="text"
                  value={advancedSearchForm[formType].docketNumber || ''}
                  onBlur={() => validateSequence()}
                  onChange={e => {
                    updateSequence({
                      key: e.target.name,
                      value: e.target.value.toUpperCase(),
                    });
                  }}
                />
              </div>
              <div className="desktop:text-center desktop:padding-top-6 width-full desktop:width-auto margin-bottom-2">
                or
              </div>
              <div className="margin-bottom-6 desktop:margin-bottom-0">
                <label className="usa-label" htmlFor="title-or-name">
                  Case title / Petitioner’s name
                </label>
                <input
                  className="usa-input"
                  id="title-or-name"
                  name="caseTitleOrPetitioner"
                  type="text"
                  value={
                    advancedSearchForm[formType].caseTitleOrPetitioner || ''
                  }
                  onBlur={() => validateSequence()}
                  onChange={e => {
                    updateSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
          </FormGroup>
          <FormGroup className="advanced-search-full-width margin-bottom-0 desktop:padding-left-9">
            <div className="grid-row nowrap-large-screens grid-gap-6">
              {formType === 'opinionSearch' && (
                <div className="opinion-type-search-row">
                  <label
                    className="usa-label padding-top-6"
                    htmlFor="order-opinion"
                  >
                    Opinion type
                  </label>
                  <BindedSelect
                    bind={`advancedSearchForm.${formType}.opinionType`}
                    className="usa-input"
                    id="order-opinion"
                    name="opinionType"
                  >
                    <option value="">- Select -</option>
                    {opinionDocumentTypes.map(opinionType => (
                      <option key={opinionType} value={opinionType}>
                        {opinionType}
                      </option>
                    ))}
                  </BindedSelect>
                </div>
              )}
              <div className="judge-search-row">
                <label
                  className="usa-label padding-top-4"
                  htmlFor="order-judge"
                >
                  Judge
                </label>
                <BindedSelect
                  bind={`advancedSearchForm.${formType}.judge`}
                  className="usa-input"
                  id="order-judge"
                  name="judge"
                >
                  <option value="">- Select -</option>
                  {judges.map(judge => (
                    <option
                      key={judge.judgeFullName}
                      value={judge.judgeFullName}
                    >
                      {judge.name}
                    </option>
                  ))}
                </BindedSelect>
              </div>
              <div className="date-search-row">
                <div className="padding-top-105 padding-left-0 padding-right-0 margin-left-0 margin-right-0 grid-row nowrap-large-screens grid-gap-6">
                  <SearchDateRangePickerComponent
                    formType={formType}
                    updateSequence={updateSequence}
                    validateSequence={validateSequence}
                  />
                </div>
              </div>
            </div>
          </FormGroup>
        </>
      );
    };

    return (
      <>
        <NonMobile>
          <div className="grid-row" id="document-advanced">
            {narrowYourSearch()}
          </div>
        </NonMobile>

        <Mobile>
          <div id="document-advanced">{narrowYourSearch()}</div>

          <div className="text-center">
            <Button
              className="margin-bottom-0"
              id="advanced-search-button"
              type="submit"
            >
              Search
            </Button>
            <Button
              link
              className="ustc-button--mobile-inline margin-right-0"
              onClick={e => {
                e.preventDefault();
                clearAdvancedSearchFormSequence({
                  formType,
                });
              }}
            >
              Clear Search
            </Button>
          </div>
        </Mobile>
      </>
    );
  },
);

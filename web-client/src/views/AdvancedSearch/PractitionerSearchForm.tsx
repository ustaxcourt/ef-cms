import { Button } from '../../ustc-ui/Button/Button';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { Mobile, NonMobile } from '@web-client/ustc-ui/Responsive/Responsive';
import { PractitionerSearchByBarNumber } from './PractitionerSearchByBarNumber';
import { PractitionerSearchByName } from './PractitionerSearchByName';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useState } from 'react';

export const PractitionerSearchForm = connect(
  {
    practitionerSearchFormHelper: state.practitionerSearchFormHelper,
  },
  function PractitionerSearchForm({ practitionerSearchFormHelper }) {
    const MOBILE_SEARCH_OPTIONS = ['Name', 'Bar Number'];

    const [
      selectedPractitionerSearchOption,
      setSelectedPractitionerSearchOption,
    ] = useState(MOBILE_SEARCH_OPTIONS[0]);

    return (
      <>
        {practitionerSearchFormHelper.showAddPractitioner && (
          <div className="grid-row margin-bottom-2">
            <div className="grid-col-12 text-right">
              <Button
                className="margin-right-0"
                data-testid="add-new-practitioner"
                href="/users/create-practitioner"
              >
                Add New Practitioner
              </Button>
            </div>
          </div>
        )}

        <Mobile>
          <FormGroup>
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend>Search by:</legend>
              {MOBILE_SEARCH_OPTIONS.map((option: string) => (
                <div className="usa-radio usa-radio__inline" key={option}>
                  <input
                    aria-describedby="notice-legend"
                    checked={selectedPractitionerSearchOption === option}
                    className="usa-radio__input"
                    id={`practitioner-search-${option}`}
                    type="radio"
                    value={option}
                    onChange={event => {
                      setSelectedPractitionerSearchOption(event.target.value);
                    }}
                  />
                  <label
                    className="usa-radio__label"
                    htmlFor={`practitioner-search-${option}`}
                  >
                    {option}
                  </label>
                </div>
              ))}
            </fieldset>
          </FormGroup>

          <div
            className="grid-row grid-gap-6"
            data-testid="practitioner-search-container"
          >
            {selectedPractitionerSearchOption === MOBILE_SEARCH_OPTIONS[0] ||
            !selectedPractitionerSearchOption ? (
              <div className="grid-col-12">
                <PractitionerSearchByName />
              </div>
            ) : (
              <div className="grid-col-12">
                <PractitionerSearchByBarNumber />
              </div>
            )}
          </div>
        </Mobile>

        <NonMobile>
          <div
            className="grid-row grid-gap-6"
            data-testid="practitioner-search-container"
          >
            <div className="grid-col-6 right-gray-border">
              <PractitionerSearchByName />
            </div>

            <div className="grid-col-6">
              <PractitionerSearchByBarNumber />
            </div>
          </div>
        </NonMobile>
      </>
    );
  },
);

PractitionerSearchForm.displayName = 'PractitionerSearchForm';

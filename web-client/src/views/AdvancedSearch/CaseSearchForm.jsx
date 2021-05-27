import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { CaseSearchByDocketNumber } from './CaseSearchByDocketNumber';
import { CaseSearchByName } from './CaseSearchByName';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseSearchForm = connect(
  { advancedSearchForm: state.advancedSearchForm },
  function CaseSearchForm({
    advancedSearchForm,
    submitAdvancedSearchSequence,
    submitDocketNumberSearchSequence,
  }) {
    return (
      <>
        <Mobile>
          <BindedSelect
            bind="advancedSearchForm.searchMode"
            id="search-mode"
            name="advancedSearchForm.searchMode"
          >
            <option value={'byName'}>Search by Name</option>
            <option value={'byDocketNumber'}>Search by Docket Number</option>
          </BindedSelect>

          {advancedSearchForm.searchMode === 'byName' && (
            <CaseSearchByName
              submitAdvancedSearchSequence={submitAdvancedSearchSequence}
            />
          )}
          {advancedSearchForm.searchMode === 'byDocketNumber' && (
            <CaseSearchByDocketNumber
              submitDocketNumberSearchSequence={
                submitDocketNumberSearchSequence
              }
            />
          )}
        </Mobile>

        <NonMobile>
          <div className="grid-row grid-gap-6">
            <div className="grid-col-6 right-gray-border">
              <CaseSearchByName
                submitAdvancedSearchSequence={submitAdvancedSearchSequence}
              />
            </div>

            <div className="grid-col-6">
              <CaseSearchByDocketNumber
                submitDocketNumberSearchSequence={
                  submitDocketNumberSearchSequence
                }
              />
            </div>
          </div>
        </NonMobile>
      </>
    );
  },
);

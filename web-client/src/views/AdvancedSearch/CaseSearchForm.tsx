import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { CaseSearchByDocketNumber } from './CaseSearchByDocketNumber';
import { CaseSearchByName } from './CaseSearchByName';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

const CaseSearchByNameAny: any = (CaseSearchByName as any);
const CaseSearchByDocketNumberAny: any = (CaseSearchByDocketNumber as any);

export const CaseSearchForm = connect(
  {
    advancedSearchForm: state.advancedSearchForm,
    submitAdvancedSearchSequence: sequences.submitCaseAdvancedSearchSequence,
    submitDocketNumberSearchSequence:
      sequences.submitCaseDocketNumberSearchSequence,
  },
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
            <CaseSearchByNameAny
              submitAdvancedSearchSequence={submitAdvancedSearchSequence}
            />
          )}
          {advancedSearchForm.searchMode === 'byDocketNumber' && (
            <CaseSearchByDocketNumberAny
              submitDocketNumberSearchSequence={
                submitDocketNumberSearchSequence
              }
            />
          )}
        </Mobile>

        <NonMobile>
          <div className="grid-row grid-gap-6">
            <div className="grid-col-6 right-gray-border display-flex flex-column">
              <CaseSearchByNameAny
                submitAdvancedSearchSequence={submitAdvancedSearchSequence}
              />
            </div>

            <div className="grid-col-6 display-flex flex-column">
              <CaseSearchByDocketNumberAny
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

CaseSearchForm.displayName = 'CaseSearchForm';

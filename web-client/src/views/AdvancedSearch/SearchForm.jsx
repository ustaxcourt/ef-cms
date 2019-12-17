import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { SearchByDocketNumber } from './SearchByDocketNumber';
import { SearchByName } from './SearchByName';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

const SearchInformation = () => (
  <p>
    Anyone can search for a case in our system for cases filed{' '}
    <span className="text-semibold">on or after May 1, 1986</span>. If you
    aren’t affiliated with that case, you will only see limited information
    about that case.
  </p>
);

export const SearchForm = connect(
  { searchMode: state.searchMode },
  ({
    searchMode,
    submitAdvancedSearchSequence,
    submitDocketNumberSearchSequence,
  }) => {
    return (
      <>
        <SearchInformation />
        <Mobile>
          <BindedSelect bind="searchMode" id="search-mode" name="searchMode">
            <option value={'byName'}>Search by Name</option>
            <option value={'byDocketNumber'}>Search by Docket number</option>
          </BindedSelect>

          {searchMode === 'byName' && (
            <SearchByName
              submitAdvancedSearchSequence={submitAdvancedSearchSequence}
            />
          )}
          {searchMode === 'byDocketNumber' && (
            <SearchByDocketNumber
              submitDocketNumberSearchSequence={
                submitDocketNumberSearchSequence
              }
            />
          )}
        </Mobile>

        <NonMobile>
          <div className="grid-row grid-gap-6">
            <div className="grid-col-6 right-gray-border">
              <SearchByName
                submitAdvancedSearchSequence={submitAdvancedSearchSequence}
              />
            </div>

            <div className="grid-col-6">
              <SearchByDocketNumber
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

import { PractitionerSearchByBarNumber } from './PractitionerSearchByBarNumber';
import { PractitionerSearchByName } from './PractitionerSearchByName';
import { connect } from '@cerebral/react';
import React from 'react';

export const PractitionerSearchForm = connect(
  {},
  ({
    submitPractitionerBarNumberSearchSequence,
    submitPractitionerNameSearchSequence,
  }) => {
    return (
      <>
        <div className="grid-row grid-gap-6">
          <div className="grid-col-6 right-gray-border">
            <PractitionerSearchByName
              submitPractitionerBarNumberSearchSequence={
                submitPractitionerBarNumberSearchSequence
              }
            />
          </div>

          <div className="grid-col-6">
            <PractitionerSearchByBarNumber
              submitPractitionerNameSearchSequence={
                submitPractitionerNameSearchSequence
              }
            />
          </div>
        </div>
      </>
    );
  },
);

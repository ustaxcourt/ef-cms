import { Button } from '../../ustc-ui/Button/Button';
import { PractitionerSearchByBarNumber } from './PractitionerSearchByBarNumber';
import { PractitionerSearchByName } from './PractitionerSearchByName';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const PractitionerSearchForm = connect(
  {
    practitionerSearchFormHelper: state.practitionerSearchFormHelper,
  },
  function PractitionerSearchForm({
    practitionerSearchFormHelper,
    submitPractitionerBarNumberSearchSequence,
    submitPractitionerNameSearchSequence,
  }) {
    return (
      <>
        {practitionerSearchFormHelper.showAddPractitioner && (
          <div className="grid-row margin-bottom-2">
            <div className="grid-col-12 text-right">
              <Button
                className="margin-right-0"
                href="/users/create-practitioner"
              >
                Add New Practitioner
              </Button>
            </div>
          </div>
        )}
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

PractitionerSearchForm.displayName = 'PractitionerSearchForm';

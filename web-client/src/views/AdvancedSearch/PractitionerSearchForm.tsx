import { Button } from '../../ustc-ui/Button/Button';
import { PractitionerSearchByBarNumber } from './PractitionerSearchByBarNumber';
import { PractitionerSearchByName } from './PractitionerSearchByName';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PractitionerSearchForm = connect(
  {
    isPublicUser: props.isPublicUser,
    practitionerSearchFormHelper: state.practitionerSearchFormHelper,
  },
  function PractitionerSearchForm({
    isPublicUser,
    practitionerSearchFormHelper,
  }) {
    return (
      <>
        {!isPublicUser && practitionerSearchFormHelper.showAddPractitioner && (
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
        <div
          className="grid-row grid-gap-6"
          data-testid="practitioner-search-container"
        >
          <div className="grid-col-6 right-gray-border">
            <PractitionerSearchByName />
          </div>

          <div className="grid-col-6">
            <PractitionerSearchByBarNumber
              isPublicUser={isPublicUser}
            ></PractitionerSearchByBarNumber>
          </div>
        </div>
      </>
    );
  },
);

PractitionerSearchForm.displayName = 'PractitionerSearchForm';

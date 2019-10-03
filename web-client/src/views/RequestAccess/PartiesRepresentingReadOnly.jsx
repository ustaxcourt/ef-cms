import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PartiesRepresentingReadOnly = connect(
  {
    chooseWizardStepSequence: sequences.chooseWizardStepSequence,
    form: state.form,
    formattedCaseDetail: state.formattedCaseDetail,
  },
  ({ chooseWizardStepSequence, form, formattedCaseDetail }) => {
    return (
      <React.Fragment>
        <div className="margin-top-4">
          <h2 className="header-with-link-button">
            Parties You’re Representing
          </h2>
          <Button
            link
            icon="edit"
            onClick={() => chooseWizardStepSequence({ value: 'RequestAccess' })}
          >
            Edit
          </Button>
        </div>
        <div className="blue-container no-margin-last-child">
          <div className="usa-form-group">
            <label className="usa-label" htmlFor="filing-parties">
              Parties
            </label>
            <ul className="ustc-unstyled-list without-margins">
              {form.representingPrimary && (
                <li>{formattedCaseDetail.contactPrimary.name}</li>
              )}
              {form.representingSecondary && (
                <li>{formattedCaseDetail.contactSecondary.name}</li>
              )}
            </ul>
          </div>
        </div>
      </React.Fragment>
    );
  },
);

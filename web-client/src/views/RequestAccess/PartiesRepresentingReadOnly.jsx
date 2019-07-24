import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PartiesRepresentingReadOnly = connect(
  {
    caseDetail: state.formattedCaseDetail,
    chooseWizardStepSequence: sequences.chooseWizardStepSequence,
    form: state.form,
  },
  ({ caseDetail, chooseWizardStepSequence, form }) => {
    return (
      <React.Fragment>
        <div className="margin-top-4">
          <h2 className="header-with-link-button">
            Parties You’re Representing
          </h2>
          <button
            className="usa-button usa-button--unstyled margin-left-205"
            type="button"
            onClick={() => chooseWizardStepSequence({ value: 'RequestAccess' })}
          >
            <FontAwesomeIcon icon="edit" size="sm" />
            Edit
          </button>
        </div>
        <div className="blue-container no-margin-last-child">
          <div className="usa-form-group">
            <label className="usa-label" htmlFor="filing-parties">
              Parties
            </label>
            <ul className="ustc-unstyled-list without-margins">
              {form.representingPrimary && (
                <li>{caseDetail.contactPrimary.name}</li>
              )}
              {form.representingSecondary && (
                <li>{caseDetail.contactSecondary.name}</li>
              )}
            </ul>
          </div>
        </div>
      </React.Fragment>
    );
  },
);

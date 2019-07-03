import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PartiesFilingReadOnly = connect(
  {
    caseDetail: state.formattedCaseDetail,
    chooseWizardStepSequence: sequences.chooseWizardStepSequence,
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
  },
  ({ caseDetail, chooseWizardStepSequence, fileDocumentHelper, form }) => {
    return (
      <React.Fragment>
        <h2 className="header-with-link-button margin-top-4">
          Parties Filing This Document{' '}
          <button
            className="usa-button usa-button--unstyled margin-left-205"
            type="button"
            onClick={() => chooseWizardStepSequence({ value: 'FileDocument' })}
          >
            <FontAwesomeIcon icon="edit" size="sm" />
            Edit
          </button>
        </h2>
        <div className="blue-container">
          <div className="usa-form-group margin-bottom-0">
            <label className="usa-label" htmlFor="filing-parties">
              Filing Parties
            </label>
            <ul className="ustc-unstyled-list without-margins">
              {form.partyPractitioner && (
                <li>Myself as Petitioner’s Counsel</li>
              )}
              {form.partyPrimary && (
                <li>{fileDocumentHelper.partyPrimaryLabel}</li>
              )}
              {form.partySecondary && (
                <li>{caseDetail.contactSecondary.name}</li>
              )}
              {form.partyRespondent && <li>Respondent</li>}
            </ul>
          </div>
        </div>
      </React.Fragment>
    );
  },
);

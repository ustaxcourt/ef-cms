import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PartiesRepresentingReadOnly = connect(
  {
    caseDetail: state.formattedCaseDetail,
    chooseWizardStepSequence: sequences.chooseWizardStepSequence,
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
  },
  ({ caseDetail, chooseWizardStepSequence, fileDocumentHelper, form }) => {
    return (
      <React.Fragment>
        <h3 className="header-with-link-button">Parties You’re Representing</h3>
        <button
          className="link push-right"
          type="button"
          onClick={() => chooseWizardStepSequence({ value: 'RequestAccess' })}
        >
          <FontAwesomeIcon icon="edit" size="sm" />
          Edit
        </button>
        <div className="blue-container">
          <div className="ustc-form-group">
            <label htmlFor="filing-parties">Parties</label>
            <ul className="ustc-unstyled-list without-margins">
              {form.partyPrimary && (
                <li>{fileDocumentHelper.partyPrimaryLabel}</li>
              )}
              {form.partySecondary && (
                <li>{caseDetail.contactSecondary.name}</li>
              )}
            </ul>
          </div>
        </div>
      </React.Fragment>
    );
  },
);

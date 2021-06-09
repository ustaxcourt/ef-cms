import { AddIrsPractitionerModal } from './AddIrsPractitionerModal';
import { AddressDisplay } from './AddressDisplay';
import { Button } from '../../ustc-ui/Button/Button';
import { EditIrsPractitionersModal } from './EditIrsPractitionersModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { RespondentExistsModal } from './RespondentExistsModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

const RespondentInformation = connect(
  {
    caseDetailHelper: state.caseDetailHelper,
    caseInformationHelper: state.caseInformationHelper,
    form: state.form,
    formattedCaseDetail: state.formattedCaseDetail,
    openAddIrsPractitionerModalSequence:
      sequences.openAddIrsPractitionerModalSequence,
    openEditIrsPractitionersModalSequence:
      sequences.openEditIrsPractitionersModalSequence,
    showModal: state.modal.showModal,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
  },
  function RespondentInformation({
    caseDetailHelper,
    caseInformationHelper,
    form,
    formattedCaseDetail,
    openAddIrsPractitionerModalSequence,
    openEditIrsPractitionersModalSequence,
    showModal,
    updateFormValueSequence,
    validationErrors,
  }) {
    const respondentPartyInformation = () => (
      <div className="grid-container padding-x-0">
        <div className="grid-row">
          {formattedCaseDetail.irsPractitioners &&
            formattedCaseDetail.irsPractitioners.map((respondent, index) => (
              <div
                className={classNames(
                  'tablet:grid-col-3 counsel-information',
                  index > 3 && 'margin-top-3',
                )}
                key={respondent.name}
              >
                <address aria-labelledby="respondent-label">
                  {respondent.name && (
                    <AddressDisplay
                      showEmail
                      contact={{
                        ...respondent,
                        ...respondent.contact,
                      }}
                      nameOverride={respondent.name}
                    />
                  )}
                </address>
                {respondent.serviceIndicator && (
                  <div className="margin-top-4">
                    <span className="semi-bold">Service: </span>
                    {respondent.serviceIndicator}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    );

    const respondentSearch = () => (
      <>
        <div className="grid-col-3 text-right">
          <span
            className="label margin-right-4 margin-top-05"
            id="respondent-counsel-search-description"
          >
            Add counsel
          </span>
        </div>
        <div className="grid-col-3 margin-top-neg-05">
          <FormGroup
            className="margin-bottom-0"
            errorText={validationErrors.respondentSearchError}
          >
            <form
              className="usa-search"
              onSubmit={e => {
                e.preventDefault();
                openAddIrsPractitionerModalSequence();
              }}
            >
              <div role="search">
                <label
                  className="usa-sr-only"
                  htmlFor="respondent-search-field"
                >
                  Search
                </label>
                <input
                  aria-describedby="respondent-counsel-search-description"
                  className={classNames(
                    'usa-input margin-bottom-0',
                    validationErrors.respondentSearchError &&
                      'usa-input--error',
                  )}
                  id="respondent-search-field"
                  name="respondentSearch"
                  placeholder="Enter bar no. or name"
                  type="search"
                  value={form.respondentSearch || ''}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
                <button
                  className="usa-button"
                  id="search-for-respondent"
                  type="submit"
                >
                  <span className="usa-search__submit-text">Search</span>
                </button>
              </div>
            </form>
          </FormGroup>
        </div>
      </>
    );

    return (
      <>
        <div className="subsection party-information">
          <div className="card">
            <div className="content-wrapper">
              <div className="grid-row header-row">
                <div className="grid-col-6 display-flex" id="respondent-label">
                  <h3>Respondent Counsel</h3>
                  {caseInformationHelper.showEditIrsPractitioners && (
                    <Button
                      link
                      className="margin-left-205 padding-0 height-3"
                      id="edit-irsPractitioners-button"
                      onClick={() => openEditIrsPractitionersModalSequence()}
                    >
                      <FontAwesomeIcon icon="edit" size="sm" />
                      Edit
                    </Button>
                  )}
                </div>
                {caseInformationHelper.showAddCounsel && respondentSearch()}
              </div>
              {caseDetailHelper.hasIrsPractitioners &&
                respondentPartyInformation()}

              {!caseDetailHelper.hasIrsPractitioners && (
                <span>
                  There is no respondent counsel associated with this case.
                </span>
              )}
            </div>
          </div>
        </div>

        {showModal === 'AddIrsPractitionerModal' && <AddIrsPractitionerModal />}
        {showModal === 'EditIrsPractitionersModal' && (
          <EditIrsPractitionersModal />
        )}
        {showModal === 'RespondentExistsModal' && <RespondentExistsModal />}
      </>
    );
  },
);

export { RespondentInformation };

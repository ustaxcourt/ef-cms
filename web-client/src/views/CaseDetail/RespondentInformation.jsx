import { AddRespondentModal } from './AddRespondentModal';
import { Button } from '../../ustc-ui/Button/Button';
import { EditRespondentsModal } from './EditRespondentsModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { RespondentExistsModal } from './RespondentExistsModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

const AddressDisplay = (contact, constants, { nameOverride } = {}) => {
  return (
    <React.Fragment>
      <p className="margin-top-0 address-name">
        {nameOverride || contact.name}{' '}
        {contact.barNumber && `(${contact.barNumber})`}
        {contact.inCareOf && (
          <span>
            <br />
            c/o {contact.inCareOf}
          </span>
        )}
      </p>
      <p>
        <span className="address-line">{contact.address1}</span>
        {contact.address2 && (
          <span className="address-line">{contact.address2}</span>
        )}
        {contact.address3 && (
          <span className="address-line">{contact.address3}</span>
        )}
        <span className="address-line">
          {contact.city && `${contact.city}, `}
          {contact.state} {contact.postalCode}
        </span>
        {contact.countryType === constants.COUNTRY_TYPES.INTERNATIONAL && (
          <span className="address-line">{contact.country}</span>
        )}
        {contact.phone && (
          <span className="address-line margin-top-1">{contact.phone}</span>
        )}
      </p>
    </React.Fragment>
  );
};

const RespondentInformation = connect(
  {
    caseDetailHelper: state.caseDetailHelper,
    caseInformationHelper: state.caseInformationHelper,
    constants: state.constants,
    form: state.form,
    formattedCaseDetail: state.formattedCaseDetail,
    openAddRespondentModalSequence: sequences.openAddRespondentModalSequence,
    openEditRespondentsModalSequence:
      sequences.openEditRespondentsModalSequence,
    showModal: state.showModal,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
  },
  ({
    caseDetailHelper,
    caseInformationHelper,
    constants,
    form,
    formattedCaseDetail,
    openAddRespondentModalSequence,
    openEditRespondentsModalSequence,
    showModal,
    updateFormValueSequence,
    validationErrors,
  }) => {
    const respondentPartyInformation = () => (
      <div className="grid-container padding-x-0">
        <div className="grid-row">
          {formattedCaseDetail.respondents &&
            formattedCaseDetail.respondents.map((respondent, index) => (
              <div
                className={classNames(
                  'tablet:grid-col-3',
                  index > 3 && 'margin-top-3',
                )}
                key={index}
              >
                <address aria-labelledby="respondent-label">
                  {respondent.name &&
                    AddressDisplay(
                      {
                        ...respondent,
                        ...respondent.contact,
                      },
                      constants,
                      {
                        nameOverride: respondent.name,
                      },
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
            Add Counsel
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
                openAddRespondentModalSequence();
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
                  placeholder="Enter Bar No. or Name"
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
        {caseDetailHelper.showRespondentSection && (
          <div className="subsection party-information">
            <div className="card">
              <div className="content-wrapper">
                <div className="grid-row header-row">
                  <div className="grid-col-6 display-flex" id="secondary-label">
                    <h3>Respondent Counsel</h3>
                    {caseInformationHelper.showEditRespondents && (
                      <Button
                        link
                        className="margin-left-205 padding-0 height-3"
                        id="edit-respondents-button"
                        onClick={() => openEditRespondentsModalSequence()}
                      >
                        <FontAwesomeIcon icon="edit" size="sm" />
                        Edit
                      </Button>
                    )}
                  </div>
                  {caseInformationHelper.showAddCounsel && respondentSearch()}
                </div>
                {respondentPartyInformation()}
              </div>
            </div>
          </div>
        )}
        {showModal === 'AddRespondentModal' && <AddRespondentModal />}
        {showModal === 'EditRespondentsModal' && <EditRespondentsModal />}
        {showModal === 'RespondentExistsModal' && <RespondentExistsModal />}
      </>
    );
  },
);

export { AddressDisplay, RespondentInformation };

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const FileDocument = connect(
  {
    caseDetail: state.formattedCaseDetail,
    chooseWizardStepSequence: sequences.chooseWizardStepSequence,
    constants: state.constants,
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  ({
    caseDetail,
    chooseWizardStepSequence,
    constants,
    form,
    updateFormValueSequence,
    fileDocumentHelper,
  }) => {
    return (
      <React.Fragment>
        <h2 tabIndex="-1" id="file-a-document-header">
          File a Document
        </h2>
        <p>All fields required unless otherwise noted</p>
        <div>
          <h3 className="type-of-document">Type of Document You’re Filing</h3>
          <button
            className="link"
            type="button"
            onClick={() =>
              chooseWizardStepSequence({ value: 'SelectDocumentType' })
            }
          >
            <FontAwesomeIcon icon="edit" size="sm" />
            Edit
          </button>
        </div>
        <div className="blue-container">
          <FontAwesomeIcon icon={['far', 'file-alt']} />
          <h4 className="file-name">{form.documentTitle}</h4>
        </div>

        <h3>Tell Us About the {form.documentTitle}</h3>
        <div className="blue-container">
          <div className="usa-grid-full">
            <div className="usa-width-seven-twelfths push-right">
              <div id="document-upload-hint" className="alert-gold">
                <span className="usa-form-hint">
                  <FontAwesomeIcon
                    icon={['far', 'arrow-alt-circle-left']}
                    className="fa-icon-gold"
                    size="sm"
                  />
                  Remember to remove or redact all personal information (such as
                  Social Security Numbers, Taxpayer Identification Numbers, or
                  Employer Identification Numbers) from your documents.
                </span>
              </div>
            </div>

            <div className="usa-width-five-twelfths">
              <div className="ustc-form-group">
                <label htmlFor="primary-document" className="inline-block mr-1">
                  Upload Your Document
                </label>
                <input
                  id="primary-document"
                  type="file"
                  accept=".pdf"
                  aria-describedby="petition-hint"
                  name="primaryDocument"
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.files[0],
                    });
                  }}
                />
              </div>

              <div className="ustc-form-group">
                <fieldset className="usa-fieldset-inputs usa-sans">
                  <legend>
                    Does Your Filing Include A Certificate of Service?
                  </legend>
                  <ul className="usa-unstyled-list">
                    {['Yes', 'No'].map(option => (
                      <li key={option}>
                        <input
                          id={`certificate-${option}`}
                          type="radio"
                          name="certificateOfService"
                          value={option}
                          onChange={e => {
                            updateFormValueSequence({
                              key: e.target.name,
                              value: e.target.value === 'Yes',
                            });
                          }}
                        />
                        <label htmlFor={`certificate-${option}`}>
                          {option}
                        </label>
                      </li>
                    ))}
                  </ul>
                </fieldset>
              </div>

              {form.certificateOfService && (
                <div className="ustc-form-group">
                  <fieldset>
                    <legend>Service Date</legend>
                    <div className="usa-date-of-birth">
                      <div className="usa-form-group usa-form-group-month">
                        <label htmlFor="service-date-month">MM</label>
                        <input
                          className="usa-input-inline"
                          id="service-date-month"
                          name="month"
                          type="number"
                          min="1"
                          max="12"
                        />
                      </div>
                      <div className="usa-form-group usa-form-group-day">
                        <label htmlFor="service-date-day">DD</label>
                        <input
                          className="usa-input-inline"
                          id="service-date-day"
                          name="day"
                          type="number"
                          min="1"
                          max="31"
                        />
                      </div>
                      <div className="usa-form-group usa-form-group-year">
                        <label htmlFor="service-date-year">YYYY</label>
                        <input
                          className="usa-input-inline"
                          id="service-date-year"
                          name="year"
                          type="number"
                          min="1900"
                          max="2000"
                        />
                      </div>
                    </div>
                  </fieldset>
                </div>
              )}

              <div className="ustc-form-group">
                <fieldset className="usa-fieldset-inputs usa-sans">
                  <legend>Does Your Filing Include Exhibits?</legend>
                  <ul className="usa-unstyled-list">
                    {['Yes', 'No'].map(option => (
                      <li key={option}>
                        <input
                          id={`exhibits-${option}`}
                          type="radio"
                          name="exhibits"
                          value={option}
                          onChange={e => {
                            updateFormValueSequence({
                              key: e.target.name,
                              value: e.target.value === 'Yes',
                            });
                          }}
                        />
                        <label htmlFor={`exhibits-${option}`}>{option}</label>
                      </li>
                    ))}
                  </ul>
                </fieldset>
              </div>

              <div className="ustc-form-group">
                <fieldset className="usa-fieldset-inputs usa-sans">
                  <legend>Does Your Filing Include Attachments?</legend>
                  <ul className="usa-unstyled-list">
                    {['Yes', 'No'].map(option => (
                      <li key={option}>
                        <input
                          id={`attachments-${option}`}
                          type="radio"
                          name="attachments"
                          value={option}
                          onChange={e => {
                            updateFormValueSequence({
                              key: e.target.name,
                              value: e.target.value === 'Yes',
                            });
                          }}
                        />
                        <label htmlFor={`attachments-${option}`}>
                          {option}
                        </label>
                      </li>
                    ))}
                  </ul>
                </fieldset>
              </div>

              <div className="ustc-form-group">
                <fieldset className="usa-fieldset-inputs usa-sans">
                  <legend>Are There Any Objections to This Document?</legend>
                  <ul className="usa-unstyled-list">
                    {['Yes', 'No', 'Unknown'].map(option => (
                      <li key={option}>
                        <input
                          id={`objections-${option}`}
                          type="radio"
                          name="objections"
                          value={option}
                          onChange={e => {
                            updateFormValueSequence({
                              key: e.target.name,
                              value: e.target.value === 'Yes',
                            });
                          }}
                        />
                        <label htmlFor={`objections-${option}`}>{option}</label>
                      </li>
                    ))}
                  </ul>
                </fieldset>
              </div>

              <div className="ustc-form-group">
                <fieldset className="usa-fieldset-inputs usa-sans">
                  <legend>
                    Do You Have Any Supporting Documents for This Filing?
                  </legend>
                  <ul className="usa-unstyled-list">
                    {['Yes', 'No'].map(option => (
                      <li key={option}>
                        <input
                          id={`supporting-documents-${option}`}
                          type="radio"
                          name="supportingDocuments"
                          value={option}
                          onChange={e => {
                            updateFormValueSequence({
                              key: e.target.name,
                              value: e.target.value === 'Yes',
                            });
                          }}
                        />
                        <label htmlFor={`supporting-documents-${option}`}>
                          {option}
                        </label>
                      </li>
                    ))}
                  </ul>
                </fieldset>
              </div>

              {form.supportingDocuments && (
                <div className="ustc-form-group">
                  <label htmlFor="supporting-document">
                    Select Supporting Document
                  </label>
                  <select
                    name="supportingDocument"
                    id="supporting-document"
                    aria-label="category"
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                    value={form.supportingDocument}
                  >
                    <option value="">- Select -</option>
                    {constants.CATEGORY_MAP['Supporting Document'].map(
                      entry => {
                        return (
                          <option
                            key={entry.documentType}
                            value={entry.documentType}
                          >
                            {entry.documentType}
                          </option>
                        );
                      },
                    )}
                  </select>
                </div>
              )}

              {fileDocumentHelper.showSupportingDocumentFreeText && (
                <div className="ustc-form-group">
                  <label htmlFor="supporting-document-free-text">
                    Supporting Document Signed By
                  </label>
                  <input
                    id="supporting-document-free-text"
                    type="text"
                    name="supportingDocumentFreeText"
                    autoCapitalize="none"
                    value={form.supportingDocumentFreeText}
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
              )}

              {fileDocumentHelper.showSupportingDocumentUpload && (
                <div className="ustc-form-group">
                  <label
                    htmlFor="supporting-document"
                    className="inline-block mr-1"
                  >
                    Upload Your Supporting Document
                  </label>
                  <input
                    id="supporting-document"
                    type="file"
                    accept=".pdf"
                    aria-describedby="petition-hint"
                    name="supportingDocument"
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {form.secondaryDocument.documentTitle && (
          <>
            <h3>Tell Us About the {form.secondaryDocument.documentTitle}</h3>
            <div className="blue-container">
              <div className="usa-grid-full">
                <div className="usa-width-seven-twelfths push-right">
                  <div id="document-upload-hint" className="alert-gold">
                    <span className="usa-form-hint">
                      <FontAwesomeIcon
                        icon={['far', 'arrow-alt-circle-left']}
                        className="fa-icon-gold"
                        size="sm"
                      />
                      Remember to remove or redact all personal information
                      (such as Social Security Numbers, Taxpayer Identification
                      Numbers, or Employer Identification Numbers) from your
                      documents.
                    </span>
                  </div>
                </div>

                <div className="usa-width-five-twelfths">
                  <div className="ustc-form-group">
                    <label
                      htmlFor="primary-document"
                      className="inline-block mr-1"
                    >
                      Upload Your Document
                    </label>
                    <input
                      id="secondary-document"
                      type="file"
                      accept=".pdf"
                      aria-describedby="petition-hint"
                      name="secondaryDocument"
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    />
                  </div>

                  <div className="ustc-form-group">
                    <fieldset className="usa-fieldset-inputs usa-sans">
                      <legend>
                        Do You Have Any Supporting Documents for This Filing?
                      </legend>
                      <ul className="usa-unstyled-list">
                        {['Yes', 'No'].map(option => (
                          <li key={option}>
                            <input
                              id={`secondary-supporting-documents-${option}`}
                              type="radio"
                              name="secondarySupportingDocuments"
                              value={option}
                              onChange={e => {
                                updateFormValueSequence({
                                  key: e.target.name,
                                  value: e.target.value === 'Yes',
                                });
                              }}
                            />
                            <label
                              htmlFor={`secondary-supporting-documents-${option}`}
                            >
                              {option}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </fieldset>
                  </div>

                  {form.secondarySupportingDocuments && (
                    <div className="ustc-form-group">
                      <label htmlFor="secondary-supporting-document">
                        Select Supporting Document
                      </label>
                      <select
                        name="secondarySupportingDocument"
                        id="secondary-supporting-document"
                        aria-label="category"
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                        value={form.secondarySupportingDocument}
                      >
                        <option value="">- Select -</option>
                        {constants.CATEGORY_MAP['Supporting Document'].map(
                          entry => {
                            return (
                              <option
                                key={entry.documentType}
                                value={entry.documentType}
                              >
                                {entry.documentType}
                              </option>
                            );
                          },
                        )}
                      </select>
                    </div>
                  )}

                  {fileDocumentHelper.showSecondarySupportingDocumentFreeText && (
                    <div className="ustc-form-group">
                      <label htmlFor="secondary-supporting-document-free-text">
                        Supporting Document Signed By
                      </label>
                      <input
                        id="secondary-supporting-document-free-text"
                        type="text"
                        name="secondarySupportingDocumentFreeText"
                        autoCapitalize="none"
                        value={form.secondarySupportingDocumentFreeText}
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                    </div>
                  )}

                  {fileDocumentHelper.showSecondarySupportingDocumentUpload && (
                    <div className="ustc-form-group">
                      <label
                        htmlFor="secondary-supporting-document"
                        className="inline-block mr-1"
                      >
                        Upload Your Supporting Document
                      </label>
                      <input
                        id="secondary-supporting-document"
                        type="file"
                        accept=".pdf"
                        name="secondarySupportingDocument"
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.files[0],
                          });
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        <h3>Tell Us About the Parties Filing This Document</h3>
        <div className="blue-container">
          <fieldset className="usa-fieldset-inputs usa-sans">
            <legend>Who Is Filing This Document?</legend>
            <p>Check all that apply.</p>
            <ul className="ustc-vertical-option-list">
              <li>
                <input
                  id="party-primary"
                  type="checkbox"
                  name="partyPrimary"
                  value="Myself"
                  checked="checked"
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
                <label htmlFor="party-primary">Myself</label>
              </li>
              {fileDocumentHelper.showSecondaryParty && (
                <li>
                  <input
                    id="party-secondary"
                    type="checkbox"
                    name="partySecondary"
                    value={caseDetail.contactSecondary.name}
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                  <label htmlFor="party-secondary">
                    {caseDetail.contactSecondary.name}
                  </label>
                </li>
              )}
              <li>
                <input
                  id="party-respondent"
                  type="checkbox"
                  name="partyRespondent"
                  value="Respondent"
                />
                <label htmlFor="party-respondent">Respondent</label>
              </li>
            </ul>
          </fieldset>
        </div>

        <div className="button-box-container">
          <button id="submit-document" type="submit" className="usa-button">
            Review Filing
          </button>
          <button
            type="button"
            className="usa-button-secondary"
            onClick={() => {}}
          >
            Cancel
          </button>
        </div>
      </React.Fragment>
    );
  },
);

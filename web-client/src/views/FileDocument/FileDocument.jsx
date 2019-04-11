import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const FileDocument = connect(
  {
    caseDetail: state.formattedCaseDetail,
    chooseWizardStepSequence: sequences.chooseWizardStepSequence,
    fileDocumentHelper: state.fileDocumentHelper,
    form: state.form,
    submitExternalDocumentInformationSequence:
      sequences.submitExternalDocumentInformationSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateExternalDocumentInformationSequence:
      sequences.validateExternalDocumentInformationSequence,
    validationErrors: state.validationErrors,
  },
  ({
    caseDetail,
    chooseWizardStepSequence,
    form,
    updateFormValueSequence,
    fileDocumentHelper,
    submitExternalDocumentInformationSequence,
    validateExternalDocumentInformationSequence,
    validationErrors,
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
                <span className="usa-form-hint ustc-form-hint-with-svg">
                  <FontAwesomeIcon
                    icon={['far', 'arrow-alt-circle-left']}
                    className="fa-icon-gold"
                    size="lg"
                  />
                  Remember to remove or redact all personal information (such as
                  Social Security Numbers, Taxpayer Identification Numbers, or
                  Employer Identification Numbers) from your documents.
                </span>
              </div>
            </div>

            <div className="usa-width-five-twelfths">
              <div
                className={`ustc-form-group ${
                  validationErrors.primaryDocumentFile ? 'usa-input-error' : ''
                }`}
              >
                <label
                  htmlFor="primary-document"
                  className={
                    'ustc-upload ' +
                    (fileDocumentHelper.showPrimaryDocumentValid
                      ? 'validated'
                      : '')
                  }
                >
                  Upload Your Document{' '}
                  <span className="success-message">
                    <FontAwesomeIcon icon="check-circle" size="sm" />
                  </span>
                </label>
                <input
                  id="primary-document"
                  type="file"
                  accept=".pdf"
                  name="primaryDocumentFile"
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.files[0],
                    });
                    validateExternalDocumentInformationSequence();
                  }}
                />
                <Text
                  className="usa-input-error-message"
                  bind="validationErrors.primaryDocumentFile"
                />
              </div>

              <div className="ustc-form-group">
                <fieldset
                  className={
                    'usa-fieldset-inputs usa-sans ' +
                    (validationErrors.certificateOfService
                      ? 'usa-input-error'
                      : '')
                  }
                >
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
                            validateExternalDocumentInformationSequence();
                          }}
                        />
                        <label htmlFor={`certificate-${option}`}>
                          {option}
                        </label>
                      </li>
                    ))}
                  </ul>
                </fieldset>
                <Text
                  className="usa-input-error-message"
                  bind="validationErrors.certificateOfService"
                />
              </div>

              {form.certificateOfService && (
                <div
                  className={`ustc-form-group ${
                    validationErrors.certificateOfServiceDate
                      ? 'usa-input-error'
                      : ''
                  }`}
                >
                  <fieldset className="service-date">
                    <legend>Service Date</legend>
                    <div className="usa-date-of-birth">
                      <div className="usa-form-group usa-form-group-month">
                        <label htmlFor="service-date-month">MM</label>
                        <input
                          className="usa-input-inline"
                          id="service-date-month"
                          name="certificateOfServiceMonth"
                          type="number"
                          min="1"
                          max="12"
                          onChange={e => {
                            updateFormValueSequence({
                              key: e.target.name,
                              value: e.target.value,
                            });
                          }}
                          onBlur={() => {
                            validateExternalDocumentInformationSequence();
                          }}
                        />
                      </div>
                      <div className="usa-form-group usa-form-group-day">
                        <label htmlFor="service-date-day">DD</label>
                        <input
                          className="usa-input-inline"
                          id="service-date-day"
                          name="certificateOfServiceDay"
                          type="number"
                          min="1"
                          max="31"
                          onChange={e => {
                            updateFormValueSequence({
                              key: e.target.name,
                              value: e.target.value,
                            });
                          }}
                          onBlur={() => {
                            validateExternalDocumentInformationSequence();
                          }}
                        />
                      </div>
                      <div className="usa-form-group usa-form-group-year">
                        <label htmlFor="service-date-year">YYYY</label>
                        <input
                          className="usa-input-inline"
                          id="service-date-year"
                          name="certificateOfServiceYear"
                          type="number"
                          min="1900"
                          max="2000"
                          onChange={e => {
                            updateFormValueSequence({
                              key: e.target.name,
                              value: e.target.value,
                            });
                          }}
                          onBlur={() => {
                            validateExternalDocumentInformationSequence();
                          }}
                        />
                      </div>
                    </div>
                  </fieldset>
                  <Text
                    className="usa-input-error-message"
                    bind="validationErrors.certificateOfServiceDate"
                  />
                </div>
              )}

              <div className="ustc-form-group">
                <fieldset
                  className={
                    'usa-fieldset-inputs usa-sans ' +
                    (validationErrors.exhibits ? 'usa-input-error' : '')
                  }
                >
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
                            validateExternalDocumentInformationSequence();
                          }}
                        />
                        <label htmlFor={`exhibits-${option}`}>{option}</label>
                      </li>
                    ))}
                  </ul>
                </fieldset>
                <Text
                  className="usa-input-error-message"
                  bind="validationErrors.exhibits"
                />
              </div>

              <div className="ustc-form-group">
                <fieldset
                  className={
                    'usa-fieldset-inputs usa-sans ' +
                    (validationErrors.attachments ? 'usa-input-error' : '')
                  }
                >
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
                            validateExternalDocumentInformationSequence();
                          }}
                        />
                        <label htmlFor={`attachments-${option}`}>
                          {option}
                        </label>
                      </li>
                    ))}
                  </ul>
                </fieldset>
                <Text
                  className="usa-input-error-message"
                  bind="validationErrors.attachments"
                />
              </div>

              {fileDocumentHelper.showObjection && (
                <div className="ustc-form-group">
                  <fieldset
                    className={
                      'usa-fieldset-inputs usa-sans ' +
                      (validationErrors.objections ? 'usa-input-error' : '')
                    }
                  >
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
                                value: e.target.value,
                              });
                              validateExternalDocumentInformationSequence();
                            }}
                          />
                          <label htmlFor={`objections-${option}`}>
                            {option}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </fieldset>
                  <Text
                    className="usa-input-error-message"
                    bind="validationErrors.objections"
                  />
                </div>
              )}

              <div className="ustc-form-group">
                <fieldset
                  className={
                    'usa-fieldset-inputs usa-sans ' +
                    (validationErrors.hasSupportingDocuments
                      ? 'usa-input-error'
                      : '')
                  }
                >
                  <legend>
                    Do You Have Any Supporting Documents for This Filing?
                  </legend>
                  <ul className="usa-unstyled-list">
                    {['Yes', 'No'].map(option => (
                      <li key={option}>
                        <input
                          id={`supporting-documents-${option}`}
                          type="radio"
                          name="hasSupportingDocuments"
                          value={option}
                          onChange={e => {
                            updateFormValueSequence({
                              key: e.target.name,
                              value: e.target.value === 'Yes',
                            });
                            validateExternalDocumentInformationSequence();
                          }}
                        />
                        <label htmlFor={`supporting-documents-${option}`}>
                          {option}
                        </label>
                      </li>
                    ))}
                  </ul>
                </fieldset>
                <Text
                  className="usa-input-error-message"
                  bind="validationErrors.hasSupportingDocuments"
                />
              </div>

              {form.hasSupportingDocuments && (
                <div
                  className={`ustc-form-group ${
                    validationErrors.supportingDocument ? 'usa-input-error' : ''
                  }`}
                >
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
                      validateExternalDocumentInformationSequence();
                    }}
                    value={form.supportingDocument}
                  >
                    <option value="">- Select -</option>
                    {fileDocumentHelper.supportingDocumentTypeList.map(
                      entry => {
                        return (
                          <option
                            key={entry.documentType}
                            value={entry.documentType}
                          >
                            {entry.documentTypeDisplay}
                          </option>
                        );
                      },
                    )}
                  </select>
                  <Text
                    className="usa-input-error-message"
                    bind="validationErrors.supportingDocument"
                  />
                </div>
              )}

              {fileDocumentHelper.showSupportingDocumentFreeText && (
                <div
                  className={`ustc-form-group ${
                    validationErrors.supportingDocumentFreeText
                      ? 'usa-input-error'
                      : ''
                  }`}
                >
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
                    onBlur={() => {
                      validateExternalDocumentInformationSequence();
                    }}
                  />
                  <Text
                    className="usa-input-error-message"
                    bind="validationErrors.supportingDocumentFreeText"
                  />
                </div>
              )}

              {fileDocumentHelper.showSupportingDocumentUpload && (
                <div
                  className={`ustc-form-group ${
                    validationErrors.supportingDocumentFile
                      ? 'usa-input-error'
                      : ''
                  }`}
                >
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
                    name="supportingDocumentFile"
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                      validateExternalDocumentInformationSequence();
                    }}
                  />
                  <Text
                    className="usa-input-error-message"
                    bind="validationErrors.supportingDocumentFile"
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
                  <div
                    id="document-secondary-upload-hint"
                    className="alert-gold"
                  >
                    <span className="usa-form-hint ustc-form-hint-with-svg">
                      <FontAwesomeIcon
                        icon={['far', 'arrow-alt-circle-left']}
                        className="fa-icon-gold"
                        size="lg"
                      />
                      Remember to remove or redact all personal information
                      (such as Social Security Numbers, Taxpayer Identification
                      Numbers, or Employer Identification Numbers) from your
                      documents.
                    </span>
                  </div>
                </div>

                <div className="usa-width-five-twelfths">
                  <div
                    className={`ustc-form-group ${
                      validationErrors.secondaryDocumentFile
                        ? 'usa-input-error'
                        : ''
                    }`}
                  >
                    <label
                      htmlFor="secondary-document"
                      className={
                        'ustc-upload ' +
                        (fileDocumentHelper.showSecondaryDocumentValid
                          ? 'validated'
                          : '')
                      }
                    >
                      Upload Your Document{' '}
                      <span className="success-message">
                        <FontAwesomeIcon icon="check-circle" size="sm" />
                      </span>{' '}
                      {fileDocumentHelper.isSecondaryDocumentUploadOptional && (
                        <span className="usa-form-hint">(optional)</span>
                      )}
                    </label>
                    <input
                      id="secondary-document"
                      type="file"
                      accept=".pdf"
                      name="secondaryDocumentFile"
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                        validateExternalDocumentInformationSequence();
                      }}
                    />
                    <Text
                      className="usa-input-error-message"
                      bind="validationErrors.secondaryDocumentFile"
                    />
                  </div>

                  <div className="ustc-form-group">
                    <fieldset
                      className={
                        'usa-fieldset-inputs usa-sans ' +
                        (validationErrors.hasSecondarySupportingDocuments
                          ? 'usa-input-error'
                          : '')
                      }
                    >
                      <legend>
                        Do You Have Any Supporting Documents for This Filing?
                      </legend>
                      <ul className="usa-unstyled-list">
                        {['Yes', 'No'].map(option => (
                          <li key={option}>
                            <input
                              id={`secondary-supporting-documents-${option}`}
                              type="radio"
                              name="hasSecondarySupportingDocuments"
                              value={option}
                              onChange={e => {
                                updateFormValueSequence({
                                  key: e.target.name,
                                  value: e.target.value === 'Yes',
                                });
                                validateExternalDocumentInformationSequence();
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
                    <Text
                      className="usa-input-error-message"
                      bind="validationErrors.hasSecondarySupportingDocuments"
                    />
                  </div>

                  {form.hasSecondarySupportingDocuments && (
                    <div
                      className={`ustc-form-group ${
                        validationErrors.secondarySupportingDocument
                          ? 'usa-input-error'
                          : ''
                      }`}
                    >
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
                          validateExternalDocumentInformationSequence();
                        }}
                        value={form.secondarySupportingDocument}
                      >
                        <option value="">- Select -</option>
                        {fileDocumentHelper.supportingDocumentTypeList.map(
                          entry => {
                            return (
                              <option
                                key={entry.documentType}
                                value={entry.documentType}
                              >
                                {entry.documentTypeDisplay}
                              </option>
                            );
                          },
                        )}
                      </select>
                      <Text
                        className="usa-input-error-message"
                        bind="validationErrors.secondarySupportingDocument"
                      />
                    </div>
                  )}

                  {fileDocumentHelper.showSecondarySupportingDocumentFreeText && (
                    <div
                      className={`ustc-form-group ${
                        validationErrors.secondarySupportingDocumentFreeText
                          ? 'usa-input-error'
                          : ''
                      }`}
                    >
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
                        onBlur={() => {
                          validateExternalDocumentInformationSequence();
                        }}
                      />
                      <Text
                        className="usa-input-error-message"
                        bind="validationErrors.secondarySupportingDocumentFreeText"
                      />
                    </div>
                  )}

                  {fileDocumentHelper.showSecondarySupportingDocumentUpload && (
                    <div
                      className={`ustc-form-group ${
                        validationErrors.secondarySupportingDocumentFile
                          ? 'usa-input-error'
                          : ''
                      }`}
                    >
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
                        name="secondarySupportingDocumentFile"
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.files[0],
                          });
                          validateExternalDocumentInformationSequence();
                        }}
                      />
                      <Text
                        className="usa-input-error-message"
                        bind="validationErrors.secondarySupportingDocumentFile"
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
            <legend className="with-hint">Who Is Filing This Document?</legend>
            <span className="usa-form-hint">Check all that apply.</span>
            <ul className="ustc-vertical-option-list">
              <li>
                <input
                  id="party-primary"
                  type="checkbox"
                  name="partyPrimary"
                  value="Myself"
                  defaultChecked={true}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                    validateExternalDocumentInformationSequence();
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
                      validateExternalDocumentInformationSequence();
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
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                    validateExternalDocumentInformationSequence();
                  }}
                />
                <label htmlFor="party-respondent">Respondent</label>
              </li>
            </ul>
          </fieldset>
        </div>

        <div className="button-box-container">
          <button
            id="submit-document"
            type="submit"
            className="usa-button"
            onClick={() => {
              submitExternalDocumentInformationSequence();
            }}
          >
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

import { CourtIssuedNonstandardForm } from '@web-client/views/CourtIssuedDocketEntry/CourtIssuedNonstandardForm';
import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { SelectSearch } from '@web-client/ustc-ui/Select/SelectSearch';
import { connect } from '@web-client/presenter/shared.cerebral';
import { isMemberCase } from '@shared/business/entities/cases/Case';
import { reactSelectValue } from '@web-client/ustc-ui/Utils/documentTypeSelectHelper';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { Button } from '@web-client/ustc-ui/Button/Button';
import _ from 'lodash';
import { createISODateString } from '@shared/business/utilities/DateHandler';

export const EditDocketEntryMetaFormCourtIssued = connect(
  {
    DATE_FORMATS: state.constants.DATE_FORMATS,
    addCourtIssuedDocketEntryHelper: state.addCourtIssuedDocketEntryHelper,
    form: state.form,
    caseDetail: state.caseDetail,
    isFiledAcrossAllCases: state.isFiledAcrossAllCases,
    formatAndUpdateDateFromDatePickerSequence:
      sequences.formatAndUpdateDateFromDatePickerSequence,
    updateCourtIssuedDocketEntryFormValueSequence:
      sequences.updateCourtIssuedDocketEntryFormValueSequence,
    validateCourtIssuedDocketEntrySequence:
      sequences.validateCourtIssuedDocketEntrySequence,
    validateDocumentSequence: sequences.validateDocumentSequence,
    validationErrors: state.validationErrors,
  },
  function EditDocketEntryMetaFormCourtIssued({
    addCourtIssuedDocketEntryHelper,
    DATE_FORMATS,
    form,
    caseDetail,
    isFiledAcrossAllCases,
    formatAndUpdateDateFromDatePickerSequence,
    updateCourtIssuedDocketEntryFormValueSequence,
    validateCourtIssuedDocketEntrySequence,
    validateDocumentSequence,
    validationErrors,
  }) {
    const isDisabled =
      caseDetail && isMemberCase(caseDetail) && isFiledAcrossAllCases;

    return (
      <div className="blue-container">
        <DateSelector
          defaultValue={form.filingDate}
          errorText={validationErrors.filingDate}
          id="filing-date"
          label="Filed date"
          onChange={e => {
            formatAndUpdateDateFromDatePickerSequence({
              key: 'filingDate',
              toFormat: DATE_FORMATS.ISO,
              value: e.target.value,
            });
            validateDocumentSequence();
          }}
          disabled={isDisabled}
        />

        <FormGroup errorText={validationErrors.documentType}>
          <label
            className="usa-label"
            htmlFor="document-type"
            id="document-type-label"
          >
            Document type
          </label>
          {addCourtIssuedDocketEntryHelper.showDocumentTypeDropdown && (
            <SelectSearch
              aria-labelledby="document-type-label"
              data-testid="add-court-issued-document-type-search"
              id="document-type"
              isClearable={true}
              name="eventCode"
              options={addCourtIssuedDocketEntryHelper.documentTypes}
              value={reactSelectValue({
                documentTypes: addCourtIssuedDocketEntryHelper.documentTypes,
                selectedEventCode: form.eventCode,
              })}
              onChange={inputValue => {
                [
                  'documentType',
                  'documentTitle',
                  'eventCode',
                  'scenario',
                ].forEach(key =>
                  updateCourtIssuedDocketEntryFormValueSequence({
                    key,
                    value: inputValue ? inputValue[key] : '',
                  }),
                );
                validateCourtIssuedDocketEntrySequence();
              }}
              onInputChange={inputText => {
                updateCourtIssuedDocketEntryFormValueSequence({
                  key: 'searchText',
                  value: inputText,
                });
              }}
              isDisabled={isDisabled}
            />
          )}
          {!addCourtIssuedDocketEntryHelper.showDocumentTypeDropdown && (
            <span>{form.documentType}</span>
          )}
        </FormGroup>

        {form.eventCode && <CourtIssuedNonstandardForm />}

        {DocketEntry.isOrder(form.eventCode) && (
          <FormGroup errorText={validationErrors.dispositionOrder}>
            <fieldset className="usa-fieldset">
              {/* <legend className="usa-legend"></legend> */}
              <div className="usa-checkbox">
                <input
                  checked={
                    form.dispositionOrder || form.affectedDocketEntries || false
                  } // false if undefined
                  className="usa-checkbox__input"
                  id="dispositionOrder"
                  name="dispositionOrder"
                  type="checkbox"
                  onChange={e => {
                    updateCourtIssuedDocketEntryFormValueSequence({
                      key: e.target.name,
                      value: e.target.checked,
                    });
                    if (e.target.checked) {
                      updateCourtIssuedDocketEntryFormValueSequence({
                        key: 'affectedDocketEntries',
                        value: [{}],
                      });
                    } else {
                      updateCourtIssuedDocketEntryFormValueSequence({
                        key: 'affectedDocketEntries',
                        value: undefined,
                      });
                    }
                    validateCourtIssuedDocketEntrySequence();
                  }}
                />
                <label
                  className="usa-checkbox__label"
                  htmlFor="dispositionOrder"
                >
                  This order acts on at least one motion
                </label>
              </div>
            </fieldset>
          </FormGroup>
        )}
        {/* TODO (#8546): Fix this */}
        {DocketEntry.isOrder(form.eventCode) &&
          (form.dispositionOrder || form.affectedDocketEntries) && (
            <div>
              {form.affectedDocketEntries.map((motion, i) => {
                return (
                  <div key={motion.arrayKey}>
                    <FormGroup
                      errorText={
                        validationErrors[
                          `affectedDocketEntries-${i}-docketEntryId`
                        ]
                      }
                    >
                      <label
                        className="usa-label"
                        htmlFor="related-motion"
                        id="related-motion-label"
                      >
                        What motion is being acted on?
                      </label>
                      <SelectSearch
                        className="usa-label"
                        aria-labelledby="related-motion-label"
                        data-testid="related-motion-type-search"
                        id="docketEntryid"
                        isClearable={true}
                        name="docketEntryid"
                        options={addCourtIssuedDocketEntryHelper.caseMotions}
                        value={
                          motion.docketEntryId
                            ? {
                                label: _.filter(
                                  caseDetail.docketEntries,
                                  de =>
                                    de.docketEntryId === motion.docketEntryId,
                                )
                                  .map(m => `${m.index} - ${m.documentTitle}`)
                                  .at(0),
                                value: motion.docketEntryId,
                              }
                            : undefined
                        }
                        onChange={(inputValue: any) => {
                          updateCourtIssuedDocketEntryFormValueSequence({
                            key: 'affectedDocketEntries',
                            index: i,
                            value: Object.assign(
                              form.affectedDocketEntries[i],
                              {
                                docketEntryId: inputValue.value,
                              },
                            ),
                          });

                          validateCourtIssuedDocketEntrySequence();
                        }}
                      />
                    </FormGroup>
                    <FormGroup
                      errorText={
                        validationErrors[
                          `affectedDocketEntries-${i}-disposition`
                        ]
                      }
                    >
                      <label
                        className="usa-label"
                        htmlFor="related-motion-disposition"
                        id="related-motion-disposition-label"
                      >
                        What action is being taken?
                      </label>
                      <SelectSearch
                        aria-labelledby="related-motion-disposition-label"
                        data-testid="related-motion-disposition-type-search"
                        id="related-motion-disposition"
                        isClearable={true}
                        name="relatedMotionDisposition"
                        options={
                          addCourtIssuedDocketEntryHelper.relatedMotionDispositions
                        }
                        value={
                          motion.disposition
                            ? {
                                label: motion.disposition,
                                value: motion.disposition,
                              }
                            : undefined
                        }
                        onChange={(inputValue: any) => {
                          updateCourtIssuedDocketEntryFormValueSequence({
                            key: 'affectedDocketEntries',
                            index: i,
                            value: Object.assign(
                              form.affectedDocketEntries[i],
                              {
                                disposition: inputValue.value,
                              },
                            ),
                          });

                          validateCourtIssuedDocketEntrySequence();
                        }}
                      />

                      <Button
                        link
                        icon="minus-circle"
                        className="red-warning"
                        onClick={() => {
                          const motions = [...form.affectedDocketEntries];
                          _.pullAt(motions, i);
                          updateCourtIssuedDocketEntryFormValueSequence({
                            key: 'affectedDocketEntries',
                            value: motions,
                          });
                        }}
                      >
                        Remove Motion
                      </Button>

                      {form.affectedDocketEntries.length > 1 && <hr></hr>}
                    </FormGroup>
                  </div>
                );
              })}

              <Button
                link
                icon="plus-circle"
                onClick={() => {
                  updateCourtIssuedDocketEntryFormValueSequence({
                    key: 'affectedDocketEntries',
                    value: [
                      ...form.affectedDocketEntries,
                      { arrayKey: createISODateString() },
                    ],
                  });
                }}
              >
                Add new motion
              </Button>
            </div>
          )}

        <FormGroup errorText={validationErrors.attachments}>
          <fieldset className="usa-fieldset">
            <legend className="usa-legend">Inclusions</legend>
            <div className="usa-checkbox">
              <input
                checked={form.attachments}
                className="usa-checkbox__input"
                id="attachments"
                name="attachments"
                type="checkbox"
                onChange={e => {
                  updateCourtIssuedDocketEntryFormValueSequence({
                    key: e.target.name,
                    value: e.target.checked,
                  });
                  validateCourtIssuedDocketEntrySequence();
                }}
              />
              <label className="usa-checkbox__label" htmlFor="attachments">
                Attachment(s)
              </label>
            </div>
          </fieldset>
        </FormGroup>
        <hr />
        <div className="usa-form-group">
          <fieldset className="usa-fieldset">
            <legend className="usa-legend">Track document?</legend>
            <div className="usa-checkbox">
              <input
                checked={form.pending || false}
                className="usa-checkbox__input"
                id="pending"
                name="pending"
                type="checkbox"
                onChange={e => {
                  updateCourtIssuedDocketEntryFormValueSequence({
                    key: e.target.name,
                    value: e.target.checked,
                  });
                }}
              />
              <label className="usa-checkbox__label" htmlFor="pending">
                Add to pending report
              </label>
            </div>
          </fieldset>
        </div>
      </div>
    );
  },
);

EditDocketEntryMetaFormCourtIssued.displayName =
  'EditDocketEntryMetaFormCourtIssued';

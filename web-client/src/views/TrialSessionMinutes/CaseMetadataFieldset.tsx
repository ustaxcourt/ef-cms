import {
  AddRowHandler,
  AutoSaveHandler,
  OnChangeHandler,
} from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import {
  MINUTE_SHEET_FORM_SECTION_MAP,
  TRIAL_HEARING_OPTIONS,
} from '@shared/business/entities/EntityConstants';
import { MinuteSheetFormState } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import React from 'react';

export const CaseMetadataFieldset = ({
  addRowHandler,
  caseMetadataFormState,
  onBlurHandler,
  onChangeHandler,
}: {
  addRowHandler: AddRowHandler;
  onChangeHandler: OnChangeHandler;
  onBlurHandler: AutoSaveHandler;
  caseMetadataFormState: MinuteSheetFormState['caseMetadataSection'];
}) => {
  return (
    <fieldset className="grid-container border-0 padding-0">
      <div className="grid-row grid-gap align-items-center margin-bottom-1">
        <div className="grid-col-fill" style={{ minWidth: '100px' }}>
          <span className="usa-label margin-bottom-0">Calendar Called</span>
        </div>
        <div className="grid-col-auto">
          <FormGroup className="margin-bottom-0 display-flex align-items-center">
            <label
              className="margin-right-2 margin-bottom-0 display-inline-block"
              htmlFor="calledDate"
            >
              Date
            </label>
            <input
              className="usa-input"
              id="calledDate"
              data-testid="calledDate"
              name="calledDate"
              type="text"
              value={caseMetadataFormState.called.date}
              onBlur={() => onBlurHandler()}
              onChange={e =>
                onChangeHandler({
                  name: 'called',
                  rowInfo: {
                    key: 'date',
                  },
                  section: MINUTE_SHEET_FORM_SECTION_MAP.caseMetadataSection,
                  value: e.target.value,
                })
              }
            />
          </FormGroup>
        </div>
        <div className="grid-col-6">
          <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full">
            <label
              className="margin-right-2 margin-bottom-0 display-inline-block"
              htmlFor="calledNote"
            >
              Note
            </label>
            <input
              className="usa-input display-inline-block maxw-full"
              id="calledNote"
              data-testid="calledNote"
              name="calledNote"
              type="text"
              value={caseMetadataFormState.called.note}
              onBlur={() => onBlurHandler()}
              onChange={e =>
                onChangeHandler({
                  name: 'called',
                  rowInfo: {
                    key: 'note',
                  },
                  section: MINUTE_SHEET_FORM_SECTION_MAP.caseMetadataSection,
                  value: e.target.value,
                })
              }
            />
          </FormGroup>
        </div>
        <div className="grid-col-2">
          <FormGroup className="margin-bottom-0 display-inline-block align-items-center">
            <div className="usa-checkbox">
              <input
                aria-describedby="representing-legend"
                checked={caseMetadataFormState.called.transcriptOrdered}
                className="usa-checkbox__input"
                data-testid="calledTranscriptOrdered"
                id="calledTranscriptOrdered"
                name="calledTranscriptOrdered"
                type="checkbox"
                onBlur={() => onBlurHandler()}
                onChange={e =>
                  onChangeHandler({
                    name: 'called',
                    rowInfo: {
                      key: 'transcriptOrdered',
                    },
                    section: MINUTE_SHEET_FORM_SECTION_MAP.caseMetadataSection,
                    value: e.target.checked,
                  })
                }
              />
              <label
                className="usa-checkbox__label margin-0"
                htmlFor="calledTranscriptOrdered"
              >
                Transcript ordered
              </label>
            </div>
          </FormGroup>
        </div>
      </div>
      <div className="grid-row grid-gap align-items-center margin-bottom-1">
        <div className="grid-col-fill" style={{ minWidth: '100px' }}>
          <span className="usa-label margin-bottom-0">Not Called</span>
        </div>
        <div className="grid-col-auto">
          <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full">
            <label
              className="margin-right-2 margin-bottom-0 display-inline-block"
              htmlFor="notCalledDate"
            >
              Date
            </label>
            <input
              className="usa-input display-inline-block maxw-full"
              id="notCalledDate"
              data-testid="notCalledDate"
              name="notCalledDate"
              type="text"
              value={caseMetadataFormState.notCalled.date}
              onBlur={() => onBlurHandler()}
              onChange={e =>
                onChangeHandler({
                  name: 'notCalled',
                  rowInfo: {
                    key: 'date',
                  },
                  section: MINUTE_SHEET_FORM_SECTION_MAP.caseMetadataSection,
                  value: e.target.value,
                })
              }
            />
          </FormGroup>
        </div>
        <div className="grid-col-6">
          <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full">
            <label
              className="margin-right-2 margin-bottom-0 display-inline-block"
              htmlFor="notCalledNote"
            >
              Note
            </label>
            <input
              className="usa-input display-inline-block maxw-full"
              id="notCalledNote"
              name="notCalledNote"
              type="text"
              value={caseMetadataFormState.notCalled.note}
              onBlur={() => onBlurHandler()}
              onChange={e =>
                onChangeHandler({
                  name: 'notCalled',
                  rowInfo: {
                    key: 'note',
                  },
                  section: MINUTE_SHEET_FORM_SECTION_MAP.caseMetadataSection,
                  value: e.target.value,
                })
              }
            />
          </FormGroup>
        </div>
        <div className="grid-col-2"></div>
      </div>

      {Object.values(caseMetadataFormState.recalled).map((row, rowIndex) => {
        return (
          <div
            className="grid-row grid-gap align-items-center margin-bottom-1"
            key={row.renderKey}
          >
            <div className="grid-col-fill" style={{ minWidth: '100px' }}>
              {rowIndex === 0 && (
                <span className="usa-label margin-bottom-0">Re-called</span>
              )}
            </div>
            <div className="grid-col-auto">
              <FormGroup className="margin-bottom-0 display-flex align-items-center">
                <label
                  className="margin-right-2 margin-bottom-0 display-inline-block"
                  htmlFor={`reCalledDate-${row.renderKey}`}
                >
                  Date(s)
                </label>
                <input
                  className="usa-input"
                  id={`reCalledDate-${row.renderKey}`}
                  type="text"
                  value={row.date || ''}
                  onBlur={() => onBlurHandler()}
                  onChange={e =>
                    onChangeHandler({
                      name: 'recalled',
                      rowInfo: {
                        key: row.renderKey,
                        nestedName: 'date',
                      },
                      section:
                        MINUTE_SHEET_FORM_SECTION_MAP.caseMetadataSection,
                      value: e.target.value,
                    })
                  }
                />
              </FormGroup>
            </div>
            <div className="grid-col-6">
              <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full">
                <label
                  className="margin-right-2 margin-bottom-0 display-inline-block"
                  htmlFor="reCalledNote"
                >
                  Note
                </label>
                <input
                  className="usa-input display-inline-block maxw-full"
                  id="reCalledNote"
                  name="reCalledNote"
                  type="text"
                  value={caseMetadataFormState.recalled[row.renderKey].note}
                  onBlur={() => onBlurHandler()}
                  onChange={e =>
                    onChangeHandler({
                      name: 'recalled',
                      rowInfo: {
                        key: row.renderKey,
                        nestedName: 'note',
                      },
                      section:
                        MINUTE_SHEET_FORM_SECTION_MAP.caseMetadataSection,
                      value: e.target.value,
                    })
                  }
                />
              </FormGroup>
            </div>
            <div className="grid-col-2">
              <FormGroup className="margin-bottom-0 display-flex align-items-center">
                <div className="usa-checkbox">
                  <input
                    aria-describedby="representing-legend"
                    checked={
                      caseMetadataFormState.recalled[row.renderKey]
                        ?.transcriptOrdered
                    }
                    className="usa-checkbox__input"
                    id={`reCalledTranscriptOrdered-${rowIndex}`}
                    name={`reCalledTranscriptOrdered-${rowIndex}`}
                    type="checkbox"
                    onBlur={() => onBlurHandler()}
                    onChange={e => {
                      onChangeHandler({
                        name: 'recalled',
                        rowInfo: {
                          key: row.renderKey,
                          nestedName: 'transcriptOrdered',
                        },
                        section:
                          MINUTE_SHEET_FORM_SECTION_MAP.caseMetadataSection,
                        value: e.target.checked,
                      });
                    }}
                  />
                  <label
                    className="usa-checkbox__label margin-0"
                    htmlFor={`reCalledTranscriptOrdered-${rowIndex}`}
                  >
                    Transcript ordered
                  </label>
                </div>
              </FormGroup>
            </div>
            {Object.values(caseMetadataFormState.recalled).length - 1 ===
              rowIndex && (
              <>
                <div style={{ minWidth: '185px' }}></div>
                <div>
                  <Button
                    link
                    className="padding-0 margin-top-1"
                    icon="plus"
                    type="button"
                    onClick={e => {
                      e.preventDefault();
                      addRowHandler({
                        name: 'recalled',
                        section:
                          MINUTE_SHEET_FORM_SECTION_MAP.caseMetadataSection,
                      });
                    }}
                  >
                    Add Recall
                  </Button>
                </div>
              </>
            )}
          </div>
        );
      })}
      <div className="grid-row grid-gap align-items-center margin-bottom-1">
        <div className="grid-col-fill" style={{ minWidth: '100px' }}>
          <span className="usa-label margin-bottom-0">Pretrial conference</span>
        </div>
        <div className="grid-col-auto">
          <FormGroup className="flex-justify-end margin-bottom-0 display-flex align-items-center">
            <label
              className="margin-right-2 margin-bottom-0 display-inline-block"
              htmlFor="pretrialConferenceDate"
            >
              Date(s)
            </label>
            <input
              className="usa-input"
              id="pretrialConferenceDate"
              type="text"
              value={caseMetadataFormState.pretrialConference.date || ''}
              onBlur={() => onBlurHandler()}
              onChange={e =>
                onChangeHandler({
                  name: 'pretrialConference',
                  rowInfo: {
                    key: 'date',
                  },
                  section: MINUTE_SHEET_FORM_SECTION_MAP.caseMetadataSection,
                  value: e.target.value,
                })
              }
            />
          </FormGroup>
        </div>
        <div className="grid-col-6">
          <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full">
            <label
              className="margin-right-2 margin-bottom-0 display-inline-block"
              htmlFor="pretrialConferenceNote"
            >
              Note
            </label>
            <input
              className="usa-input display-inline-block maxw-full"
              id="pretrialConferenceNote"
              name="pretrialConferenceNote"
              type="text"
              value={caseMetadataFormState.pretrialConference.note}
              onBlur={() => onBlurHandler()}
              onChange={e =>
                onChangeHandler({
                  name: 'pretrialConference',
                  rowInfo: {
                    key: 'note',
                  },
                  section: MINUTE_SHEET_FORM_SECTION_MAP.caseMetadataSection,
                  value: e.target.value,
                })
              }
            />
          </FormGroup>
        </div>
        <div className="grid-col-2">
          <FormGroup className="margin-bottom-0 display-flex align-items-center">
            <div className="usa-checkbox">
              <input
                aria-describedby="representing-legend"
                checked={
                  caseMetadataFormState.pretrialConference.transcriptOrdered
                }
                className="usa-checkbox__input"
                id="pretrialConferenceTranscriptOrdered"
                name="pretrialConferenceTranscriptOrdered"
                type="checkbox"
                onBlur={() => onBlurHandler()}
                onChange={e => {
                  onChangeHandler({
                    name: 'pretrialConference',
                    rowInfo: {
                      key: 'transcriptOrdered',
                    },
                    section: MINUTE_SHEET_FORM_SECTION_MAP.caseMetadataSection,
                    value: e.target.checked,
                  });
                }}
              />
              <label
                className="usa-checkbox__label margin-0"
                htmlFor="pretrialConferenceTranscriptOrdered"
              >
                Transcript ordered
              </label>
            </div>
          </FormGroup>
        </div>
      </div>
      <div className="grid-row grid-gap align-items-center">
        <div className="grid-col-fill" style={{ minWidth: '100px' }}>
          <span className="usa-label margin-bottom-0">Trial/Hearing</span>
        </div>
        <div className="grid-col-auto">
          <FormGroup className="flex-justify-end margin-bottom-0 display-flex align-items-center">
            <label
              className="margin-right-2 margin-bottom-0 display-inline-block"
              htmlFor="trialHearingDate"
            >
              Date(s)
            </label>
            <input
              className="usa-input"
              id="trialHearingDate"
              type="text"
              value={caseMetadataFormState.trialHearing.date || ''}
              onBlur={() => onBlurHandler()}
              onChange={e => {
                onChangeHandler({
                  name: 'trialHearing',
                  rowInfo: {
                    key: 'date',
                  },
                  section: MINUTE_SHEET_FORM_SECTION_MAP.caseMetadataSection,
                  value: e.target.value,
                });
              }}
            />
          </FormGroup>
        </div>
        <div className="grid-col-3">
          <FormGroup className="margin-bottom-0 display-flex align-items-center">
            <label
              className="margin-right-2 margin-bottom-0 display-inline-block"
              htmlFor="trialHearingType"
            >
              Type
            </label>
            <select
              className="usa-select display-inline-block"
              id="trialHearingType"
              name="trialHearingType"
              value={caseMetadataFormState.trialHearing.trialHearingType}
              onBlur={() => onBlurHandler()}
              onChange={e => {
                onChangeHandler({
                  name: 'trialHearing',
                  rowInfo: {
                    key: 'trialHearingType',
                  },
                  section: MINUTE_SHEET_FORM_SECTION_MAP.caseMetadataSection,
                  value: e.target.value,
                });
              }}
            >
              <option value="">- Select -</option>
              {Object.keys(TRIAL_HEARING_OPTIONS).map(optionKey => {
                return (
                  <option key={optionKey} value={optionKey}>
                    {TRIAL_HEARING_OPTIONS[optionKey]}
                  </option>
                );
              })}
            </select>
          </FormGroup>
        </div>
        <div className="grid-col-3">
          <FormGroup className="margin-bottom-0 display-flex align-items-center">
            <label
              className="margin-right-2 margin-bottom-0 display-inline-block"
              htmlFor="trialHearingNote"
            >
              Note
            </label>
            <input
              className="usa-input display-inline-block"
              id="trialHearingNote"
              name="trialHearingNote"
              type="text"
              value={caseMetadataFormState.trialHearing.note}
              onBlur={() => onBlurHandler()}
              onChange={e => {
                onChangeHandler({
                  name: 'trialHearing',
                  rowInfo: {
                    key: 'note',
                  },
                  section: MINUTE_SHEET_FORM_SECTION_MAP.caseMetadataSection,
                  value: e.target.value,
                });
              }}
            />
          </FormGroup>
        </div>
        <div className="grid-col-2">
          <FormGroup className="margin-bottom-0 display-flex align-items-center">
            <div className="usa-checkbox">
              <input
                aria-describedby="representing-legend"
                checked={caseMetadataFormState.trialHearing.transcriptOrdered}
                className="usa-checkbox__input"
                id="trialHearingTranscriptOrdered"
                name="trialHearingTranscriptOrdered"
                type="checkbox"
                onBlur={() => onBlurHandler()}
                onChange={e => {
                  onChangeHandler({
                    name: 'trialHearing',
                    rowInfo: {
                      key: 'transcriptOrdered',
                    },
                    section: MINUTE_SHEET_FORM_SECTION_MAP.caseMetadataSection,
                    value: e.target.checked,
                  });
                }}
              />
              <label
                className="usa-checkbox__label margin-0"
                htmlFor="trialHearingTranscriptOrdered"
              >
                Transcript ordered
              </label>
            </div>
          </FormGroup>
        </div>
      </div>
    </fieldset>
  );
};

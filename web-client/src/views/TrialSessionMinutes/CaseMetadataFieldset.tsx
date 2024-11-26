import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { MinuteSheetFormState } from '@web-client/presenter/state/minuteSheetFormState';
import React from 'react';

export const CaseMetadataFieldset = ({
  caseMetadataFormState,
  onBlurHandler,
  onChangeHandler,
}: {
  onChangeHandler: ({
    name,
    section,
    value,
  }: {
    name: string;
    section: string;
    value: string | boolean;
  }) => void;
  onBlurHandler: () => void;
  caseMetadataFormState: MinuteSheetFormState['caseMetadata'];
}) => {
  return (
    <fieldset className="border-0 grid-container padding-0">
      <div className="grid-row grid-gap">
        <div className="grid-col">Called</div>
        <div className="grid-col">
          <FormGroup className="margin-bottom-0">
            <label className="margin-bottom-0" htmlFor="calledDate">
              Judge
            </label>
            <input
              className="usa-input"
              id="calledDate"
              name="calledDate"
              type="text"
              value={caseMetadataFormState.called.date}
              onBlur={() => onBlurHandler()}
              onChange={e =>
                onChangeHandler({
                  name: e.target.name,
                  value: e.target.value,
                  section: 'caseMetadata',
                })
              }
            />
          </FormGroup>
        </div>
        <div className="grid-col">
          <FormGroup className="margin-bottom-0">
            <label className="margin-bottom-0" htmlFor="calledNote">
              Note
            </label>
            <input
              className="usa-input"
              id="calledNote"
              name="calledNote"
              type="text"
              value={caseMetadataFormState.called.note}
              onBlur={() => onBlurHandler()}
              onChange={e =>
                onChangeHandler({
                  name: e.target.name,
                  value: e.target.value,
                  section: 'caseMetadata',
                })
              }
            />
          </FormGroup>
        </div>
        <div className="grid-col">
          <FormGroup className="margin-bottom-0">
            <div className="usa-checkbox">
              <input
                aria-describedby="representing-legend"
                checked={caseMetadataFormState.called.transcriptOrdered}
                className="usa-checkbox__input"
                id="calledTranscriptOrdered"
                name="calledTranscriptOrdered"
                type="checkbox"
                onBlur={() => onBlurHandler()}
                onChange={e => {
                  onChangeHandler({
                    name: e.target.name,
                    value: e.target.checked,
                    section: 'caseMetadata',
                  });
                }}
              />
              <label
                className="usa-checkbox__label margin-bottom-0"
                htmlFor="calledTranscriptOrdered"
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

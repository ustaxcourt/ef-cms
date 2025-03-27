import {
  AddRowHandler,
  AutoSaveHandler,
  OnChangeHandler,
  RemoveRowHandler,
} from '@web-client/presenter/state/TrialSessionMinutesForm/trialSessionMinutesFormHandlers';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { VerticalGrowableTextArea } from '@web-client/ustc-ui/Text/VerticalGrowableTextArea';
import { MinuteSheetFormState } from '@web-client/presenter/state/TrialSessionMinutesForm/initialTrialSessionMinuteFormState';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import {
  EXHIBIT_STATUS_OPTIONS,
  MINUTE_SHEET_FORM_SECTION_MAP,
} from '@shared/business/entities/EntityConstants';
import React, { useRef, useEffect } from 'react';

export const ExhibitsFieldset = ({
  addRowHandler,
  exhibitsFormState,
  onBlurHandler,
  onChangeHandler,
  removeRowHandler,
}: {
  onChangeHandler: OnChangeHandler;
  onBlurHandler: AutoSaveHandler;
  addRowHandler: AddRowHandler;
  exhibitsFormState: MinuteSheetFormState['exhibitsSection'];
  removeRowHandler: RemoveRowHandler;
}) => {
  const textareaRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>(
    {},
  );

  const adjustHeight = (key: string) => {
    const textarea = textareaRefs.current[key];
    if (textarea) {
      // Save existing styles because we need to reset them in order to get
      // an accurate measurement of the height of the textarea element.
      const previousStyles = {
        minHeight: textarea.style.minHeight,
        height: textarea.style.height,
        overflow: textarea.style.overflow,
      };

      textarea.style.height = '0';
      textarea.style.minHeight = '0';
      textarea.style.overflow = 'hidden';

      textarea.style.minHeight = previousStyles.minHeight;
      textarea.style.overflow = previousStyles.overflow;
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    Object.keys(exhibitsFormState.exhibits).forEach(key => {
      adjustHeight(key);
    });
  }, []);

  return (
    <fieldset className="grid-container border-0 padding-0">
      <div className="grid-row grid-gap-2">
        <div className="grid-col-5">
          <div className="usa-label margin-right-2">Exhibits</div>
        </div>
        <div className="grid-col-7"></div>
      </div>
      {Object.values(exhibitsFormState.exhibits).map((row, rowIndex) => (
        <div
          className="grid-row grid-gap-2 flex-justify-start align-items-top margin-bottom-1"
          key={row.renderKey}
        >
          <div className="grid-col-5">
            <FormGroup className="margin-bottom-0 display-flex align-items-center maxw-full">
              <VerticalGrowableTextArea
                id={`exhibit-description-${rowIndex}`}
                name={`exhibit-description-${rowIndex}`}
                value={exhibitsFormState.exhibits[row.renderKey].description}
                onBlurHandler={onBlurHandler}
                onChangeHandler={e => {
                  onChangeHandler({
                    name: 'exhibits',
                    rowInfo: {
                      key: row.renderKey,
                      nestedName: 'description',
                    },
                    section: MINUTE_SHEET_FORM_SECTION_MAP.exhibitsSection,
                    value: e.target.value,
                  });
                }}
              />
            </FormGroup>
          </div>
          <div className="grid-col-2">
            <FormGroup className="margin-bottom-0 display-flex align-items-center">
              <label
                className="margin-right-2 margin-bottom-0 display-inline-block"
                htmlFor={`exhibit-status-${rowIndex}`}
              >
                Status
              </label>
              <select
                className="usa-select display-inline-block"
                id={`exhibit-status-${rowIndex}`}
                data-testid={`exhibit-status-${rowIndex}`}
                name={`exhibit-status-${rowIndex}`}
                value={exhibitsFormState.exhibits[row.renderKey].status}
                onBlur={() => onBlurHandler()}
                onChange={e => {
                  onChangeHandler({
                    name: 'exhibits',
                    rowInfo: {
                      key: row.renderKey,
                      nestedName: 'status',
                    },
                    section: MINUTE_SHEET_FORM_SECTION_MAP.exhibitsSection,
                    value: e.target.value,
                  });
                }}
              >
                <option value="">- Select -</option>
                {Object.keys(EXHIBIT_STATUS_OPTIONS).map(optionKey => {
                  return (
                    <option key={optionKey} value={optionKey}>
                      {EXHIBIT_STATUS_OPTIONS[optionKey]}
                    </option>
                  );
                })}
              </select>
            </FormGroup>
          </div>
          <div className="grid-col-fill">
            <FormGroup className="margin-bottom-0 display-flex align-items-top">
              <label
                className="margin-right-2 margin-bottom-0 display-inline-block margin-top-1"
                htmlFor={`exhibit-note-${rowIndex}`}
              >
                Note
              </label>
              <VerticalGrowableTextArea
                id={`exhibit-note-${rowIndex}`}
                name={`exhibit-note-${rowIndex}`}
                value={exhibitsFormState.exhibits[row.renderKey].note}
                onBlurHandler={onBlurHandler}
                onChangeHandler={e =>
                  onChangeHandler({
                    name: 'exhibits',
                    rowInfo: {
                      key: row.renderKey,
                      nestedName: 'note',
                    },
                    section: MINUTE_SHEET_FORM_SECTION_MAP.exhibitsSection,
                    value: e.target.value,
                  })
                }
              />
            </FormGroup>
          </div>
          <div className="grid-col-auto margin-top-1">
            <Button
              link
              className="padding-0"
              data-testid={`remove-exhibit-button-${rowIndex}`}
              icon="times"
              type="button"
              onClick={e => {
                e.preventDefault();
                removeRowHandler({
                  key: row.renderKey,
                  name: 'exhibits',
                  section: MINUTE_SHEET_FORM_SECTION_MAP.exhibitsSection,
                });
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      ))}

      <div className="grid-row align-items-center margin-bottom-1">
        <Button
          link
          data-testid="add-exhibit-button"
          className="padding-0 margin-top-1"
          icon="plus"
          type="button"
          onClick={e => {
            e.preventDefault();
            addRowHandler({
              name: 'exhibits',
              section: MINUTE_SHEET_FORM_SECTION_MAP.exhibitsSection,
            });
          }}
        >
          Add Exhibit
        </Button>
      </div>
    </fieldset>
  );
};

import React from 'react';
import { TextField, TextArea } from '@web-client/dawson-ui/ui/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

export function Inputs() {
  return (
    <div className="tw:my-4">
      <h2>Text Input </h2>
      <div className="tw:p-6">
        <div className="tw:flex tw:flex-wrap tw:gap-6">
          <div className="max-xs:tw:w-full">
            <TextField
              label="Field Label"
              helpText="Help text"
              placeholder="Enter text here"
              className="tw:w-[380px] max-xs:tw:w-[351px] max-xs:[&_label]:tw:text-[16px] max-xs:[&_span]:tw:text-[14px]"
            />
          </div>

          <div className="max-xs:tw:w-full">
            <TextArea
              label="Field Label"
              helpText="Help text"
              placeholder="Enter text here"
              className="tw:w-[380px] max-xs:tw:w-[351px] max-xs:[&_label]:tw:text-[16px] max-xs:[&_span]:tw:text-[14px]"
            />
          </div>

          <div className="max-xs:tw:w-full tw:flex tw:items-start tw:gap-4 max-xs:tw:flex-col">
            <div className="tw:flex tw:flex-col">
              <div className="tw:flex tw:items-center !tw:text-[18px] max-xs:!tw:text-[16px] tw:font-semibold tw:text-gray-900">
                <span>Field Label</span>
                <FontAwesomeIcon 
                  icon={faQuestionCircle} 
                  size="sm" 
                  className="tw:ml-1 tw:text-blue-600"
                  title="Help text"
                  role="img"
                  aria-label="Help text"
                />
                <span className="tw:text-gray-500 tw:ml-1 tw:font-normal tw:text-[16px]">(optional)</span>
              </div>
              <div className="tw:text-base tw:text-gray-500">Help text</div>
            </div>
            <div className="max-xs:tw:w-[351px] tw:w-[380px]">
              <TextField
                label=""
                className="tw:w-full"
                placeholder="Enter text here"
                hideLabel
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

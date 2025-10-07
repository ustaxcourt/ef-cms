import React from 'react';
import { TextField, TextArea, MobileTextField, MobileTextArea } from '@web-client/dawson-ui/ui/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

export function Inputs() {
  return (
        <div className="tw:my-4">
      <h2>Text Input </h2>
    <div className="tw:p-6">
      <div className="tw:grid tw:grid-cols-3 tw:gap-6">
        <div>
          <TextField
            label="Field Label"
            helpText="Help text"
            placeholder="Enter text here"
          />
        </div>

        <div>
          <TextArea
            label="Field Label"
            helpText="Help text"
            placeholder="Enter text here"
            className="tw:w-[380px]"
          />
        </div>

        <div className="tw:flex tw:items-start tw:gap-4">
          <div className="tw:flex tw:flex-col">
                        <div className="tw:flex tw:items-center tw:text-lg tw:font-semibold tw:text-gray-900">
              <span>Field Label</span>
              <FontAwesomeIcon 
                icon={faQuestionCircle} 
                size="sm" 
                className="tw:ml-1 tw:text-blue-600"
                title="Help text"
                role="img"
                aria-label="Help text"
              />
              <span className="tw:text-gray-500 tw:ml-1 tw:font-normal tw:text-base">(optional)</span>
            </div>
                            <div className="tw:text-base tw:text-gray-500">Help text</div>
          </div>
          <div className="tw:flex-1">
            <TextField
              label=""
              className="tw:w-full"
              placeholder="Enter text here"
              hideLabel
            />
          </div>
        </div>
      </div>

      <h2 className="tw:mt-12 tw:mb-6">Mobile Text Input</h2>
      <div className="tw:grid tw:grid-cols-3 tw:gap-6">
        <div>
          <MobileTextField
            label="Field Label"
            helpText="Help text"
            placeholder="Enter text here"
          />
        </div>

        <div>
          <MobileTextArea
            label="Field Label"
            helpText="Help text"
            placeholder="Enter text here"
            className="tw:w-[351px]"
          />
        </div>

        <div className="tw:flex tw:items-start tw:gap-4">
          <div className="tw:flex tw:flex-col">
            <div className="tw:flex tw:items-center tw:text-lg tw:font-semibold tw:text-gray-900">
              <span>Field Label</span>
              <FontAwesomeIcon 
                icon={faQuestionCircle} 
                size="sm" 
                className="tw:ml-1 tw:text-blue-600"
                title="Help text"
                role="img"
                aria-label="Help text"
              />
              <span className="tw:text-gray-500 tw:ml-1 tw:font-normal tw:text-base">(optional)</span>
            </div>
            <div className="tw:text-base tw:text-gray-500">Help text</div>
          </div>
          <div className="tw:flex-1">
            <MobileTextField
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

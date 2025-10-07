import React from 'react';
import { TextField, TextArea } from '@web-client/dawson-ui/ui/input';

export function Inputs() {
  return (
        <div className="tw:my-4">
      <h2>Text Input </h2>
    <div className="tw:p-6">
      <div className="tw:grid tw:grid-cols-3 tw:gap-6">
        {/* First Text Field */}
        <div>
          <TextField
            label="Field Label"
            helpText="Help text"
            placeholder="Enter text here"
          />
        </div>

        {/* Text Area */}
        <div>
          <TextArea
            label="Field Label"
            helpText="Help text"
            placeholder="Enter text here"
          />
        </div>

        {/* Last Text Field - Horizontal */}
        <div className="tw:flex tw:items-start tw:gap-4">
          <div className="tw:flex tw:flex-col">
            <div className="tw:flex tw:items-center tw:text-base tw:font-bold tw:text-gray-900">
              <span>Field Label</span>
              <button
                type="button"
                className="tw:ml-1 tw:text-blue-600"
                title="Help text"
              >
                <i className="fa-regular fa-circle-question tw:text-sm" />
              </button>
              <span className="tw:text-gray-500 tw:ml-1 tw:font-normal">(optional)</span>
            </div>
            <div className="tw:text-sm tw:text-gray-500">Help text</div>
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
    </div>
    </div>
  );
}

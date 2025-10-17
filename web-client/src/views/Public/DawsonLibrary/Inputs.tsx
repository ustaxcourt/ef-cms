import React from 'react';
import { TextField, TextArea } from '@web-client/dawson-ui/ui/input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

export function Inputs() {
  return (
    <div>
      <h2>Text Input </h2>
      <div className="tw:p-6">
        <div className="tw:flex tw:flex-wrap tw:gap-6">
          <div className="max-xs:tw:w-full">
            <TextField
              label="Field Label"
              helpText="Help text"
              placeholder="Enter text here"
              icon={true}
              
            />
          </div>

          <div className="max-xs:tw:w-full">
            <TextArea
              label="Field Label"
              helpText="Help text"
              placeholder="Enter text here"
            />
          </div>

          <div className="tw:flex tw:items-start tw:gap-4 max-xs:tw:flex-col max-xs:tw:w-full">
            <div className="tw:flex tw:flex-col">
              <div className="tw:flex tw:items-center">
                <span className="tw:text-[16px] tw:md:text-[18px] !tw:font-semibold !tw:text-gray-900" style={{ fontWeight: '600' }}>
                  Field Label
                </span>
                <FontAwesomeIcon
                  icon={faQuestionCircle}
                  size="sm"
                  className="tw:ml-1 tw:text-primary-dark"
                  title="Help text"
                  role="img"
                  aria-label="Help text"
                />
                <span className="tw:text-gray-500 tw:ml-1 tw:font-normal tw:text-[14px] tw:md:text-[16px]">
                  (optional)
                </span>
              </div>
              <div className="tw:mt-1 tw:mb-[9px] tw:text-[14px] tw:md:text-[16px] tw:text-gray-500">
                Help text
              </div>
            </div>
            <div className="tw:w-[380px] max-md:tw:w-[182px]">
              <TextField
                placeholder="Enter text here"
                className="tw:w-full"
              />
            </div>
          </div>

         
          <div className="max-xs:tw:w-full">
            <TextField
              label="Field Label"
              helpText="Help text"
              placeholder="Enter text here"
              icon={true}
              error="error"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

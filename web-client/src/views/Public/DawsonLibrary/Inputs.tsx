import React from 'react';
import { TextField, TextArea, FieldWithIcon } from '@web-client/dawson-ui/ui/input';

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
              
            />
          </div>

          <div className="max-xs:tw:w-full">
            <TextArea
              label="Field Label"
              helpText="Help text"
              placeholder="Enter text here"
            />
          </div>

          <div className="max-xs:tw:w-full">
            <FieldWithIcon
              label="Field Label"
              helpText="Help text"
              placeholder="Enter text here"
              className="tw:w-[380px] max-md:tw:w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

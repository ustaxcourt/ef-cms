import React from 'react';
import { TextField, TextArea } from '@web-client/dawson-ui/ui/input';

export function Inputs() {
  return (
    <div>
      <h2>Text Input</h2>
      <div className="tw:p-6">
        <div className="tw:flex tw:flex-wrap tw:gap-6">
          <div className="tw:w-full">
            <TextField
              label="Field Label"
              helpText="Help text"
              icon={true}
              flexDirection="vertical"
            />
          </div>
          <div className="tw:w-full">
            <TextField
              label="Field Label"
              icon={true}
              flexDirection="vertical"
              error="Enter a valid answer"
            />
          </div>
          <div></div>
          <div className="tw:w-full">
            <TextArea label="Field Label" helpText="" />
          </div>
          <div className="tw:w-full">
            <TextField
              label="Field Label"
              helpText="Help Text"
              icon={true}
              flexDirection="horizontal"
            />
          </div>
          <div className="tw:w-full">
            <TextField label="Field Label" flexDirection="horizontal" />
          </div>
          <div className="tw:w-full">
            <TextField
              label="Field Label"
              helpText="Help text"
              icon={true}
              error="Enter a valid answer"
            />
          </div>
          {/* need for proper spacing */}

          <div></div>
          <div className="tw:w-full">
            <TextArea
              label="Field Label"
              helpText="Help text"
              error="Enter a valid answer"
            />
          </div>
          {/* need for proper spacing */}
          <div></div>
          <div className="tw:w-full">
            <TextField
              label="Field Label"
              helpText="Help text"
              icon={true}
              flexDirection="horizontal"
              error="Enter a valid answer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

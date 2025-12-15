import React from 'react';

type ScanUploadModeProps = {
  checked: boolean;
  onChange: () => void;
  'aria-describedby': string;
  scanOnly?: boolean;
};

export const ScanUploadMode = ({
  checked,
  onChange,
  'aria-describedby': ariaDescribedBy,
  scanOnly = false,
}: ScanUploadModeProps) => {
  if (scanOnly) {
    return null;
  }

  return (
    <div className="usa-radio usa-radio__inline">
      <input
        aria-describedby={ariaDescribedBy}
        aria-labelledby="upload-mode-upload"
        checked={checked}
        className="usa-radio__input"
        id="uploadMode"
        name="uploadMode"
        type="radio"
        value="upload"
        onChange={onChange}
      />
      <label
        className="usa-radio__label"
        data-testid="upload-pdf-button"
        htmlFor="uploadMode"
        id="upload-mode-upload"
      >
        Upload
      </label>
    </div>
  );
};

ScanUploadMode.displayName = 'ScanUploadMode';

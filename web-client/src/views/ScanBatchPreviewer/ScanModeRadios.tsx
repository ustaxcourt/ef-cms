import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { ScanUploadMode } from './ScanUploadMode';
import React from 'react';
import classNames from 'classnames';

type ScanModeRadiosProps = {
  errorText?: string[];
  hasDocumentTabs: boolean;
  onSetScanMode: () => void;
  onSetUploadMode: () => void;
  onStartScan: (e: React.MouseEvent<Element, MouseEvent>) => void;
  scanOnly?: boolean;
  scannerSource?: string;
  uploadMode: string;
};

export const ScanModeRadios = ({
  errorText,
  hasDocumentTabs,
  onSetScanMode,
  onSetUploadMode,
  onStartScan,
  scanOnly = false,
  scannerSource,
  uploadMode,
}: ScanModeRadiosProps) => {
  const headerMargin = hasDocumentTabs ? 'margin-top-2' : 'margin-top-0';

  return (
    <div className="grid-row">
      <div className="grid-col-8">
        <FormGroup errorText={errorText}>
          <fieldset
            aria-label="scan mode selection"
            className={classNames('usa-fieldset margin-bottom-3', headerMargin)}
            id="scan-mode-radios"
          >
            <legend
              className="usa-legend with-hint margin-bottom-2"
              id="scan-mode-radios-legend"
            >
              How do you want to add this document?
            </legend>
            <div className="usa-radio usa-radio__inline">
              <input
                aria-describedby="scan-mode-radios-legend"
                aria-labelledby="upload-mode-scan"
                checked={uploadMode === 'scan'}
                className="usa-radio__input"
                id="scanMode"
                name="uploadMode"
                type="radio"
                value="scan"
                onChange={onSetScanMode}
              />
              <label
                className="usa-radio__label"
                data-testid="upload-mode-scan"
                htmlFor="scanMode"
                id="upload-mode-scan"
              >
                Scan
              </label>
            </div>

            <ScanUploadMode
              aria-describedby="scan-mode-radios-legend"
              checked={uploadMode === 'upload'}
              onChange={onSetUploadMode}
              scanOnly={scanOnly}
            />
          </fieldset>
        </FormGroup>
      </div>

      <div className="grid-col-4 margin-top-4 text-align-right">
        {uploadMode === 'scan' && scannerSource && (
          <Button onClick={onStartScan}>
            <FontAwesomeIcon icon={['fas', 'plus-circle']} />
            Start Scan
          </Button>
        )}
      </div>
    </div>
  );
};

ScanModeRadios.displayName = 'ScanModeRadios';

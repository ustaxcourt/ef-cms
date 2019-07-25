import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { limitFileSize } from './limitFileSize';
import { sequences, state } from 'cerebral';
import React, { useEffect } from 'react';

export const ScanBatchPreviewer = connect(
  {
    completeScanSequence: sequences.completeScanSequence,
    constants: state.constants,
    scanBatchPreviewerHelper: state.scanBatchPreviewerHelper,
    scannerStartupSequence: sequences.scannerStartupSequence,
    setSelectedBatchIndexSequence: sequences.setSelectedBatchIndexSequence,
    startScanSequence: sequences.startScanSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validatePetitionFromPaperSequence:
      sequences.validatePetitionFromPaperSequence,
  },
  ({
    completeScanSequence,
    constants,
    scanBatchPreviewerHelper,
    scannerStartupSequence,
    setSelectedBatchIndexSequence,
    startScanSequence,
    updateFormValueSequence,
    validatePetitionFromPaperSequence,
  }) => {
    useEffect(() => {
      scannerStartupSequence();
    }, []);

    return (
      <div>
        <h4>Scanned Documents</h4>
        {scanBatchPreviewerHelper.batches.map(batch => (
          <div className="batch" key={batch.index}>
            <button
              className="usa-button usa-button--unstyled"
              onClick={e => {
                e.preventDefault();
                setSelectedBatchIndexSequence({
                  selectedBatchIndex: batch.index,
                });
              }}
            >
              Batch {batch.index + 1}
            </button>
            <span>{batch.pages.length} pages</span>
            <button className="usa-button usa-button--unstyled">Rescan</button>
            <button className="usa-button usa-button--unstyled">Remove</button>
          </div>
        ))}
        <button
          className="usa-button usa-button--unstyled"
          onClick={e => {
            e.preventDefault();
            startScanSequence();
          }}
        >
          Add Batch
        </button>
        <br />

        {scanBatchPreviewerHelper.selectedPageImage && (
          <>
            <button
              className="usa-button"
              type="button"
              onClick={e => {
                console.log('we are here');
                e.preventDefault();
                completeScanSequence({
                  onComplete: file => {
                    limitFileSize(file, constants.MAX_FILE_SIZE_MB, () => {
                      updateFormValueSequence({
                        key: 'petitionFile',
                        value: file,
                      });
                      updateFormValueSequence({
                        key: 'petitionFileSize',
                        value: file.size,
                      });
                      validatePetitionFromPaperSequence();
                    });
                  },
                });
              }}
            >
              <FontAwesomeIcon icon={['fas', 'file-pdf']} />
              Create PDF
            </button>
            <hr />
            <h4>
              Scan Preview: Batch{' '}
              {scanBatchPreviewerHelper.selectedBatch.index + 1}
            </h4>
            <img
              src={`data:image/png;base64,${scanBatchPreviewerHelper.selectedPageImage}`}
            />
          </>
        )}
      </div>
    );
  },
);

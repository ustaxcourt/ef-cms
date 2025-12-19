import { Button } from '@web-client/ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

type Batch = {
  index: number;
  pages: any[];
  scanModeLabel?: string;
};

type ScanBatchesTableProps = {
  batches: Batch[];
  batchWrapperRef: React.RefObject<HTMLDivElement>;
  onDeleteBatch: (batchIndex: number, pageCount: number) => void;
  onRescanBatch: (batchIndex: number) => void;
  onSelectBatch: (batchIndex: number) => void;
  selectedBatchIndex: number;
};

export const ScanBatchesTable = ({
  batches,
  batchWrapperRef,
  onDeleteBatch,
  onRescanBatch,
  onSelectBatch,
  selectedBatchIndex,
}: ScanBatchesTableProps) => {
  if (batches.length === 0) {
    return null;
  }

  return (
    <>
      <h5 className="header-scanned-batches">Scanned batches</h5>
      <div className="batches-table-wrapper" ref={batchWrapperRef}>
        <table className="batches-table">
          <tbody>
            {batches.map(batch => (
              <tr className="no-blue-hover" key={batch.index}>
                <td>
                  {selectedBatchIndex !== batch.index && (
                    <Button
                      link
                      aria-label={`batch ${batch.index + 1} -- ${
                        batch.pages.length
                      } pages total`}
                      onClick={e => {
                        e.preventDefault();
                        onSelectBatch(batch.index);
                      }}
                    >
                      Batch {batch.index + 1}
                    </Button>
                  )}
                  {selectedBatchIndex === batch.index && (
                    <span className="batch-index">
                      Batch {batch.index + 1}
                    </span>
                  )}
                </td>

                <td>
                  <span>{batch.scanModeLabel}</span>
                </td>
                <td>
                  <span>{batch.pages.length} pages</span>
                </td>
                <td>
                  <Button
                    link
                    aria-label={`rescan batch ${batch.index + 1}`}
                    className="no-underline"
                    onClick={e => {
                      e.preventDefault();
                      onRescanBatch(batch.index);
                    }}
                  >
                    <FontAwesomeIcon icon={['fas', 'redo-alt']} />
                    Rescan
                  </Button>
                </td>
                <td>
                  <Button
                    link
                    aria-label={`delete batch ${batch.index + 1} - with ${
                      batch.pages.length
                    } total pages`}
                    className="no-underline red-warning float-right"
                    onClick={e => {
                      e.preventDefault();
                      onDeleteBatch(batch.index, batch.pages.length);
                    }}
                  >
                    <FontAwesomeIcon icon={['fas', 'times-circle']} />
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="lighter" />
    </>
  );
};

ScanBatchesTable.displayName = 'ScanBatchesTable';

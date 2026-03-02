import { Button } from '@web-client/ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PreviewControls } from '../PreviewControls';
import React from 'react';

type ScanPreviewSectionProps = {
  batchIndex: number;
  currentPage: number;
  onCreatePdf: (e: React.MouseEvent) => void;
  onFirstPage: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onLastPage: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onNextPage: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onPreviousPage: (e: React.MouseEvent<HTMLButtonElement>) => void;
  selectedPageImage: string;
  totalPages: number;
};

export const ScanPreviewSection = ({
  batchIndex,
  currentPage,
  onCreatePdf,
  onFirstPage,
  onLastPage,
  onNextPage,
  onPreviousPage,
  selectedPageImage,
  totalPages,
}: ScanPreviewSectionProps) => {
  return (
    <>
      <div className="grid-container padding-x-0">
        <div className="grid-row space-between">
          <div>
            <h4 className="margin-bottom-0 margin-top-2">
              Scan Preview: Batch {batchIndex + 1}
            </h4>
          </div>

          <div className="margin-bottom-2">
            <PreviewControls
              currentPage={currentPage + 1}
              disableLeftButtons={currentPage === 0}
              disableRightButtons={currentPage === totalPages - 1}
              totalPages={totalPages}
              onFirstPage={onFirstPage}
              onLastPage={onLastPage}
              onNextPage={onNextPage}
              onPreviousPage={onPreviousPage}
            />
          </div>
        </div>
      </div>

      <div className="preview-container--image-area">
        <img
          alt="preview"
          src={`data:image/png;base64,${selectedPageImage}`}
        />
      </div>

      <Button
        aria-label="create pdf"
        className="margin-top-4"
        onClick={onCreatePdf}
      >
        <FontAwesomeIcon icon={['fas', 'file-pdf']} />
        Create PDF
      </Button>
    </>
  );
};

ScanPreviewSection.displayName = 'ScanPreviewSection';

import React, { useState, useRef, useImperativeHandle } from 'react';
import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  validateFileOnSelect,
  ErrorTypes,
} from '../FileHandlingHelpers/fileValidation';

export type FileInputProps = {
  accept?: string;
  'aria-describedby'?: string;
  className?: string;
  'data-testid'?: string;
  existingFileName?: string;
  file?: File | null;
  id: string;
  maxFileSizeMB: number;
  name: string;
  onError?: (error: {
    errorType?: ErrorTypes;
    messageToDisplay: string;
    messageToLog?: string;
  }) => void;
  onFileChange: (file: File) => void | Promise<void>;
  onRemoveFile?: () => void;
  showFileInfo?: boolean;
  skipFileTypeValidation?: boolean;
};

export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  function FileInput(
    {
      accept = '.pdf',
      'aria-describedby': ariaDescribedBy,
      className = 'usa-input',
      'data-testid': dataTestId,
      id,
      maxFileSizeMB,
      name,
      onError,
      onFileChange,
      onRemoveFile,
      skipFileTypeValidation = false,
      showFileInfo = true,
      file,
      existingFileName,
      ...remainingProps
    },
    ref,
  ) {
    const internalRef = useRef<HTMLInputElement>(null);
    const [selectedFilename, setSelectedFilename] = useState('');

    useImperativeHandle(ref, () => internalRef.current!);
    const actualRef = internalRef;

    const fileOnForm = file || existingFileName;
    const displayName = fileOnForm
      ? (file instanceof File ? file.name : existingFileName)
      : selectedFilename;

    const handleFileSelectionChange = async (
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      setSelectedFilename(e.target?.files?.[0]?.name || '');

      await validateFileOnSelect({
        allowedFileExtensions: accept.split(',').map(ext => ext.trim()),
        e,
        megabyteLimit: maxFileSizeMB,
        onError: error => {
          setSelectedFilename('');
          if (onError) {
            onError(error);
          }
        },
        onSuccess: async ({ selectedFile }) => {
          try {
            await onFileChange(selectedFile);
          } catch (error) {
            setSelectedFilename('');
            if (onError) {
              onError({
                messageToDisplay: 'Failed to process file. Please try again.',
              });
            }
          }
        },
        skipFileTypeValidation,
      });
    };

    const handleChangeClick = () => {
      if (onRemoveFile) {
        onRemoveFile();
      }
      if (actualRef.current) {
        actualRef.current.value = '';
        actualRef.current.click();
        setSelectedFilename('');
      }
    };

    return (
      <>
        <input
          {...remainingProps}
          accept={accept}
          aria-describedby={ariaDescribedBy}
          className={className}
          data-testid={dataTestId || id}
          id={id}
          name={name}
          ref={actualRef}
          style={{
            display: fileOnForm || selectedFilename ? 'none' : 'block',
          }}
          type="file"
          onChange={handleFileSelectionChange}
          onClick={e => {
            if (fileOnForm) e.preventDefault();
          }}
        />

        {showFileInfo && (fileOnForm || selectedFilename) && (
          <div>
            <span
              className="success-message icon-upload margin-right-1"
              data-testid={
                fileOnForm
                  ? `upload-file-success-${id}`
                  : `pending-upload-file-success-${id}`
              }
            >
              <FontAwesomeIcon icon={'check-circle'} size="1x" />
            </span>
            <span className="mr-1">{displayName}</span>
            <Button
              link
              className={'ustc-button--mobile-inline margin-left-1'}
              onClick={handleChangeClick}
            >
              Change
            </Button>
          </div>
        )}
      </>
    );
  },
);

FileInput.displayName = 'FileInput';

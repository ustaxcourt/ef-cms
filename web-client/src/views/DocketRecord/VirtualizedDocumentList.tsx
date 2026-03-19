import { Button } from '../../ustc-ui/Button/Button';
import { VariableSizeList } from 'react-window';
import { WrappedIcon } from '@web-client/ustc-ui/Icon/Icon';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import classNames from 'classnames';

interface VirtualizedDocumentListProps {
  docketEntries: any[];
  viewDocumentId: string;
  setViewerDocumentToDisplaySequence: Function;
}

export const VirtualizedDocumentList: React.FC<VirtualizedDocumentListProps> = ({
  docketEntries,
  viewDocumentId,
  setViewerDocumentToDisplaySequence,
}) => {
  const listRef = useRef<VariableSizeList>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const [listDimensions, setListDimensions] = useState<{width: number, height: number} | null>(null);

  // Calculate row height based on content
  const getRowHeight = (index: number) => {
    const entry = docketEntries[index];
    if (!entry) return 80;

    const descriptionLength = entry.descriptionDisplay?.length || 0;

    // Base height includes button padding (15px top + 15px bottom) + border + content padding
    const baseHeight = 60;

    // Very short entries (single words like "Exhibit", "Petition")
    if (descriptionLength <= 20) {
      return baseHeight;
    }

    // Adjust chars per line based on text length
    // Short texts (20-100 chars): less wrapping, ~30 chars per line
    // Medium texts (100-200 chars): moderate wrapping, ~26 chars per line
    // Long texts (200+ chars): more wrapping, ~22 chars per line
    let charsPerLine: number;
    if (descriptionLength <= 100) {
      charsPerLine = 30;
    } else if (descriptionLength <= 200) {
      charsPerLine = 26;
    } else {
      charsPerLine = 22;
    }

    const estimatedLines = Math.ceil(descriptionLength / charsPerLine);
    const heightPerLine = 24; // Line height with spacing

    // Calculate additional height for related docket entries
    let additionalHeight = 0;
    if (entry.relatedDocketEntries && entry.relatedDocketEntries.length > 0) {
      // Each related entry adds significant height (line break + disposition text)
      entry.relatedDocketEntries.forEach((affectedEntry: any) => {
        const dispositionCount = affectedEntry.dispositionLinkText?.length || 0;
        // Each disposition gets a full line + extra spacing
        additionalHeight += (dispositionCount + 1) * heightPerLine;
      });
    }

    const calculatedHeight = baseHeight + (estimatedLines * heightPerLine) + additionalHeight;

    // Allow very tall rows for complex entries
    return Math.min(calculatedHeight, 800);
  };

  // Measure container dimensions for VariableSizeList
  useLayoutEffect(() => {
    const updateDimensions = () => {
      if (listContainerRef.current) {
        const rect = listContainerRef.current.getBoundingClientRect();
        setListDimensions({
          width: rect.width,
          height: rect.height
        });
      }
    };

    // Small delay to ensure DOM is fully rendered
    const timeout = setTimeout(updateDimensions, 0);
    window.addEventListener('resize', updateDimensions);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Scroll to the selected document in the virtualized list
  useEffect(() => {
    if (viewDocumentId && listRef.current && listDimensions) {
      const selectedIndex = docketEntries.findIndex(
        entry => entry.docketEntryId === viewDocumentId,
      );
      if (selectedIndex !== -1) {
        // Use scrollToItem with center alignment for better UX
        listRef.current.scrollToItem(selectedIndex, 'center');
      }
    }
  }, [viewDocumentId, listDimensions, docketEntries]);

  // Row renderer for virtualized list
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const entry = docketEntries[index];

    if (!entry) return null;

    return (
      <div style={{
        ...style,
        padding: 0,
        margin: 0,
        boxSizing: 'border-box'
      }}>
        <Button
          className={classNames(
            'usa-button--unstyled attachment-viewer-button virtualized',
            viewDocumentId === entry.docketEntryId && 'active',
          )}
          data-entry-id={entry.docketEntryId}
          disabled={!entry.isFileAttached}
          isActive={viewDocumentId === entry.docketEntryId}
          key={entry.docketEntryId}
          onClick={() => {
            setViewerDocumentToDisplaySequence({
              viewerDocumentToDisplay: entry,
            });
          }}
        >
          <div
            className="grid-row margin-left-205"
            title={entry.toolTipText}
            style={{
              margin: '0 0 0 2.05rem',
              padding: 0
            }}
          >
            <div className="grid-col-2 text-align-center">{entry.index}</div>
            <div
              className={classNames(
                'grid-col-3',
                entry.isStricken && 'stricken-docket-record',
              )}
            >
              {entry.createdAtFormatted}
              <div className="float-right text-align-center">
                {entry.iconsToDisplay.map(
                  ({ icon, className, title }: any, iconIndex: number) => (
                    <div
                      key={iconIndex}
                      className={classNames('display-block', {
                        'margin-bottom-1':
                          iconIndex < entry.iconsToDisplay.length - 1,
                      })}
                    >
                      <WrappedIcon
                        iconClass={className}
                        icon={icon}
                        title={title}
                      />
                    </div>
                  ),
                )}
              </div>
            </div>
            <div className="grid-col-5">
              <span
                className={classNames(
                  'mobile-text-wrap',
                  'word-wrap-break-word',
                  entry.isStricken && 'stricken-docket-record',
                )}
              >
                {entry.descriptionDisplay}
                {entry.relatedDocketEntries?.map((affectedEntry: any) => {
                  return (
                    <div key={affectedEntry.docketEntryId}>
                      <br />
                      {affectedEntry.dispositionLinkText.map(
                        (linkText: string, linkIndex: number) => {
                          return (
                            <div
                              className="display-inline-block"
                              key={`${linkText}-${linkIndex}`}
                            >
                              --- <span>{linkText}</span>
                              {linkIndex <
                                affectedEntry.dispositionLinkText.length -
                                  1 && <br />}
                            </div>
                          );
                        },
                      )}
                    </div>
                  );
                })}
              </span>
              <span
                className={classNames(
                  'word-wrap-break-word',
                  'display-block',
                )}
              >
                {entry.isStricken && ' (STRICKEN)'}
              </span>
            </div>
            <div className="grid-col-2 padding-left-105">
              {entry.showNotServed && (
                <span className="text-semibold not-served">Not served</span>
              )}
            </div>
          </div>
        </Button>
      </div>
    );
  };

  return (
    <div
      ref={listContainerRef}
      className="document-viewer--documents-list"
      style={{ height: '1000px', width: '100%', padding: 0, overflow: 'hidden' }}
    >
      {listDimensions && (
        <VariableSizeList
          height={listDimensions.height}
          itemCount={docketEntries.length}
          itemSize={getRowHeight}
          width={listDimensions.width}
          ref={listRef}
        >
          {Row}
        </VariableSizeList>
      )}
    </div>
  );
};

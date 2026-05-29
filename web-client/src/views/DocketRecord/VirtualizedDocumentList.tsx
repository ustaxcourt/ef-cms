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

export const VirtualizedDocumentList: React.FC<
  VirtualizedDocumentListProps
> = ({ docketEntries, viewDocumentId, setViewerDocumentToDisplaySequence }) => {
  const listRef = useRef<VariableSizeList>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const rowHeightCacheRef = useRef<Map<number, number>>(new Map());
  const correctionCountRef = useRef(0);
  const measurementFrameRef = useRef<number | null>(null);
  const lastMeasuredRangeRef = useRef<{ start: number; end: number } | null>(
    null,
  );
  const [listDimensions, setListDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  // Get row height from cache or provide a generous overestimate.
  // Overestimating is safe (extra whitespace), underestimating causes overlap.
  // The measurement pass in useLayoutEffect corrects these to actual heights.
  const getRowHeight = (index: number) => {
    if (rowHeightCacheRef.current.has(index)) {
      return rowHeightCacheRef.current.get(index)!;
    }

    const entry = docketEntries[index];
    if (!entry) return 80;

    const descriptionLength = entry.descriptionDisplay?.length || 0;

    // Button padding: 15px top + 15px bottom + 1px border = 31px
    let estimatedHeight = 31;

    // Use a very conservative 18 chars per line.
    // The grid-col-5 column is narrow (~175px), and at the actual font size
    // only about 20-22 chars fit per line. Using 18 ensures we always
    // overestimate, which means extra whitespace (acceptable) but never overlap.
    const charsPerLine = 18;

    const estimatedLines = Math.max(
      1,
      Math.ceil(descriptionLength / charsPerLine),
    );
    // line-height: 1.4 on ~15px font ≈ 21px per line
    estimatedHeight += estimatedLines * 21;

    // Related docket entries
    if (entry.relatedDocketEntries && entry.relatedDocketEntries.length > 0) {
      entry.relatedDocketEntries.forEach((affectedEntry: any) => {
        estimatedHeight += 21; // <br /> line break
        const dispositionLines = affectedEntry.dispositionLinkText?.length || 0;
        estimatedHeight += dispositionLines * 21;
      });
    }

    // Stacked icons can make the row taller than the text
    if (entry.iconsToDisplay && entry.iconsToDisplay.length > 1) {
      const iconHeight = entry.iconsToDisplay.length * 20;
      const textHeight = estimatedHeight - 31;
      if (iconHeight > textHeight) {
        estimatedHeight = 31 + iconHeight;
      }
    }

    if (entry.isStricken) {
      estimatedHeight += 21;
    }

    // Small buffer for rounding/padding — keep minimal to reduce spacing inconsistency
    estimatedHeight += 5;

    return Math.max(estimatedHeight, 60);
  };

  // Measure container dimensions for VariableSizeList
  useLayoutEffect(() => {
    const updateDimensions = () => {
      if (listContainerRef.current) {
        const rect = listContainerRef.current.getBoundingClientRect();
        setListDimensions({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    const timeout = setTimeout(updateDimensions, 0);
    window.addEventListener('resize', updateDimensions);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Clear cache when docketEntries change
  useEffect(() => {
    rowHeightCacheRef.current.clear();
    correctionCountRef.current = 0;
    if (listRef.current) {
      listRef.current.resetAfterIndex(0);
    }
  }, [docketEntries]);

  // Single parent-level measurement pass: after all Row DOMs are committed,
  // query all visible content wrappers, measure their actual heights,
  // cache them, and do ONE resetAfterIndex call to reposition everything.
  // This avoids the per-Row resetAfterIndex batching issue.
  // Limited to 10 correction cycles to prevent infinite re-render loops
  // (e.g., when correcting heights changes the visible range, revealing
  // new unmeasured rows that need their own correction).
  // Uses requestAnimationFrame to batch measurements and prevent multiple
  // measurements per frame during scrolling.
  useLayoutEffect(() => {
    if (!listContainerRef.current || !listRef.current) return;
    if (correctionCountRef.current >= 10) return;

    // Cancel any pending measurement to avoid multiple measurements per frame
    if (measurementFrameRef.current !== null) {
      cancelAnimationFrame(measurementFrameRef.current);
    }

    measurementFrameRef.current = requestAnimationFrame(() => {
      if (!listContainerRef.current || !listRef.current) return;

      const contentElements =
        listContainerRef.current.querySelectorAll<HTMLElement>(
          '[data-row-index]',
        );

      if (contentElements.length === 0) return;

      // Determine the current visible range
      const indices = Array.from(contentElements).map(el =>
        parseInt(el.dataset.rowIndex!, 10),
      );
      const currentStart = Math.min(...indices);
      const currentEnd = Math.max(...indices);

      // Reset correction counter if we've scrolled to a significantly different range
      const lastRange = lastMeasuredRangeRef.current;
      if (lastRange) {
        const rangeSize = currentEnd - currentStart;
        const overlap =
          Math.min(currentEnd, lastRange.end) -
          Math.max(currentStart, lastRange.start);
        // If less than 50% overlap, we've scrolled to mostly new content
        if (overlap < rangeSize * 0.5) {
          correctionCountRef.current = 0;
        }
      }

      lastMeasuredRangeRef.current = { start: currentStart, end: currentEnd };

      let needsReset = false;
      let minChangedIndex = Infinity;

      contentElements.forEach(el => {
        const index = parseInt(el.dataset.rowIndex!, 10);
        const buttonEl = el.querySelector<HTMLElement>(
          '.attachment-viewer-button',
        );

        if (!buttonEl) return;

        const height = buttonEl.offsetHeight;
        const cached = rowHeightCacheRef.current.get(index);

        if (!cached || Math.abs(cached - height) > 1) {
          rowHeightCacheRef.current.set(index, height);
          needsReset = true;
          minChangedIndex = Math.min(minChangedIndex, index);
        }
      });

      if (needsReset) {
        correctionCountRef.current++;
        listRef.current!.resetAfterIndex(minChangedIndex, true);
      } else {
        // Stable — reset correction counter for future scroll events
        correctionCountRef.current = 0;
      }

      measurementFrameRef.current = null;
    });

    return () => {
      if (measurementFrameRef.current !== null) {
        cancelAnimationFrame(measurementFrameRef.current);
      }
    };
  });

  // Scroll to the selected document in the virtualized list
  useEffect(() => {
    if (viewDocumentId && listRef.current && listDimensions) {
      const selectedIndex = docketEntries.findIndex(
        entry => entry.docketEntryId === viewDocumentId,
      );
      if (selectedIndex !== -1) {
        listRef.current.scrollToItem(selectedIndex, 'center');
      }
    }
  }, [viewDocumentId, listDimensions, docketEntries]);

  // Row renderer for virtualized list
  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const entry = docketEntries[index];

    if (!entry) return null;

    // Extract height from react-window's style to apply to button
    const { height: rowHeight, ...positionStyle } = style;

    return (
      <div style={{ ...positionStyle, boxShadow: 'inset 0 -1px 0 #dfe1e2' }}>
        <div data-row-index={index}>
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
            style={{
              height: rowHeight,
              overflow: 'hidden',
              display: 'block',
            }}
          >
            <div
              className="grid-row margin-left-205"
              title={entry.toolTipText}
              style={{
                margin: '0 0 0 2.05rem',
                padding: 0,
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
      </div>
    );
  };

  return (
    <div
      className="document-viewer--documents-list"
      data-testid="document-viewer-documents-list"
      ref={listContainerRef}
      style={{
        height: '1000px',
        width: '100%',
        padding: 0,
        overflow: 'hidden',
      }}
    >
      {listDimensions && (
        <VariableSizeList
          height={listDimensions.height}
          itemCount={docketEntries.length}
          itemSize={getRowHeight}
          overscanCount={3}
          width={listDimensions.width}
          ref={listRef}
        >
          {Row}
        </VariableSizeList>
      )}
    </div>
  );
};

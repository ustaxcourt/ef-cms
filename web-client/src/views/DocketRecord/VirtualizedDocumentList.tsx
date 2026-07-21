import { Button } from '../../ustc-ui/Button/Button';
import { List, useDynamicRowHeight, useListRef } from 'react-window';
import { WrappedIcon } from '@web-client/ustc-ui/Icon/Icon';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

interface VirtualizedDocumentListProps {
  docketEntries: any[];
  viewDocumentId: string;
  setViewerDocumentToDisplaySequence: Function;
}

export const VirtualizedDocumentList: React.FC<
  VirtualizedDocumentListProps
> = ({ docketEntries, viewDocumentId, setViewerDocumentToDisplaySequence }) => {
  const listRef = useListRef(null);
  const rowHeightManager = useDynamicRowHeight({ defaultRowHeight: 80 });
  const [listDimensions, setListDimensions] = useState<{
    height: number;
    width: number;
  }>();

  // Scroll to the selected document in the virtualized list
  useEffect(() => {
    if (viewDocumentId && listRef.current && listDimensions) {
      const selectedIndex = docketEntries.findIndex(
        entry => entry.docketEntryId === viewDocumentId,
      );
      if (selectedIndex !== -1) {
        listRef.current.scrollToRow({ align: 'center', index: selectedIndex });
      }
    }
  }, [viewDocumentId, docketEntries, listDimensions]);

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

    return (
      <div style={{ ...style, boxShadow: 'inset 0 -1px 0 #dfe1e2' }}>
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
              display: 'block',
              overflow: 'hidden',
              width: '100%',
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
      style={{
        height: '1000px',
        width: '100%',
        padding: 0,
        overflow: 'hidden',
      }}
    >
      <List<object>
        listRef={listRef}
        onResize={setListDimensions}
        rowComponent={Row}
        rowCount={docketEntries.length}
        rowHeight={rowHeightManager}
        rowProps={{}}
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
};

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import React from 'react';

export type DocumentTab = {
  documentId?: string;
  documentType: string;
  eventCode?: string;
  tabTitle: string;
  [key: string]: any;
};

type ScanDocumentTabsProps = {
  documentTabs?: DocumentTab[] | Record<string, any>[];
  isFileUploaded: (eventCode?: string) => boolean;
  onSelect: ((documentId?: string) => void) | (() => void) | Function;
  scanOnly?: boolean;
};

export const ScanDocumentTabs = ({
  documentTabs,
  isFileUploaded,
  onSelect,
  scanOnly = false,
}: ScanDocumentTabsProps) => {
  if (!documentTabs || documentTabs.length <= 1) {
    return null;
  }

  return (
    <Tabs
      bind={
        scanOnly
          ? 'currentViewMetadata.documentSelectedForPreview'
          : 'currentViewMetadata.documentSelectedForScan'
      }
      className="document-select container-tabs margin-top-neg-205 margin-x-neg-205"
      onSelect={onSelect}
    >
      {documentTabs.map((documentTab: any) => {
        const fileUploaded = isFileUploaded(documentTab.eventCode);
        const dataTestId = documentTab.documentType.includes(' ')
          ? documentTab.documentType
          : `tabButton-${documentTab.documentType}`;
        return (
          <Tab
            data-testid={dataTestId}
            icon={
              fileUploaded ? (
                <>
                  <FontAwesomeIcon
                    color="green"
                    data-testid={`icon-${documentTab.documentType}`}
                    icon={['fas', 'check-circle']}
                  />
                </>
              ) : undefined
            }
            key={`tabButton-${documentTab.documentType}`}
            tabName={documentTab.documentType}
            title={documentTab.tabTitle}
          />
        );
      })}
    </Tabs>
  );
};

ScanDocumentTabs.displayName = 'ScanDocumentTabs';

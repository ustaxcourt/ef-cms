import { PdfPreview } from '../../ustc-ui/PdfPreview/PdfPreview';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const PetitionQcDocumentPreview = connect(
  {
    selectDocumentForPetitionQcPreviewSequence:
      sequences.selectDocumentForPetitionQcPreviewSequence,
  },
  function PetitionQcDocumentPreview({
    documentTabs,
    selectDocumentForPetitionQcPreviewSequence,
    title,
  }) {
    const renderIframePreview = () => {
      return (
        <>
          <div className="padding-top-4">
            <PdfPreview />
          </div>
        </>
      );
    };

    const renderTabs = documentTabs => {
      if (documentTabs && documentTabs.length > 1) {
        return (
          <Tabs
            bind="currentViewMetadata.documentSelectedForPreview"
            className="document-select container-tabs margin-top-neg-205 margin-x-neg-205"
            onSelect={() => {
              selectDocumentForPetitionQcPreviewSequence();
            }}
          >
            {documentTabs.map(documentTab => (
              <Tab
                key={documentTab.documentType}
                tabName={documentTab.documentType}
                title={documentTab.title}
              />
            ))}
          </Tabs>
        );
      }

      return null;
    };

    return (
      <>
        <div className="scanner-area-header">
          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap">
              <div className="grid-col-6">
                <h3 className="margin-bottom-0 margin-left-105">{title}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="document-select-container">
          {renderTabs(documentTabs)}
          {renderIframePreview()}
        </div>
      </>
    );
  },
);

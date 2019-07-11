import { Accordion, AccordionItem } from '../../ustc-ui/Accordion/Accordion';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const ViewAllDocuments = connect(
  {
    viewAllDocumentsHelper: state.viewAllDocumentsHelper,
  },
  ({ viewAllDocumentsHelper }) => {
    return (
      <React.Fragment>
        <div className="grid-container">
          <div className="grid-row grid-gap">
            <div className="tablet:grid-col-12">
              <h1
                className="margin-bottom-05"
                id="file-a-document-header"
                tabIndex="-1"
              >
                All Document Categories
              </h1>
              <p className="margin-bottom-5 margin-top-05 ">
                Select the document type under the category you wish to file....
              </p>
              <Accordion headingLevel="3">
                {viewAllDocumentsHelper.sections.map((title, index) => {
                  return (
                    <AccordionItem key={`item-${index}`} title={title}>
                      <div className="all-columns-view">
                        {viewAllDocumentsHelper.categoryMap[title].map(
                          (document, index) => (
                            <button
                              className="usa-button usa-button--unstyled margin-bottom-1"
                              key={`${title}-document-${index}`}
                            >
                              {document.documentType}
                            </button>
                          ),
                        )}
                      </div>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  },
);

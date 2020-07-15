import { CorrespondenceHeader } from './CorrespondenceHeader';
import { CorrespondenceViewerCorrespondence } from './CorrespondenceViewerCorrespondence';
import { DeleteCorrespondenceModal } from './DeleteCorrespondenceModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useEffect } from 'react';
import classNames from 'classnames';

export const Correspondence = connect(
  {
    formattedCaseDetail: state.formattedCaseDetail,
    loadDefaultViewerCorrespondenceSequence:
      sequences.loadDefaultViewerCorrespondenceSequence,
    setViewerCorrespondenceToDisplaySequence:
      sequences.setViewerCorrespondenceToDisplaySequence,
    showModal: state.modal.showModal,
    viewerCorrespondenceToDisplay: state.viewerCorrespondenceToDisplay,
  },
  function Correspondence({
    formattedCaseDetail,
    loadDefaultViewerCorrespondenceSequence,
    setViewerCorrespondenceToDisplaySequence,
    showModal,
    viewerCorrespondenceToDisplay,
  }) {
    useEffect(() => {
      loadDefaultViewerCorrespondenceSequence();
      return;
    }, []);

    return (
      <>
        <CorrespondenceHeader />
        {formattedCaseDetail.correspondence.length === 0 && (
          <p>There are no correspondence files.</p>
        )}
        {formattedCaseDetail.correspondence.length > 0 && (
          <div className="grid-row grid-gap-5">
            <div className="grid-col-4">
              <div className="border border-base-lighter">
                <table className="document-viewer usa-table case-detail docket-record responsive-table row-border-only">
                  <thead>
                    <tr>
                      <th className="small">Date</th>
                      <th>Correspondence Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formattedCaseDetail.correspondence.map((document, idx) => {
                      return (
                        <tr
                          className={classNames(
                            'row-button',
                            viewerCorrespondenceToDisplay &&
                              viewerCorrespondenceToDisplay.documentId ===
                                document.documentId &&
                              'active',
                          )}
                          key={idx}
                          onClick={() => {
                            setViewerCorrespondenceToDisplaySequence({
                              viewerCorrespondenceToDisplay: document,
                            });
                          }}
                        >
                          <td className="small">
                            {document.formattedFilingDate}
                          </td>
                          <td>{document.documentTitle}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid-col-8">
              <CorrespondenceViewerCorrespondence />
            </div>
          </div>
        )}

        {showModal === 'DeleteCorrespondenceModal' && (
          <DeleteCorrespondenceModal />
        )}
      </>
    );
  },
);

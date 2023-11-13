import { Button } from '../../ustc-ui/Button/Button';
import { CorrespondenceHeader } from './CorrespondenceHeader';
import { CorrespondenceViewerCorrespondence } from './CorrespondenceViewerCorrespondence';
import { DeleteCorrespondenceModal } from './DeleteCorrespondenceModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect } from 'react';
import classNames from 'classnames';

export const Correspondence = connect(
  {
    correspondenceId: state.correspondenceId,
    formattedCaseDetail: state.formattedCaseDetail,
    loadDefaultViewerCorrespondenceSequence:
      sequences.loadDefaultViewerCorrespondenceSequence,
    setViewerCorrespondenceToDisplaySequence:
      sequences.setViewerCorrespondenceToDisplaySequence,
    showModal: state.modal.showModal,
    viewerCorrespondenceToDisplay: state.viewerCorrespondenceToDisplay,
  },
  function Correspondence({
    correspondenceId,
    formattedCaseDetail,
    loadDefaultViewerCorrespondenceSequence,
    setViewerCorrespondenceToDisplaySequence,
    showModal,
    viewerCorrespondenceToDisplay,
  }) {
    useEffect(() => {
      loadDefaultViewerCorrespondenceSequence({
        correspondenceId,
      });
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
              <div className="border border-base-lighter document-viewer--documents document-viewer--documents-list-container">
                <div className="grid-row padding-left-205 grid-header">
                  <div className="grid-col-3">Date</div>
                  <div className="grid-col-5">Correspondence Description</div>
                  <div className="grid-col-2"></div>
                </div>
                <div className="document-viewer--documents-list">
                  {formattedCaseDetail.correspondence.map(correspondence => {
                    const isActive =
                      viewerCorrespondenceToDisplay &&
                      viewerCorrespondenceToDisplay.correspondenceId ===
                        correspondence.correspondenceId;
                    return (
                      <Button
                        className={classNames(
                          'usa-button--unstyled attachment-viewer-button',
                          isActive && 'active',
                        )}
                        isActive={isActive}
                        key={correspondence.correspondenceId}
                        onClick={() => {
                          setViewerCorrespondenceToDisplaySequence({
                            viewerCorrespondenceToDisplay: correspondence,
                          });
                        }}
                      >
                        <div className="grid-row margin-left-205">
                          <div className="grid-col-2 text-align-center">
                            {correspondence.formattedFilingDate}
                          </div>
                          <div
                            className={classNames(
                              'grid-col-3',
                              correspondence.isStricken &&
                                'stricken-docket-record',
                            )}
                          >
                            {correspondence.createdAtFormatted}
                          </div>
                          <div className="grid-col-5">
                            {correspondence.documentTitle}
                            {correspondence.isStricken && ' (STRICKEN)'}
                          </div>
                          <div className="grid-col-2 padding-left-105">
                            {correspondence.showNotServed && (
                              <span className="text-semibold not-served">
                                Not served
                              </span>
                            )}
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
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

Correspondence.displayName = 'Correspondence';

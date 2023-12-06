import { Button } from '../../ustc-ui/Button/Button';
import { CaseDifferenceExplained } from '../CaseDifferenceExplained';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Overlay } from '../../ustc-ui/Overlay/Overlay';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const CaseDifferenceModalOverlay = connect(
  {
    clearModalSequence: sequences.clearModalSequence,
  },
  function CaseDifferenceModalOverlay({ clearModalSequence }) {
    return (
      <>
        <Overlay
          className="case-difference-overlay"
          onEscSequence="clearModalSequence"
        >
          <div className="overlay-blue-header">
            <div className="grid-container">
              <Button
                link
                aria-roledescription="button to return to Create a Case"
                className="heading-3"
                onClick={() => clearModalSequence()}
              >
                <FontAwesomeIcon icon="caret-left" />
                Back to Create a Case
              </Button>
            </div>
          </div>
          <div className="grid-container">
            <CaseDifferenceExplained />
          </div>
        </Overlay>
      </>
    );
  },
);

CaseDifferenceModalOverlay.displayName = 'CaseDifferenceModalOverlay';

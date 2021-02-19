import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useEffect, useRef } from 'react';

export const EditCaseTrialInformationMenu = connect(
  {
    isEditCaseTrialInformationMenuOpen:
      state.menuHelper.isEditCaseTrialInformationMenuOpen,
    openRemoveFromTrialSessionModalSequence:
      sequences.openRemoveFromTrialSessionModalSequence,
    resetEditCaseTrialInfoMenuSequence:
      sequences.resetEditCaseTrialInfoMenuSequence,
    toggleEditCaseTrialInfoMenuSequence:
      sequences.toggleEditCaseTrialInfoMenuSequence,
    trialSessionId: state.caseDetail.trialSessionId,
  },
  function EditCaseTrialInformationMenu({
    isEditCaseTrialInformationMenuOpen,
    openRemoveFromTrialSessionModalSequence,
    resetEditCaseTrialInfoMenuSequence,
    toggleEditCaseTrialInfoMenuSequence,
    trialSessionId,
  }) {
    const menuRef = useRef(null);
    const keydown = event => {
      const pressedESC = event.keyCode === 27;
      if (pressedESC) {
        return resetEditCaseTrialInfoMenuSequence();
      }
    };

    const reset = e => {
      const clickedWithinComponent = menuRef.current.contains(e.target);
      const clickedOnMenuButton = e.target.closest('.trial-session-edit-btn');
      const clickedOnSubNav = e.target.closest('.edit-case-trial-menu');
      if (!clickedWithinComponent) {
        return resetEditCaseTrialInfoMenuSequence();
      } else if (!clickedOnMenuButton && !clickedOnSubNav) {
        return resetEditCaseTrialInfoMenuSequence();
      }
      return true;
    };

    useEffect(() => {
      window.document.addEventListener('mousedown', reset, false);
      window.document.addEventListener('keydown', keydown, false);
      return () => {
        window.document.removeEventListener('mousedown', reset, false);
        window.document.removeEventListener('keydown', keydown, false);
        return resetEditCaseTrialInfoMenuSequence();
      };
    }, []);

    return (
      <div ref={menuRef}>
        <Button
          link
          className={'trial-session-edit-btn margin-right-0'}
          id="edit-case-trial-information-btn"
          onClick={() => {
            toggleEditCaseTrialInfoMenuSequence({
              editCaseTrialInfoMenu: 'EditCaseTrialInformationMenu',
            });
          }}
        >
          Edit{' '}
          <FontAwesomeIcon
            className="margin-left-105"
            icon={
              isEditCaseTrialInformationMenuOpen ? 'caret-up' : 'caret-down'
            }
            size="lg"
          />
        </Button>
        {isEditCaseTrialInformationMenuOpen && (
          <div className="edit-case-trial-menu">
            <Button link className="margin-right-0">
              Add/Edit Calendar Note
            </Button>
            <Button
              link
              className="margin-right-0"
              id="remove-from-trial-session-btn"
              onClick={() => {
                openRemoveFromTrialSessionModalSequence({
                  trialSessionId: trialSessionId,
                });
              }}
            >
              Remove From Trial
            </Button>
          </div>
        )}
      </div>
    );
  },
);

import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React, { useEffect, useRef } from 'react';

export const DropdownMenu = connect(
  {
    caseDetail: state.formattedCaseDetail,
    id: props.id,
    clearDropDownMenuStateSequence: sequences.clearDropDownMenuStateSequence,
    isMenuOpen: state[props.menuState],
    menuItems: props.menuItems,
    menuState: props.menuState,
    openAddEditCalendarNoteModalSequence:
      sequences.openAddEditCalendarNoteModalSequence,
    openRemoveFromTrialSessionModalSequence:
      sequences.openRemoveFromTrialSessionModalSequence,
    toggleEditCaseTrialInfoMenuSequence:
      sequences.toggleEditCaseTrialInfoMenuSequence,
    toggleMenuStateSequence: sequences.toggleMenuStateSequence,
    trialSessionId: state.caseDetail.trialSessionId,
  },
  function DropdownMenu({
    clearDropDownMenuStateSequence,
    isMenuOpen,
    id,
    menuItems,
    menuState,
    toggleMenuStateSequence,
  }) {
    const menuRef = useRef(null);

    const keydown = event => {
      const pressedESC = event.keyCode === 27;
      if (pressedESC) {
        return clearDropDownMenuStateSequence({
          menuState,
        });
      }
    };

    const reset = e => {
      const clickedWithinComponent = menuRef.current.contains(e.target);
      const clickedOnMenuButton = e.target.closest('.trial-session-edit-btn');
      const clickedOnSubNav = e.target.closest('.edit-case-trial-menu');
      if (!clickedWithinComponent) {
        return clearDropDownMenuStateSequence({
          menuState,
        });
      } else if (!clickedOnMenuButton && !clickedOnSubNav) {
        return clearDropDownMenuStateSequence({
          menuState,
        });
      }
      return true;
    };

    useEffect(() => {
      window.document.addEventListener('mousedown', reset, false);
      window.document.addEventListener('keydown', keydown, false);
      return () => {
        window.document.removeEventListener('mousedown', reset, false);
        window.document.removeEventListener('keydown', keydown, false);
        return clearDropDownMenuStateSequence({
          menuState,
        });
      };
    }, []);

    return (
      <div ref={menuRef}>
        <Button
          link
          id={id}
          className={'trial-session-edit-btn margin-right-0'}
          id="edit-case-trial-information-btn"
          onClick={() => {
            toggleMenuStateSequence({
              menuState,
            });
          }}
        >
          Edit{' '}
          <FontAwesomeIcon
            className="margin-left-105"
            icon={isMenuOpen ? 'caret-up' : 'caret-down'}
            size="lg"
          />
        </Button>
        {isMenuOpen && (
          <div className="edit-case-trial-menu">
            {menuItems.map(item => (
              <Button
                link
                id={item.id}
                className="margin-right-0"
                key={item.label}
                onClick={() => {
                  clearDropDownMenuStateSequence({
                    menuState,
                  });
                  item.click();
                }}
              >
                {item.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  },
);

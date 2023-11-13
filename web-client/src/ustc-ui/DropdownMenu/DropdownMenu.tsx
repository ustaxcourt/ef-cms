import { Button } from '../Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect, useRef } from 'react';

export const DropdownMenu = connect(
  {
    caseDetail: state.formattedCaseDetail,
    clearDropDownMenuStateSequence: sequences.clearDropDownMenuStateSequence,
    id: props.id,
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
  },
  function DropdownMenu({
    clearDropDownMenuStateSequence,
    id,
    isMenuOpen,
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
          className={'trial-session-edit-btn margin-right-0'}
          icon={isMenuOpen ? 'caret-up' : 'caret-down'}
          iconRight={true}
          iconSize="lg"
          id={id}
          onClick={() => {
            toggleMenuStateSequence({
              menuState,
            });
          }}
        >
          Edit{' '}
        </Button>
        {isMenuOpen && (
          <div className="edit-case-trial-menu">
            {menuItems.map(item => (
              <Button
                link
                className="margin-right-0"
                id={item.id}
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

DropdownMenu.displayName = 'DropdownMenu';

import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';

export const ReportsMenuItems = () => {
  return (
    <ul className="usa-unstyled-list">
      <li>
        <a
          className="reports-menu-item usa-button usa-button--unstyled"
          href="/reports/case-deadlines"
          id="all-deadlines"
        >
          Deadlines
        </a>
      </li>
    </ul>
  );
};

export const ReportsMenu = connect(
  {
    isReportsMenuOpen: state.menuHelper.isReportsMenuOpen,
    toggleReportsMenu: sequences.toggleReportsMenuSequence,
    user: state.user,
  },
  ({ isReportsMenuOpen, toggleReportsMenu }) => {
    return (
      <div
        className={
          isReportsMenuOpen ? 'reports-menu open' : 'reports-menu closed'
        }
      >
        <div className="reports-button-container margin-top-neg-1">
          <button
            aria-label="reports menu"
            className="usa-button usa-button--unstyled header-tab-button"
            type="button"
            onClick={() => toggleReportsMenu()}
          >
            Reports
          </button>
        </div>
        {isReportsMenuOpen && <ReportsMenuContent />}
      </div>
    );
  },
);

class ReportsMenuContentComponent extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    const targetClasses = Array.from(e.target.classList);
    if (targetClasses.includes('reports-menu-item')) {
      return true;
    } else {
      // set a small delay to account for state updates in parent
      setTimeout(this.props.closeReportsMenu, 200);
    }
  }
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick);
  }

  render() {
    return <div className="reports-menu-content">{ReportsMenuItems()}</div>;
  }
}

ReportsMenuContentComponent.propTypes = {
  closeReportsMenu: PropTypes.func,
  signOutSequence: PropTypes.func.isRequired,
};

ReportsMenuItems.propTypes = {
  signOut: PropTypes.func,
};

const ReportsMenuContent = connect(
  {
    closeReportsMenu: sequences.closeReportsMenuSequence,
    signOutSequence: sequences.signOutSequence,
  },
  ReportsMenuContentComponent,
);

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';

export const AccountMenuItems = ({ signOut }) => {
  return (
    <ul className="usa-unstyled-list">
      <li>
        <button
          className="account-menu-item usa-button--unstyled"
          id="log-out"
          onClick={() => {
            signOut();
          }}
        >
          Log Out
        </button>
      </li>
    </ul>
  );
};

export const AccountMenu = connect(
  {
    isMenuOpen: state.accountMenuHelper.isMenuOpen,
    signOutSequence: sequences.signOutSequence,
    toggleAccountMenu: sequences.toggleAccountMenuSequence,
    user: state.user,
  },
  ({ isMenuOpen, toggleAccountMenu, user }) => {
    return (
      <div className={isMenuOpen ? 'account-menu open' : 'account-menu closed'}>
        <div className="account-button-container">
          <button
            aria-label="account menu"
            className="button-account-menu"
            title={`Hello, ${user.name}`}
            type="button"
            onClick={() => toggleAccountMenu()}
          >
            <FontAwesomeIcon
              className="account-menu-icon user-icon"
              icon={['far', 'user']}
            />
            <FontAwesomeIcon
              className="account-menu-icon caret"
              icon={['fa', 'caret-down']}
            />
          </button>
        </div>
        {isMenuOpen && <AccountMenuContent />}
      </div>
    );
  },
);

class AccountMenuContentComponent extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    const targetClasses = Array.from(e.target.classList);
    if (targetClasses.includes('account-menu-item')) {
      return true;
    } else {
      // set a small delay to account for state updates in parent
      setTimeout(this.props.closeAccountMenu, 200);
    }
  }
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick);
  }

  render() {
    return (
      <div className="account-menu-content">
        {AccountMenuItems({ signOut: this.props.signOutSequence })}
      </div>
    );
  }
}

AccountMenuContentComponent.propTypes = {
  closeAccountMenu: PropTypes.func,
  signOutSequence: PropTypes.func.isRequired,
};

AccountMenuItems.propTypes = {
  signOut: PropTypes.func,
};

const AccountMenuContent = connect(
  {
    closeAccountMenu: sequences.closeAccountMenuSequence,
    signOutSequence: sequences.signOutSequence,
  },
  AccountMenuContentComponent,
);

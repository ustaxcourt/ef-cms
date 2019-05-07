import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';

class AccountMenuComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
    };
  }

  openMenu() {
    this.setState({ menuOpen: true });
  }

  closeMenu() {
    this.setState({ menuOpen: false });
  }

  render() {
    const { user } = this.props;
    const { menuOpen } = this.state;
    return (
      <div className="account-menu open">
        <div className="account-button-container">
          <button
            title={`Hello, ${user.name}`}
            type="button"
            className="button-account-menu"
            aria-label="logout"
            onClick={menuOpen ? () => null : () => this.openMenu()}
          >
            <FontAwesomeIcon
              icon={['fa', 'user']}
              className="account-menu-icon"
            />
          </button>
        </div>
        {menuOpen && <AccountMenuContent close={() => this.closeMenu()} />}
      </div>
    );
  }
}

class AccountMenuContentComponent extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    const targetClasses = Array.from(e.target.classList);
    if (
      targetClasses.indexOf('account-menu-item') > -1 &&
      targetClasses.indexOf('button-account-menu') > -1
    ) {
      return true;
    } else {
      // set a small delay to account for state updates in parent
      setTimeout(this.props.close, 100);
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
        <ul className="usa-unstyled-list">
          <li>
            <a
              className="account-menu-item"
              href="/"
              onClick={() => {
                this.props.signOutSequence();
              }}
            >
              Log Out
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

AccountMenuComponent.propTypes = {
  user: PropTypes.object,
};

AccountMenuContentComponent.propTypes = {
  close: PropTypes.func.isRequired,
  signOutSequence: PropTypes.func.isRequired,
};

const AccountMenuContent = connect(
  { signOutSequence: sequences.signOutSequence },
  AccountMenuContentComponent,
);

export const AccountMenu = connect(
  { signOutSequence: sequences.signOutSequence, user: state.user },
  AccountMenuComponent,
);

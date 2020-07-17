import { camelCase } from 'lodash';
import { connect } from '@cerebral/react';
import {
  decorateWithPostCallback,
  useCerebralStateFactory,
} from '../utils/useCerebralState';
import { getDefaultAttribute, map } from '../utils/ElementChildren';
import { props, sequences, state } from 'cerebral';
import React, { useState } from 'react';
import classNames from 'classnames';

let FontAwesomeIcon;

if (process.env.NODE_ENV === 'test') {
  FontAwesomeIcon = function FontAwesomeIcon() {
    return <i className="fa" />;
  };
} else {
  ({ FontAwesomeIcon } = require('@fortawesome/react-fontawesome'));
}

/**
 * Tab
 */
export function Tab() {}

/**
 * TabsComponent
 *
 * @param {*} properties the props
 * @returns {*} the rendered component
 */
export function TabsComponent({
  asSwitch,
  bind,
  boxed,
  children,
  className,
  defaultActiveTab,
  id,
  onSelect,
  simpleSetter,
  value,
}) {
  // TODO - Refactor how tab selection sets documentSelectedForScan
  let activeKey, setTab;

  defaultActiveTab =
    defaultActiveTab || getDefaultAttribute(children, 'tabName');

  if (bind) {
    const useCerebralState = useCerebralStateFactory(
      simpleSetter,
      value || defaultActiveTab,
    );
    [activeKey, setTab] = useCerebralState(bind, defaultActiveTab);
  } else {
    [activeKey, setTab] = useState(defaultActiveTab);
  }

  setTab = decorateWithPostCallback(setTab, onSelect);

  const renderTab = child => {
    const { icon, iconColor, id, showIcon, tabName, title } = child.props;

    const isActiveTab = tabName === activeKey;
    const tabContentId = asSwitch ? '' : `tabContent-${camelCase(tabName)}`;

    const liClass = classNames('ustc-ui-tabs', {
      active: isActiveTab,
      'grid-col': boxed,
    });

    if (!title) {
      return null;
    }

    return (
      <li className={liClass}>
        <button
          aria-controls={tabContentId}
          aria-selected={isActiveTab}
          id={id}
          role="tab"
          type="button"
          onClick={() => setTab(tabName)}
        >
          <span>{title}</span>{' '}
          {showIcon && (
            <FontAwesomeIcon color={iconColor || null} icon={icon} />
          )}
        </button>
      </li>
    );
  };

  const renderTabContent = child => {
    const { children, tabName } = child.props;
    const isActiveTab = tabName === activeKey;
    const tabContentId = `tabContent-${camelCase(tabName)}`;

    let contentProps = {
      className: 'tab-content',
      id: tabContentId,
      role: 'tabpanel',
    };

    if (asSwitch) {
      contentProps = {};
    }

    if (tabName && isActiveTab && children) {
      return <div {...contentProps}>{children}</div>;
    }

    return null;
  };

  const renderNonTab = child => {
    const { tabName } = child.props;

    if (!tabName) {
      return child;
    }

    return null;
  };

  const navItems = map(children, child => child.props.title && child);
  const hasNav = !!(navItems && navItems.length);

  const tabsClass = classNames(
    'ustc-ui-tabs',
    className || '',
    hasNav && `ustc-num-tabs-${navItems.length}`,
  );

  let baseProps = {
    className: tabsClass,
    id,
  };

  if (asSwitch) {
    baseProps = {};
  }

  return (
    <div {...baseProps}>
      {hasNav && (
        <nav className={classNames({ 'grid-container padding-x-0': boxed })}>
          <ul
            className={classNames('ustc-ui-tabs', { 'grid-row': boxed })}
            role="tablist"
          >
            {map(children, renderTab)}
          </ul>
        </nav>
      )}
      {map(children, renderNonTab)}
      {map(children, renderTabContent)}
    </div>
  );
}

export const Tabs = connect(
  {
    bind: props.bind,
    simpleSetter: sequences.cerebralBindSimpleSetStateSequence,
    value: state[props.bind],
  },
  TabsComponent,
);

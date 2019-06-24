import { camelCase } from 'lodash';
import { connect } from '@cerebral/react';
import { decorateWithPostCallback } from '../utils/useCerebralState';
import { getDefaultAttribute, map } from '../utils/ElementChildren';
import { props, sequences, state } from 'cerebral';
import { useCerebralStateFactory } from '../utils/useCerebralState';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import classNames from 'classnames';

export function Tab() {}

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
  let activeKey, setTab;

  defaultActiveTab =
    defaultActiveTab || getDefaultAttribute(children, 'tabName');

  if (bind) {
    const useCerebralState = useCerebralStateFactory(simpleSetter, value);
    [activeKey, setTab] = useCerebralState(bind, defaultActiveTab);
  } else {
    [activeKey, setTab] = useState(defaultActiveTab);
  }

  setTab = decorateWithPostCallback(setTab, onSelect);

  function renderTab(child) {
    const { id, tabName, title } = child.props;

    const isActiveTab = tabName === activeKey;
    const tabContentId = asSwitch ? '' : `tabContent-${camelCase(tabName)}`;

    var liClass = classNames({
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
          <span>{title}</span>
        </button>
      </li>
    );
  }

  function renderTabContent(child) {
    const { children, tabName } = child.props;
    const isActiveTab = tabName === activeKey;
    const tabContentId = `tabContent-${camelCase(tabName)}`;

    let contentProps = {
      className: 'tabcontent',
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
  }

  function renderNonTab(child) {
    const { tabName } = child.props;

    if (!tabName) {
      return child;
    }

    return null;
  }

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
          <ul className={classNames({ 'grid-row': boxed })} role="tablist">
            {map(children, renderTab)}
          </ul>
        </nav>
      )}
      {map(children, renderNonTab)}
      {map(children, renderTabContent)}
    </div>
  );
}

TabsComponent.propTypes = {
  asSwitch: PropTypes.bool,
  bind: PropTypes.string,
  boxed: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  defaultActiveTab: PropTypes.string,
  id: PropTypes.string,
  onSelect: PropTypes.func,
  simpleSetter: PropTypes.func,
  value: PropTypes.any,
};

export const Tabs = connect(
  {
    bind: props.bind,
    simpleSetter: sequences.cerebralBindSimpleSetStateSequence,
    value: state[props.bind],
  },
  TabsComponent,
);

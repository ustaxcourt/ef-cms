import React, { useState } from 'react';
import { connect } from '@cerebral/react';
import { getDefaultAttribute, map } from '../utils/ElementChildren';
import classNames from 'classnames';
import { camelCase } from 'lodash';
import { decorateWithPostCallback } from '../utils/useCerebralState';
import { props, sequences, state } from 'cerebral';
import PropTypes from 'prop-types';
import { useCerebralStateFactory } from '../utils/useCerebralState';

export function Tab() {}

export function TabsComponent({
  id,
  bind,
  value,
  simpleSetter,
  onSelect,
  children,
  defaultActiveTab,
  className,
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

  const tabsClass = classNames('ustc-ui-tabs', className || '');

  function renderTab(child) {
    const { title, tabName, id } = child.props;

    const isActiveTab = tabName === activeKey;
    const tabContentId = `tabContent-${camelCase(tabName)}`;

    var liClass = classNames({
      active: isActiveTab,
    });

    if (!tabName) {
      return null;
    }

    return (
      <li className={liClass}>
        <button
          role="tab"
          type="button"
          className="tab-link"
          id={id}
          aria-controls={tabContentId}
          aria-selected={isActiveTab}
          onClick={() => setTab(tabName)}
        >
          {title}
        </button>
      </li>
    );
  }

  function renderTabContent(child) {
    const { children, tabName } = child.props;
    const isActiveTab = tabName === activeKey;
    const tabContentId = `tabContent-${camelCase(tabName)}`;

    if (!tabName) {
      return null;
    }

    if (isActiveTab) {
      return (
        <div className="tabcontent" role="tabpanel" id={tabContentId}>
          {children}
        </div>
      );
    } else {
      return null;
    }
  }

  function renderNonTab(child) {
    const { tabName } = child.props;

    if (!tabName) {
      return child;
    }

    return null;
  }

  return (
    <div id={id} className={tabsClass}>
      <nav>
        <ul role="tablist">{map(children, renderTab)}</ul>
      </nav>
      {map(children, renderNonTab)}
      {map(children, renderTabContent)}
    </div>
  );
}

TabsComponent.propTypes = {
  bind: PropTypes.string,
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

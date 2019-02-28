import React, { useState } from 'react';
import { connect } from '@cerebral/react';
import { getDefaultAttribute, map } from '../utils/ElementChildren';
import classNames from 'classnames';
import { camelCase } from 'lodash';
import {
  useCerebralState,
  decorateWithPostCallback,
} from '../utils/useCerebralState';

export function Tab() {}

export function TabsComponent(props) {
  let { get, bind, onSelect, children, defaultActiveTab } = props;

  let activeKey, setTab;

  defaultActiveTab =
    defaultActiveTab || getDefaultAttribute(children, 'tabName');

  if (bind) {
    [activeKey, setTab] = useCerebralState(get, bind, defaultActiveTab);
  } else {
    [activeKey, setTab] = useState(defaultActiveTab);
  }

  setTab = decorateWithPostCallback(setTab, onSelect);

  function renderTab(child) {
    const { title, tabName, id } = child.props;

    const isActiveTab = tabName === activeKey;
    const tabContentId = `tabContent-${camelCase(tabName)}`;

    var liClass = classNames({
      active: isActiveTab,
    });

    return (
      <li className={liClass}>
        <button
          role="tab"
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

    if (isActiveTab) {
      return (
        <div role="tabpanel" id={tabContentId}>
          {children}
        </div>
      );
    } else {
      return null;
    }
  }

  return (
    <>
      <nav className="horizontal-tabs subsection">
        <ul role="tablist">{map(children, renderTab)}</ul>
      </nav>

      {map(children, renderTabContent)}
    </>
  );
}

export const Tabs = connect(TabsComponent);

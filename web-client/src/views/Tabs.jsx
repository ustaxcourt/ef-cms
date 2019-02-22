import React, { useState } from 'react';
import { connect } from '@cerebral/react';
import { forEach, map } from './utils/ElementChildren';
import classNames from 'classnames';
import { camelCase } from 'lodash';
import {
  useCerebralState,
  decorateWithPostCallback,
  decorateWithPreemptiveCallback,
} from './utils/useCerebralState';

// maybe no default search is needed
function getDefaultActiveKey(children) {
  let defaultActiveKey;
  forEach(children, child => {
    if (defaultActiveKey == null) {
      defaultActiveKey = child.props.tabName;
    }
  });

  return defaultActiveKey;
}

export function Tab() {}

export const Tabs = connect(function Tabs(props) {
  let { get, bind, onSelect, children, defaultActiveTab } = props;

  let activeKey, setTab;

  defaultActiveTab = defaultActiveTab || getDefaultActiveKey(children);

  if (bind) {
    [activeKey, setTab] = useCerebralState(get, bind, defaultActiveTab);
  } else {
    [activeKey, setTab] = useState(defaultActiveTab);
  }

  setTab = decorateWithPostCallback(setTab, onSelect);

  function tabHasChanged(tabName) {
    return activeKey !== tabName;
  }

  setTab = decorateWithPreemptiveCallback(setTab, tabHasChanged);

  function renderTab(child) {
    const { title, tabName, id } = child.props;

    const isActiveTab = tabName === activeKey;
    const tabContentId = `tabContent-${camelCase(tabName)}`;

    var liClass = classNames({
      active: isActiveTab,
    });

    if (title == null) {
      return null;
    }

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
});

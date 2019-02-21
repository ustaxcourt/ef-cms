import React, { useState } from 'react';

import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import { forEach, map } from './utils/ElementChildren';
import classNames from 'classnames';
import { camelCase } from 'lodash';

function getDefaultActiveKey(children) {
  let defaultActiveKey;
  forEach(children, child => {
    if (defaultActiveKey == null) {
      defaultActiveKey = child.props.eventKey;
    }
  });

  return defaultActiveKey;
}
export function Tab() {}

export const Tabs = connect(function Tabs(props) {
  let { get, bind, onSelect, children, defaultActiveTab } = props;

  let activeKey, setTab;

  defaultActiveTab = defaultActiveTab || getDefaultActiveKey(children);
  onSelect = onSelect || (() => {});

  if (bind) {
    activeKey = get(state[bind]);
    setTab = newTab => {
      get(sequences.cerebralBindSimpleSetStateSequence)({
        key: bind,
        value: newTab,
      });
    };
    if (!activeKey) {
      setTab((activeKey = defaultActiveTab));
    }
  } else {
    [activeKey, setTab] = useState(defaultActiveTab);
  }

  setTab = (setterFn => {
    return (...args) => {
      setterFn(...args);
      onSelect(...args);
    };
  })(setTab);

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

import { camelCase } from 'lodash';
import { connect } from '@web-client/presenter/shared.cerebral';
import {
  decorateWithPostCallback,
  useCerebralStateFactory,
} from '../Utils/useCerebralState';
import { getDefaultAttribute, map } from '../Utils/ElementChildren';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { ReactNode, useState } from 'react';
import classNames from 'classnames';

const renderTabFactory = ({
  activeKey,
  asSwitch,
  boxed,
  headingLevel,
  setTab,
}) =>
  function TabComponent(child) {
    const {
      children: tabChildren,
      className: childClassName,
      disabled,
      icon,
      id: tabId,
      tabName,
      title,
    } = child.props;

    const isActiveTab = tabName === activeKey;
    const tabContentId =
      asSwitch || !tabChildren ? undefined : `tabContent-${camelCase(tabName)}`;
    const buttonId = tabId || `tabButton-${camelCase(tabName)}`;

    const liClass = classNames('ustc-ui-tabs', {
      active: isActiveTab,
      'grid-col': boxed,
    });

    if (!title) {
      return null;
    }

    const HeadingElement = headingLevel ? `h${headingLevel}` : 'span';
    const tabProps = {
      'aria-controls': tabContentId,
      'aria-selected': isActiveTab,
      className: liClass,
      role: 'tab',
    };

    const buttonProps = {
      className: childClassName,
      disabled,
      id: buttonId,
      onClick: () => setTab(tabName),
      type: 'button',
    };

    return (
      <li {...tabProps}>
        <button {...buttonProps} data-testid={child.props['data-testid']}>
          <HeadingElement className="button-text">{title}</HeadingElement>{' '}
          {icon}
        </button>
      </li>
    );
  };
/**
 * Tab //: This is a strange hollow component that is being used in renderTabFactory + TabsComponent to make a styled component
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Tab(properties: {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  icon?: JSX.Element;
  id?: string;
  tabName?: string;
  title?: string;
}) {
  return <></>;
}

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
  headingLevel,
  id,
  marginBottom = true,
  onSelect,
  simpleSetter,
  value,
}: {
  asSwitch?: boolean;
  bind?: string;
  boxed?: any;
  children: ReactNode;
  className?: string;
  defaultActiveTab?: string;
  headingLevel?: string;
  id?: string;
  marginBottom?: boolean;
  onSelect?: any;
  simpleSetter?: any;
  value?: any;
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

  const renderTabContent = child => {
    const { children: tabChildren, tabName } = child.props;
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

    if (tabName && isActiveTab && tabChildren) {
      return <div {...contentProps}>{tabChildren}</div>;
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

  const TabComponent = renderTabFactory({
    activeKey,
    asSwitch,
    boxed,
    headingLevel,
    marginBottom,
    setTab,
  });

  return (
    <div {...baseProps}>
      {hasNav && (
        <nav className={classNames({ 'grid-container padding-x-0': boxed })}>
          <ul
            className={classNames(
              'ustc-ui-tabs',
              { 'grid-row': boxed },
              !marginBottom && 'margin-bottom-0',
            )}
            role="tablist"
          >
            {map(children, TabComponent)}
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

Tabs.displayName = 'Tabs';

import { camelCase } from 'lodash';
import { connect } from '@cerebral/react';
import { decorateWithPostCallback } from '../utils/useCerebralState';
import { getDefaultAttribute, map } from '../utils/ElementChildren';
import { props, sequences, state } from 'cerebral';
import { useCerebralStateFactory } from '../utils/useCerebralState';
import React, { useState } from 'react';
import classNames from 'classnames';

export function AccordionItem() {}

export const Accordion = connect(
  {
    bind: props.bind,
    simpleSetter: sequences.cerebralBindSimpleSetStateSequence,
    value: state[props.bind],
  },
  ({
    bind,
    bordered,
    children,
    className,
    id,
    onSelect,
    simpleSetter,
    value,
  }) => {
    let activeKey, setTab;

    if (bind) {
      const useCerebralState = useCerebralStateFactory(simpleSetter, value);
      [activeKey, setTab] = useCerebralState(bind);
    } else {
      [activeKey, setTab] = useState();
    }

    setTab = decorateWithPostCallback(setTab, onSelect);

    const renderTab = child => {
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
        <>
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
        </>
      );
    };

    const renderTabContent = child => {
      const { children, tabName } = child.props;
      const isActiveTab = tabName === activeKey;
      const tabContentId = `tabContent-${camelCase(tabName)}`;

      let contentProps = {
        className: 'tabcontent',
        id: tabContentId,
        role: 'tabpanel',
      };

      if (tabName && isActiveTab && children) {
        return <div {...contentProps}>{children}</div>;
      }

      return null;
    };

    const accordionClass = classNames(
      className,
      'usa-accordion',
      bordered && 'usa-accordion--bordered',
    );

    let baseProps = {
      className: accordionClass,
      id,
    };

    return <div {...baseProps}>{map(children, renderTabContent)}</div>;
  },
);

import { connect } from '@cerebral/react';
import { decorateWithPostCallback } from '../utils/useCerebralState';
import { map } from '../utils/ElementChildren';
import { props, sequences, state } from 'cerebral';
import { useCerebralStateFactory } from '../utils/useCerebralState';
import React, { useState } from 'react';
import classNames from 'classnames';

/**
 * AccordionItem
 */
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
    headingLevel,
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

    const toggleAlreadySelectedValueDecorator = delegate => {
      return value => {
        if (activeKey === value) {
          value = '-1';
        }
        delegate(value);
      };
    };

    setTab = toggleAlreadySelectedValueDecorator(setTab);
    setTab = decorateWithPostCallback(setTab, onSelect);

    const renderTab = (child, index) => {
      const { children, id, title } = child.props;
      let { itemName } = child.props;

      itemName = itemName || `item-${index}`;
      const itemId = id || `ustc-ui-accordion-item-${index}`;
      const HeadingElement = `h${headingLevel || 2}`;

      const isActiveTab = itemName === activeKey;
      const expandedText = (isActiveTab && 'true') || 'false';

      if (!title) {
        return null;
      }

      return (
        <>
          <HeadingElement className="usa-accordion__heading">
            <button
              aria-controls={itemId}
              aria-expanded={expandedText}
              className="usa-accordion__button"
              type="button"
              onClick={() => setTab(itemName)}
            >
              {title}
            </button>
          </HeadingElement>
          {isActiveTab && (
            <div className="usa-accordion__content" id={itemId}>
              {children}
            </div>
          )}
        </>
      );
    };

    return (
      <div
        className={classNames(
          className,
          'usa-accordion',
          bordered && 'usa-accordion--bordered',
        )}
        id={id}
      >
        {map(children, renderTab)}
      </div>
    );
  },
);

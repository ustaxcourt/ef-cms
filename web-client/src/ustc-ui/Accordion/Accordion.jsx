import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Mobile, NonMobile } from '../Responsive/Responsive';
import { connect } from '@cerebral/react';
import {
  decorateWithPostCallback,
  useCerebralStateFactory,
} from '../utils/useCerebralState';
import { map } from '../utils/ElementChildren';
import { props, sequences, state } from 'cerebral';
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
  function Accordion({
    bind,
    bordered,
    children,
    className,
    headingLevel,
    id,
    onSelect,
    simpleSetter,
    value,
  }) {
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
          value = '~no item selected~';
        }
        delegate(value);
      };
    };

    setTab = toggleAlreadySelectedValueDecorator(setTab);
    setTab = decorateWithPostCallback(setTab, onSelect);

    const renderTab = (child, index) => {
      const {
        children,
        customClassName,
        displayIcon = false,
        iconClassName,
        iconSize,
        iconTypes,
        id,
        title,
      } = child.props;
      let { itemName } = child.props;

      itemName = itemName || `item-${index}`;
      const itemButtonId = id || `ustc-ui-accordion-item-button-${index}`;
      const itemContentId =
        (id && `${id}-item-content`) ||
        `ustc-ui-accordion-item-content-${index}`;
      const HeadingElement = `h${headingLevel || 2}`;
      const isActiveItem = itemName === activeKey;
      const expandedText = (isActiveItem && 'true') || 'false';

      if (!title) {
        return null;
      }

      return (
        <>
          <HeadingElement
            className={customClassName || 'usa-accordion__heading'}
          >
            <Mobile>
              <span className="grid-container">
                <button
                  aria-controls={itemContentId}
                  aria-expanded={expandedText}
                  className="usa-accordion__button"
                  id={itemButtonId}
                  type="button"
                  onClick={() => setTab(itemName)}
                >
                  <span className="grid-row">
                    {displayIcon && (
                      <span className="grid-col-3">
                        <span className="caseItem__icon">
                          <FontAwesomeIcon
                            className={iconClassName}
                            icon={iconTypes}
                            size={iconSize}
                          />
                        </span>
                      </span>
                    )}
                    <span className="grid-col-7">{title}</span>
                  </span>
                </button>
              </span>
            </Mobile>

            <NonMobile>
              <button
                aria-controls={itemContentId}
                aria-expanded={expandedText}
                className="usa-accordion__button"
                id={itemButtonId}
                type="button"
                onClick={() => setTab(itemName)}
              >
                {displayIcon && (
                  <span className="caseItem__icon">
                    <FontAwesomeIcon
                      className={iconClassName}
                      icon={iconTypes}
                      size={iconSize}
                    />
                  </span>
                )}
                {title}
              </button>
            </NonMobile>
          </HeadingElement>
          {isActiveItem && (
            <div
              className={customClassName || 'usa-accordion__heading'}
              id={itemContentId}
            >
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

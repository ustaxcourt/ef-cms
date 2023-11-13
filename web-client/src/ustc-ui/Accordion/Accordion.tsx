import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@web-client/presenter/shared.cerebral';
import {
  decorateWithPostCallback,
  useCerebralStateFactory,
} from '../Utils/useCerebralState';
import { map } from '../Utils/ElementChildren';
import { pick, uniqueId } from 'lodash';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useState } from 'react';
import classNames from 'classnames';

/**
 * AccordionItem: This is a strange hollow component that is being used in renderAccordionFactory + Accordion to make a styled component
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function AccordionItem(properties: {
  children: React.ReactNode;
  customClassName?: string;
  displayIcon?: boolean;
  iconClassName?: string;
  iconSize?: string;
  iconTypes?: string[];
  id?: string;
  title?: string;
}) {
  return <></>;
}

const renderAccordionFactory = ({ activeKey, headingLevel, setTab }) =>
  function AccordionContent(child, index) {
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
    const itemButtonId =
      id || uniqueId(`ustc-ui-accordion-item-button-${index}`);
    const itemContentId =
      (id && `${id}-item-content`) ||
      uniqueId(`ustc-ui-accordion-item-content-${index}`);
    const HeadingElement = `h${headingLevel || 2}`;
    const isActiveItem = itemName === activeKey;
    const expandedText = (isActiveItem && 'true') || 'false';

    if (!title) {
      return null;
    }
    const buttonProps = {
      'aria-controls': itemContentId,
      'aria-expanded': expandedText,
      className: 'usa-accordion__button grid-container',
      id: itemButtonId,
      onClick: () => setTab(itemName),
      type: 'button',
    };

    return (
      <>
        <HeadingElement className={customClassName || 'usa-accordion__heading'}>
          <button {...buttonProps}>
            <div className="grid-row">
              {displayIcon && (
                <span className="grid-col-auto">
                  <span className="caseItem__icon">
                    <FontAwesomeIcon
                      className={iconClassName}
                      icon={iconTypes}
                      size={iconSize}
                    />
                  </span>
                </span>
              )}
              <div className="accordion-item-title grid-col-8">{title}</div>
            </div>
          </button>
        </HeadingElement>
        {isActiveItem && (
          <div
            className={customClassName || 'usa-accordion__content'}
            id={itemContentId}
          >
            {children}
          </div>
        )}
      </>
    );
  };

export const Accordion = connect(
  {
    bind: props.bind,
    simpleSetter: sequences.cerebralBindSimpleSetStateSequence,
    value: state[props.bind],
  },
  function Accordion(accordionProps) {
    const {
      bind,
      bordered,
      children,
      className,
      headingLevel,
      id,
      onSelect,
      simpleSetter,
      value,
    } = accordionProps;
    const passThroughProps = pick(accordionProps, ['role']);

    let activeKey, setTab;

    if (bind) {
      const useCerebralState = useCerebralStateFactory(simpleSetter, value);
      [activeKey, setTab] = useCerebralState(bind);
    } else {
      [activeKey, setTab] = useState();
    }

    const toggleAlreadySelectedValueDecorator = delegate => {
      return delegatedValue => {
        if (activeKey === delegatedValue) {
          delegatedValue = '~no item selected~';
        }
        delegate(delegatedValue);
      };
    };

    setTab = toggleAlreadySelectedValueDecorator(setTab);
    setTab = decorateWithPostCallback(setTab, onSelect);

    const AccordionContent = renderAccordionFactory({
      activeKey,
      headingLevel,
      setTab,
    });
    return (
      <div
        className={classNames(
          className,
          'usa-accordion',
          bordered && 'usa-accordion--bordered',
        )}
        id={id}
        {...passThroughProps}
      >
        {map(children, AccordionContent)}
      </div>
    );
  },
);

Accordion.displayName = 'Accordion';

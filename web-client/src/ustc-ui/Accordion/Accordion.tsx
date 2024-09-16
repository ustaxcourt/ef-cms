import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Mobile, NonMobile } from '@web-client/ustc-ui/Responsive/Responsive';
import { map } from '../Utils/ElementChildren';
import { uniqueId } from 'lodash';

import React, { ReactNode, useState } from 'react';
import classNames from 'classnames';

/**
 * AccordionItem: This is a strange hollow component that is being used in renderAccordionFactory + Accordion to make a styled component
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function AccordionItem(properties: {
  children: React.ReactNode;
  customClassName?: string;
  customTitleClassName?: string;
  displayIcon?: boolean;
  iconClassName?: string;
  iconSize?: string;
  iconTypes?: string[];
  id?: string;
  title?: string;
}) {
  return <></>;
}

const renderAccordionFactory = ({ headingLevel }) =>
  function AccordionContent(child, index) {
    const {
      children,
      customClassName,
      customTitleClassName,
      displayIcon = false,
      iconClassName,
      iconSize,
      iconTypes,
      id,
      title,
    } = child.props;

    const [isActive, setIsActive] = useState(false);

    const itemButtonId =
      id || uniqueId(`ustc-ui-accordion-item-button-${index}`);
    const itemContentId =
      (id && `${id}-item-content`) ||
      uniqueId(`ustc-ui-accordion-item-content-${index}`);

    const HeadingElement = `h${headingLevel || 2}`;
    const expandedText = (isActive && 'true') || 'false';

    if (!title) {
      return null;
    }

    const buttonProps = {
      'aria-controls': itemContentId,
      'aria-expanded': expandedText,
      className: 'usa-accordion__button grid-container',
      id: itemButtonId,
      onClick: () => setIsActive(!isActive),
      type: 'button',
    };

    const baseTitleClassName = 'accordion-item-title grid-col-8';
    const titleClassName = classNames(baseTitleClassName, customTitleClassName);

    const mobileBaseTitleClassName = 'accordion-item-title grid-col-10';
    const mobileTitleClassName = classNames(
      mobileBaseTitleClassName,
      customTitleClassName,
    );

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
              <Mobile>
                <div className={mobileTitleClassName}>{title}</div>
              </Mobile>
              <NonMobile>
                <div
                  className={titleClassName}
                  data-testid="accordion-item-title"
                >
                  {title}
                </div>
              </NonMobile>
            </div>
          </button>
        </HeadingElement>
        {isActive && (
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

export const Accordion = ({
  bordered,
  children,
  className,
  headingLevel,
  id,
  role,
}: {
  bordered?: boolean;
  children: ReactNode;
  className?: string;
  headingLevel?: string;
  id?: string;
  role?: string;
}) => {
  const passThroughProps = { role };

  const AccordionContent = renderAccordionFactory({
    headingLevel,
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
};

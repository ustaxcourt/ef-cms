import { uniqueId } from 'lodash';
import React, { HTMLAttributes, ReactNode, useState } from 'react';
import classNames from 'classnames';

export const Accordion = ({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      data-allow-multiple
      className={classNames(
        className,
        'usa-accordion',
        'usa-accordion--multiselectable',
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const AccordionItem = ({
  children,
  className,
  initiallyOpen = false,
  title,
}: {
  initiallyOpen?: boolean;
  className?: string;
  children: ReactNode;
  title: string;
}) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const id = uniqueId('accordion-item-');

  return (
    <>
      <h3 className={classNames('usa-accordion__heading', className)}>
        <button
          aria-controls={id}
          aria-expanded={isOpen}
          className="usa-accordion__button"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          {title}
        </button>
      </h3>
      <div className="usa-accordion__content" hidden={!isOpen} id={id}>
        {children}
      </div>
    </>
  );
};

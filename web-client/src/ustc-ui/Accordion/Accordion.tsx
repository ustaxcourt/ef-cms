import { uniqueId } from 'lodash';
import React, { HTMLAttributes, ReactNode, useState } from 'react';
import classNames from 'classnames';

export const Accordion = ({
  children,
  className,
  dataTestId,
  ...props
}: {
  children: ReactNode;
  dataTestId?: string;
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
      data-testid={dataTestId}
      {...props}
    >
      {children}
    </div>
  );
};

export const AccordionItem = ({
  children,
  contentClassName,
  dataTestId,
  headerClassName,
  initiallyOpen = false,
  title,
}: {
  dataTestId?: string;
  initiallyOpen?: boolean;
  headerClassName?: string;
  contentClassName?: string;
  children: ReactNode;
  title: string;
}) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const id = uniqueId('accordion-item-');

  return (
    <>
      <h3 className={classNames('usa-accordion__heading')}>
        <button
          aria-controls={id}
          aria-expanded={isOpen}
          className={classNames(
            'usa-accordion__button',
            'accordion-title',
            headerClassName,
          )}
          data-testid={dataTestId}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          {title}
        </button>
      </h3>
      <div
        className={classNames('usa-accordion__content', contentClassName)}
        hidden={!isOpen}
        id={id}
      >
        {children}
      </div>
    </>
  );
};

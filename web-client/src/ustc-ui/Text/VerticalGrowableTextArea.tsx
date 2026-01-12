import React, { ChangeEvent, useEffect, useRef } from 'react';

type VerticalGrowableTextAreaProps = {
  id: string;
  name: string;
  value: string;
  onBlurHandler: () => void;
  onChangeHandler: (e: ChangeEvent<HTMLTextAreaElement>) => void;
};

export const VerticalGrowableTextArea = (
  props: VerticalGrowableTextAreaProps,
) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Save existing styles because we need to reset them in order to get
      // an accurate measurement of the height of the textarea element.
      const previousStyles = {
        minHeight: textarea.style.minHeight,
        height: textarea.style.height,
        overflow: textarea.style.overflow,
      };

      textarea.style.height = '0';
      textarea.style.minHeight = '0';
      textarea.style.overflow = 'hidden';

      textarea.style.minHeight = previousStyles.minHeight;
      textarea.style.overflow = previousStyles.overflow;
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, []);

  return (
    <textarea
      className="usa-input margin-top-0 maxw-full textarea-resize-vertical"
      id={props.id}
      data-testid={props.name}
      name={props.name}
      aria-label={props.name}
      ref={textareaRef}
      value={props.value}
      onBlur={() => props.onBlurHandler()}
      onChange={e => {
        props.onChangeHandler(e);
        adjustHeight();
      }}
      style={{ overflow: 'hidden' }}
    />
  );
};

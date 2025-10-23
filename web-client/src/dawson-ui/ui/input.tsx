import * as React from 'react';
import { cn } from '@web-client/lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  helpText?: string;
  hideLabel?: boolean;
  icon?: boolean;
  label?: string;
  optional?: boolean;
  required?: boolean;
  flexDirection?: 'vertical' | 'horizontal'; 
}

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  helpText?: string;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      className,
      error,
      helpText,
      hideLabel,
      icon,
      label,
      optional,
      required,
      type = 'text',
      flexDirection = 'vertical',
      ...props
    },
    ref,
  ) => {

    const inputId = React.useId();

    const parentDiv = classNames(
      "tw:flex", 
      flexDirection === "vertical" ? "tw:flex-col" : "tw:flex-row"
    )

    const inputClass = classNames(
      // Base styles
      'tw:block tw:w-full tw:rounded-md tw:border-[1px] tw:border-grey-base tw:bg-white',
      'tw:px-3 tw:xs:h-[36px] tw:h-[32px] tw:text-sm tw:outline-none tw:cursor-text',
      'tw:w-[380px] tw:ps-[10px] tw:xs:ps-[12px]',
      'tw:focus-visible:ring-4 tw:focus-visible:ring-offset-[4px] tw:focus-visible:ring-ring tw:focus-visible:outline-none',
      // States
      // 'tw:focus:border-blue-500 tw:focus:ring-2 tw:focus:ring-blue-500/20',
      'tw:hover:border-grey-base tw:hover:shadow-none', //disable hover state
      // Disabled state
      'tw:disabled:cursor-not-allowed tw:disabled:bg-grey-light tw:disabled:text-grey-light',
      className,
      // Error state
      error && 'tw:border-red-primary tw:hover:border-red-primary tw:focus-visible:!ring-0',
    )

    return (
      <div className={parentDiv}>
        {label && (
          <div className={`${flexDirection === "horizontal" ? "tw:mr-[16px]" : ""} tw:shrink-0`}>
            <div className="tw:flex tw:flex-col">
              <div className="tw:flex tw:items-center">
                <span
                  className={cn(
                    'tw:text-[16px]',
                    'tw:xs:text-[18px]',
                    '!tw:font-semibold',
                    '!tw:text-gray-900',
                  )}
                  style={{ fontWeight: '600' }}
                >
                  {label}
                </span>
                {icon && (
                  <FontAwesomeIcon
                    icon={faQuestionCircle}
                    className="tw:ml-1 tw:text-[16px] tw:xs:text-[18px] tw:text-primary"
                    title={helpText}
                    role="img"
                    aria-label={helpText}
                  />
                )}

                <span className="tw:text-grey-base tw:ml-1 tw:font-normal tw:text-[14px] tw:xs:text-[16px]">
                  {!required ? '(optional)' : '(required)'}
                </span>
              </div>
              {helpText && (
              <div className="tw:mt-[8px] tw:mb-[9px] tw:xs:mt-[10px] tw:xs:mb-[13px] tw:text-[14px] tw:xs:text-[16px] tw:text-grey-base">
                  {helpText}
                </div>
              )}
            </div>
          </div>
        )}

        <input
          id={inputId}
          ref={ref}
          type={type}
          aria-invalid={!!error}
          className={inputClass }
          {...props}
        />

        {error && (
          <div className="tw:mt-[6px] tw:xs:mt-[8px] tw:flex tw:items-center tw:gap-2 tw:text-destructive">
            <FontAwesomeIcon
              icon={faExclamationCircle}
              className="tw-text-[16px] tw:xs:text-[18px]"
            />
            <span className="tw-text-[16px] tw:xs:text-[18px]">
              Enter a valid answer
            </span>
          </div>
        )}
      </div>
    );
  },
);

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error, label, helpText, ...props }, ref) => {
      const textareaId = React.useId();

      const textAreaClass = classNames(
        // Base styles
        'tw:block tw:w-full tw:rounded-tl-md tw:rounded-tr-md tw:rounded-bl-md tw:border tw:border-grey-base tw:bg-white',
        'tw:p-[10px] tw:xs:p-[12px] tw:text-sm tw:outline-none tw:cursor-text',
        'tw:min-h-[100px] tw:resize-y',
        'tw:w-[380px]',
        
        // Focus state
        'tw:focus-visible:ring-4 tw:focus-visible:ring-offset-[4px] tw:focus-visible:ring-ring tw:focus-visible:outline-none',   

        // Error state     
        error && 'tw:border-destructive tw:ring-1 tw:ring-destructive',
        'tw:disabled:cursor-not-allowed tw:disabled:bg-gray-50 tw:disabled:text-grey-base',

        // States
        'tw:hover:border-grey-base tw:hover:shadow-none', //disable hover state

        className,
      )


    return (
      <div className="tw:flex tw:flex-col">
        {label && (
          <div>
            <div className="tw:flex tw:flex-col">
              <div className="tw:flex tw:items-center">
                <span
                  className={cn(
                    'tw:text-[16px]',
                    'tw:xs:text-[18px]',
                    '!tw:font-semibold',
                    '!tw:text-gray-900',
                  )}
                  style={{ fontWeight: '600' }}
                >
                  {label}
                </span>
                {helpText && (
                  <FontAwesomeIcon
                    icon={faQuestionCircle}
                    className="tw:ml-1 tw:text-[16px] tw:xs:text-[18px] tw:text-primary"
                    title={helpText}
                    role="img"
                    aria-label={helpText}
                  />
                )}
                {!props.required && (
                  <span className="tw:text-grey-base tw:ml-1 tw:font-normal tw:text-[14px] tw:xs:text-[16px]">
                    (optional)
                  </span>
                )}
              </div>
              {helpText && (
                <div className="tw:my-[8px] tw:xs:mt-[10px] tw:xs:mb-[13px] tw:text-[14px] tw:xs:text-[16px] tw:text-grey-base">
                  {helpText}
                </div>
              )}
            </div>
          </div>
        )}

        <textarea
          id={textareaId}
          ref={ref}
          aria-invalid={!!error}
          className={textAreaClass}
          {...props}
        />

        {error && (
          <div className="tw:mt-1 tw:flex tw:items-center tw:gap-2 tw:text-destructive">
            <FontAwesomeIcon
              icon={faQuestionCircle}
              className="tw-text-[16px] tw:xs:text-[18px]"
            />
            <span className="tw-text-[16px] tw:xs:text-[18px]">
              Enter a valid answer
            </span>
          </div>
        )}
      </div>
    );
  },
);

TextField.displayName = 'TextField';
TextArea.displayName = 'TextArea';

export { TextField, TextArea };

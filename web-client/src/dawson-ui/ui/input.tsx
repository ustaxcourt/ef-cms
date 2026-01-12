import * as React from 'react';
import { cn } from '@web-client/lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  helpText?: string | React.ReactNode;
  hideLabel?: boolean;
  icon?: boolean;
  label?: string | React.ReactNode;
  optional?: boolean;
  required?: boolean;
  flexDirection?: 'vertical' | 'horizontal';
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  helpText?: string;
  showReqOptionalText?: boolean;
}

const styles = {
  border:
    'tw:block tw:w-full tw:rounded-md tw:border-[0.0625rem] tw:border-grey-base tw:bg-white',
  focus:
    'tw:focus-visible:ring-4 tw:focus-visible:ring-offset-[0.25rem] tw:focus-visible:ring-ring tw:focus-visible:outline-none',
  icon: 'tw:ml-1 tw:text-base tw:xs:text-lg tw:text-primary',
  label: 'tw:text-base tw:xs:text-lg !tw:font-semibold !tw:text-grey-base',
  optional:
    'tw:text-grey-dark tw:ml-1 tw:font-normal tw:text-sm tw:xs:text-base',
  text: {
    base: 'tw:xs:text-lg tw:text-base tw:outline-none tw:cursor-text',
    help: 'tw:xs:mb-[0.8125rem] tw:text-sm tw:xs:text-base tw:text-grey-dark', // must add conditional
  },
  states: {
    disabled:
      'tw:disabled:cursor-not-allowed tw:disabled:bg-grey-light tw:disabled:text-grey-light',
    error:
      'tw:border-red-primary tw:hover:border-red-primary tw:border-[0.125rem]',
    hover: 'tw:hover:border-grey-base tw:hover:shadow-none',
  },
};

/**
 * Used custom hook because browser focus-visible is triggered by both
 * keyboard and mouse for inputs/textboxes,
 * but we only want to apply focus styles on keyboard navigation
 *
 */
const useKeyboardListenerHook = () => {
  const [isTab, setIsTab] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        setIsTab(true);
      }
    };

    const handleMouseDown = () => {
      setIsTab(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return { isTab };
};

const InputError = ({ error }) => (
  <>
    {error && (
      <div className="tw:absolute tw:mt-1.25 tw:xs:mt-2.25 tw:gap-2 tw:text-red-primary">
        <FontAwesomeIcon
          icon={faInfoCircle}
          className="tw-text-base tw:xs:text-lg tw:mr-1"
        />
        <span className="tw-text-base tw:xs:text-lg">{error}</span>
      </div>
    )}
  </>
);

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
    const labelId = React.useId();
    const helpTextId = helpText ? React.useId() : undefined;
    const errorId = error ? React.useId() : undefined;

    const { isTab } = useKeyboardListenerHook();

    const parentDiv = classNames(
      'tw:flex',
      flexDirection === 'vertical' ? 'tw:flex-col' : 'tw:flex-row',
      !helpText && flexDirection === 'horizontal' && 'tw:items-center',
    );

    const inputClass = classNames(
      className,
      styles.border,
      isTab && styles.focus,
      styles.text.base,
      styles.states.disabled,
      styles.states.hover,
      error && styles.states.error,
      'tw:px-3 tw:xs:h-[2.25rem] tw:h-[2rem]',
      'tw:w-[23.75rem] tw:ps-[0.75rem] tw:xs:ps-[0.75rem]',
    );

    return (
      <div className={parentDiv}>
        {label && (
          <label
            id={labelId}
            htmlFor={inputId}
            className={`${flexDirection === 'horizontal' && !helpText ? 'tw:mb-0! ' : ''} ${flexDirection === 'horizontal' ? 'tw:xs:mr-4 tw:mr-3' : ''} tw:shrink-0 ${!helpText ? 'tw:mb-1.5 tw:xs:mb-2' : 'tw:mb-0'}`}
          >
            <div className="tw:flex tw:flex-col">
              <div className="tw:flex tw:items-center">
                <span
                  className={cn(styles.label)}
                  style={{ fontWeight: '600' }}
                >
                  {label}
                </span>
                {icon && (
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className={cn(styles.icon)}
                    title={typeof helpText === 'string' ? helpText : ''}
                    role="img"
                    aria-label={typeof helpText === 'string' ? helpText : ''}
                  />
                )}
                <span className={cn(styles.optional)}>
                  {!required ? '(optional)' : '(required)'}
                </span>
              </div>
              {helpText && (
                <div
                  id={helpTextId}
                  className={cn(
                    styles.text.help,
                    'tw:font-normal tw:mt-1.25 tw:xs:mt-3 tw:mb-2 tw:xs:mb-3',
                    flexDirection === 'horizontal' &&
                      'tw:mt-0 tw:xs:mt-0 tw:mb-0!',
                  )}
                >
                  {helpText}
                </div>
              )}
            </div>
          </label>
        )}
        <div
          className={
            flexDirection === 'vertical'
              ? 'tw:flex-col'
              : 'tw:flex-row tw:w-full tw:content-center'
          }
        >
          <input
            id={inputId}
            ref={ref}
            type={type}
            aria-invalid={!!error}
            aria-required={required}
            aria-describedby={cn(helpTextId, errorId)}
            aria-labelledby={labelId}
            className={inputClass}
            {...props}
          />
          <InputError error={error} />
        </div>
      </div>
    );
  },
);

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    { className, error, label, helpText, showReqOptionalText, ...props },
    ref,
  ) => {
    const textareaId = React.useId();
    const labelId = React.useId();
    const helpTextId = helpText ? React.useId() : undefined;
    const errorId = error ? React.useId() : undefined;

    const { isTab } = useKeyboardListenerHook();

    const textAreaClass = classNames(
      className,
      styles.border,
      isTab && styles.focus,
      styles.text.base,
      styles.states.disabled,
      styles.states.hover,
      'tw:rounded-tl-md tw:rounded-tr-md tw:rounded-bl-md tw:rounded-br-[0rem]',
      'tw:p-[0.625rem] tw:xs:p-[0.75rem]',
      'tw:min-h-[6.25rem] tw:resize-y',
      'tw:w-[23.75rem]',
      error && styles.states.error,
    );

    return (
      <div className="tw:flex tw:flex-col">
        {label && (
          <label className="tw:mb-0" id={labelId} htmlFor={textareaId}>
            <div className="tw:flex tw:flex-col">
              <div className={`tw:flex tw:items-center tw:mb-2 tw:xs:mb-3`}>
                <span
                  className={cn(styles.label)}
                  style={{ fontWeight: '600' }}
                >
                  {label}
                </span>
                {helpText && (
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className={cn(styles.icon)}
                    title={helpText}
                    role="img"
                    aria-label={helpText}
                  />
                )}
                {showReqOptionalText && !props.required && (
                  <span className="tw:text-grey-dark tw:ml-1 tw:font-normal tw:text-sm tw:xs:text-base">
                    (optional) Jake
                  </span>
                )}
              </div>
              {helpText && (
                <div
                  className={cn(
                    styles.text.help,
                    'tw:mb-2 tw:xs:mb-3 tw:font-normal',
                  )}
                >
                  {helpText}
                </div>
              )}
            </div>
          </label>
        )}
        <div>
          <textarea
            id={textareaId}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={cn(helpTextId, errorId && errorId)}
            aria-labelledby={labelId}
            className={textAreaClass}
            {...props}
          />
          <InputError error={error} />
        </div>
      </div>
    );
  },
);

TextField.displayName = 'TextField';
TextArea.displayName = 'TextArea';

export { TextField, TextArea };

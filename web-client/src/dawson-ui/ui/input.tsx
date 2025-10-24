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

const styles = {
  border:
    'tw:block tw:w-full tw:rounded-md tw:border-[1px] tw:border-grey-base tw:bg-white',
  focus: 'tw:focus-visible:ring-4 tw:focus-visible:ring-offset-[4px] tw:focus-visible:ring-ring tw:focus-visible:outline-none',
  icon: 'tw:ml-1 tw:text-[16px] tw:xs:text-[18px] tw:text-primary',
  label: 'tw:text-[16px] tw:xs:text-[18px] !tw:font-semibold !tw:text-grey-base',
  optional: 'tw:text-grey-dark tw:ml-1 tw:font-normal tw:text-[14px] tw:xs:text-[16px]',
  text: {
    base: 'tw:xs:text-[18px] tw:text-[16px] tw:outline-none tw:cursor-text',
    help: 'tw:xs:mt-[10px] tw:xs:mb-[13px] tw:text-[14px] tw:xs:text-[16px] tw:text-grey-dark'
  },
  states: {
    disabled:'tw:disabled:cursor-not-allowed tw:disabled:bg-grey-light tw:disabled:text-grey-light',
    error: 'tw:border-red-primary tw:hover:border-red-primary',
    hover:'tw:hover:border-grey-base tw:hover:shadow-none'
  }
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

  return {isTab}
}

const InputError = ({error}) => (
  <>
    {error && (
      <div className="tw:mt-[6px] tw:xs:mt-[8px] tw:gap-2 tw:text-destructive">
        <FontAwesomeIcon
          icon={faExclamationCircle}
          className="tw-text-[16px] tw:xs:text-[18px] tw:mr-[4px]"
        />
        <span className="tw-text-[16px] tw:xs:text-[18px]">
              {error}
            </span>
      </div>
    )}
  </>
)

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
    const { isTab } = useKeyboardListenerHook();

    const parentDiv = classNames(
      'tw:flex',
      flexDirection === 'vertical' ? 'tw:flex-col' : 'tw:flex-row',
    );

    const inputClass = classNames(
      className,
      styles.border,
      isTab && styles.focus,
      styles.text.base,
      styles.states.disabled,
      styles.states.hover,
      error && styles.states.error,
      'tw:px-3 tw:xs:h-[36px] tw:h-[32px]',
      'tw:w-[380px] tw:ps-[10px] tw:xs:ps-[12px]'
    );

    return (
      <div className={parentDiv}>
        {label && (
          <div
            className={`${flexDirection === 'horizontal' ? 'tw:xs:mr-[16px] tw:mr-[12px]' : ''} tw:shrink-0`}
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
                    icon={faQuestionCircle}
                    className={cn(styles.icon)}
                    title={helpText}
                    role="img"
                    aria-label={helpText}
                  />
                )}
                <span className={cn(styles.optional)}>
                  {!required ? '(optional)' : '(required)'}
                </span>
              </div>
              {helpText && (
                <div className={cn(styles.text.help, "tw:mt-[8px] tw:mb-[9px]", flexDirection === 'horizontal' && 'tw:mt-[0px]')}>
                  {helpText}
                </div>
              )}
            </div>
          </div>
        )}
        <div className={flexDirection === 'vertical' ? 'tw:flex-col' : 'tw:flex-row tw:w-full'}>
          <input
            id={inputId}
            ref={ref}
            type={type}
            aria-invalid={!!error}
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
  ({ className, error, label, helpText, ...props }, ref) => {
    const textareaId = React.useId();
    const { isTab } = useKeyboardListenerHook();

    const textAreaClass = classNames(
      className,
      styles.border,
      isTab && styles.focus,
      styles.text.base,
      styles.states.disabled,
      styles.states.hover,
      'tw:rounded-tl-md tw:rounded-tr-md tw:rounded-bl-md',
      'tw:p-[10px] tw:xs:p-[12px]',
      'tw:min-h-[100px] tw:resize-y',
      'tw:w-[380px]',
      error && styles.states.error,
    );

    return (
      <div className="tw:flex tw:flex-col">
        {label && (
          <div>
            <div className="tw:flex tw:flex-col">
              <div className="tw:flex tw:items-center">
                <span
                  className={cn(styles.label)}
                  style={{ fontWeight: '600' }}
                >
                  {label}
                </span>
                {helpText && (
                  <FontAwesomeIcon
                    icon={faQuestionCircle}
                    className={cn(styles.icon)}
                    title={helpText}
                    role="img"
                    aria-label={helpText}
                  />
                )}
                {!props.required && (
                  <span className="tw:text-grey-dark tw:ml-1 tw:font-normal tw:text-[14px] tw:xs:text-[16px]">
                    (optional)
                  </span>
                )}
              </div>
              {helpText && (
                <div className={cn(styles.text.help, "tw:!my-[12px]")}>
                  {helpText}
                </div>
              )}
            </div>
          </div>
        )}
        <div>
          <textarea
            id={textareaId}
            ref={ref}
            aria-invalid={!!error}
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

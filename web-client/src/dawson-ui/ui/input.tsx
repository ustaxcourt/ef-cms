import * as React from "react"
import { cn } from "@web-client/lib/utils"

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helpText?: string;
  hideLabel?: boolean;
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  helpText?: string;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ className, type = "text", error, label, helpText, hideLabel, ...props }, ref) => {
    const inputId = React.useId();
    
    return (
      <div className="tw:flex tw:flex-col tw:gap-1.5">
        {label && (
          <div>
            <div className="tw:flex tw:flex-col tw:gap-0">
              <div className="tw:flex tw:items-center tw:text-base tw:font-bold tw:text-gray-900">
                <span>{label}</span>
                {helpText && (
                  <button
                    type="button"
                    className="tw:ml-1 tw:text-blue-600"
                    aria-label={helpText}
                    title={helpText}
                  >
                    <i className="fa-regular fa-circle-question tw:text-sm" />
                  </button>
                )}
                {!props.required && (
                  <span className="tw:text-gray-500 tw:ml-1 tw:font-normal">(optional)</span>
                )}
              </div>
              {helpText && (
                <div className="tw:text-sm tw:text-gray-500">
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
          className={cn(
            // Base styles
            "tw:block tw:w-full tw:rounded-md tw:border tw:border-gray-300 tw:bg-white",
            "tw:px-3 tw:py-2 tw:text-sm tw:outline-none tw:cursor-text",
            
            // States
            "tw:placeholder:text-gray-400",
            "tw:focus:border-blue-500 tw:focus:ring-2 tw:focus:ring-blue-500/20",
            
            // Error state
            error && "tw:border-red-300 tw:focus:border-red-500 tw:focus:ring-red-500/20",
            
            // Disabled state
            "tw:disabled:cursor-not-allowed tw:disabled:bg-gray-50 tw:disabled:text-gray-500",
            
            className
          )}
          {...props}
        />
        
        {error && (
          <div className="tw:flex tw:items-center tw:gap-2 tw:text-red-500 tw:text-sm">
            <i className="fa-regular fa-circle-exclamation" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, error, label, helpText, ...props }, ref) => {
    const textareaId = React.useId();
    
    return (
      <div className="tw:flex tw:flex-col tw:gap-1.5">
        {label && (
          <div>
            <div className="tw:flex tw:flex-col tw:gap-0">
              <div className="tw:flex tw:items-center tw:text-base tw:font-bold tw:text-gray-900">
                <span>{label}</span>
                {helpText && (
                  <button
                    type="button"
                    className="tw:ml-1 tw:text-blue-600"
                    aria-label={helpText}
                    title={helpText}
                  >
                    <i className="fa-regular fa-circle-question tw:text-sm" />
                  </button>
                )}
                {!props.required && (
                  <span className="tw:text-gray-500 tw:ml-1 tw:font-normal">(optional)</span>
                )}
              </div>
              {helpText && (
                <div className="tw:text-sm tw:text-gray-500">
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
          className={cn(
            // Base styles
            "tw:block tw:w-full tw:rounded-tl-md tw:rounded-tr-md tw:rounded-bl-md tw:border tw:border-gray-300 tw:bg-white",
            "tw:px-3 tw:py-2 tw:text-sm tw:outline-none tw:cursor-text",
            "tw:min-h-[80px] tw:resize-y",
            
            // States
            "tw:placeholder:text-gray-400",
            "tw:focus:border-blue-500 tw:focus:ring-2 tw:focus:ring-blue-500/20",
            error && "tw:border-red-300 tw:focus:border-red-500 tw:focus:ring-red-500/20",
            "tw:disabled:cursor-not-allowed tw:disabled:bg-gray-50 tw:disabled:text-gray-500",
            
            className
          )}
          {...props}
        />
        
        {error && (
          <div className="tw:flex tw:items-center tw:gap-2 tw:text-red-500 tw:text-sm">
            <i className="fa-regular fa-circle-exclamation" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

TextField.displayName = "TextField";
TextArea.displayName = "TextArea";

export { TextField, TextArea };

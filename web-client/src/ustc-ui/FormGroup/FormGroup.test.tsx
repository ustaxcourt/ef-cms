import { FormGroup } from './FormGroup';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';

const renderFormGroup = (
  props: Partial<React.ComponentProps<typeof FormGroup>>,
): HTMLElement => {
  const container = window.document.createElement('div');
  container.innerHTML = renderToStaticMarkup(
    <FormGroup {...props}>
      <input id="field" />
    </FormGroup>,
  );
  return container;
};

describe('FormGroup', () => {
  it('should set the DOM id on the error message when errorId is provided', () => {
    const container = renderFormGroup({
      errorId: 'field-error',
      errorMessageId: 'field-error-test-id',
      errorText: 'Enter a value',
    });

    const errorMessage = container.querySelector('.usa-error-message');
    expect(errorMessage?.id).toEqual('field-error');
    expect(errorMessage?.getAttribute('data-testid')).toEqual(
      'field-error-test-id',
    );
    expect(errorMessage?.textContent).toEqual('Enter a value');
  });

  it('should not set a DOM id on the error message when errorId is not provided', () => {
    const container = renderFormGroup({
      errorMessageId: 'field-error-test-id',
      errorText: 'Enter a value',
    });

    expect(
      container.querySelector('.usa-error-message')?.hasAttribute('id'),
    ).toBe(false);
  });

  it('should not render an error message or error class when there is no errorText', () => {
    const container = renderFormGroup({ errorId: 'field-error' });

    expect(container.querySelector('#field-error')).toBeNull();
    expect(container.querySelector('.usa-form-group--error')).toBeNull();
  });
});

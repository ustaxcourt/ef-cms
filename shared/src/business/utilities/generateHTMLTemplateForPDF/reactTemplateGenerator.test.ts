jest.mock('react');
jest.mock('react-dom/server');
import { reactTemplateGenerator } from './reactTemplateGenerator';
import React from 'react';
import ReactDOM from 'react-dom/server';

describe('reactTemplateGenerator', () => {
  beforeEach(() => {
    React.createElement = jest.fn();
    ReactDOM.renderToString = jest.fn();
  });

  it('calls the react render method and renders the result to string', () => {
    reactTemplateGenerator({
      componentName: 'SomeComponent',
      data: { foo: 'bar' },
    });

    expect(React.createElement).toHaveBeenCalled();
    expect(ReactDOM.renderToString).toHaveBeenCalled();
  });

  it('calls the react render method and renders nothing with no data', () => {
    reactTemplateGenerator({
      componentName: 'SomeComponent',
    });

    expect(React.createElement).toHaveBeenCalled();
    expect(ReactDOM.renderToString).toHaveBeenCalled();
  });
});

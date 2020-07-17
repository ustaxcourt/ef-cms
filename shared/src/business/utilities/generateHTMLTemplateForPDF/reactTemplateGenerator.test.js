jest.mock('react');
jest.mock('react-dom/server');
const React = require('react');
const ReactDOM = require('react-dom/server');
const { reactTemplateGenerator } = require('./reactTemplateGenerator');

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
});

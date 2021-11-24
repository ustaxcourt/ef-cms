import { Container } from '@cerebral/react';
import { PdfViewer } from './PdfViewer';
import { mount } from 'enzyme';
import App from 'cerebral';
import React from 'react';

describe('PdfViewer', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });

  it('should render an iframe if isPdfJsEnabled if false', () => {
    const testModule = {
      state: {
        featureFlagHelper: {
          isPdfJsEnabled: false,
        },
      },
    };
    const app = App(testModule);

    const wrapper = mount(
      <Container app={app}>
        <PdfViewer />
      </Container>,
    );
    expect(wrapper.find('.pdf-express-viewer').exists()).toBe(false);
    expect(wrapper.find('.default-iframe').exists()).toBe(true);
  });

  it('should render the PdfViwer if isPdfJsEnabled if true', () => {
    process.env.CI = '';

    const testModule = {
      state: {
        featureFlagHelper: {
          isPdfJsEnabled: true,
        },
      },
    };
    const app = App(testModule);

    const wrapper = mount(
      <Container app={app}>
        <PdfViewer src={'source-url'} />
      </Container>,
    );

    expect(wrapper.find('.default-iframe').exists()).toBe(false);
    expect(wrapper.find('.pdf-express-viewer').exists()).toBe(true);
  });
});

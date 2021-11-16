import { Container } from '@cerebral/react';
import { PdfViewer } from './PdfViewer';
import { mount } from 'enzyme';
import App from 'cerebral';
import React from 'react';

describe('PdfViewer', () => {
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

    expect(wrapper.find('.viewer-iframe').length).toBe(1);
  });

  it('should render the PdfViwer if isPdfJsEnabled if true', () => {
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

    expect(wrapper.find('.express-pdf-viewer').length).toBe(1);
  });
});

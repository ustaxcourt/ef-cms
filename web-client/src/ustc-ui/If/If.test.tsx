import { Container } from '@cerebral/react';
import { If } from './If';
import App from 'cerebral';
import React from 'react';
import TestRenderer from 'react-test-renderer';

describe('If Component', () => {
  it('should not show the content if no binded property is available', () => {
    const testModule = {
      sequences: {},
      state: {},
    };
    const app = App(testModule);
    const testRenderer = TestRenderer.create(
      <Container app={app}>
        <If>
          <div id="some-content">Some Content</div>
        </If>
      </Container>,
    );

    const testInstance = testRenderer.root;

    expect(() => testInstance.findByProps({ id: 'some-content' })).toThrow();
  });

  it('should not show the content if binded value is falsy', () => {
    const testModule = {
      state: {
        show: false,
      },
    };
    const app = App(testModule);
    const testRenderer = TestRenderer.create(
      <Container app={app}>
        <If bind="show">
          <div id="some-content">Some Content</div>
        </If>
      </Container>,
    );

    const testInstance = testRenderer.root;

    expect(() => testInstance.findByProps({ id: 'some-content' })).toThrow();
  });

  it('should show the content if binded value is truthy', () => {
    const testModule = {
      state: {
        show: true,
      },
    };
    const app = App(testModule);
    const testRenderer = TestRenderer.create(
      <Container app={app}>
        <If bind="show">
          <div id="some-content">Some Content</div>
        </If>
      </Container>,
    );

    const testInstance = testRenderer.root;

    expect(
      testInstance.findByProps({ id: 'some-content' }).children[0],
    ).toEqual('Some Content');
  });

  it('should not show the content if binded value is truthy and not property is present', () => {
    const testModule = {
      state: {
        show: true,
      },
    };
    const app = App(testModule);
    const testRenderer = TestRenderer.create(
      <Container app={app}>
        <If not bind="show">
          <div id="some-content">Some Content</div>
        </If>
      </Container>,
    );

    const testInstance = testRenderer.root;

    expect(() => testInstance.findByProps({ id: 'some-content' })).toThrow();
  });
});

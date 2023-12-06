import { Container } from '@cerebral/react';
import { Tab, Tabs } from './Tabs';
import { cerebralBindSimpleSetStateSequence } from '../../presenter/sequences/cerebralBindSimpleSetStateSequence';
import App from 'cerebral';
import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';

describe('TabsComponent', () => {
  it('should show the binded item', () => {
    const testModule = {
      sequences: {
        cerebralBindSimpleSetStateSequence,
      },
      state: {
        tab: 'my',
      },
    };
    const app = App(testModule);

    let testRenderer;
    act(() => {
      testRenderer = TestRenderer.create(
        <Container app={app}>
          <Tabs bind="tab" className="yeah">
            <Tab id="tab-work-queue" tabName="section" title="Section Queue">
              <div id="tab-section-panel">Section</div>
            </Tab>
            <Tab id="tab-my-queue" tabName="my" title="My Queue">
              <div id="tab-individual-panel">Indy</div>
            </Tab>
          </Tabs>
        </Container>,
      );
    });

    const testInstance = testRenderer.root;

    expect(
      testInstance.findByProps({ id: 'tab-individual-panel' }).children[0],
    ).toEqual('Indy');

    expect(() =>
      testInstance.findByProps({ id: 'tab-section-panel' }),
    ).toThrow();
  });

  it('should be able to click to show an item', () => {
    const testModule = {
      sequences: {
        cerebralBindSimpleSetStateSequence,
      },
      state: {
        tab: 'my',
      },
    };
    const app = App(testModule);
    let testRenderer;
    act(() => {
      testRenderer = TestRenderer.create(
        <Container app={app}>
          <Tabs bind="tab" className="yeah">
            <Tab id="tab-work-queue" tabName="section" title="Section Queue">
              <div id="tab-section-panel">Section</div>
            </Tab>
            <Tab id="tab-my-queue" tabName="my" title="My Queue">
              <div id="tab-individual-panel">Indy</div>
            </Tab>
          </Tabs>
        </Container>,
      );
    });

    const testInstance = testRenderer.root;

    expect(
      testInstance.findByProps({ id: 'tab-individual-panel' }).children[0],
    ).toEqual('Indy');

    act(() => {
      testInstance.findByProps({ id: 'tab-work-queue' }).props.onClick();
    });

    expect(() =>
      testInstance.findByProps({ id: 'tab-individual-panel' }),
    ).toThrow();

    expect(
      testInstance.findByProps({ id: 'tab-section-panel' }).children[0],
    ).toEqual('Section');
  });

  it('should remove classes when used asSwitch', () => {
    const testModule = {
      sequences: {
        cerebralBindSimpleSetStateSequence,
      },
      state: {
        tab: 'my',
      },
    };
    const app = App(testModule);
    let testRenderer;
    act(() => {
      testRenderer = TestRenderer.create(
        <Container app={app}>
          <Tabs asSwitch bind="tab" className="yeah">
            <Tab id="tab-work-queue" tabName="section" title="something">
              <div id="tab-section-panel">Section</div>
            </Tab>
            <Tab id="tab-my-queue" tabName="my">
              <div id="tab-individual-panel">Indy</div>
            </Tab>
          </Tabs>
        </Container>,
      );
    });

    const testInstance = testRenderer.root;

    expect(() => testInstance.findByProps({ id: 'tabContent-my' })).toThrow();
  });
});

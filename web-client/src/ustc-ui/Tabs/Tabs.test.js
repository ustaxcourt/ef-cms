import { Tab, TabsComponent } from './Tabs';
import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';

describe('TabsComponent', () => {
  it('should show the default item', () => {
    let testRenderer;
    act(() => {
      testRenderer = TestRenderer.create(
        <TabsComponent className="yeah" defaultActiveTab="my">
          <Tab id="tab-my-queue" tabName="my" title="My Queue">
            <div id="tab-individual-panel">Indy</div>
          </Tab>
          <Tab id="tab-work-queue" tabName="section" title="Section Queue">
            <div id="tab-section-panel">Section</div>
          </Tab>
        </TabsComponent>,
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
    let testRenderer;
    act(() => {
      testRenderer = TestRenderer.create(
        <TabsComponent defaultActiveTab="my">
          <Tab id="tab-my-queue" tabName="my" title="My Queue">
            <div id="tab-individual-panel">Indy</div>
          </Tab>
          <Tab id="tab-work-queue" tabName="section" title="Section Queue">
            <div id="tab-section-panel">Section</div>
          </Tab>
        </TabsComponent>,
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

  it('should show the selected item from bind/value', () => {
    let testRenderer;
    act(() => {
      testRenderer = TestRenderer.create(
        <TabsComponent bind="aBind" simpleSetter={v => v.value} value="section">
          <Tab id="tab-my-queue" tabName="my" title="My Queue">
            <div id="tab-individual-panel">Indy</div>
          </Tab>
          <Tab id="tab-work-queue" tabName="section" title="Section Queue">
            <div id="tab-section-panel">Section</div>
          </Tab>
        </TabsComponent>,
      );
    });

    const testInstance = testRenderer.root;
    expect(
      testInstance.findByProps({ id: 'tab-section-panel' }).children[0],
    ).toEqual('Section');

    expect(() =>
      testInstance.findByProps({ id: 'tab-individual-panel' }),
    ).toThrow();
  });

  it('should show non tab content', () => {
    let testRenderer;
    act(() => {
      testRenderer = TestRenderer.create(
        <TabsComponent>
          <div id="non-tab">Non Tab</div>
        </TabsComponent>,
      );
    });

    const testInstance = testRenderer.root;

    expect(testInstance.findByProps({ id: 'non-tab' }).children[0]).toEqual(
      'Non Tab',
    );
  });

  it('should not show tab for items without title (for tab-less tabs)', () => {
    let testRenderer;
    act(() => {
      testRenderer = TestRenderer.create(
        <TabsComponent defaultActiveTab="my">
          <Tab id="tab-my-queue" tabName="my">
            <div id="tab-individual-panel">Indy</div>
          </Tab>
          <Tab id="tab-work-queue" tabName="section" title="Section Queue">
            <div id="tab-section-panel">Section</div>
          </Tab>
          <div id="non-tab">Non Tab</div>
        </TabsComponent>,
      );
    });

    const testInstance = testRenderer.root;

    expect(() => testInstance.findByProps({ id: 'tab-my-queue' })).toThrow();
  });
});

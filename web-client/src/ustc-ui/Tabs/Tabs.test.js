import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';

import { Tab, TabsComponent } from './Tabs';

describe('TabsComponent', () => {
  it('should show the default item', () => {
    const testRenderer = TestRenderer.create(
      <TabsComponent defaultActiveTab="my" className="yeah">
        <Tab tabName="my" title="My Queue" id="tab-my-queue">
          <div id="tab-individual-panel">Indy</div>
        </Tab>
        <Tab tabName="section" title="Section Queue" id="tab-work-queue">
          <div id="tab-section-panel">Section</div>
        </Tab>
      </TabsComponent>,
    );

    const testInstance = testRenderer.root;

    expect(
      testInstance.findByProps({ id: 'tab-individual-panel' }).children[0],
    ).toEqual('Indy');

    expect(() =>
      testInstance.findByProps({ id: 'tab-section-panel' }),
    ).toThrow();
  });

  it('should be able to click to show an item', () => {
    const testRenderer = TestRenderer.create(
      <TabsComponent defaultActiveTab="my">
        <Tab tabName="my" title="My Queue" id="tab-my-queue">
          <div id="tab-individual-panel">Indy</div>
        </Tab>
        <Tab tabName="section" title="Section Queue" id="tab-work-queue">
          <div id="tab-section-panel">Section</div>
        </Tab>
      </TabsComponent>,
    );

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
    const testRenderer = TestRenderer.create(
      <TabsComponent value="section" bind="aBind" simpleSetter={v => v.value}>
        <Tab tabName="my" title="My Queue" id="tab-my-queue">
          <div id="tab-individual-panel">Indy</div>
        </Tab>
        <Tab tabName="section" title="Section Queue" id="tab-work-queue">
          <div id="tab-section-panel">Section</div>
        </Tab>
      </TabsComponent>,
    );

    const testInstance = testRenderer.root;
    expect(
      testInstance.findByProps({ id: 'tab-section-panel' }).children[0],
    ).toEqual('Section');

    expect(() =>
      testInstance.findByProps({ id: 'tab-individual-panel' }),
    ).toThrow();
  });

  it('should show non tab content', () => {
    const testRenderer = TestRenderer.create(
      <TabsComponent>
        <div id="non-tab">Non Tab</div>
      </TabsComponent>,
    );

    const testInstance = testRenderer.root;

    expect(testInstance.findByProps({ id: 'non-tab' }).children[0]).toEqual(
      'Non Tab',
    );
  });

  it('should not show tab for items without title (for tabless tabs)', () => {
    const testRenderer = TestRenderer.create(
      <TabsComponent defaultActiveTab="my">
        <Tab tabName="my" id="tab-my-queue">
          <div id="tab-individual-panel">Indy</div>
        </Tab>
        <Tab tabName="section" title="Section Queue" id="tab-work-queue">
          <div id="tab-section-panel">Section</div>
        </Tab>
        <div id="non-tab">Non Tab</div>
      </TabsComponent>,
    );

    const testInstance = testRenderer.root;

    expect(() => testInstance.findByProps({ id: 'tab-my-queue' })).toThrow();
  });
});

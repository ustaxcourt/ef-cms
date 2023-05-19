import { Accordion, AccordionItem } from './Accordion';
import { Container } from '@cerebral/react';
import { cerebralBindSimpleSetStateSequence } from '../../presenter/sequences/cerebralBindSimpleSetStateSequence';
import App from 'cerebral';
import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';

describe('Accordion', () => {
  it('should show no items if nothing is active', () => {
    const testModule = {
      sequences: {
        cerebralBindSimpleSetStateSequence,
      },
      state: {
        item: '',
      },
    };
    const app = (App as any)(testModule);
    const testRenderer = TestRenderer.create(
      <Container app={app}>
        <Accordion bind="item">
          <AccordionItem id="item-work-queue" title="Section Queue">
            <div id="item-section-panel">Section</div>
          </AccordionItem>
          <AccordionItem id="item-my-queue" title="My Queue">
            <div id="item-individual-panel">Indy</div>
          </AccordionItem>
        </Accordion>
      </Container>,
    );

    const testInstance = testRenderer.root;

    expect(() =>
      testInstance.findByProps({ id: 'item-section-panel' }),
    ).toThrow();
    expect(() =>
      testInstance.findByProps({ id: 'item-individual-panel' }),
    ).toThrow();
  });

  it('should show the bound item', () => {
    const testModule = {
      sequences: {
        cerebralBindSimpleSetStateSequence,
      },
      state: {
        item: 'item-1',
      },
    };
    const app = App(testModule);
    const testRenderer = TestRenderer.create(
      <Container app={app}>
        <Accordion bind="item">
          <AccordionItem id="item-work-queue" title="Section Queue">
            <div id="item-section-panel">Section</div>
          </AccordionItem>
          <AccordionItem id="item-my-queue" title="My Queue">
            <div id="item-individual-panel">Indy</div>
          </AccordionItem>
        </Accordion>
      </Container>,
    );

    const testInstance = testRenderer.root;

    expect(
      testInstance.findByProps({ id: 'item-individual-panel' }).children[0],
    ).toEqual('Indy');

    expect(() =>
      testInstance.findByProps({ id: 'item-section-panel' }),
    ).toThrow();
  });

  it('should be able to click to show an item', () => {
    const testModule = {
      sequences: {
        cerebralBindSimpleSetStateSequence,
      },
      state: {
        item: 'item-1',
      },
    };
    const app = (App as any)(testModule);
    const testRenderer = TestRenderer.create(
      <Container app={app}>
        <Accordion bind="item">
          <AccordionItem id="item-work-queue" title="Section Queue">
            <div id="item-section-panel">Section</div>
          </AccordionItem>
          <AccordionItem id="item-my-queue" title="My Queue">
            <div id="item-individual-panel">Indy</div>
          </AccordionItem>
        </Accordion>
      </Container>,
    );

    const testInstance = testRenderer.root;

    expect(
      testInstance.findByProps({ id: 'item-individual-panel' }).children[0],
    ).toEqual('Indy');

    act(() => {
      testInstance.findByProps({ id: 'item-work-queue' }).props.onClick();
    });

    expect(() =>
      testInstance.findByProps({ id: 'item-individual-panel' }),
    ).toThrow();

    expect(
      testInstance.findByProps({ id: 'item-section-panel' }).children[0],
    ).toEqual('Section');
  });

  it('should be able to click to toggle off an item', () => {
    const testModule = {
      sequences: {
        cerebralBindSimpleSetStateSequence,
      },
      state: {
        item: 'item-1',
      },
    };
    const app = (App as any)(testModule);
    const testRenderer = TestRenderer.create(
      <Container app={app}>
        <Accordion bind="item">
          <AccordionItem id="item-work-queue" title="Section Queue">
            <div id="item-section-panel">Section</div>
          </AccordionItem>
          <AccordionItem id="item-my-queue" title="My Queue">
            <div id="item-individual-panel">Indy</div>
          </AccordionItem>
        </Accordion>
      </Container>,
    );

    const testInstance = testRenderer.root;

    expect(
      testInstance.findByProps({ id: 'item-individual-panel' }).children[0],
    ).toEqual('Indy');

    act(() => {
      testInstance.findByProps({ id: 'item-my-queue' }).props.onClick();
    });

    expect(() =>
      testInstance.findByProps({ id: 'item-individual-panel' }),
    ).toThrow();

    expect(() =>
      testInstance.findByProps({ id: 'item-section-panel' }),
    ).toThrow();
  });

  it('should not show items without a title', () => {
    const testModule = {
      sequences: {
        cerebralBindSimpleSetStateSequence,
      },
      state: {
        item: 'item-1',
      },
    };
    const app = (App as any)(testModule);
    const testRenderer = TestRenderer.create(
      <Container app={app}>
        <Accordion bind="item">
          <AccordionItem id="item-work-queue">
            <div id="item-section-panel">Section</div>
          </AccordionItem>
          <AccordionItem id="item-my-queue">
            <div id="item-individual-panel">Indy</div>
          </AccordionItem>
        </Accordion>
      </Container>,
    );

    const testInstance = testRenderer.root;

    expect(() => testInstance.findByProps({ id: 'item-my-queue' })).toThrow();

    expect(() => testInstance.findByProps({ id: 'item-work-queue' })).toThrow();
  });

  it('should work without bind and id', () => {
    const testModule = {
      sequences: {
        cerebralBindSimpleSetStateSequence,
      },
    };
    const app = (App as any)(testModule);
    const testRenderer = TestRenderer.create(
      <Container app={app}>
        <Accordion bordered>
          <AccordionItem title="Section Queue">
            <div id="item-section-panel">Section</div>
          </AccordionItem>
          <AccordionItem title="My Queue">
            <div id="item-individual-panel">Indy</div>
          </AccordionItem>
        </Accordion>
      </Container>,
    );

    const testInstance = testRenderer.root;

    expect(() =>
      testInstance.findByProps({ id: 'item-individual-panel' }),
    ).toThrow();

    act(() => {
      testInstance.findAllByProps({ type: 'button' })[0].props.onClick();
    });

    expect(() =>
      testInstance.findByProps({ id: 'item-individual-panel' }),
    ).toThrow();

    expect(
      testInstance.findByProps({ id: 'item-section-panel' }).children[0],
    ).toEqual('Section');
  });
});

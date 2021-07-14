import { Container } from '@cerebral/react';
import { DatePickerComponent } from './DatePickerComponent';
import { mount } from 'enzyme';
import App from 'cerebral';
import React from 'react';

describe('DatePickerComponent', () => {
  it('should reset the input value to an empty string if day, month, or year is null', () => {
    const app = App({});

    const wrapper = mount(
      <Container app={app}>
        <DatePickerComponent
          name="test"
          names={{
            day: 'day',
            month: 'month',
            year: 'year',
          }}
          values={{
            day: '04',
            month: '05',
            year: '2001',
          }}
        ></DatePickerComponent>
      </Container>,
    );
    expect(wrapper.find('input').instance().value).toEqual('05/04/2001');

    wrapper.setProps({
      children: (
        <Container app={app}>
          <DatePickerComponent
            name="test"
            names={{
              day: 'day',
              month: 'month',
              year: 'year',
            }}
            values={{
              day: '',
              month: '',
              year: '',
            }}
          ></DatePickerComponent>
        </Container>
      ),
    });

    expect(wrapper.find('input').instance().value).toEqual('');
  });
});

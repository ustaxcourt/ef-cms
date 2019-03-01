import {
  decorateWithPostCallback,
  decorateWithPreemptiveCallback,
  useCerebralStateFactory,
} from './useCerebralState';

describe('decorateWithPostCallback', () => {
  it('should not decorate with a callback if no callback exists', () => {
    const delegate = obj => {
      obj.value = '' + obj.value + ' delegate';
    };

    const data = { value: 'values' };
    decorateWithPostCallback(delegate)(data);
    expect(data.value).toEqual('values delegate');
  });

  it('should call the callback after the initial function', () => {
    const delegate = obj => {
      obj.value = '' + obj.value + ' delegate';
    };

    const postCallback = obj => {
      obj.value = '' + obj.value + ' postCallback';
    };

    const data = { value: 'values' };
    decorateWithPostCallback(delegate, postCallback)(data);
    expect(data.value).toEqual('values delegate postCallback');
  });
});

describe('decorateWithPreemptiveCallback', () => {
  it('should not preempt call if no callback exists', () => {
    const delegate = obj => {
      obj.value = '' + obj.value + ' delegate';
    };

    const data = { value: 'values' };
    decorateWithPreemptiveCallback(delegate)(data);
    expect(data.value).toEqual('values delegate');
  });

  it('should not call the delegate after the preemptive callback if it returns false', () => {
    const delegate = obj => {
      obj.value = '' + obj.value + ' delegate';
    };

    const preemptiveCallback = obj => {
      obj.value = '' + obj.value + ' preemptiveCallback';
      return false;
    };

    const data = { value: 'values' };
    decorateWithPreemptiveCallback(delegate, preemptiveCallback)(data);
    expect(data.value).toEqual('values preemptiveCallback');
  });

  it('should call the callback after the preemptive callback if true', () => {
    const delegate = obj => {
      obj.value = '' + obj.value + ' delegate';
    };

    const preemptiveCallback = obj => {
      obj.value = '' + obj.value + ' preemptiveCallback';
      return true;
    };

    const data = { value: 'values' };
    decorateWithPreemptiveCallback(delegate, preemptiveCallback)(data);
    expect(data.value).toEqual('values preemptiveCallback delegate');
  });
});

describe('useCerebralStateFactory', () => {
  it('should return value and setter method', () => {
    const useCerebralState = useCerebralStateFactory(v => v.value, 'Bags');
    const [name, setName] = useCerebralState('name');

    expect(name).toEqual('Bags');
    expect(setName('Aria')).toEqual('Aria');
  });

  it('should set default value when no value exist in state', () => {
    const useCerebralState = useCerebralStateFactory(v => v.value);
    const defaultNumber = '867-5309';
    const [number] = useCerebralState('number', defaultNumber);

    expect(number).toEqual(defaultNumber);
  });
});

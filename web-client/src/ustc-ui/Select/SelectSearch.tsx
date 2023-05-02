import { getSortedOptions } from '../../ustc-ui/Utils/selectSearchHelper';
import React from 'react';
import ReactSelect, {
  ActionMeta,
  GroupBase,
  OptionsOrGroups,
} from 'react-select';
import classNames from 'classnames';

export class SelectSearch extends React.Component<
  {
    className?: string;
    disabled?: boolean;
    id?: string;
    isClearable?: boolean;
    name?: string;
    onChange?: (newValue: any, actionMeta: ActionMeta<any>) => void;
    onInputChange?: Function;
    options?: OptionsOrGroups<any, GroupBase<any>> | undefined;
    placeholder?: string;
    value?: any;
  },
  { inputText: string }
> {
  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
    };
  }

  handleOnInputChange(inputText, { action }) {
    if (action === 'input-change') {
      this.setState({ inputText });
    }
    if (typeof this.props.onInputChange === 'function') {
      this.props.onInputChange.apply(this, arguments);
    }
  }

  render() {
    const {
      className,
      disabled,
      id,
      isClearable = true,
      name,
      onChange,
      options,
      placeholder = '- Select -',
      value,
    } = this.props;
    const sortedOptions = getSortedOptions(options, this.state.inputText);
    const aria = {
      'aria-describedby': this.props['aria-describedby'],
      'aria-disabled': disabled || this.props['aria-disabled'],
      'aria-label': this.props['aria-label'],
      'aria-labelledby': this.props['aria-labelledby'],
    };

    return (
      <ReactSelect
        {...aria}
        className={classNames('select-react-element', className)}
        classNamePrefix="select-react-element"
        id={id}
        isClearable={isClearable}
        isDisabled={aria['aria-disabled']}
        name={name}
        options={sortedOptions}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onInputChange={this.handleOnInputChange.bind(this)}
      />
    );
  }
}

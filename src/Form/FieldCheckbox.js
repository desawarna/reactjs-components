import classNames from 'classnames/dedupe';
import React from 'react';
import ReactDOM from 'react-dom';

import FieldRadioButton from './FieldRadioButton';
import IconCheckbox from './icons/IconCheckbox';
import Util from '../Util/Util';

class FieldCheckbox extends FieldRadioButton {

  componentDidMount() {
    super.componentDidMount(...arguments);
    this.updateCheckbox();
  }

  componentDidUpdate() {
    super.componentDidUpdate(...arguments);
    this.updateCheckbox();
  }

  updateCheckbox() {
    let {props, refs} = this;
    Object.keys(refs).forEach(function (refName) {
      let checkbox = ReactDOM.findDOMNode(refs[refName]);
      let indeterminate;
      // Single checkbox
      if (props.name === refName) {
        indeterminate = props.indeterminate;
      }

      // Multiple checkboxes
      if (Util.isArray(props.startValue)) {
        indeterminate = Util.find(props.startValue, function (item) {
          return item.name === refName;
        }).indeterminate;
      }

      if (indeterminate != null) {
        checkbox.indeterminate = indeterminate;
      }
    });
  }

  handleChange(eventName, name, event) {
    let {props} = this;
    let model = {name, checked: event.target.checked};

    if (eventName === 'multipleChange') {
      props.handleEvent(eventName, props.name, [model], event);
    }

    if (eventName === 'change') {
      props.handleEvent(eventName, props.name, model, event);
    }
  }

  getItemLabel(attributes) {
    if (!attributes.label) {
      return null;
    }

    let checkboxLabelClass = classNames(
      attributes.checkboxLabelClass,
      this.props.checkboxLabelClass
    );

    return (
      <span className={checkboxLabelClass}>
        {attributes.label}
      </span>
    );
  }

  getItem(eventName, labelClass, attributes, index) {
    let labelClasses = classNames(labelClass, {mute: attributes.disabled});

    return (
      <label className={labelClasses} key={index}>
        <input
          onChange={this.handleChange.bind(this, eventName, attributes.name)}
          ref={attributes.name}
          type="checkbox"
          {...attributes} />
        <span className="form-element-checkbox-decoy">
          <IconCheckbox labelClass={labelClass} {...attributes} />
        </span>
        {this.getItemLabel(attributes)}
      </label>
    );
  }
}

FieldCheckbox.defaultProps = {
  columnWidth: 12,
  formElementClass: 'form-row-element checkbox',
  checkboxLabelClass: 'form-element-checkbox-label',
  handleChange: function () {},
  labelClass: 'form-row-element form-element-checkbox'
};

let classPropType = React.PropTypes.oneOfType([
  React.PropTypes.array,
  React.PropTypes.object,
  React.PropTypes.string
]);

FieldCheckbox.propTypes = {
  // Optional number of columns to take up of the grid
  columnWidth: React.PropTypes.number.isRequired,
  // Function to handle change event
  // (usually passed down from form definition)
  handleEvent: React.PropTypes.func,
  // Optional boolean, string, or react node.
  // If boolean: true - shows name as label; false - shows nothing.
  // If string: shows string as label.
  // If node: returns the node as the label.
  showLabel: React.PropTypes.oneOfType([
    React.PropTypes.node,
    React.PropTypes.string,
    React.PropTypes.bool
  ]),
  // Optional object of error messages, with key equal to field property name
  validationError: React.PropTypes.object,

  // Classes
  formElementClass: classPropType,
  formGroupClass: classPropType,
  formGroupErrorClass: classPropType,
  helpBlockClass: classPropType,
  labelClass: classPropType
};

module.exports = FieldCheckbox;

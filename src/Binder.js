import React, { Component } from 'react';
import PropTypes from 'prop-types';

function handleBinder(parentProps, props) {
  let newProps = {};
  ['error', 'label', 'value', 'onBlur'].forEach(method => {
    let binder = parentProps[method];
    if (!binder) return;
    if (typeof binder[`${method}For`] === 'function') newProps[method] = binder[`${method}For`](props.id);
    else if (typeof binder[`${method}Props`] === 'function') binder[`${method}Props`](props, newProps);
  });
  return newProps;
}

function deepClone(parentProps, children) {
  return React.Children.map(children, child => {
    if (!child || !child.props) return child;
    let childProps = React.isValidElement(child) && child.props.id ? handleBinder(parentProps, child.props) : {};
    childProps.children = deepClone(parentProps, child.props.children);
    return React.cloneElement(child, childProps);
  });
}

export default class Binder extends Component {
  render() {
    return deepClone(this.props, this.props.children);
  }
}

Binder.propTypes = {
  error: PropTypes.object,
  label: PropTypes.object,
  onBlur: PropTypes.object,
};

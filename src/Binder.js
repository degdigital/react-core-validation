import React, { Component } from 'react';
import PropTypes from 'prop-types';

function handleBinder(parentProps, props, opt) {
  let newProps = {};
  ['error', 'label', 'value', 'onBlur'].forEach(method => {
    let binder = parentProps[method];
    if (!binder) return;
    if (typeof binder[`${method}For`] === 'function') newProps[method] = binder[`${method}For`](props.id, opt);
    else if (typeof binder[`${method}Props`] === 'function') binder[`${method}Props`](props, params, newProps);
  });
  return newProps;
}

function deepClone(parentProps, children, opt) {
  return React.Children.map(children, child => {
    if (!child || !child.props) return child;
    let childProps = React.isValidElement(child) && child.props.id ? handleBinder(parentProps, child.props, opt) : {};
    childProps.children = deepClone(parentProps, child.props.children, opt);
    return React.cloneElement(child, childProps);
  });
}

export default class Binder extends Component {
  render() {
    let opt = this.props.opt;
    return deepClone(this.props, this.props.children, opt);
  }
}

Binder.propTypes = {
  error: PropTypes.object,
  label: PropTypes.object,
  onBlur: PropTypes.object,
  opt: PropTypes.object,
};

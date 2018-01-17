import React, { Component } from 'react';
import PropTypes from 'prop-types';

function handleBinder(parentProps, props, opts) {
  let newProps = {};
  ['error', 'label', 'value', 'onBlur'].forEach(method => {
    let binder = parentProps[method];
    if (!binder) return;
    if (typeof binder[`${method}Props`] === 'function') binder[`${method}Props`](props, params, newProps);
    else if (props[method] === undefined && typeof binder[`${method}For`] === 'function') newProps[method] = binder[`${method}For`](props.id, opts);
  });
  return newProps;
}

function deepClone(parentProps, children, opts) {
  return React.Children.map(children, child => {
    if (!child || !child.props) return child;
    let childProps = React.isValidElement(child) && child.props.id ? handleBinder(parentProps, child.props, opts) : {};
    childProps.children = deepClone(parentProps, child.props.children, opts);
    return React.cloneElement(child, childProps);
  });
}

export default class Binder extends Component {
  render() {
    let opts = this.props.opts;
    return deepClone(this.props, this.props.children, opts);
  }
}

Binder.propTypes = {
  error: PropTypes.object,
  label: PropTypes.object,
  onBlur: PropTypes.object,
  opts: PropTypes.object,
};

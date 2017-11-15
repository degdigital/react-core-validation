// https://github.com/atomicobject/elegant-form-validation-react/blob/master/src/Validation
import moment from 'moment';
// // Object.keys polyfill
// if (!Object.keys) {
//   Object.keys = function (obj) { let keys = []; for (let k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) keys.push(k); return keys; };
// }

// error messages
export const requiredError = fieldName => `${fieldName} is required`;
export const mustMatchError = otherFieldName => (fieldName) => `${fieldName} must match ${otherFieldName}`;
export const minLengthError = length => (fieldName) => `${fieldName} must be at least ${length} characters`;
export const maxLengthError = length => (fieldName) => `${fieldName} must be at most ${length} characters`;
export const invalidFormatError = fieldName => `${fieldName} has an invalid format`;
// rules
export const required = (f, text) => f ? null : [[text, text], v => v ? null : requiredError];
export const mustMatch = (field, fieldName) => (f, text, state) => f ? null : [[text, state[field] === text], v => v ? null : mustMatchError(fieldName)];
export const minLength = (length) => (f, text) => f ? null : [[text, text && text.length >= length], v => v ? null : minLengthError(length)];
export const maxLength = (length) => (f, text) => f ? null : [[text, (!text || text && text.length <= length)], v => v ? null : maxLengthError(length)];
// formats
export const bool = (param) => (f, text) => f ? boolFormater(text, param) : [boolParser(text, param), v => v ? null : invalidFormatError];
export const date = (param) => (f, text) => f ? dateFormater(text, param) : [dateParser(text, param), v => v ? null : invalidFormatError];
export const dateTime = (param) => (f, text) => f ? dateTimeFormater(text, param) : [dateTimeParser(text, param), v => v ? null : invalidFormatError];
export const decimal = (param) => (f, text) => f ? decimalFormater(text, param) : [decimalParser(text, param), v => v ? null : invalidFormatError];
export const email = (param) => (f, text) => f ? emailFormater(text, param) : [emailParser(text, param), v => v ? null : invalidFormatError];
export const emailList = (param) => (f, text) => f ? emailListFormater(text, param) : [emailListParser(text, param), v => v ? null : invalidFormatError];
export const hostname = (param) => (f, text) => f ? hostnameFormater(text, param) : [hostnameParser(text, param), v => v ? null : invalidFormatError];
export const hostnameList = (param) => (f, text) => f ? hostnameListFormater(text, param) : [hostnameListParser(text, param), v => v ? null : invalidFormatError];
export const integer = (param) => (f, text) => f ? integerFormater(text, param) : [integerParser(text, param), v => v ? null : invalidFormatError];
export const memo = (param) => (f, text) => f ? memoFormater(text, param) : [memoParser(text, param), v => v ? null : invalidFormatError];
export const money = (param) => (f, text) => f ? moneyFormater(text, param) : [moneyParser(text, param), v => v ? null : invalidFormatError];
export const monthAndDay = (param) => (f, text) => f ? monthAndDayFormater(text, param) : [monthAndDayParser(text, param), v => v ? null : invalidFormatError];
export const percent = (param) => (f, text) => f ? percentFormater(text, param) : [percentParser(text, param), v => v ? null : invalidFormatError];
export const phone = (param) => (f, text) => f ? phoneFormater(text, param) : [phoneParser(text, param), v => v ? null : invalidFormatError];
export const real = (param) => (f, text) => f ? realFormater(text, param) : [realParser(text, param), v => v ? null : invalidFormatError];
export const regex = (param) => (f, text) => f ? regexFormater(text, param) : [regexParser(text, param), v => v ? null : invalidFormatError];
export const text = (param) => (f, text) => f ? textFormater(text, param) : [textParser(text, param), v => v ? null : invalidFormatError];
export const time = (param) => (f, text) => f ? timeFormater(text, param) : [timeParser(text, param), v => v ? null : invalidFormatError];
export const uri = (param) => (f, text) => f ? uriFormater(text, param) : [uriParser(text, param), v => v ? null : invalidFormatError];
export const xml = (param) => (f, text) => f ? xmlFormater(text, param) : [xmlParser(text, param), v => v ? null : invalidFormatError];
export const zip = (param) => (f, text) => f ? zipFormater(text, param) : [zipParser(text, param), v => v ? null : invalidFormatError];

// execution
export const rule = (field, name, ...args) => {
  return {
    r: (state) => {
      return {
        field,
        name,
        args
      };
    },
    v0: (state) => {
      for (let v of args) {
        let value = state[field], x = v(0, value, state), newValue = v(1, x[0][0], state);
        if (newValue && value !== newValue) {
          return { [field]: newValue };
        }
      }
      return null;
    },
    v1: (state) => {
      for (let v of args) {
        let value = state[field], x = v(0, value, state);
        let messageFunc = x[1](x[0][1]);
        if (messageFunc) {
          return { [field]: messageFunc(name) };
        }
      }
      return null;
    },
    f: (state) => {
      for (let v of args) {
        let value = state[field], newValue = v(1, value, state);
        if (newValue && value !== newValue) {
          return { [field]: newValue };
        }
      }
      return null;
    }
  }
};
export const ruleIf = (condition, ...rules) => {
  return {
    c: (state) => typeof condition !== 'function' ? state[condition] : condition(state),
    r: rules
  }
};
export const flatten = (state, rules) => rules.reduce((y, x) => { y.push.apply(y, x.c ? (x.c(state) && x.r ? flatten(state, x.r) : []) : [x.r(state)]); return y; }, []);
export const valuedate = (state, rules) => rules.reduce((y, x) => Object.assign(y, x.c ? (x.c(state) && x.r ? valuedate(state, x.r) : y) : x.v0(state)), {});
export const validate = (state, rules) => rules.reduce((y, x) => Object.assign(y, x.c ? (x.c(state) && x.r ? validate(state, x.r) : y) : x.v1(state)), {});
export const format = (state, rules) => rules.reduce((y, x) => Object.assign(y, x.c ? (x.c(state) && x.r ? format(state, x.r) : y) : x.f(state)), {});

// accessors
export let hasErrors = function ($this, rules, stateProp) {
  let errors = rules ? setErrors($this, rules, stateProp) : $this.state.errors || {};
  errors._showErrors = true;
  $this.setState({ errors });
  return Object.keys(errors).length !== 1;
};

export let hadErrors = function ($this, stateProp) {
  let errors = $this.state.errors || null;
  return errors ? Object.keys(errors).length !== 1 : false;
};

export let hadShownErrors = function ($this, stateProp) {
  let errors = $this.state.errors ? $this.state.errors._showErrors || null : null;
  return errors ? Object.keys(errors).length !== 1 : false;
};

export let errorFor = function ($this, field) {
  return $this.state.errors && $this.state.errors._showErrors ? $this.state.errors[field || ''] || '' : '';
};

export let getRules = function ($this, rules, stateProp) {
  let state = stateProp ? $this.state[stateProp] : $this.state;
  return rules ? flatten(state, rules) : [];
};

export let setState = function ($this, rules, stateProp) {
  let state = stateProp ? $this.state[stateProp] : $this.state;
  let effectiveRules = getRules($this, rules, stateProp);
  let fieldMap = effectiveRules.reduce((y, x) => Object.assign(y, { [x.field]: true }), {});
  Object.keys(state).forEach(function (key) {
    if (!fieldMap[key]) {
      state[key] = undefined;
      // delete state[key];
    }
  });
  return $this.state;
};

export let setErrors = function ($this, rules, stateProp) {
  let state = stateProp ? $this.state[stateProp] : $this.state;
  let errors = rules ? validate(state, rules) : {};
  errors._showErrors = ($this.state.errors || { _showErrors: false })._showErrors;
  $this.setState({ errors });
  return errors;
};

export let setValues = function ($this, rules, stateProp) {
  let state = stateProp ? $this.state[stateProp] : $this.state;
  let values = rules ? valuedate(state, rules) : {};
  if (stateProp) { for (let key in values) state[key] = values[key]; $this.setState({ [stateProp]: state }); }
  else $this.setState(values);
  return values;
};

export let setFormats = function ($this, rules, stateProp) {
  let state = stateProp ? $this.state[stateProp] : $this.state;
  let values = rules ? format(state, rules) : {};
  if (stateProp) { for (let key in values) state[key] = values[key]; $this.setState({ [stateProp]: state }); }
  else $this.setState(values);
  return values;
};

// export let parseFor = function ($this, rules, field) {
// 	let state = stateProp ? $this.state[stateProp] : $this.state;
// 	let oldValue = state[field] || '';
// 	let newValue = rules ? format(state, rules, field) : '';
// 	if (oldValue == newValue) {
// 		return;
// 	}
// 	if (stateProp) { }
// 	else $this.setState({ [field]: newValue });
// };

export default {
  hasErrors, hadErrors, hadShownErrors, errorFor, getRules, setState, setErrors, setValues, setFormats
};


//// CONVERTERS ////
const _minDateValue = moment([1753, 1, 1]);
const _maxDateValue = moment([9999, 12, 31]);
const _emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const _hostnamePattern = /^(?:([left-zA-Z0-9](?:[left-zA-Z0-9\-]{0,61}[left-zA-Z0-9])?\.)+([left-zA-Z]{2,6})(:\d{1,5})?)|(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d{1,5})?)?$/;

// bool
export const boolFormater = (value, param) => {
  if (!value) return '';
  if (param) {
    switch (param.format) {
      case 'trueFalse': return value ? 'True' : 'False';
      case 'yesNo': return value ? 'Yes' : 'No';
      case 'values':
        let values = param.values; if (!values) throw new Error('param.values undefined');
        if (values.length != 2) throw new Error('param.values invalid');
        return value ? values[0] : values[1];
      default: throw new Error('param.format invalid');
    }
  }
  return value ? 'Yes' : 'No';
};
export const boolParser = (text, param) => {
  if (!text) return [text, false];
  switch (text.toLowerCase()) {
    case '1': case 'y': case 'true': case 'yes': case 'on': return [true, true];
    case '0': case 'n': case 'false': case 'no': case 'off': return [false, true];
  }
};

// dates
let dateFormaterDefault = 'YYYY-MM-DD'; //'M/D/YYYY'
export const dateFormater = (value, param) => {
  if (!value) return '';
  value = moment(value);
  if (param) {
    switch (param.format) {
      case 'date': return value.format('DD MMMM YYYY');
      case 'longDate': return value.format('dddd, MMMM D, YYYY');
      case 'longDate2': return value.format(value.year() === moment().year() ? 'dddd, MMMM D' : 'dddd, MMMM D, YYYY');
      case 'shortDate': return value.format('D-MMM-YYYY');
      case 'shorterDate': return value.format('MMM D YYYY');
      case 'monthDay': return value.format('MMMM D');
      case 'monthYear': return value.format('MMMM YYYY');
      case 'pattern': return value.format(param.pattern);
      default: throw new Error('param.format invalid');
    }
  }
  return value.format(dateFormaterDefault);
};
export const dateParser = (text, param) => {
  if (!text) return [text, false];
  let value = moment(text); if (!value.isValid()) return [text, false];
  else if (value < _minDateValue || value > _maxDateValue) return [value, false];
  value = moment([value.year(), value.month(), value.date()]);
  if (param) { // check param
    let minValue = param.minValue; if (minValue && value < moment(minValue)) return [value, false];
    let maxValue = param.maxValue; if (maxValue && value > moment(maxValue)) return [value, false];
  }
  return [value, true];
};

// dateTime
export const dateTimeFormater = (value, param) => {
  if (!value) return '';
  value = moment(value);
  if (param) {
    switch (param.format) {
      case 'date': return value.format('DD MMMM YYYY hh:mm tt');
      case 'longDateTime': return value.format('dddd, MMMM D, YYYY');
      case 'longDate': return value.format('dddd, MMMM D, YYYY');
      case 'longTime': return value.format('hh:mm:ss tt');
      case 'shortDate': return value.format('D-MMM-YYYY');
      case 'shortTime': return value.format('hh:mm tt');
      case 'tinyDate': return value.format('M/D/YY');
      case 'tinyDateTime': return value.format('M/D/YY hh:mm tt');
      case 'pattern': return value.format(param.pattern);
      default: throw new Error('param.format invalid');
    }
  }
  return value.format('M/D/YYYY');
};
export const dateTimeParser = (text, param) => {
  if (!text) return [text, false];
  let value = moment(text); if (!value.isValid()) return [text, false];
  else if (value < _minDateValue || value > _maxDateValue) return [value, false];
  value = moment([value.year(), value.month() + 1, value.date()]);
  if (param) { // check param
    let minValue = param.minValue; if (minValue && value < moment(minValue)) return [value, false];
    let maxValue = param.maxValue; if (maxValue && value > moment(maxValue)) return [value, false];
  }
  return [value, true];
};

// decimal
export const decimalFormater = (value, param) => {
  if (!value) return '';
  value = parseFloat(value);
  if (param) {
    switch (param.format) {
      case 'pattern': return value.toFixed(param.pattern);
      default: throw new Error('param.format invalid');
    }
  }
  return value.toFixed(4);
};
export const decimalParser = (text, param) => {
  if (!text) return [text, false];
  let value = parseFloat(text); if (isNaN(value)) return [text, false];
  if (param) { // check param
    let minValue = param.minValue; if (minValue && value < parseFloat(minValue)) return [value, false];
    let maxValue = param.maxValue; if (maxValue && value > parseFloat(maxValue)) return [value, false];
    let precision = param.precision; if (precision && value !== Math.round(value, precision)) return [value, false];
    let round = param.round; if (round) value = Math.round(value, round);
  }
  return [value, true];
};

// email
export const emailFormater = (value, param) => {
  if (!value) return '';
  return value;
};
export const emailParser = (text, param) => {
  if (!text) return [text, false];
  if (!_emailPattern.test(text)) return [value, false];
  return [value, true];
};

// emailList
export const emailListFormater = (value, param) => {
  if (!value) return '';
  return value;
};
export const emailListParser = (text, param) => {
  if (!text) return [text, false];
  let list = text.replace(',', ';').split(';'), newList = [];
  for (let v in list) {
    v = v.trim(); if (!v) continue;
    if (!_emailPattern.test(list[i])) return [text, false];
    newList.push(v);
  }
  let value = newList.join('; ');
  if (param) { // check param
    let maxCount = param.maxCount; if (maxCount && newList.length > maxCount) return [text, false];
  }
  return [value, true];
};

// hostname
export const hostnameFormater = (value, param) => {
  if (!value) return '';
  return value;
};
export const hostnameParser = (text, param) => {
  if (!text) return [text, false];
  if (!_hostnamePattern.test(text)) return [value, false];
  return [value, true];
};

// hostnameList
export const hostnameListFormater = (value, param) => {
  if (!value) return '';
  return value;
};
export const hostnameListParser = (text, param) => {
  if (!text) return [text, false];
  let list = text.replace('\r', '').replace('\n', ';').replace(',', ';').split(';'), newList = [];
  for (let v in list) {
    v = v.trim(); if (!v) continue;
    if (!_hostnamePattern.test(list[i])) return [text, false];
    newList.push(v);
  }
  let value = newList.join('; ');
  if (param) { // check param
    let maxCount = param.maxCount; if (maxCount && newList.length > maxCount) return [text, false];
  }
  return [value, true];
};

// integer
export const integerFormater = (value, param) => {
  if (!value) return '';
  value = parseInt(value);
  if (param) {
    switch (param.format) {
      case 'comma': return value.toString('#,##0');
      case 'byte':
        let length = Math.floor((double)(value.toString().length - 1) / 3);
        if (length > 0) return Math.Round(value / (2 << (10 * length)), 2).toString() + ' ' + '  KBMBGB'.substring(length * 2, 2);
        if (value == 1) return '1 byte';
        return value.toString() + ' bytes';
      case 'pattern': return value.toString(param.pattern);
      default: throw new Error('param.format invalid');
    }
  }
  return value.toString();
};
export const integerParser = (text, param) => {
  if (!text) return [text, false];
  let value = parseInt(text); if (isNaN(value)) return [text, false];
  if (param) { // check param
    let minValue = param.minValue; if (minValue && value < parseInt(minValue)) return [value, false];
    let maxValue = param.maxValue; if (maxValue && value > parseInt(maxValue)) return [value, false];
  }
  return [value, true];
};

// memo
export const memoFormater = (value, param) => {
  if (!value) return '';
  return value;
};
export const memoParser = (text, param) => {
  if (!text) return [text, false];
  if (param) { // check param
    let maxNonWhiteSpaceLength = param.maxNonWhiteSpaceLength; if (maxNonWhiteSpaceLength && /\s/.replace(text, '').length > maxNonWhiteSpaceLength) return [value, false];
    let maxLines = param.maxLines; if (maxLines && text.split('\r\n').length > maxLines) return [value, false];
  }
  return [value, true];
};

// money
Number.prototype.formatMoney = function (c, d, t) {
  var n = this,
    c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = (j = i.length) > 3 ? j % 3 : 0;
  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};
export const moneyFormater = (value, param) => {
  if (!value) return '';
  value = parseFloat(value);
  if (param) {
    switch (param.format) {
      case 'c3': return '$' + value.formatMoney(3);
      case 'c2': return '$' + value.formatMoney(2);
      case 'pattern': return '$' + value.formatMoney(param.pattern);
      default: throw new Error('param.format invalid');
    }
  }
  return '$' + value.formatMoney(2);
};
export const moneyParser = (text, param) => {
  if (!text) return [text, false];
  //if(!/^\d+$/.test(text)) return [text, false];
  text = text.replace(/[^0-9\.]+/g, ''); if (!text) return [text, false];
  let value = parseFloat(text); if (isNaN(value)) return [text, false];
  value = Math.round(value, 4);
  if (param) { // check param
    let minValue = param.minValue; if (minValue && value < parseFloat(minValue)) return [value, false];
    let maxValue = param.maxValue; if (maxValue && value > parseFloat(maxValue)) return [value, false];
    let precision = param.precision; if (precision && value !== Math.round(value, precision)) return [value, false];
    let round = param.round; if (round) value = Math.round(value, round);
  }
  return [value, true];
};

// monthAndDay
export const monthAndDayFormater = (value, param) => {
  if (!value) return '';
  value = moment(value);
  if (param) {
    switch (param.format) {
      case 'pattern': return value.format(param.pattern);
      default: throw new Error('param.format invalid');
    }
  }
  return value.format('M/D');
};
export const monthAndDayParser = (text, param) => {
  if (!text) return [text, false];
  let match = /^\d{1,2}([/\-])\d{1,2}$/.exec(text); if (!match) return [text, false];
  let value = moment(match[1] + '2000'); if (!value.isValid()) return [text, false];
  return [value, true];
};

// percent
export const percentFormater = (value, param) => {
  if (!value) return '';
  value = parseFloat(value);
  if (param) {
    switch (param.format) {
      case 'pattern': return value.toString(param.pattern);
      default: throw new Error('param.format invalid');
    }
  }
  return value.toString('0.00') + '%';
};
export const percentParser = (text, param) => {
  if (!text) return [text, false];
  if (text && text[text.length - 1] === '%') text = text.substring(0, text.length - 1);
  let value = parseFloat(text); if (isNaN(value)) return [text, false];
  return [value, true];
};

// phone
export const phoneFormater = (value, param) => {
  if (!value) return '';
  return value;
};
export const phoneParser = (text, param) => {
  if (!text) return [text, false];
  let countries = param && param.countries ? param.countries() || '' : 'u';
  if (countries.includes('u') || countries.includes('c')) { // canada+usa/generic parsing
    let text = ''; //U.extractDigits(text);
    if (text.length > 10) return [text.substring(0, 3) + '-' + text.substring(3, 3) + '-' + text.substring(6, 4) + ' x' + text.substring(10), true];
    else if (text.length === 10) return [text.substring(0, 3) + '-' + text.substring(3, 3) + '-' + text.substring(6, 4), true];
    else if (text.length === 7) return [text.substring(0, 3) + '-' + text.substring(3, 4), true];
  }
  else if (countries === '') return [text, true]; // accept all
  return [text, false];
};

// real
export const realFormater = (value, param) => {
  if (!value) return '';
  value = parseFloat(value);
  if (param) {
    switch (param.format) {
      case 'pattern': return value.toFixed(param.pattern);
      default: throw new Error('param.format invalid');
    }
  }
  return value.toFixed(4);
};
export const realParser = (text, param) => {
  if (!text) return [text, false];
  let value = parseFloat(text); if (isNaN(value)) return [text, false];
  if (param) { // check param
    let minValue = param.minValue; if (minValue && value < parseFloat(minValue)) return [value, false];
    let maxValue = param.maxValue; if (maxValue && value > parseFloat(maxValue)) return [value, false];
    let precision = param.precision; if (precision && value !== Math.round(value, precision)) return [value, false];
    let round = param.round; if (round) value = Math.round(value, round);
  }
  return [value, true];
};

// regex
export const regexFormater = (value, param) => {
  if (!value) return '';
  return value;
};
export const regexParser = (text, param) => {
  if (!text) return [text, false];
  if (param) { // check param
    let pattern = param.pattern; if (pattern && !(new RegExp(pattern)).test(text)) return [text, false];
  }
  return [text, true];
};

// text
export const textFormater = (value, param) => {
  if (!value) return '';
  return value;
};
export const textParser = (text, param) => {
  if (!text) return [text, false];
  return [text, true];
};

// time
export const timeFormater = (value, param) => {
  if (!value) return '';
  value = moment(value);
  if (param) {
    switch (param.format) {
      case 'longTime': return value.format('hh:mm:ss tt');
      case 'shortTime': return value.format('hh:mm tt');
      case 'pattern': return value.format(param.pattern);
      default: throw new Error('param.format invalid');
    }
  }
  return value.format('hh:mm tt');
};
export const timeParser = (text, param) => {
  if (!text) return [text, false];
  let value = moment(text); if (!value.isValid()) return [text, false];
  value = moment([0, 0, 0, value.hour(), value.minute(), value.second()]);
  if (param) { // check param
    let minValue = param.minValue, minValue2; if (minValue && value < moment(minValue)) return [value, false];
    let maxValue = param.maxValue, maxValue2; if (maxValue && value > moment(maxValue)) return [value, false];
  }
  return [value, true];
};

// uri
export const uriFormater = (value, param) => {
  if (!value) return '';
  return value;
};
export const uriParser = (text, param) => {
  if (!text) return [text, false];
  return [text, true];
};

// xml
export const xmlFormater = (value, param) => {
  if (!value) return '';
  return value;
};
export const xmlParser = (text, param) => {
  if (!text) return [text, false];
  return [text, true];
};

// zip
export const zipFormater = (value, param) => {
  if (!value) return '';
  return value;
};
export const zipParser = (text, param) => {
  let letter = /[a-z]/i, digit = /[0-9]/i;
  if (!text) return [text, false];
  let countries = param && param.countries ? param.countries() || '' : 'u';
  if (countries.includes('c')) { // canada/generic parsing
    let text = ''; //U.extractAlphaDigits(text);
    if (text.length === 6 &&
      text[0].match(letter) && text[1].match(digit) && text[2].match(letter) &&
      text[3].match(digit) && text[4].match(letter) && text[5].match(digit)
    ) return [text.substring(0, 3) + ' ' + text.substring(3), true];
  }
  if (countries.includes('u')) { // usa/generic parsing
    let text = ''; //U.extractDigits(text);
    if (text.length >= 7 && text.length <= 9) return [text.substring(0, 5) + '-' + text.substring(5).padStart(4, '0'), true];
    else if (text.length >= 3 && text.length <= 5) return [text.padStart(5, '0'), true];
  }
  else if (countries === '') return [text, true]; // accept all
  return [text, false];
};

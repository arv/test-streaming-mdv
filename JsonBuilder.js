'use strict';

function assert(b) {
  if (!b)
    throw Error('Assertion failed');
}

function JsonBuilder() {
  this.parser = new CParser();
  this.value = undefined;
  this.valueStack = [];
  this.stateStack = ['begin'];
  this.keyStack = [];

  this.parser.onerror = this.onerror.bind(this);
  this.parser.onvalue = this.onvalue.bind(this);
  this.parser.onopenobject = this.onopenobject.bind(this);
  this.parser.onkey = this.onkey.bind(this);
  this.parser.oncloseobject = this.oncloseobject.bind(this);
  this.parser.onopenarray = this.onopenarray.bind(this);
  this.parser.onclosearray = this.onclosearray.bind(this);
  this.parser.onend = this.onend.bind(this);
}

JsonBuilder.prototype = {

  get value_() {
    return this.valueStack[this.valueStack.length - 1];
  },

  get state() {
    return this.stateStack[this.stateStack.length - 1];
  },

  get key() {
    return this.keyStack[this.keyStack.length - 1];
  },

  pushValue: function(v) {
    this.valueStack.push(v);
  },

  onerror: function (e) {

  },
  onvalue: function (v) {
    var state = this.state;
    var value = this.value_;
    switch (state) {
      case 'begin':
        this.value = v;
        break;
      case 'array':
        value.push(v);
        break;
      case 'key':
        value[this.key] = v;
        this.stateStack.pop();
        this.keyStack.pop();
        break;
      default:
        throw Error('Invalid state');
    }
  },
  onopenobject: function (key) {
    var object = {};
    this.onvalue(object);

    this.pushValue(object);
    this.stateStack.push('object');

    this.stateStack.push('key');
    this.keyStack.push(key);
  },
  onkey: function (key) {
    this.keyStack.push(key);
    this.stateStack.push('key');
  },
  oncloseobject: function () {
    this.valueStack.pop();
    assert(this.stateStack.pop() === 'object');
  },
  onopenarray: function () {
    var array = [];
    this.onvalue(array);

    this.pushValue(array);
    this.stateStack.push('array');
  },
  onclosearray: function () {
    this.valueStack.pop();
    assert(this.stateStack.pop() === 'array');
  },
  onend: function () {
    // I don't see this one happening.
    console.log('onend');
  },

  write: function(s) {
    this.parser.write(s);
  }
};

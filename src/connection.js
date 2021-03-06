'use strict';

//====================================================================

var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;

//--------------------------------------------------------------------

var extend = require('underscore').extend;

//====================================================================

var has = Object.prototype.hasOwnProperty;
has = has.call.bind(has);

//====================================================================

var Connection = function Connection(adapter) {
	this.data = Object.create(null);

	this._adapter = adapter;
};
inherits(Connection, EventEmitter);

extend(Connection.prototype, {
	// Close the connection.
	close: function () {
		this._adapter.close();
		this.emit('close');

		// Releases values AMAP to ease the garbage collecting.
		for (var key in this)
		{
			if (has(this, key))
			{
				delete this[key];
			}
		}
	},

	// Gets the value for this key.
	get: function (key, defaultValue) {
		var data = this.data;

		if (key in data)
		{
			return data[key];
		}

		if (arguments.length >= 2)
		{
			return defaultValue;
		}

		throw new Error('no value for `'+ key +'`');
	},

	// Checks whether there is a value for this key.
	has: function (key) {
		return key in this.data;
	},

	// Sets the value for this key.
	set: function (key, value) {
		this.data[key] = value;
	},

	// Sends a message.
	send: function (name, data) {
		this._adapter.send(name, data);
	},

	unset: function (key) {
		delete this.data[key];
	},
});

//====================================================================

module.exports = Connection;

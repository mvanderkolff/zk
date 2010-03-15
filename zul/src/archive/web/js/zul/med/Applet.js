/* Applet.js

	Purpose:
		
	Description:
		
	History:
		Wed Mar 25 17:11:55     2009, Created by tomyeh

Copyright (C) 2009 Potix Corporation. All Rights Reserved.

This program is distributed under LGPL Version 3.0 in the hope that
it will be useful, but WITHOUT ANY WARRANTY.
*/
/** The multimedia widgets, such as applet and audio.
 */
//zk.$package('zul.med');

/**
 * A generic applet component.
 * 
 * <p>
 * Non XUL extension.
 * <p>Note: {@link #setVisible} with false cannot work in IE. (Browser's limitation) 
 */
zul.med.Applet = zk.$extends(zul.Widget, {
	$init: function() {
		this._params = {};
		this.$supers('$init', arguments);
	},

	$define: {
		/** Return the code of the applet, i.e., the URI of the Java class.
		 * @return String
		 */
		/** Sets the code of the applet, i.e., the URI of the Java class.
		 * @param String code
		 */
		code: _zkf = function () {
			this.rerender();
		},
		/** Return the codebase of the applet, i.e., the URI of the Java class.
		 * @return String
		 */
		/** Sets the codebase of the applet, i.e., the URI of the Java class.
		 * @param String codebase
		 */
		codebase: _zkf
	},
	/** Invokes the function of the applet running at the client.
	 */
	invoke: zk.ie ? function() {
		var n = this.$n(),
			len = arguments.length;
		if (n && len >= 1) {
			var single = len < 3,
				begin = single ? '(' : '([',
				end = single ? ')' : '])',
				expr = "n." + arguments[0] + begin;
			for (var j = 1; j < len;) {
				if (j != 1) expr += ',';
				var s = arguments[j++];
				expr += '"' + (s ? s.replace('"', '\\"'): '') + '"';
			}
			try {
				eval(expr + end);
			} catch (e) {
				zk.error("Failed to invoke applet's method: "+expr+'\n'+e.message);
			}
		}
	}: function(){
		var n = this.$n();
		if (n && arguments.length >= 1) {
			var fn = arguments[0],
				func = n[fn];
			if (!func) {
				zk.error("Method not found: "+fn);
				return;
			}
			try {
				var args = [],
					arrayArg = [];
				if (arguments.length < 3) {
					if (arguments[1]) 
						args.push(arguments[1]);
				} else {
					for (var j = 1, len = arguments.length; j < len;) 
						arrayArg.push(arguments[j++]);
					args.push(arrayArg);
				}
				func.apply(n, args);
			} catch (e) {
				zk.error("Failed to invoke applet's method: "+fn+'\n'+e.message);
			}
		}
	},
	/** Returns the value of the specified filed.
	 * @param String name
	 * @return String
	 */
	getField: function (name) {
		var n = this.$n();
		return n ? n[name]: null;
	},
	/** Sets the value of the specified filed.
	 * @param String name
	 * @param String value
	 */
	setField: function (name, value) {
		var n = this.$n();
		if (n)
			try {
				n[name] = value;
			} catch(e) {
				zk.error("Failed to set applet's field: "+ name+'\n'+e.message);
			}
	},

	/** Sets the param. Notice that it is meaningful only if it is called
	 * before redraw.
	 * There are two format:
	 * setParam(nm, val)
	 * and
	 * setParam([nm, val])
	 * @param String nm
	 * @param String val
	 */
	setParam: function (nm, val) {
		if (arguments.length == 1) {
			val = nm[1];
			nm = nm[0];
		}
		if (val != null) this._params[nm] = val;
		else delete this._params[nm];
	},

	//super
	domAttrs_: function(no){
		return this.$supers('domAttrs_', arguments)
				+ ' code="' + (this._code || '') + '"'
				+ ' codebase="' + (this._codebase || '') + '"';
	},
	domStyle_: function (no) {
		return this.$supers('domStyle_', arguments)
			+ "visibility:visible;"; //bug 2815049
	},

	_outParamHtml: function (out) {
		var params = this._params;
		for (var nm in params)
			out.push('<param name="', zUtl.encodeXML(nm), '" value="', zUtl.encodeXML(params[nm]), '"/>');
	}
});

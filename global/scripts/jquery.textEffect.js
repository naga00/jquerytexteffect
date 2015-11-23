/**
 * jquery.textEffect.js
 * Copyright (c) 2012 www.metaphor.co.jp
 * Dual licensed under the MIT and GPL licenses.
 * Date: 2012-3-13
 * @version 1.0.0
 * http://www.metaphor.co.jp/
 */
 
(function($) {
	$.fn.textEffect = function(options){
		
		options = $.extend({
			fromText: "",
			toText: "",
			frames: 2.0,
			charDelay: 0.5,
			lineDelay: 5.0,
			delay: 0.0,
			defaultChar: " ",
			tick: 30,
			onComplete: function () {}
		}, options);
		
		this.each(function(){
			var element = $(this);
			if(element.data("animated")) return;
			
			element.data("animated", true);
			var timer;
			var fromText = element.html();
			var toText = options.toText.length ? options.toText : fromText;
			options.toText = "";

			var str = replaceAll(fromText, /<br>\n|<br \/>\n/, "\n");
			str = replaceAll(str, /<br>|<br \/>/, "\n");
			str = replaceAll(str, /./, options.defaultChar);
			str = replaceAll(str, /\n/, "<br>");
			element.html(str);

			var dCode = options.defaultChar.charCodeAt(0);
			var sLines = element.html().length ? element.html().split("<br>") : [];
			var tLines = toText.length ? toText.split("<br>") : [];
			var sLen = sLines.length;
			var tLen = tLines.length;
			var funcs = [];
			
			if(tLen >= sLen){
				for(var i = 0; i < tLen; ++i){
					funcs.push(forward(sLines[i] || "", tLines[i], options.frames, options.charDelay, options.delay + i * options.lineDelay, dCode));
				}
			} else {
				for (i = 0; i < sLen; ++i) {
					funcs.push(forward(sLines[i], tLines[i] || "", options.frames, options.charDelay, options.delay + (sLines.length - 1 - i) * options.lineDelay, dCode));
				} 
			}
	
			var update = function() {
				var lines = [];
				var line = "";
				for (var i = 0, len = funcs.length; i < len; ++i) {
					line = funcs[i]();
					if(funcs.length > 1 && i >= 0 && i < len) {
						line += "<br>";
					}
					if (line != '') {lines.push(line)};
				}
				element.html(lines.join('\n'));					
				if(toText == replaceAll(element.html(), '<br>', '')){
					element.data("animated", false);
					clearInterval(timer);
					options.onComplete();
				}
			}

			timer = setInterval(function(){ update(); }, options.tick);

			function replaceAll(expression, org, dest){  
				return expression.split(org).join(dest);  
			}  

			function forward(sTxt, toText, speed, charDelay, lineDelay, dCode) {
				var len = Math.max(sTxt.length, toText.length);
				var codes = new Array(len);
				for (var i = 0; i < len; ++i) {
					codes[i] = sTxt.charCodeAt(i) || dCode;
				}
	
				var frame = 0;
				return function() {
					if (frame++ < lineDelay) return sTxt;
					
					var result = "";
					var index = Math.min((frame - lineDelay) / charDelay, len);
					var code, tcode;
					
					if (toText.length >= sTxt.length) {
						for (var i = 0; i < index; ++i) {
							code = Math.round(codes[i]);
							tcode = toText.charCodeAt(i);

							if (code + 100 < tcode || code - 100 > tcode) {
								result += String.fromCharCode(code);
								codes[i] += (tcode - codes[i]) * 0.9;
								continue;
							}
							
							if (code + speed < tcode) {
								result += String.fromCharCode(code);
								codes[i] += speed;
								continue;
							}
							
							if (code - speed > tcode) {
								result += String.fromCharCode(code);
								codes[i] -= speed;
								continue;
							}
							
							result += toText.charAt(i);
						}
						for (i = index + 1; i < len; ++i) { result += sTxt.charAt(i); }
					} else {
						for (i = len - 1; i >= len - index; --i) {
							code = Math.round(codes[i]);
							tcode = toText.charCodeAt(i) || dCode;
							
							if (code + 100 < tcode || code - 100 > tcode) {
								result += String.fromCharCode(code);
								codes[i] += (tcode - codes[i]) * 0.9;
								continue;
							}
							
							if (code + speed < tcode) {
								result += String.fromCharCode(code);
								codes[i] += speed;
								continue;
							}
							
							if (code - speed > tcode) {
								result += String.fromCharCode(code);
								codes[i] -= speed;
								continue;
							}
	
							result = toText.charAt(i) + result;
						}
						for (i = len - index - 1; i >= 0; --i) { result = sTxt.charAt(i) + result; }
					}
	
					return result;
				}
			}		
		});		

		return this;
	};
})(jQuery);
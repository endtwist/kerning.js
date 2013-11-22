/*global jQuery */
/*!
 * Kerning.js
 * Version: 0.2.1
 * Copyright 2011 Joshua Gross
 * MIT license
 *
 * Usage:
 *  Include this file anywhere in your HTML
 *    <script src="kerning.js"></script>
 *
 *  Then, add any of the attributes following to your CSS, under any
 *  selectors you want modified:
 *    -letter-kern, -letter-size, -letter-weight, -letter-color, -letter-transform
 *    -word-kern, -word-size, -word-weight, -word-color, -word-transform
 *
 *  To use pairings (e.g., modify 'a' if 'ab' is paired):
 *    -letter-pairs('xy': [value], …)
 *    -word-pairs('cat mouse': [value], …)
 *
 *  To use multiple transforms, you need to use transform "groups":
 *    -transform-group([transform] [transform] …)
 *
 *  Sometimes you need to want to use a different size or weight, depending on what
 *  font has loaded:
 *    font-size: [default size];
 *    font-size: if-font('font name': [size], 'font name': [size], …);
 *  (The first line is a fallback should Kerning.js not load. This is recommended.)
 *
 *  That's it! Attributes will be applied automagically.
 *
 * Examples:
 *  Alter first 3 letters:
 *    -letter-size: 100px 20px 30px;
 *
 *  Modify letter pairs:
 *    -letter-kern: -letter-pairs('ab': 1px,
 *                                'bc': 300px,
 *                                's ': 100px);
 *
 *  Transform the first two letters:
 *    -letter-transform: -transform-group(rotate3d(0,0,1,10deg) translate3d(0,10px,0))
 *                       -transform-group(translate3d(0,-10px,0) rotate3d(0,0,1,-10deg));
 *
 *  Modify word pairs:
 *    -word-size: -word-pairs('this is': 10em);
 *
 *  Modify the first 3 words:
 *    -word-size: 10em 0.1em 0.2em;
 *
 *  Using repeat rules:
 *    -letter-color: -letter-repeat(even: #f0f0f0, odd: #cccccc);
 *    -letter-color: -letter-repeat(2n+1: #f0f0f0);
 *
 *  Using conditionals:
 *    -letter-kern: if-font('Helvetica Neue': 0 1px 1px, 'Helvetica': 0 -1px 0);
 *
 *  Using conditionals on existing properties for weight or size:
 *    font-size: 9.5em;
 *    font-size: if-font('Helvetica Neue': 10em, 'Helvetica': 9em);
 */
(function($){(function(){function parsedeclarations(e){var t=munged[e].replace(/^{|}$/g,"");t=munge(t);var n={};$.each(t.split(";"),function(e,t){t=t.split(":");if(t.length<2)return;n[restore(t[0])]=restore(t.slice(1).join(":"))});return n}function munge(e,t){e=e.replace(REatcomment,"$1").replace(REcomment_string,function(e,t){if(!t)return"";var n="%s`"+ ++uid+"`s%";munged[uid]=t.replace(/^\\/,"");return n});var n=t?REfull:REbraces;while(match=n.exec(e)){replacement="%b`"+ ++uid+"`b%";munged[uid]=match[0];e=e.replace(n,replacement)}return e}function restore(e){if(e===undefined)return e;while(match=REmunged.exec(e)){e=e.replace(REmunged,munged[match[1]])}return $.trim(e)}function processAtRule(e,t){var n=e.split(/\s+/);var r=n.shift();if(r=="media"){var i=restore(n.pop()).slice(1,-1);if($.parsecss.mediumApplies(n.join(" "))){$.parsecss(i,t)}}else if(r=="import"){var s=restore(n.shift());if($.parsecss.mediumApplies(n.join(" "))){s=s.replace(/^url\(|\)$/gi,"").replace(/^["']|["']$/g,"");$.get(s,function(e){$.parsecss(e,t)})}}}function styleAttributes(e,t){var n="",r,i={};e=e.replace(RESGMLcomment,"").replace(REnotATag,"$1");munge(e).replace(REtag,function(e,t,s){t=t.toLowerCase();if(i[t])++i[t];else i[t]=1;if(r=/\bstyle\s*=\s*(%s`\d+`s%)/i.exec(s)){var o=/\bid\s*=\s*(\S+)/i.exec(s);if(o)o="#"+restore(o[1]).replace(/^['"]|['"]$/g,"");else o=t+":eq("+(i[t]-1)+")";n+=[o,"{",restore(r[1]).replace(/^['"]|['"]$/g,""),"}"].join("")}});$.parsecss(n,t)}var hasSameOrigin=function(e){return e===e.replace(/^([^\/]*)\/\/([^@]*@)?([^\/:]+)(:\d+)?.*/,function(t,n,r,i,s,o,u){n=n===""?window.location.protocol:n;s=s===undefined?"":s.substring(1);if(n!==window.location.protocol)return"";if(i!==window.location.hostname)return"";if(s!==window.location.port)return"";return e})};$.fn.findandfilter=function(e){var t=this.filter(e).add(this.find(e));t.prevObject=t.prevObject.prevObject;return t};$.fn.parsecss=function(e,t){var n=function(t){$.parsecss(t,e)};this.findandfilter("style").each(function(){n(this.innerHTML)}).end().findandfilter('link[type="text/css"],link[rel="stylesheet"]').each(function(){if(!this.disabled&&hasSameOrigin(this.href)&&$.parsecss.mediumApplies(this.media))$.get(this.href,n)}).end();if(t){$.get(location.pathname+location.search,"text",function(t){styleAttributes(t,e)})}return this};$.parsecss=function(e,t){var n={};e=munge(e).replace(/@(([^;`]|`[^b]|`b[^%])*(`b%)?);?/g,function(e,n){processAtRule($.trim(n),t);return""});$.each(e.split("`b%"),function(e,t){t=t.split("%b`");if(t.length<2)return;t[0]=restore(t[0]);n[t[0]]=$.extend(n[t[0]]||{},parsedeclarations(t[1]))});t(n)};$.parsecss.mediumApplies=window.media&&window.media.query||function(e){if(!e)return true;if(e in media)return media[e];var t=$('<style media="'+e+'">body {position: relative; z-index: 1;}</style>').appendTo("head");return media[e]=[$("body").css("z-index")==1,t.remove()][0]};$.parsecss.isValidSelector=function(e){var t=$("<style>"+e+"{}</style>").appendTo("head")[0];return[t.styleSheet?!/UNKNOWN/i.test(t.styleSheet.cssText):!!t.sheet.cssRules.length,$(t).remove()][0]};$.parsecss.parseArguments=function(str){if(!str)return[];var ret=[],mungedArguments=munge(str,true).split(/\s+/);for(var i=0;i<mungedArguments.length;++i){var a=restore(mungedArguments[i]);try{ret.push(eval("("+a+")"))}catch(err){ret.push(a)}}return ret};$.parsecss.styleAttributes=styleAttributes;var media={};var munged={};var REbraces=/{[^{}]*}/;var REfull=/\[[^\[\]]*\]|{[^{}]*}|\([^()]*\)|function(\s+\w+)?(\s*%b`\d+`b%){2}/;var REatcomment=/\/\*@((?:[^\*]|\*[^\/])*)\*\//g;var REcomment_string=/(?:\/\*(?:[^\*]|\*[^\/])*\*\/)|(\\.|"(?:[^\\\"]|\\.|\\\n)*"|'(?:[^\\\']|\\.|\\\n)*')/g;var REmunged=/%\w`(\d+)`\w%/;var uid=0;var _show={show:$.fn.show,hide:$.fn.hide};$.each(["show","hide"],function(){var e=this,t=_show[e],n=e+"Default";$.fn[e]=function(){if(arguments.length>0)return t.apply(this,arguments);return this.each(function(){var e=$.data(this,n),r=$(this);if(e){$.removeData(this,n);e.call(r);r.queue(function(){r.data(n,e).dequeue()})}else{t.call(r)}})};$.fn[n]=function(){var t=$.makeArray(arguments),r=t[0];if($.fn[r]){t.shift();var i=$.fn[r]}else if($.effects&&$.effects[r]){if(typeof t[1]!="object")t.splice(1,0,{});i=_show[e]}else{i=_show[e]}return this.data(n,function(){i.apply(this,t)})}});var RESGMLcomment=/<!--([^-]|-[^-])*-->/g;var REnotATag=/(>)[^<]*/g;var REtag=/<(\w+)([^>]*)>/g})();(function(){function e(e,t,n,r){var i=e.text().split(t),s="";if(i.length){$(i).each(function(e,t){s+='<span class="'+n+(e+1)+'">'+t+"</span>"+r});e.empty().append(s)}}var t={init:function(){return this.each(function(){e($(this),"","char","")})},words:function(){return this.each(function(){e($(this)," ","word"," ")})},lines:function(){return this.each(function(){var t="eefec303079ad17405c889e092e105b0";e($(this).children("br").replaceWith(t).end(),t,"line","")})}};$.fn.lettering=function(e){if(e&&t[e]){return t[e].apply(this,[].slice.call(arguments,1))}else if(e==="letters"||!e){return t.init.apply(this,[].slice.call(arguments,0))}$.error("Method "+e+" does not exist on jQuery.lettering");return this}})();var unstack=function(){var e={init:function(e){var t=$(e).css("font-family").match(/[^'",;\s][^'",;]*/g)||[];return this.analyzeStack(t,e)},analyzeStack:function(t,n){var r=["monospace","sans-serif","serif","cursive","fantasy"];var i=r[0];var s=t.length;var o=t[s-1];if($.inArray(o,r)){t.push(i);s++}if(o==i){i=r[1]}for(var u=0;u<s-1;u++){font=t[u];if(e.testFont(font,i)){return font}}},testFont:function(e,t){var n=$('<span id="font_tester" style="font-family:'+t+'; font-size:144px;position:absolute;left:-10000px;top:-10000px;visibility:hidden;">mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmml</span>');$("body").prepend(n);var r=n.width();n.css("font-family",e+","+t);var i=n.width();n.remove();return i!=r}};return function(t){return e.init(t)}}();window.Kerning=new function(){var e=this,t=navigator.platform,n=["webkitTransform"in document.documentElement.style&&"webkit",navigator.userAgent.indexOf("MSIE")>-1&&"ms","MozTransform"in document.documentElement.style&&"moz",window.opera&&"o"].reduce(function(e,t){return e+(t||"")}),r=[t.match(/Mac/)&&"mac",t.match(/Win/)&&"win",t.match(/Linux/)&&"linux"].reduce(function(e,t){return e+(t||"")});var i={_pairs:function(e,t,n){var r=n.match(/^-(letter|word)-pairs\(([\s\S]+)\)$/i);if(!r||r[1]!==e)return false;var i=e==="word"?t.children("span"):t.find("span > span"),s=n.match(/translate|rotate|skew|perspective/i),o=$.trim(r[2].replace(/,\s+?'/g,",'").replace(/:\s+?(\d)/g,":$1")).split(s?"),":","),u,a,f,l=[];if(!o)return;$.each(o,function(t,n){u=n.split(":");u[0]=u[0].replace(/^['"](.+)['"]$/g,"$1");if(e==="word")a=u[0].split(" ");else a=u[0];f=function(t){var n=$(this).text().match(new RegExp(a[0])),r,i;if(a[1]!==" "){i=($(this).next().html()||"").match(new RegExp(a[1]))}else{r=e=="word"?$(this).next('[class^="word"]'):$(this).parent().next('[class^="word"]');i=!$(this).next().length&&r.length}return n&&i};l.push([u[1],i.filter(f)])});return l},_repeats:function(e,t,n){var r=n.match(/^-(letter|word)-repeats\(([\s\S]+)\)$/i);if(!r||r[1]!==e)return false;var i=e==="word"?t.children("span"):t.find("span > span"),s=n.match(/translate|rotate|skew|perspective/i),o=$.trim(r[2].replace(/,\s+?'/g,",'").replace(/:\s+?(\d)/g,":$1")).split(s?"),":","),u,a,f,l=[];if(!o)return;$.each(o,function(e,t){u=t.split(":");if(s&&u[1].substring(u[1].length-1)!==")")u[1]+=")";l.push([$.trim(u[1]),i.filter(":nth-child("+$.trim(u[0])+")")])});return l},_conditional:function(e,t,n){var r=n.match(/^(?:-(letter|word)-)?if-font\(([\s\S]+)\)$/i);if(!r)return;var i=e==="all"?t:e==="word"?t.children("span"):t.find("span > span"),s=n.match(/translate|rotate|skew|perspective/i),o=r[2].replace(/\n/g,"").match(/['"][^'"]+['"]:\s*.+?(\)|(?=\w),\s['"]|$)/g),u,a={},f=[];if(!o)return;t.each(function(e,t){var n=unstack(t).replace(/^['"](.+)['"]$/g,"$1");if(!a[n])a[n]=[t];else a[n].push(t)});$.each(o,function(e,t){u=t.match(/['"]([^'"]+)['"]:\s*(.+)$/);if(!u)return true;u=u.splice(1);if(u[0]in a)f.push([$.trim(u[1]),$(a[u[0]])])});return f},_applyAttribute:function(e,t,n,r){var s=i._conditional(e,t,r);if(!s||!s.length)s=[[r,t]];$.each(s,function(t,r){var s=r[0],o=r[1];var u=i._pairs(e,o,s)||i._repeats(e,o,s);if(u){$.each(u,function(e,t){if(typeof n!=="string"){var r={};$.each(n,function(e,n){r[n]=t[0]});t[1].css(r)}else{t[1].css(n,t[0])}})}else{var a,f,l;if(l=s.match(/-transform-group\(([\s\S]+?\([^)]+\))*?\)/g)){a=$.map(l,function(e,t){return e.replace(/-transform-group\(([\s\S]+)\)$/,"$1")})}else{a=s.replace(/[\n\s]+/g," ").split(" ")}o.each(function(t,r){f=e==="all"?$(r):e==="word"?$(r).children("span"):$(r).find("span > span");$.each(a,function(e,t){if(typeof n!=="string"){var r={};$.each(n,function(e,n){r[n]=t});f.eq(e).css(r)}else{f.eq(e).css(n,t)}})})}})},kern:function(e,t,n){i._applyAttribute(e,t,"margin-right",n)},size:function(e,t,n){i._applyAttribute(e,t,"font-size",n)},weight:function(e,t,n){i._applyAttribute(e,t,"font-weight",n)},color:function(e,t,n){i._applyAttribute(e,t,"color",n)},backgroundcolor:function(e,t,n){i._applyAttribute(e,t,"background-color",n)},transform:function(e,t,n){var r=["-webkit-transform","-moz-transform","-ms-transform","-o-transform","transform"];i._applyAttribute(e,t,r,n)}};this._parse=function(t,s){if(!e._parsedCSS)e._parsedCSS=t;for(var o in t){for(var u in t[o]){var a,f,l=t[o][u];if(a=u.match(new RegExp("^(-"+n+"|-"+r+")?-(letter|word)-(kern|transform|size|color|backgroundcolor|weight)","i"))){var c=a[2].toLowerCase(),h=a[3].toLowerCase();f=$(o);if(s)f=f.not(".kerningjs");f.not(".kerningjs").addClass("kerningjs").css("visibility","inherit").lettering("words").children("span").css("display","inline-block").lettering().children("span").css("display","inline-block");if(i[h])i[h].call(this,c,f,l)}else if((a=u.match(/font-(size|weight)/i))&&l.match(/if-font/i)){var h=a[1].toLowerCase();f=$(o);if(s)f=f.not(".kerningjs");f.not(".kerningjs").addClass("kerningjs").css("visibility","inherit");if(i[h])i[h].call(this,"all",f,l)}}}};this.live=function(){$(document).bind("DOMNodeInserted",function(t){if(t.target)e.refresh(true)})};this.refresh=function(t){if(e._parsedCSS)e._parse(e._parsedCSS,t)};$(function(){$(document).parsecss(e._parse,true)})}})(jQuery)

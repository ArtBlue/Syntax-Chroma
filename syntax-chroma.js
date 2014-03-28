/* Syntax Chroma jQuery Extension
 * @namespace SChroma globally, aliased to SC in library
 * @param {String} SChroma Main library Class object
 * @param {Object} {} Empty object explicitly guarantee 'undefined' immutability for pre ES5
 * @returns {Schroma} The Syntax Chroma object
*/
;(function ( SC, undefined ) {
    "use strict";
    
    SC.title = "Syntax Chroma jQuery Extension";
    SC.version = "0.1";
    SC.codeTags = "code";
    SC.indentSpaces = 4;
    
    /* Public dictionary object with initial set of languages and scopes. Future versions will allow extending of language and scope */
    SC.diction = {
        /* syntax vocabulary */
        /* currently supported langiages: HTML, CSS, JS, PHP */
        lang : {
            JS : { /* list of JS keywords with mods: http://www.oreillynet.com/pub/a/javascript/excerpts/learning-javascript/javascript-datatypes-variables.html*/
                keywords : ['\\&lt;(script)|\&lt;\/(script)','function','return','array','\\%','\\-','\\+','\\=','\\!','\\|','error','void','catch','throw','delete','try','do ','instanceof','console'],
                
                methods  : ['prototype','break','typeof','window','for',' in ','while','continue','if','else if','else','with','switch','case',
                            'join','slice','new ','finally','\\$','this','object','var ','window','document','default','abstract','enum','short',
                            'boolean','export','interface','static','byte','extends', 'super','char','final','native', 'synchronized','class ',
                            'package','throws','const','goto','private','transient','debugger','implements','protected','volatile','double',
                            'import','public','undefined','false','true','\\d'],
                
                reserved : ['alert','eval','location','open\\(\\w*\\S*\\)','focus','math','outerHeight','blur','name','parent','boolean','history',
                            'navigator','parseFloat','date','image','number','regExp','document','isNaN','object','status','escape\W','encodeURI\W','length',
                            'onLoad','string','\\"(.*?)\\"']
            },
            CSS : {
                keywords : ['\\&lt;(style)|\/(style)','\\.\\w*[^\\.*\\s\\{]'],
                methods  : ['\\#\\w*[^\.\s<]'],
                reserved : ['\\"(.*?)\\"']
            },
            PHP  : {
                keywords  : ['__halt_compiler','__construct','abstract','and','array',' as\\W','break','callable','case','catch','class','clone',
                             'const','continue','declare','default','die','do','echo','empty','enddeclare','endfor','endforeach','endswitch','endwhile',
                             'eval','exit','extends','final','foreach','for\\W','global','goto','implements','include','include_once','instanceof',
                             'insteadof','interface','isset','list','namespace','new','or\\W','print','private','protected','public','require\\W',
                             'require_once','return','static','switch','throw','trait','try','unset','use\\W','var ','while','xor'
],
                methods  : ['\\&lt;\\?php','\\?\\&gt;','\\$\\w*','function','var_dump','trim','split','define','assert','file','count','if','else','elseif','endif'],
                reserved : ['\\"(.*?)\\"','true','false']
            }
        }
    }

    /* Private Functions */

    /**
     * Chromalize All Objects
     * @param {Object} obj The UI element object to be styled 
     * @returns {Object}  Returns styled UI elements
     * the <code> element has optional features that are triggered from HTML attributes:
       <code data-lang="JS" data-code-wrapper="1">...</code>
     */
    function _chromalize(obj) {
        
        /** look at the data-lang attribute; if known language and code wrapper is 1, include the code wrappers as well */
        var codeLang      = obj.attr('data-lang') || 'txt',
            codeWrapper   = obj.attr('data-code-wrapper'),
            codeContent   = obj.html(),
            codeStartBase = codeContent.search(/\S/);
        
        if (codeStartBase % 2 == 1) { /** if cariage return is counted in the # of chars, or if for some reason an odd number of spaces before code */
            codeStartBase--;          /** make code start position even */
        }

        /** trim off the ends so we have no leading or trailing spaces
            is this a modern browser? is trim() part of string prototype? If not, extend it... */
        if (!String.prototype.trim) {
            String.prototype.trim = function(){
                return this.replace(/^\s+|\s+$/g, '');
            };
        }
        codeContent = codeContent.trim();

        /** set up codeWrappers */
        if (typeof codeLang !== 'undefined' && codeLang !== false) {
            if (typeof codeWrapper !== 'undefined' && codeWrapper !== false && codeWrapper ==  1) {
                var codeOpener,
                    codeCloser;
                switch(codeLang) {
                    case "JS":
                        codeOpener = '&lt;script type="text/javascript"&gt;';
                        codeCloser = '&lt;/script&gt;';
                        break;
                    case "CSS":
                        codeOpener = '&lt;style type="text/css"&gt;';
                        codeCloser = '&lt;/style&gt;';
                        break;
                    case "PHP":
                        codeOpener = '&lt;?php ';
                        codeCloser = '?&gt;';
                        break;
                    default:
                        // default - nada
                }
                codeContent = codeOpener + "\n" +
                              codeContent + "\n" +
                              codeCloser;
            }
        }
        
        /** apply code coloring, if code language is known, else just exit */
        if (codeLang) {
            codeContent = _colorize(codeLang, codeContent);
        } else {
            return;
        }
        
        /** iterate through custom extended dictionaries, and colorize */
        /** style HTML tags for ALL languages */
        /** keep in mind that the grammar of HTML is too complex for regular expressions to be correct 100% of the time, but here we go... */
        if (codeLang == "HTML") {
            codeContent = _escapeHtml(codeContent); // convert HTML tags to entities
            codeContent = codeContent.replace(/(&lt;([^&gt;]+)&gt;)/gi, "<span class='html-tag'>$1</span>"); /* regex for ESCAPED HTML */
        }
        /* each row of code is added to array */
        var codeLines = codeContent.split("\n");
        var prevLineComment = false;

        var objHtml = '<ol>';
        for (var i = 0; i < codeLines.length; i++) {
            var indentStr = '&nbsp;'.repeat(indent),
                codeLine = codeLines[i].replace(/\t/g, indentStr).trim(),
                codeSpaceIndented = codeLines[i].search(/\S/), /** how many whitespace characters before code */
                indent = 0;
            if (codeSpaceIndented - codeStartBase > 0) {
                indent = codeSpaceIndented - codeStartBase;
            }
            /**
             * If comments can be multi-line they need to be applied to each row since browsers like to
             * close tags automatically - <spans> cannot span aross <li>s. Loop and apply // and /* style comments to JS, PHP, CSS individually
             */
            if (codeLang == "JS" || codeLang == "PHP" || codeLang == "CSS") {
                // style comments
                var domOpen = '<span class="comment">';
                var domClose = '</span>';

                if (prevLineComment) {
                    
                    if ( codeLine.indexOf("*/") != -1 ) { // comment is being terminated
                        codeLine = domOpen + codeLine + domClose;
                        prevLineComment = false;
                    } else { // comment continues...
                        codeLine = domOpen + codeLine + domClose;
                    }
                    
                } else { /** previous line did not open a comment */
                    
                    /** multiline comments
                        comments open and close on same line */
                    if (codeLine.indexOf("/*") != -1 && codeLine.indexOf("*/") != -1) { 
                        var sPos = codeLine.indexOf("/*");
                        // trying to find the location of '*/' on same line, will use line end instead...
                        var ePos = codeLines[i].indexOf("*/") + indent + 2; // + 2 to account for the '*/' string itself
                        var codeLine = _insertStr(domOpen, codeLine, sPos) + domClose;
                        prevLineComment = false;
                    // comments open but do NOT close on same line
                    } else if (codeLine.indexOf("/*") != -1 && codeLine.indexOf("*/") == -1) {
                        codeLine = '<span class="comment">' + codeLine + '</span>';
                        prevLineComment = true;
                    // single line comment
                    } else if (codeLine.indexOf("//") != -1) {
                        var sPos = codeLine.indexOf("//");
                        codeLine = _insertStr(domOpen, codeLine, sPos);
                        prevLineComment = false;
                    }
                }
            }

            if (indent > 0)  objHtml += '<li><span class="line">' + '&nbsp;'.repeat(indent) + codeLine + '</span></li>';
            else             objHtml += '<li><span class="line">' + codeLine + '</span></li>';

            indent = 0; /** reset indent for next line */
        }
        objHtml += "</ol>";
        obj.html(objHtml);
    }
    
    /**
     * Colorize syntax based on language
     * @param {string} lang Language specification string
     * @param {string} code The code string
     * @returns {string} Colorized code string
     */
    function _colorize(lang, code) {
        
        if ( (lang == "JS" || lang == "PHP" || lang == "CSS") && SC.diction.lang[lang]) {
            /** colorize keywords */
            var str     = code,
                keywordStr = SC.diction.lang[lang].keywords.join("|"),
                keywordReg = new RegExp('('+ keywordStr + ')', 'gi'),
                newstr  = str.replace(keywordReg, "<span class='keyword'>$1</span>");
            /** colorize methods */
            var methodStr = SC.diction.lang[lang].methods.join("|"),
                methodReg = new RegExp('('+ methodStr + ')', 'gi');
                newstr  = newstr.replace(methodReg, "<span class='method'>$1</span>");

            /** colorize reserved */
            var reservedStr = SC.diction.lang[lang].reserved.join("|"),
                reservedReg = new RegExp('('+ reservedStr + ')', 'gi'),
                newstr  = newstr.replace(reservedReg, "<span class='reserved'>$1</span>");
            /** if language is CSS, apply common CSS regexes */
            if (lang == "CSS") {
                /* CSS declarations */
                var css_decl_str = /([\w-]*:)|([^"&gt;][^&lt;][-\w\s]*;)/gi;
                newstr = newstr.replace(css_decl_str, "<span class='css-dec'>$1</span><span class='css-vals'>$2</span>");
                /* CSS attribute selectors */
                var css_attr_sel = /(\[.*\])/gi;
                newstr = newstr.replace(css_attr_sel, "<span class='css-attr-sel'>$1</span>");
            }
        }
        return newstr || code;
    }
    
    /**
     * @extends String via prototype
     * @param {Number} x Number of times to repeat text
     * @returns {String}    String repeated x number of times 
     */
    String.prototype.repeat= function(x){
        x = x || 1;
        return Array(x+1).join(this);
    }
    
    /**
     * Escape HTML characters
     * @param   {String}    text    HTML tags
     * @returns {String}    HTML entities
     */
    function _escapeHtml(text) {
        return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
    
    /**
     * Utility function to insert one string into another at the given character position
     * @param {String} insStr String to be inserted
     * @param {String} intoStr String to be inserted into
     * @param {Number} pos Position of where to insert string
     * @returns {String}  Returns 'intoStr' string inserted with 'insStr'
     */
    function _insertStr(insStr, intoStr, pos) {
        var str = [intoStr.slice(0, pos), insStr, intoStr.slice(pos)].join('');
        return str;
    }
    
    /** jQuery.ready() */
    $(function() {
        $(SC.codeTags).each(function( index ) {
            _chromalize($(this));
        });
    });
 
})( window.SChroma = window.SChroma || {} );
var jscolor={dir:"",bindClass:"color",binding:true,preloading:true,install:function(){jscolor.addEvent(window,"load",jscolor.init)},init:function(){if(jscolor.binding){jscolor.bind()}if(jscolor.preloading){jscolor.preload()}},getDir:function(){if(!jscolor.dir){var a=jscolor.detectDir();jscolor.dir=a!==false?a:"jscolor/"}return jscolor.dir},detectDir:function(){var a=location.href;var b=document.getElementsByTagName("base");for(var c=0;c<b.length;c+=1){if(b[c].href){a=b[c].href}}var b=document.getElementsByTagName("script");for(var c=0;c<b.length;c+=1){if(b[c].src&&/(^|\/)jscolor\.js([?#].*)?$/i.test(b[c].src)){var d=new jscolor.URI(b[c].src);var e=d.toAbsolute(a);e.path=e.path.replace(/[^\/]+$/,"");e.query=null;e.fragment=null;return e.toString()}}return false},bind:function(){var a=new RegExp("(^|\\s)("+jscolor.bindClass+")\\s*(\\{[^}]*\\})?","i");var b=document.getElementsByTagName("input");for(var c=0;c<b.length;c+=1){var d;if(!b[c].color&&b[c].className&&(d=b[c].className.match(a))){var e={};if(d[3]){try{e=(new Function("return ("+d[3]+")"))()}catch(f){}}b[c].color=new jscolor.color(b[c],e)}}},preload:function(){for(var a in jscolor.imgRequire){if(jscolor.imgRequire.hasOwnProperty(a)){jscolor.loadImage(a)}}},images:{pad:[181,101],sld:[16,101],cross:[15,15],arrow:[7,11]},imgRequire:{},imgLoaded:{},requireImage:function(a){jscolor.imgRequire[a]=true},loadImage:function(a){if(!jscolor.imgLoaded[a]){jscolor.imgLoaded[a]=new Image;jscolor.imgLoaded[a].src=jscolor.getDir()+a}},fetchElement:function(a){return typeof a==="string"?document.getElementById(a):a},addEvent:function(a,b,c){if(a.addEventListener){a.addEventListener(b,c,false)}else if(a.attachEvent){a.attachEvent("on"+b,c)}},fireEvent:function(a,b){if(!a){return}if(document.createEvent){var c=document.createEvent("HTMLEvents");c.initEvent(b,true,true);a.dispatchEvent(c)}else if(document.createEventObject){var c=document.createEventObject();a.fireEvent("on"+b,c)}else if(a["on"+b]){a["on"+b]()}},getElementPos:function(a){var b=a,c=a;var d=0,e=0;if(b.offsetParent){do{d+=b.offsetLeft;e+=b.offsetTop}while(b=b.offsetParent)}while((c=c.parentNode)&&c.nodeName.toUpperCase()!=="BODY"){d-=c.scrollLeft;e-=c.scrollTop}return[d,e]},getElementSize:function(a){return[a.offsetWidth,a.offsetHeight]},getRelMousePos:function(a){var b=0,c=0;if(!a){a=window.event}if(typeof a.offsetX==="number"){b=a.offsetX;c=a.offsetY}else if(typeof a.layerX==="number"){b=a.layerX;c=a.layerY}return{x:b,y:c}},getViewPos:function(){if(typeof window.pageYOffset==="number"){return[window.pageXOffset,window.pageYOffset]}else if(document.body&&(document.body.scrollLeft||document.body.scrollTop)){return[document.body.scrollLeft,document.body.scrollTop]}else if(document.documentElement&&(document.documentElement.scrollLeft||document.documentElement.scrollTop)){return[document.documentElement.scrollLeft,document.documentElement.scrollTop]}else{return[0,0]}},getViewSize:function(){if(typeof window.innerWidth==="number"){return[window.innerWidth,window.innerHeight]}else if(document.body&&(document.body.clientWidth||document.body.clientHeight)){return[document.body.clientWidth,document.body.clientHeight]}else if(document.documentElement&&(document.documentElement.clientWidth||document.documentElement.clientHeight)){return[document.documentElement.clientWidth,document.documentElement.clientHeight]}else{return[0,0]}},URI:function(a){function b(a){var b="";while(a){if(a.substr(0,3)==="../"||a.substr(0,2)==="./"){a=a.replace(/^\.+/,"").substr(1)}else if(a.substr(0,3)==="/./"||a==="/."){a="/"+a.substr(3)}else if(a.substr(0,4)==="/../"||a==="/.."){a="/"+a.substr(4);b=b.replace(/\/?[^\/]*$/,"")}else if(a==="."||a===".."){a=""}else{var c=a.match(/^\/?[^\/]*/)[0];a=a.substr(c.length);b=b+c}}return b}this.scheme=null;this.authority=null;this.path="";this.query=null;this.fragment=null;this.parse=function(a){var b=a.match(/^(([A-Za-z][0-9A-Za-z+.-]*)(:))?((\/\/)([^\/?#]*))?([^?#]*)((\?)([^#]*))?((#)(.*))?/);this.scheme=b[3]?b[2]:null;this.authority=b[5]?b[6]:null;this.path=b[7];this.query=b[9]?b[10]:null;this.fragment=b[12]?b[13]:null;return this};this.toString=function(){var a="";if(this.scheme!==null){a=a+this.scheme+":"}if(this.authority!==null){a=a+"//"+this.authority}if(this.path!==null){a=a+this.path}if(this.query!==null){a=a+"?"+this.query}if(this.fragment!==null){a=a+"#"+this.fragment}return a};this.toAbsolute=function(a){var a=new jscolor.URI(a);var c=this;var d=new jscolor.URI;if(a.scheme===null){return false}if(c.scheme!==null&&c.scheme.toLowerCase()===a.scheme.toLowerCase()){c.scheme=null}if(c.scheme!==null){d.scheme=c.scheme;d.authority=c.authority;d.path=b(c.path);d.query=c.query}else{if(c.authority!==null){d.authority=c.authority;d.path=b(c.path);d.query=c.query}else{if(c.path===""){d.path=a.path;if(c.query!==null){d.query=c.query}else{d.query=a.query}}else{if(c.path.substr(0,1)==="/"){d.path=b(c.path)}else{if(a.authority!==null&&a.path===""){d.path="/"+c.path}else{d.path=a.path.replace(/[^\/]+$/,"")+c.path}d.path=b(d.path)}d.query=c.query}d.authority=a.authority}d.scheme=a.scheme}d.fragment=c.fragment;return d};if(a){this.parse(a)}},color:function(a,b){function d(a,b,c){var d=Math.min(Math.min(a,b),c);var e=Math.max(Math.max(a,b),c);var f=e-d;if(f===0){return[null,0,e]}var g=a===d?3+(c-b)/f:b===d?5+(a-c)/f:1+(b-a)/f;return[g===6?0:g,f/e,e]}function e(a,b,c){if(a===null){return[c,c,c]}var d=Math.floor(a);var e=d%2?a-d:1-(a-d);var f=c*(1-b);var g=c*(1-b*e);switch(d){case 6:case 0:return[c,g,f];case 1:return[g,c,f];case 2:return[f,c,g];case 3:return[f,g,c];case 4:return[g,f,c];case 5:return[c,f,g]}}function f(){delete jscolor.picker.owner;document.getElementsByTagName("body")[0].removeChild(jscolor.picker.boxB)}function g(b,c){function m(){var a=q.pickerInsetColor.split(/\s+/);var b=a.length<2?a[0]:a[1]+" "+a[0]+" "+a[0]+" "+a[1];g.btn.style.borderColor=b}if(!jscolor.picker){jscolor.picker={box:document.createElement("div"),boxB:document.createElement("div"),pad:document.createElement("div"),padB:document.createElement("div"),padM:document.createElement("div"),sld:document.createElement("div"),sldB:document.createElement("div"),sldM:document.createElement("div"),btn:document.createElement("div"),btnS:document.createElement("span"),btnT:document.createTextNode(q.pickerCloseText)};for(var d=0,e=4;d<jscolor.images.sld[1];d+=e){var f=document.createElement("div");f.style.height=e+"px";f.style.fontSize="1px";f.style.lineHeight="0";jscolor.picker.sld.appendChild(f)}jscolor.picker.sldB.appendChild(jscolor.picker.sld);jscolor.picker.box.appendChild(jscolor.picker.sldB);jscolor.picker.box.appendChild(jscolor.picker.sldM);jscolor.picker.padB.appendChild(jscolor.picker.pad);jscolor.picker.box.appendChild(jscolor.picker.padB);jscolor.picker.box.appendChild(jscolor.picker.padM);jscolor.picker.btnS.appendChild(jscolor.picker.btnT);jscolor.picker.btn.appendChild(jscolor.picker.btnS);jscolor.picker.box.appendChild(jscolor.picker.btn);jscolor.picker.boxB.appendChild(jscolor.picker.box)}var g=jscolor.picker;g.box.onmouseup=g.box.onmouseout=function(){a.focus()};g.box.onmousedown=function(){s=true};g.box.onmousemove=function(a){if(v||w){v&&n(a);w&&o(a);if(document.selection){document.selection.empty()}else if(window.getSelection){window.getSelection().removeAllRanges()}p()}};g.padM.onmouseup=g.padM.onmouseout=function(){if(v){v=false;jscolor.fireEvent(t,"change")}};g.padM.onmousedown=function(a){switch(r){case 0:if(q.hsv[2]===0){q.fromHSV(null,null,1)}break;case 1:if(q.hsv[1]===0){q.fromHSV(null,1,null)}break}v=true;n(a);p()};g.sldM.onmouseup=g.sldM.onmouseout=function(){if(w){w=false;jscolor.fireEvent(t,"change")}};g.sldM.onmousedown=function(a){w=true;o(a);p()};var k=h(q);g.box.style.width=k[0]+"px";g.box.style.height=k[1]+"px";g.boxB.style.position="absolute";g.boxB.style.clear="both";g.boxB.style.left=b+"px";g.boxB.style.top=c+"px";g.boxB.style.zIndex=q.pickerZIndex;g.boxB.style.border=q.pickerBorder+"px solid";g.boxB.style.borderColor=q.pickerBorderColor;g.boxB.style.background=q.pickerFaceColor;g.pad.style.width=jscolor.images.pad[0]+"px";g.pad.style.height=jscolor.images.pad[1]+"px";g.padB.style.position="absolute";g.padB.style.left=q.pickerFace+"px";g.padB.style.top=q.pickerFace+"px";g.padB.style.border=q.pickerInset+"px solid";g.padB.style.borderColor=q.pickerInsetColor;g.padM.style.position="absolute";g.padM.style.left="0";g.padM.style.top="0";g.padM.style.width=q.pickerFace+2*q.pickerInset+jscolor.images.pad[0]+jscolor.images.arrow[0]+"px";g.padM.style.height=g.box.style.height;g.padM.style.cursor="crosshair";g.sld.style.overflow="hidden";g.sld.style.width=jscolor.images.sld[0]+"px";g.sld.style.height=jscolor.images.sld[1]+"px";g.sldB.style.display=q.slider?"block":"none";g.sldB.style.position="absolute";g.sldB.style.right=q.pickerFace+"px";g.sldB.style.top=q.pickerFace+"px";g.sldB.style.border=q.pickerInset+"px solid";g.sldB.style.borderColor=q.pickerInsetColor;g.sldM.style.display=q.slider?"block":"none";g.sldM.style.position="absolute";g.sldM.style.right="0";g.sldM.style.top="0";g.sldM.style.width=jscolor.images.sld[0]+jscolor.images.arrow[0]+q.pickerFace+2*q.pickerInset+"px";g.sldM.style.height=g.box.style.height;try{g.sldM.style.cursor="pointer"}catch(l){g.sldM.style.cursor="hand"}g.btn.style.display=q.pickerClosable?"block":"none";g.btn.style.position="absolute";g.btn.style.left=q.pickerFace+"px";g.btn.style.bottom=q.pickerFace+"px";g.btn.style.padding="0 15px";g.btn.style.height="18px";g.btn.style.border=q.pickerInset+"px solid";m();g.btn.style.color=q.pickerButtonColor;g.btn.style.font="12px sans-serif";g.btn.style.textAlign="center";try{g.btn.style.cursor="pointer"}catch(l){g.btn.style.cursor="hand"}g.btn.onmousedown=function(){q.hidePicker()};g.btnS.style.lineHeight=g.btn.style.height;switch(r){case 0:var u="hs.png";break;case 1:var u="hv.png";break}g.padM.style.backgroundImage="url('"+jscolor.getDir()+"cross.gif')";g.padM.style.backgroundRepeat="no-repeat";g.sldM.style.backgroundImage="url('"+jscolor.getDir()+"arrow.gif')";g.sldM.style.backgroundRepeat="no-repeat";g.pad.style.backgroundImage="url('"+jscolor.getDir()+u+"')";g.pad.style.backgroundRepeat="no-repeat";g.pad.style.backgroundPosition="0 0";i();j();jscolor.picker.owner=q;document.getElementsByTagName("body")[0].appendChild(g.boxB)}function h(a){var b=[2*a.pickerInset+2*a.pickerFace+jscolor.images.pad[0]+(a.slider?2*a.pickerInset+2*jscolor.images.arrow[0]+jscolor.images.sld[0]:0),a.pickerClosable?4*a.pickerInset+3*a.pickerFace+jscolor.images.pad[1]+a.pickerButtonHeight:2*a.pickerInset+2*a.pickerFace+jscolor.images.pad[1]];return b}function i(){switch(r){case 0:var a=1;break;case 1:var a=2;break}var b=Math.round(q.hsv[0]/6*(jscolor.images.pad[0]-1));var c=Math.round((1-q.hsv[a])*(jscolor.images.pad[1]-1));jscolor.picker.padM.style.backgroundPosition=q.pickerFace+q.pickerInset+b-Math.floor(jscolor.images.cross[0]/2)+"px "+(q.pickerFace+q.pickerInset+c-Math.floor(jscolor.images.cross[1]/2))+"px";var d=jscolor.picker.sld.childNodes;switch(r){case 0:var f=e(q.hsv[0],q.hsv[1],1);for(var g=0;g<d.length;g+=1){d[g].style.backgroundColor="rgb("+f[0]*(1-g/d.length)*100+"%,"+f[1]*(1-g/d.length)*100+"%,"+f[2]*(1-g/d.length)*100+"%)"}break;case 1:var f,h,i=[q.hsv[2],0,0];var g=Math.floor(q.hsv[0]);var j=g%2?q.hsv[0]-g:1-(q.hsv[0]-g);switch(g){case 6:case 0:f=[0,1,2];break;case 1:f=[1,0,2];break;case 2:f=[2,0,1];break;case 3:f=[2,1,0];break;case 4:f=[1,2,0];break;case 5:f=[0,2,1];break}for(var g=0;g<d.length;g+=1){h=1-1/(d.length-1)*g;i[1]=i[0]*(1-h*j);i[2]=i[0]*(1-h);d[g].style.backgroundColor="rgb("+i[f[0]]*100+"%,"+i[f[1]]*100+"%,"+i[f[2]]*100+"%)"}break}}function j(){switch(r){case 0:var a=2;break;case 1:var a=1;break}var b=Math.round((1-q.hsv[a])*(jscolor.images.sld[1]-1));jscolor.picker.sldM.style.backgroundPosition="0 "+(q.pickerFace+q.pickerInset+b-Math.floor(jscolor.images.arrow[1]/2))+"px"}function k(){return jscolor.picker&&jscolor.picker.owner===q}function l(){if(t===a){q.importColor()}if(q.pickerOnfocus){q.hidePicker()}}function m(){if(t!==a){q.importColor()}}function n(a){var b=jscolor.getRelMousePos(a);var c=b.x-q.pickerFace-q.pickerInset;var d=b.y-q.pickerFace-q.pickerInset;switch(r){case 0:q.fromHSV(c*(6/(jscolor.images.pad[0]-1)),1-d/(jscolor.images.pad[1]-1),null,A);break;case 1:q.fromHSV(c*(6/(jscolor.images.pad[0]-1)),null,1-d/(jscolor.images.pad[1]-1),A);break}}function o(a){var b=jscolor.getRelMousePos(a);var c=b.y-q.pickerFace-q.pickerInset;switch(r){case 0:q.fromHSV(null,null,1-c/(jscolor.images.sld[1]-1),z);break;case 1:q.fromHSV(null,1-c/(jscolor.images.sld[1]-1),null,z);break}}function p(){if(q.onImmediateChange){var a;if(typeof q.onImmediateChange==="string"){a=new Function(q.onImmediateChange)}else{a=q.onImmediateChange}a.call(q)}}this.required=true;this.adjust=true;this.hash=false;this.caps=true;this.slider=true;this.valueElement=a;this.styleElement=a;this.onImmediateChange=null;this.hsv=[0,0,1];this.rgb=[1,1,1];this.minH=0;this.maxH=6;this.minS=0;this.maxS=1;this.minV=0;this.maxV=1;this.pickerOnfocus=true;this.pickerMode="HSV";this.pickerPosition="bottom";this.pickerSmartPosition=true;this.pickerButtonHeight=20;this.pickerClosable=false;this.pickerCloseText="Close";this.pickerButtonColor="ButtonText";this.pickerFace=10;this.pickerFaceColor="ThreeDFace";this.pickerBorder=1;this.pickerBorderColor="ThreeDHighlight ThreeDShadow ThreeDShadow ThreeDHighlight";this.pickerInset=1;this.pickerInsetColor="ThreeDShadow ThreeDHighlight ThreeDHighlight ThreeDShadow";this.pickerZIndex=1e4;for(var c in b){if(b.hasOwnProperty(c)){this[c]=b[c]}}this.hidePicker=function(){if(k()){f()}};this.showPicker=function(){if(!k()){var b=jscolor.getElementPos(a);var c=jscolor.getElementSize(a);var d=jscolor.getViewPos();var e=jscolor.getViewSize();var f=h(this);var i,j,l;switch(this.pickerPosition.toLowerCase()){case"left":i=1;j=0;l=-1;break;case"right":i=1;j=0;l=1;break;case"top":i=0;j=1;l=-1;break;default:i=0;j=1;l=1;break}var m=(c[j]+f[j])/2;if(!this.pickerSmartPosition){var n=[b[i],b[j]+c[j]-m+m*l]}else{var n=[-d[i]+b[i]+f[i]>e[i]?-d[i]+b[i]+c[i]/2>e[i]/2&&b[i]+c[i]-f[i]>=0?b[i]+c[i]-f[i]:b[i]:b[i],-d[j]+b[j]+c[j]+f[j]-m+m*l>e[j]?-d[j]+b[j]+c[j]/2>e[j]/2&&b[j]+c[j]-m-m*l>=0?b[j]+c[j]-m-m*l:b[j]+c[j]-m+m*l:b[j]+c[j]-m+m*l>=0?b[j]+c[j]-m+m*l:b[j]+c[j]-m-m*l]}g(n[i],n[j])}};this.importColor=function(){if(!t){this.exportColor()}else{if(!this.adjust){if(!this.fromString(t.value,x)){u.style.backgroundImage=u.jscStyle.backgroundImage;u.style.backgroundColor=u.jscStyle.backgroundColor;u.style.color=u.jscStyle.color;this.exportColor(x|y)}}else if(!this.required&&/^\s*$/.test(t.value)){t.value="";u.style.backgroundImage=u.jscStyle.backgroundImage;u.style.backgroundColor=u.jscStyle.backgroundColor;u.style.color=u.jscStyle.color;this.exportColor(x|y)}else if(this.fromString(t.value)){}else{this.exportColor()}}};this.exportColor=function(a){if(!(a&x)&&t){var b=this.toString();if(this.caps){b=b.toUpperCase()}if(this.hash){b="#"+b}t.value=b}if(!(a&y)&&u){u.style.backgroundImage="none";u.style.backgroundColor="#"+this.toString();u.style.color=.213*this.rgb[0]+.715*this.rgb[1]+.072*this.rgb[2]<.5?"#FFF":"#000"}if(!(a&z)&&k()){i()}if(!(a&A)&&k()){j()}};this.fromHSV=function(a,b,c,d){if(a!==null){a=Math.max(0,this.minH,Math.min(6,this.maxH,a))}if(b!==null){b=Math.max(0,this.minS,Math.min(1,this.maxS,b))}if(c!==null){c=Math.max(0,this.minV,Math.min(1,this.maxV,c))}this.rgb=e(a===null?this.hsv[0]:this.hsv[0]=a,b===null?this.hsv[1]:this.hsv[1]=b,c===null?this.hsv[2]:this.hsv[2]=c);this.exportColor(d)};this.fromRGB=function(a,b,c,f){if(a!==null){a=Math.max(0,Math.min(1,a))}if(b!==null){b=Math.max(0,Math.min(1,b))}if(c!==null){c=Math.max(0,Math.min(1,c))}var g=d(a===null?this.rgb[0]:a,b===null?this.rgb[1]:b,c===null?this.rgb[2]:c);if(g[0]!==null){this.hsv[0]=Math.max(0,this.minH,Math.min(6,this.maxH,g[0]))}if(g[2]!==0){this.hsv[1]=g[1]===null?null:Math.max(0,this.minS,Math.min(1,this.maxS,g[1]))}this.hsv[2]=g[2]===null?null:Math.max(0,this.minV,Math.min(1,this.maxV,g[2]));var h=e(this.hsv[0],this.hsv[1],this.hsv[2]);this.rgb[0]=h[0];this.rgb[1]=h[1];this.rgb[2]=h[2];this.exportColor(f)};this.fromString=function(a,b){var c=a.match(/^\W*([0-9A-F]{3}([0-9A-F]{3})?)\W*$/i);if(!c){return false}else{if(c[1].length===6){this.fromRGB(parseInt(c[1].substr(0,2),16)/255,parseInt(c[1].substr(2,2),16)/255,parseInt(c[1].substr(4,2),16)/255,b)}else{this.fromRGB(parseInt(c[1].charAt(0)+c[1].charAt(0),16)/255,parseInt(c[1].charAt(1)+c[1].charAt(1),16)/255,parseInt(c[1].charAt(2)+c[1].charAt(2),16)/255,b)}return true}};this.toString=function(){return(256|Math.round(255*this.rgb[0])).toString(16).substr(1)+(256|Math.round(255*this.rgb[1])).toString(16).substr(1)+(256|Math.round(255*this.rgb[2])).toString(16).substr(1)};var q=this;var r=this.pickerMode.toLowerCase()==="hvs"?1:0;var s=false;var t=jscolor.fetchElement(this.valueElement),u=jscolor.fetchElement(this.styleElement);var v=false,w=false;var x=1<<0,y=1<<1,z=1<<2,A=1<<3;jscolor.addEvent(a,"focus",function(){if(q.pickerOnfocus){q.showPicker()}});jscolor.addEvent(a,"blur",function(){if(!s){window.setTimeout(function(){s||l();s=false},0)}else{s=false}});if(t){var B=function(){q.fromString(t.value,x);p()};jscolor.addEvent(t,"keyup",B);jscolor.addEvent(t,"input",B);jscolor.addEvent(t,"blur",m);t.setAttribute("autocomplete","off")}if(u){u.jscStyle={backgroundImage:u.style.backgroundImage,backgroundColor:u.style.backgroundColor,color:u.style.color}}switch(r){case 0:jscolor.requireImage("hs.png");break;case 1:jscolor.requireImage("hv.png");break}jscolor.requireImage("cross.gif");jscolor.requireImage("arrow.gif");this.importColor()}};jscolor.install()
(()=>{var e={};e.id=917,e.ids=[917],e.modules={47849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},55403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},94749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},15344:(e,t,s)=>{"use strict";s.r(t),s.d(t,{GlobalError:()=>i.a,__next_app__:()=>p,originalPathname:()=>m,pages:()=>d,routeModule:()=>x,tree:()=>c});var a=s(50482),r=s(69108),o=s(62563),i=s.n(o),n=s(68300),l={};for(let e in n)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>n[e]);s.d(t,l);let c=["",{children:["shared",{children:["analysis",{children:["[id]",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(s.bind(s,43308)),"/Users/wolf/bnb-calc-clone/app/shared/analysis/[id]/page.tsx"]}]},{}]},{}]},{}]},{layout:[()=>Promise.resolve().then(s.bind(s,82917)),"/Users/wolf/bnb-calc-clone/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(s.t.bind(s,69361,23)),"next/dist/client/components/not-found-error"]}],d=["/Users/wolf/bnb-calc-clone/app/shared/analysis/[id]/page.tsx"],m="/shared/analysis/[id]/page",p={require:s,loadChunk:()=>Promise.resolve()},x=new a.AppPageRouteModule({definition:{kind:r.x.APP_PAGE,page:"/shared/analysis/[id]/page",pathname:"/shared/analysis/[id]",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},38515:(e,t,s)=>{Promise.resolve().then(s.t.bind(s,56886,23))},82468:(e,t,s)=>{Promise.resolve().then(s.bind(s,71281))},49049:(e,t,s)=>{Promise.resolve().then(s.t.bind(s,2583,23)),Promise.resolve().then(s.t.bind(s,26840,23)),Promise.resolve().then(s.t.bind(s,38771,23)),Promise.resolve().then(s.t.bind(s,13225,23)),Promise.resolve().then(s.t.bind(s,9295,23)),Promise.resolve().then(s.t.bind(s,43982,23))},56886:()=>{throw Error("Module build failed (from ./node_modules/next/dist/build/webpack/loaders/next-swc-loader.js):\nError: \n  \x1b[31mx\x1b[0m You are attempting to export \"metadata\" from a component marked with \"use client\", which is disallowed. Either remove the export, or the \"use client\" directive. Read more: https://nextjs.org/\n  \x1b[31m|\x1b[0m docs/getting-started/react-essentials#the-use-client-directive\n  \x1b[31m|\x1b[0m \n  \x1b[31m|\x1b[0m \n    ,-[\x1b[36;1;4m/Users/wolf/bnb-calc-clone/app/layout.tsx\x1b[0m:12:1]\n \x1b[2m12\x1b[0m | \n \x1b[2m13\x1b[0m | const inter = Inter({ subsets: ['latin'] });\n \x1b[2m14\x1b[0m | \n \x1b[2m15\x1b[0m | export const metadata = {\n    : \x1b[31;1m             ^^^^^^^^\x1b[0m\n \x1b[2m16\x1b[0m |   title: 'Rose Renters Calculator',\n \x1b[2m17\x1b[0m |   description: 'Calculate rental property returns and analyze investments',\n \x1b[2m18\x1b[0m | };\n    `----\n")},71281:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>d});var a=s(95344),r=s(3729),o=s(8428),i=s(56506),n=s(63024),l=s(96885),c=s(44669);function d(){let e=(0,o.useParams)(),[t,s]=(0,r.useState)(null),[d,m]=(0,r.useState)(!0);(0,r.useEffect)(()=>{p()},[e.id]);let p=async()=>{try{let t=await fetch(`/api/analysis/shared/${e.id}`),a=await t.json();s(a.analysis)}catch(e){c.Am.error("Failed to load analysis")}finally{m(!1)}};return d?a.jsx("div",{className:"min-h-screen bg-black text-[#2ecc71] p-8",children:a.jsx("div",{className:"max-w-6xl mx-auto",children:a.jsx("div",{className:"text-center",children:"Loading..."})})}):t?a.jsx("div",{className:"min-h-screen bg-black text-[#2ecc71] p-8",children:(0,a.jsxs)("div",{className:"max-w-6xl mx-auto",children:[(0,a.jsxs)("div",{className:"flex items-center gap-4 mb-12",children:[a.jsx(i.default,{href:"/",className:"text-[#2ecc71] hover:text-white transition-colors",children:a.jsx(n.Z,{className:"w-6 h-6"})}),(0,a.jsxs)("div",{children:[(0,a.jsxs)("h1",{className:"text-4xl font-mono",children:[t.calculatorType.charAt(0).toUpperCase()+t.calculatorType.slice(1)," Analysis"]}),(0,a.jsxs)("p",{className:"text-sm opacity-75",children:["Version ",t.version]})]})]}),(0,a.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-8",children:[a.jsx("div",{className:"lg:col-span-2 space-y-8",children:(0,a.jsxs)("div",{className:"border border-[#2ecc71] p-6",children:[a.jsx("h2",{className:"text-2xl font-mono mb-6",children:"Results"}),a.jsx("div",{className:"space-y-4",children:Object.entries(t.data).map(([e,t])=>(0,a.jsxs)("div",{className:"flex justify-between py-2 border-b border-gray-700",children:[a.jsx("span",{className:"font-mono",children:e}),a.jsx("span",{className:"font-mono",children:"number"==typeof t?t.toLocaleString():String(t)})]},e))})]})}),(0,a.jsxs)("div",{className:"space-y-6",children:[(0,a.jsxs)("div",{className:"border border-[#2ecc71] p-6",children:[a.jsx("h3",{className:"text-xl font-mono mb-4",children:"Download"}),(0,a.jsxs)("div",{className:"space-y-4",children:[(0,a.jsxs)("a",{href:t.pdfUrl,target:"_blank",rel:"noopener noreferrer",className:"flex items-center gap-2 text-sm hover:text-white transition-colors",children:[a.jsx(l.Z,{className:"w-4 h-4"}),"PDF Report"]}),t.csvUrl&&(0,a.jsxs)("a",{href:t.csvUrl,target:"_blank",rel:"noopener noreferrer",className:"flex items-center gap-2 text-sm hover:text-white transition-colors",children:[a.jsx(l.Z,{className:"w-4 h-4"}),"CSV Data"]})]})]}),(0,a.jsxs)("div",{className:"border border-[#2ecc71] p-6",children:[a.jsx("h3",{className:"text-xl font-mono mb-4",children:"Information"}),(0,a.jsxs)("div",{className:"space-y-2 text-sm",children:[(0,a.jsxs)("p",{children:["Created: ",new Date(t.createdAt).toLocaleDateString()]}),(0,a.jsxs)("p",{children:["Calculator: ",t.calculatorType]}),(0,a.jsxs)("p",{children:["Version: ",t.version]})]})]})]})]})]})}):a.jsx("div",{className:"min-h-screen bg-black text-[#2ecc71] p-8",children:a.jsx("div",{className:"max-w-6xl mx-auto",children:(0,a.jsxs)("div",{className:"text-center",children:[a.jsx("h1",{className:"text-4xl font-mono mb-4",children:"Analysis Not Found"}),a.jsx("p",{className:"mb-8",children:"This analysis may have been deleted or is no longer available."}),a.jsx(i.default,{href:"/",className:"text-[#2ecc71] hover:text-white transition-colors",children:"Return Home"})]})})})}},63024:(e,t,s)=>{"use strict";s.d(t,{Z:()=>a});/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,s(69224).Z)("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]])},96885:(e,t,s)=>{"use strict";s.d(t,{Z:()=>a});/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,s(69224).Z)("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]])},8428:(e,t,s)=>{"use strict";var a=s(14767);s.o(a,"useParams")&&s.d(t,{useParams:function(){return a.useParams}}),s.o(a,"usePathname")&&s.d(t,{usePathname:function(){return a.usePathname}}),s.o(a,"useRouter")&&s.d(t,{useRouter:function(){return a.useRouter}}),s.o(a,"useSearchParams")&&s.d(t,{useSearchParams:function(){return a.useSearchParams}})},82917:(e,t,s)=>{"use strict";s.r(t),s.d(t,{$$typeof:()=>i,__esModule:()=>o,default:()=>c,metadata:()=>l});var a=s(86843);let r=(0,a.createProxy)(String.raw`/Users/wolf/bnb-calc-clone/app/layout.tsx`),{__esModule:o,$$typeof:i}=r,n=r.default,l=(0,a.createProxy)(String.raw`/Users/wolf/bnb-calc-clone/app/layout.tsx#metadata`),c=n},43308:(e,t,s)=>{"use strict";s.r(t),s.d(t,{$$typeof:()=>o,__esModule:()=>r,default:()=>i});let a=(0,s(86843).createProxy)(String.raw`/Users/wolf/bnb-calc-clone/app/shared/analysis/[id]/page.tsx`),{__esModule:r,$$typeof:o}=a,i=a.default},44669:(e,t,s)=>{"use strict";s.d(t,{Am:()=>U});var a,r=s(3729);let o={data:""},i=e=>e||o,n=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,l=/\/\*[^]*?\*\/|  +/g,c=/\n+/g,d=(e,t)=>{let s="",a="",r="";for(let o in e){let i=e[o];"@"==o[0]?"i"==o[1]?s=o+" "+i+";":a+="f"==o[1]?d(i,o):o+"{"+d(i,"k"==o[1]?"":t)+"}":"object"==typeof i?a+=d(i,t?t.replace(/([^,])+/g,e=>o.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):o):null!=i&&(o=/^--/.test(o)?o:o.replace(/[A-Z]/g,"-$&").toLowerCase(),r+=d.p?d.p(o,i):o+":"+i+";")}return s+(t&&r?t+"{"+r+"}":r)+a},m={},p=e=>{if("object"==typeof e){let t="";for(let s in e)t+=s+p(e[s]);return t}return e},x=(e,t,s,a,r)=>{let o=p(e),i=m[o]||(m[o]=(e=>{let t=0,s=11;for(;t<e.length;)s=101*s+e.charCodeAt(t++)>>>0;return"go"+s})(o));if(!m[i]){let t=o!==e?e:(e=>{let t,s,a=[{}];for(;t=n.exec(e.replace(l,""));)t[4]?a.shift():t[3]?(s=t[3].replace(c," ").trim(),a.unshift(a[0][s]=a[0][s]||{})):a[0][t[1]]=t[2].replace(c," ").trim();return a[0]})(e);m[i]=d(r?{["@keyframes "+i]:t}:t,s?"":"."+i)}let x=s&&m.g?m.g:null;return s&&(m.g=m[i]),((e,t,s,a)=>{a?t.data=t.data.replace(a,e):-1===t.data.indexOf(e)&&(t.data=s?e+t.data:t.data+e)})(m[i],t,a,x),i},u=(e,t,s)=>e.reduce((e,a,r)=>{let o=t[r];if(o&&o.call){let e=o(s),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;o=t?"."+t:e&&"object"==typeof e?e.props?"":d(e,""):!1===e?"":e}return e+a+(null==o?"":o)},"");function h(e){let t=this||{},s=e.call?e(t.p):e;return x(s.unshift?s.raw?u(s,[].slice.call(arguments,1),t.p):s.reduce((e,s)=>Object.assign(e,s&&s.call?s(t.p):s),{}):s,i(t.target),t.g,t.o,t.k)}h.bind({g:1});let b,f,g,y=h.bind({k:1});function v(e,t){let s=this||{};return function(){let a=arguments;function r(o,i){let n=Object.assign({},o),l=n.className||r.className;s.p=Object.assign({theme:f&&f()},n),s.o=/ *go\d+/.test(l),n.className=h.apply(s,a)+(l?" "+l:""),t&&(n.ref=i);let c=e;return e[0]&&(c=n.as||e,delete n.as),g&&c[0]&&g(n),b(c,n)}return t?t(r):r}}var w=e=>"function"==typeof e,j=(e,t)=>w(e)?e(t):e,N=(()=>{let e=0;return()=>(++e).toString()})(),P=((()=>{let e;return()=>e})(),(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,20)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:s}=t;return P(e,{type:e.toasts.find(e=>e.id===s.id)?1:0,toast:s});case 3:let{toastId:a}=t;return{...e,toasts:e.toasts.map(e=>e.id===a||void 0===a?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let r=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+r}))}}}),k=[],_={toasts:[],pausedAt:void 0},$=e=>{_=P(_,e),k.forEach(e=>{e(_)})},A={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},S=(e,t="blank",s)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...s,id:(null==s?void 0:s.id)||N()}),q=e=>(t,s)=>{let a=S(t,e,s);return $({type:2,toast:a}),a.id},U=(e,t)=>q("blank")(e,t);U.error=q("error"),U.success=q("success"),U.loading=q("loading"),U.custom=q("custom"),U.dismiss=e=>{$({type:3,toastId:e})},U.remove=e=>$({type:4,toastId:e}),U.promise=(e,t,s)=>{let a=U.loading(t.loading,{...s,...null==s?void 0:s.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let r=t.success?j(t.success,e):void 0;return r?U.success(r,{id:a,...s,...null==s?void 0:s.success}):U.dismiss(a),e}).catch(e=>{let r=t.error?j(t.error,e):void 0;r?U.error(r,{id:a,...s,...null==s?void 0:s.error}):U.dismiss(a)}),e};var C=new Map,D=1e3,E=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,R=y`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,M=y`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,z=(v("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${E} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${R} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${M} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,y`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`),Z=(v("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${z} 1s linear infinite;
`,y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`),F=y`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,I=(v("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Z} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${F} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,v("div")`
  position: absolute;
`,v("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,y`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`);v("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${I} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,v("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,v("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,a=r.createElement,d.p=void 0,b=a,f=void 0,g=void 0,h`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`}};var t=require("../../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),a=t.X(0,[1638,8356,2642],()=>s(15344));module.exports=a})();
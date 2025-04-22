(()=>{var e={};e.id=882,e.ids=[882],e.modules={47849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},55403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},94749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},90282:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>i.a,__next_app__:()=>m,originalPathname:()=>p,pages:()=>d,routeModule:()=>x,tree:()=>c});var a=r(50482),s=r(69108),o=r(62563),i=r.n(o),n=r(68300),l={};for(let e in n)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>n[e]);r.d(t,l);let c=["",{children:["reports",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,19669)),"/Users/wolf/bnb-calc-clone/app/reports/page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(r.bind(r,82917)),"/Users/wolf/bnb-calc-clone/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,69361,23)),"next/dist/client/components/not-found-error"]}],d=["/Users/wolf/bnb-calc-clone/app/reports/page.tsx"],p="/reports/page",m={require:r,loadChunk:()=>Promise.resolve()},x=new a.AppPageRouteModule({definition:{kind:s.x.APP_PAGE,page:"/reports/page",pathname:"/reports",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},38515:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,56886,23))},2237:(e,t,r)=>{Promise.resolve().then(r.bind(r,52215))},49049:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,2583,23)),Promise.resolve().then(r.t.bind(r,26840,23)),Promise.resolve().then(r.t.bind(r,38771,23)),Promise.resolve().then(r.t.bind(r,13225,23)),Promise.resolve().then(r.t.bind(r,9295,23)),Promise.resolve().then(r.t.bind(r,43982,23))},56886:()=>{throw Error("Module build failed (from ./node_modules/next/dist/build/webpack/loaders/next-swc-loader.js):\nError: \n  \x1b[31mx\x1b[0m You are attempting to export \"metadata\" from a component marked with \"use client\", which is disallowed. Either remove the export, or the \"use client\" directive. Read more: https://nextjs.org/\n  \x1b[31m|\x1b[0m docs/getting-started/react-essentials#the-use-client-directive\n  \x1b[31m|\x1b[0m \n  \x1b[31m|\x1b[0m \n    ,-[\x1b[36;1;4m/Users/wolf/bnb-calc-clone/app/layout.tsx\x1b[0m:12:1]\n \x1b[2m12\x1b[0m | \n \x1b[2m13\x1b[0m | const inter = Inter({ subsets: ['latin'] });\n \x1b[2m14\x1b[0m | \n \x1b[2m15\x1b[0m | export const metadata = {\n    : \x1b[31;1m             ^^^^^^^^\x1b[0m\n \x1b[2m16\x1b[0m |   title: 'Rose Renters Calculator',\n \x1b[2m17\x1b[0m |   description: 'Calculate rental property returns and analyze investments',\n \x1b[2m18\x1b[0m | };\n    `----\n")},52215:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>p});var a=r(95344),s=r(3729),o=r(56506),i=r(63024),n=r(89151),l=r(38271),c=r(96885),d=r(44669);function p(){let[e,t]=(0,s.useState)(!1),[r,p]=(0,s.useState)(!0),[m,x]=(0,s.useState)([]),[u,h]=(0,s.useState)([]),[b,f]=(0,s.useState)(""),[g,y]=(0,s.useState)("");(0,s.useEffect)(()=>{(async()=>{try{let e=await fetch("/api/auth/check"),r=await e.json();t(r.authenticated),r.authenticated&&v()}catch(e){console.error("Auth check failed:",e)}finally{p(!1)}})()},[]);let v=async()=>{try{let e=new URLSearchParams;b&&e.append("calculatorType",b),u.length&&e.append("tags",u.join(","));let t=await fetch(`/api/reports?${e}`),r=await t.json();x(r.reports)}catch(e){d.Am.error("Failed to fetch reports")}},w=async e=>{try{let t=await fetch(`/api/reports/${e}/share`,{method:"POST"}),{publicUrl:r}=await t.json();await navigator.clipboard.writeText(r),d.Am.success("Share link copied to clipboard")}catch(e){d.Am.error("Failed to generate share link")}},j=async e=>{if(confirm("Are you sure you want to delete this report?"))try{await fetch(`/api/reports/${e}`,{method:"DELETE"}),x(m.filter(t=>t._id!==e)),d.Am.success("Report deleted")}catch(e){d.Am.error("Failed to delete report")}},k=m.filter(e=>e.notes.toLowerCase().includes(g.toLowerCase())||e.tags.some(e=>e.toLowerCase().includes(g.toLowerCase())));return r?a.jsx("div",{className:"min-h-screen bg-black text-[#2ecc71] p-8",children:a.jsx("div",{className:"max-w-6xl mx-auto",children:a.jsx("h1",{className:"text-4xl font-mono mb-8",children:"Loading..."})})}):e?a.jsx("div",{className:"min-h-screen bg-black text-[#2ecc71] p-8",children:(0,a.jsxs)("div",{className:"max-w-6xl mx-auto",children:[(0,a.jsxs)("div",{className:"flex items-center gap-4 mb-12",children:[a.jsx(o.default,{href:"/dashboard",className:"text-[#2ecc71] hover:text-white transition-colors",children:a.jsx(i.Z,{className:"w-6 h-6"})}),a.jsx("h1",{className:"text-4xl font-mono",children:"Saved Reports"})]}),(0,a.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4 mb-8",children:[a.jsx("input",{type:"text",placeholder:"Search reports...",value:g,onChange:e=>y(e.target.value),className:"bg-black border border-[#2ecc71] px-4 py-2 font-mono"}),(0,a.jsxs)("select",{value:b,onChange:e=>f(e.target.value),className:"bg-black border border-[#2ecc71] px-4 py-2 font-mono",children:[a.jsx("option",{value:"",children:"All Calculators"}),a.jsx("option",{value:"mortgage",children:"Mortgage"}),a.jsx("option",{value:"rental",children:"Rental"}),a.jsx("option",{value:"airbnb",children:"Airbnb"}),a.jsx("option",{value:"wholesale",children:"Wholesale"})]}),a.jsx("div",{className:"flex gap-2",children:["investment","residential","commercial"].map(e=>a.jsx("button",{onClick:()=>{h(t=>t.includes(e)?t.filter(t=>t!==e):[...t,e])},className:`px-4 py-2 border ${u.includes(e)?"bg-[#2ecc71] text-black":"border-[#2ecc71]"} font-mono`,children:e},e))})]}),0===m.length?a.jsx("div",{className:"text-center",children:"No reports found"}):a.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:k.map(e=>(0,a.jsxs)("div",{className:"border border-[#2ecc71] p-6 space-y-4",children:[(0,a.jsxs)("div",{className:"flex justify-between items-start",children:[(0,a.jsxs)("div",{children:[a.jsx("h3",{className:"text-xl font-mono",children:e.calculatorType.charAt(0).toUpperCase()+e.calculatorType.slice(1)}),(0,a.jsxs)("p",{className:"text-sm opacity-75",children:["Version ",e.version]})]}),(0,a.jsxs)("div",{className:"flex gap-2",children:[a.jsx("button",{onClick:()=>w(e._id),className:"p-2 hover:bg-[#2ecc71] hover:text-black transition-colors",children:a.jsx(n.Z,{className:"w-4 h-4"})}),a.jsx("button",{onClick:()=>j(e._id),className:"p-2 hover:bg-red-500 hover:text-white transition-colors",children:a.jsx(l.Z,{className:"w-4 h-4"})})]})]}),a.jsx("p",{className:"font-mono text-sm",children:e.notes}),a.jsx("div",{className:"flex flex-wrap gap-2",children:e.tags.map(e=>a.jsx("span",{className:"px-2 py-1 bg-[#2ecc71]/10 text-sm font-mono",children:e},e))}),(0,a.jsxs)("div",{className:"flex gap-2 pt-4 border-t border-[#2ecc71]/20",children:[(0,a.jsxs)("a",{href:e.pdfUrl,target:"_blank",rel:"noopener noreferrer",className:"flex items-center gap-2 text-sm hover:text-white transition-colors",children:[a.jsx(c.Z,{className:"w-4 h-4"}),"Download PDF"]}),e.csvUrl&&(0,a.jsxs)("a",{href:e.csvUrl,target:"_blank",rel:"noopener noreferrer",className:"flex items-center gap-2 text-sm hover:text-white transition-colors",children:[a.jsx(c.Z,{className:"w-4 h-4"}),"Download CSV"]})]})]},e._id))})]})}):a.jsx("div",{className:"min-h-screen bg-black text-[#2ecc71] p-8",children:(0,a.jsxs)("div",{className:"max-w-6xl mx-auto",children:[a.jsx("h1",{className:"text-4xl font-mono mb-8",children:"Please sign in to view your reports"}),a.jsx(o.default,{href:"/login",className:"text-[#2ecc71] hover:text-white transition-colors",children:"Sign In"})]})})}},63024:(e,t,r)=>{"use strict";r.d(t,{Z:()=>a});/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,r(69224).Z)("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]])},96885:(e,t,r)=>{"use strict";r.d(t,{Z:()=>a});/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,r(69224).Z)("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]])},89151:(e,t,r)=>{"use strict";r.d(t,{Z:()=>a});/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,r(69224).Z)("Share2",[["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}],["circle",{cx:"6",cy:"12",r:"3",key:"w7nqdw"}],["circle",{cx:"18",cy:"19",r:"3",key:"1xt0gg"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49",key:"47mynk"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49",key:"1n3mei"}]])},38271:(e,t,r)=>{"use strict";r.d(t,{Z:()=>a});/**
 * @license lucide-react v0.344.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,r(69224).Z)("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]])},82917:(e,t,r)=>{"use strict";r.r(t),r.d(t,{$$typeof:()=>i,__esModule:()=>o,default:()=>c,metadata:()=>l});var a=r(86843);let s=(0,a.createProxy)(String.raw`/Users/wolf/bnb-calc-clone/app/layout.tsx`),{__esModule:o,$$typeof:i}=s,n=s.default,l=(0,a.createProxy)(String.raw`/Users/wolf/bnb-calc-clone/app/layout.tsx#metadata`),c=n},19669:(e,t,r)=>{"use strict";r.r(t),r.d(t,{$$typeof:()=>o,__esModule:()=>s,default:()=>i});let a=(0,r(86843).createProxy)(String.raw`/Users/wolf/bnb-calc-clone/app/reports/page.tsx`),{__esModule:s,$$typeof:o}=a,i=a.default},44669:(e,t,r)=>{"use strict";r.d(t,{Am:()=>q});var a,s=r(3729);let o={data:""},i=e=>e||o,n=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,l=/\/\*[^]*?\*\/|  +/g,c=/\n+/g,d=(e,t)=>{let r="",a="",s="";for(let o in e){let i=e[o];"@"==o[0]?"i"==o[1]?r=o+" "+i+";":a+="f"==o[1]?d(i,o):o+"{"+d(i,"k"==o[1]?"":t)+"}":"object"==typeof i?a+=d(i,t?t.replace(/([^,])+/g,e=>o.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):o):null!=i&&(o=/^--/.test(o)?o:o.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=d.p?d.p(o,i):o+":"+i+";")}return r+(t&&s?t+"{"+s+"}":s)+a},p={},m=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+m(e[r]);return t}return e},x=(e,t,r,a,s)=>{let o=m(e),i=p[o]||(p[o]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(o));if(!p[i]){let t=o!==e?e:(e=>{let t,r,a=[{}];for(;t=n.exec(e.replace(l,""));)t[4]?a.shift():t[3]?(r=t[3].replace(c," ").trim(),a.unshift(a[0][r]=a[0][r]||{})):a[0][t[1]]=t[2].replace(c," ").trim();return a[0]})(e);p[i]=d(s?{["@keyframes "+i]:t}:t,r?"":"."+i)}let x=r&&p.g?p.g:null;return r&&(p.g=p[i]),((e,t,r,a)=>{a?t.data=t.data.replace(a,e):-1===t.data.indexOf(e)&&(t.data=r?e+t.data:t.data+e)})(p[i],t,a,x),i},u=(e,t,r)=>e.reduce((e,a,s)=>{let o=t[s];if(o&&o.call){let e=o(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;o=t?"."+t:e&&"object"==typeof e?e.props?"":d(e,""):!1===e?"":e}return e+a+(null==o?"":o)},"");function h(e){let t=this||{},r=e.call?e(t.p):e;return x(r.unshift?r.raw?u(r,[].slice.call(arguments,1),t.p):r.reduce((e,r)=>Object.assign(e,r&&r.call?r(t.p):r),{}):r,i(t.target),t.g,t.o,t.k)}h.bind({g:1});let b,f,g,y=h.bind({k:1});function v(e,t){let r=this||{};return function(){let a=arguments;function s(o,i){let n=Object.assign({},o),l=n.className||s.className;r.p=Object.assign({theme:f&&f()},n),r.o=/ *go\d+/.test(l),n.className=h.apply(r,a)+(l?" "+l:""),t&&(n.ref=i);let c=e;return e[0]&&(c=n.as||e,delete n.as),g&&c[0]&&g(n),b(c,n)}return t?t(s):s}}var w=e=>"function"==typeof e,j=(e,t)=>w(e)?e(t):e,k=(()=>{let e=0;return()=>(++e).toString()})(),N=((()=>{let e;return()=>e})(),(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,20)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return N(e,{type:e.toasts.find(e=>e.id===r.id)?1:0,toast:r});case 3:let{toastId:a}=t;return{...e,toasts:e.toasts.map(e=>e.id===a||void 0===a?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let s=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+s}))}}}),P=[],_={toasts:[],pausedAt:void 0},A=e=>{_=N(_,e),P.forEach(e=>{e(_)})},$={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},S=(e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||k()}),C=e=>(t,r)=>{let a=S(t,e,r);return A({type:2,toast:a}),a.id},q=(e,t)=>C("blank")(e,t);q.error=C("error"),q.success=C("success"),q.loading=C("loading"),q.custom=C("custom"),q.dismiss=e=>{A({type:3,toastId:e})},q.remove=e=>A({type:4,toastId:e}),q.promise=(e,t,r)=>{let a=q.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let s=t.success?j(t.success,e):void 0;return s?q.success(s,{id:a,...r,...null==r?void 0:r.success}):q.dismiss(a),e}).catch(e=>{let s=t.error?j(t.error,e):void 0;s?q.error(s,{id:a,...r,...null==r?void 0:r.error}):q.dismiss(a)}),e};var Z=new Map,E=1e3,M=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,U=y`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,D=y`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,L=(v("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${M} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${U} 0.15s ease-out forwards;
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
    animation: ${D} 0.15s ease-out forwards;
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
`),z=(v("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${L} 1s linear infinite;
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
}`,R=(v("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${z} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
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
  animation: ${R} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
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
`,a=s.createElement,d.p=void 0,b=a,f=void 0,g=void 0,h`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[1638,8356,2642],()=>r(90282));module.exports=a})();
(()=>{var e={};e.id=2626,e.ids=[2626],e.modules={47849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},55403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},94749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},58787:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>i.a,__next_app__:()=>u,originalPathname:()=>p,pages:()=>d,routeModule:()=>m,tree:()=>c});var a=r(50482),s=r(69108),o=r(62563),i=r.n(o),n=r(68300),l={};for(let e in n)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>n[e]);r.d(t,l);let c=["",{children:["login",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,43015)),"/Users/wolf/bnb-calc-clone/app/login/page.tsx"]}]},{layout:[()=>Promise.resolve().then(r.bind(r,15601)),"/Users/wolf/bnb-calc-clone/app/login/layout.tsx"]}]},{layout:[()=>Promise.resolve().then(r.bind(r,82917)),"/Users/wolf/bnb-calc-clone/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,69361,23)),"next/dist/client/components/not-found-error"]}],d=["/Users/wolf/bnb-calc-clone/app/login/page.tsx"],p="/login/page",u={require:r,loadChunk:()=>Promise.resolve()},m=new a.AppPageRouteModule({definition:{kind:s.x.APP_PAGE,page:"/login/page",pathname:"/login",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},53121:(e,t,r)=>{Promise.resolve().then(r.bind(r,89928))},35303:()=>{},89928:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>p,dynamic:()=>d});var a=r(95344),s=r(3729),o=r(47674),i=r(8428),n=r(56506),l=r(92756),c=r(44669);let d="force-dynamic";function p(){let e=(0,i.useRouter)(),t=(0,i.useSearchParams)(),[r,d]=(0,s.useState)(!1),[p,u]=(0,s.useState)(""),[m,f]=(0,s.useState)(""),g=t.get("mode")||"login",x="signup"===g,b=async t=>{t.preventDefault(),d(!0);try{let t=await (0,o.signIn)("credentials",{email:p,password:m,mode:g,redirect:!1});t?.error?c.Am.error(t.error):(c.Am.success(x?"Account created successfully!":"Welcome back!"),e.push("/dashboard"))}catch(e){c.Am.error("An error occurred. Please try again.")}finally{d(!1)}};return a.jsx(l.Z,{children:a.jsx("div",{className:"min-h-screen flex items-center justify-center bg-[#0a0a0a] bg-grid-[#111111]",children:(0,a.jsxs)("div",{className:"max-w-md w-full space-y-8 p-8 bg-[#111111] rounded-xl shadow-[0_0_30px_rgba(46,204,113,0.1)] border border-[#2ecc71]/20",children:[(0,a.jsxs)("div",{children:[a.jsx("h2",{className:"mt-6 text-center text-4xl font-mono font-bold text-[#2ecc71] [text-shadow:_0_0_20px_rgba(46,204,113,0.3)]",children:x?"Create Account":"Welcome Back"}),a.jsx("p",{className:"mt-2 text-center text-sm text-gray-400 font-mono",children:x?"Join the future of real estate analysis":"Access your real estate insights"})]}),(0,a.jsxs)("form",{className:"mt-8 space-y-6",onSubmit:b,children:[(0,a.jsxs)("div",{className:"space-y-4",children:[(0,a.jsxs)("div",{children:[a.jsx("label",{htmlFor:"email",className:"sr-only",children:"Email address"}),a.jsx("input",{id:"email",name:"email",type:"email",required:!0,value:p,onChange:e=>u(e.target.value),className:"block w-full px-4 py-3 border bg-[#0a0a0a] border-[#2ecc71]/20 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ecc71]/50 focus:border-transparent font-mono text-sm",placeholder:"Email address"})]}),(0,a.jsxs)("div",{children:[a.jsx("label",{htmlFor:"password",className:"sr-only",children:"Password"}),a.jsx("input",{id:"password",name:"password",type:"password",required:!0,value:m,onChange:e=>f(e.target.value),className:"block w-full px-4 py-3 border bg-[#0a0a0a] border-[#2ecc71]/20 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2ecc71]/50 focus:border-transparent font-mono text-sm",placeholder:"Password"})]})]}),a.jsx("div",{children:a.jsx("button",{type:"submit",disabled:r,className:`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-mono font-medium rounded-lg text-black bg-[#2ecc71] hover:bg-[#2ecc71]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2ecc71] transition-all duration-200 ${r?"opacity-50 cursor-not-allowed":""} [text-shadow:_0_0_10px_rgba(0,0,0,0.3)]`,children:r?"Processing...":x?"Create Account":"Sign In"})}),a.jsx("div",{className:"text-center font-mono",children:a.jsx(n.default,{href:`/login?mode=${x?"login":"signup"}`,className:"text-[#2ecc71] hover:text-[#2ecc71]/80 text-sm transition-colors",children:x?"Already have an account? Sign in":"Don't have an account? Sign up"})})]})]})})})}},15601:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>s});var a=r(25036);function s({children:e}){return a.jsx("div",{className:"min-h-screen bg-black",children:e})}},43015:(e,t,r)=>{"use strict";r.r(t),r.d(t,{$$typeof:()=>i,__esModule:()=>o,default:()=>c,dynamic:()=>l});var a=r(86843);let s=(0,a.createProxy)(String.raw`/Users/wolf/bnb-calc-clone/app/login/page.tsx`),{__esModule:o,$$typeof:i}=s,n=s.default,l=(0,a.createProxy)(String.raw`/Users/wolf/bnb-calc-clone/app/login/page.tsx#dynamic`),c=n},44669:(e,t,r)=>{"use strict";r.d(t,{Am:()=>C});var a,s=r(3729);let o={data:""},i=e=>e||o,n=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,l=/\/\*[^]*?\*\/|  +/g,c=/\n+/g,d=(e,t)=>{let r="",a="",s="";for(let o in e){let i=e[o];"@"==o[0]?"i"==o[1]?r=o+" "+i+";":a+="f"==o[1]?d(i,o):o+"{"+d(i,"k"==o[1]?"":t)+"}":"object"==typeof i?a+=d(i,t?t.replace(/([^,])+/g,e=>o.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):o):null!=i&&(o=/^--/.test(o)?o:o.replace(/[A-Z]/g,"-$&").toLowerCase(),s+=d.p?d.p(o,i):o+":"+i+";")}return r+(t&&s?t+"{"+s+"}":s)+a},p={},u=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+u(e[r]);return t}return e},m=(e,t,r,a,s)=>{let o=u(e),i=p[o]||(p[o]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(o));if(!p[i]){let t=o!==e?e:(e=>{let t,r,a=[{}];for(;t=n.exec(e.replace(l,""));)t[4]?a.shift():t[3]?(r=t[3].replace(c," ").trim(),a.unshift(a[0][r]=a[0][r]||{})):a[0][t[1]]=t[2].replace(c," ").trim();return a[0]})(e);p[i]=d(s?{["@keyframes "+i]:t}:t,r?"":"."+i)}let m=r&&p.g?p.g:null;return r&&(p.g=p[i]),((e,t,r,a)=>{a?t.data=t.data.replace(a,e):-1===t.data.indexOf(e)&&(t.data=r?e+t.data:t.data+e)})(p[i],t,a,m),i},f=(e,t,r)=>e.reduce((e,a,s)=>{let o=t[s];if(o&&o.call){let e=o(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;o=t?"."+t:e&&"object"==typeof e?e.props?"":d(e,""):!1===e?"":e}return e+a+(null==o?"":o)},"");function g(e){let t=this||{},r=e.call?e(t.p):e;return m(r.unshift?r.raw?f(r,[].slice.call(arguments,1),t.p):r.reduce((e,r)=>Object.assign(e,r&&r.call?r(t.p):r),{}):r,i(t.target),t.g,t.o,t.k)}g.bind({g:1});let x,b,h,y=g.bind({k:1});function v(e,t){let r=this||{};return function(){let a=arguments;function s(o,i){let n=Object.assign({},o),l=n.className||s.className;r.p=Object.assign({theme:b&&b()},n),r.o=/ *go\d+/.test(l),n.className=g.apply(r,a)+(l?" "+l:""),t&&(n.ref=i);let c=e;return e[0]&&(c=n.as||e,delete n.as),h&&c[0]&&h(n),x(c,n)}return t?t(s):s}}var w=e=>"function"==typeof e,j=(e,t)=>w(e)?e(t):e,_=(()=>{let e=0;return()=>(++e).toString()})(),P=((()=>{let e;return()=>e})(),(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,20)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return P(e,{type:e.toasts.find(e=>e.id===r.id)?1:0,toast:r});case 3:let{toastId:a}=t;return{...e,toasts:e.toasts.map(e=>e.id===a||void 0===a?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let s=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+s}))}}}),A=[],k={toasts:[],pausedAt:void 0},N=e=>{k=P(k,e),A.forEach(e=>{e(k)})},$={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},q=(e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||_()}),S=e=>(t,r)=>{let a=q(t,e,r);return N({type:2,toast:a}),a.id},C=(e,t)=>S("blank")(e,t);C.error=S("error"),C.success=S("success"),C.loading=S("loading"),C.custom=S("custom"),C.dismiss=e=>{N({type:3,toastId:e})},C.remove=e=>N({type:4,toastId:e}),C.promise=(e,t,r)=>{let a=C.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let s=t.success?j(t.success,e):void 0;return s?C.success(s,{id:a,...r,...null==r?void 0:r.success}):C.dismiss(a),e}).catch(e=>{let s=t.error?j(t.error,e):void 0;s?C.error(s,{id:a,...r,...null==r?void 0:r.error}):C.dismiss(a)}),e};var E=new Map,I=1e3,z=y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,D=y`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,F=y`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,U=(v("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${z} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${D} 0.15s ease-out forwards;
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
    animation: ${F} 0.15s ease-out forwards;
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
`),M=(v("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${U} 1s linear infinite;
`,y`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`),O=y`
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
}`,G=(v("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${M} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${O} 0.2s ease-out forwards;
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
  animation: ${G} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
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
`,a=s.createElement,d.p=void 0,x=a,b=void 0,h=void 0,g`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[1638,8356,2642,7674,3933],()=>r(58787));module.exports=a})();
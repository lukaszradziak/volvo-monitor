var S=Object.defineProperty,k=Object.defineProperties;var M=Object.getOwnPropertyDescriptors;var f=Object.getOwnPropertySymbols;var L=Object.prototype.hasOwnProperty,P=Object.prototype.propertyIsEnumerable;var p=(t,r,n)=>r in t?S(t,r,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[r]=n,l=(t,r)=>{for(var n in r||(r={}))L.call(r,n)&&p(t,n,r[n]);if(f)for(var n of f(r))P.call(r,n)&&p(t,n,r[n]);return t},m=(t,r)=>k(t,M(r));import{j as e,a as i,D as h,F as j,N as g,X as H,M as O,O as D,r as x,u as F,C as b,b as I,H as R,R as q,c}from"./vendor.js";const B=function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const d of o.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&a(d)}).observe(document,{childList:!0,subtree:!0});function n(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerpolicy&&(o.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?o.credentials="include":s.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(s){if(s.ep)return;s.ep=!0;const o=n(s);fetch(s.href,o)}};B();const C=({children:t})=>e("main",{className:"bg-gray-100 flex-1",children:e("div",{className:"max-w-7xl mx-auto py-6 px-4",children:t})}),E=()=>i("footer",{className:"bg bg-white text-center p-8 text-gray-400",children:["Volvo Monitor ",new Date().getFullYear()]}),v=[{name:"Home",href:"/"},{name:"Monitor",href:"/monitor"},{name:"Parameters",href:"/parameters"},{name:"Settings",href:"/settings"}],A=()=>e(h,{as:"nav",className:"bg-primary-600",children:({open:t,close:r})=>i(j,{children:[e("div",{className:"max-w-7xl mx-auto px-2 sm:px-4 lg:px-8",children:i("div",{className:"relative flex items-center justify-between h-16",children:[i("div",{className:"flex items-center px-2 lg:px-0",children:[e("div",{className:"flex-shrink-0",children:e("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-8 w-8",fill:"none",viewBox:"0 0 24 24",stroke:"white",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"})})}),e("div",{className:"hidden lg:block lg:ml-6",children:e("div",{className:"flex space-x-4",children:v.map(n=>e(g,{to:n.href,className:({isActive:a})=>`${a?"bg-primary-700 text-white":"text-gray-300"}  hover:bg-primary-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium `,children:n.name},n.name))})})]}),e("div",{className:"flex lg:hidden",children:i(h.Button,{className:"inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white",children:[e("span",{className:"sr-only",children:"Open main menu"}),t?e(H,{className:"block h-6 w-6","aria-hidden":"true"}):e(O,{className:"block h-6 w-6","aria-hidden":"true"})]})})]})}),e(h.Panel,{className:"lg:hidden",children:e("div",{className:"px-2 pt-2 pb-3 space-y-1",children:v.map(n=>e(g,{to:n.href,className:({isActive:a})=>`${a?"bg-primary-700 text-white":"text-gray-300"}  text-gray-300 hover:bg-primary-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium`,onClick:r,children:n.name},n.name))})})]})}),V=()=>i("div",{className:"flex flex-col min-h-screen",children:[e(A,{}),e(C,{children:e(D,{})}),e(E,{})]}),T=()=>e("p",{children:"Home Page"}),X=()=>{const[t,r]=x.exports.useState([]);return x.exports.useEffect(()=>{let n;const a=async()=>{(await(await fetch("http://192.168.4.1/api/monitor-data")).text()).trim().split(`
`).filter(u=>u).forEach(u=>{let w=u.split(";");r(N=>[...N,w])}),n=setTimeout(a,100)};return a(),()=>{clearTimeout(n)}},[]),i("div",{children:[i("p",{children:["Monitor Page ",t.length]}),t.length?i("p",{children:["Data: ",t[t.length-1][0]]}):null]})},Y=()=>e("p",{children:"Parameters Page"}),$=t=>e("button",m(l({className:"inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"},t),{children:t.children})),z=t=>e("input",l({className:"mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-4"},t)),y=t=>e("label",m(l({className:"block text-sm font-medium text-gray-700"},t),{children:t.children})),K=t=>e("select",m(l({className:"mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-4"},t),{children:t.options.map(r=>e("option",{value:r.value,children:r.label},r.value))})),W=()=>{const{control:t,handleSubmit:r}=F({defaultValues:{interval:"100",canSpeed:"250"}});return i("form",{onSubmit:r(a=>{console.log(a)}),children:[e(y,{children:"Requests Interval"}),e(b,{name:"interval",control:t,render:({field:{onChange:a,onBlur:s,value:o}})=>e(z,{onChange:a,onBlur:s,value:o})}),e(y,{children:"CAN Speed"}),e(b,{name:"canSpeed",control:t,render:({field:{onChange:a,onBlur:s,value:o}})=>e(K,{onChange:a,onBlur:s,value:o,options:[{value:"250",label:"250 kbps"},{value:"500",label:"500 kbps (MY05+)"}]})}),e($,{type:"submit",children:"Save"})]})};I.exports.render(e(R,{children:e(q,{children:i(c,{path:"/",element:e(V,{}),children:[e(c,{index:!0,element:e(T,{})}),e(c,{path:"monitor",element:e(X,{})}),e(c,{path:"parameters",element:e(Y,{})}),e(c,{path:"settings",element:e(W,{})})]})})}),document.getElementById("root"));

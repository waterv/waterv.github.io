if(!self.define){let l,e={};const n=(n,s)=>(n=new URL(n+".js",s).href,e[n]||new Promise((e=>{if("document"in self){const l=document.createElement("script");l.src=n,l.onload=e,document.head.appendChild(l)}else l=n,importScripts(n),e()})).then((()=>{let l=e[n];if(!l)throw new Error(`Module ${n} didn’t register its module`);return l})));self.define=(s,i)=>{const r=l||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let f={};const o=l=>n(l,r),a={module:{uri:r},exports:f,require:o};e[r]=Promise.all(s.map((l=>a[l]||o(l)))).then((l=>(i(...l),f)))}}define(["./workbox-79ffe3e0"],(function(l){"use strict";l.setCacheNameDetails({prefix:"waterv.github.io"}),self.addEventListener("message",(l=>{l.data&&"SKIP_WAITING"===l.data.type&&self.skipWaiting()})),l.precacheAndRoute([{url:"css/11.ca9ff243.css",revision:null},{url:"css/119.49fe6546.css",revision:null},{url:"css/235.97c13a36.css",revision:null},{url:"css/590.a9bcb6c1.css",revision:null},{url:"css/637.956103f6.css",revision:null},{url:"css/688.cfca5104.css",revision:null},{url:"css/724.643b2e93.css",revision:null},{url:"css/775.90371133.css",revision:null},{url:"css/868.8e145e4f.css",revision:null},{url:"css/944.9c82351a.css",revision:null},{url:"css/app.79a834be.css",revision:null},{url:"css/chunk-vendors.0a55b158.css",revision:null},{url:"css/fonts.css",revision:"11eab688e85c4e9db02db2f121365052"},{url:"css/mainstyle.css",revision:"0cfbebd0fea89866480d3385fdabd554"},{url:"fonts/CASIO ClassWiz.ttf",revision:"a8f9ce033670e9502fa27af9a4c711ff"},{url:"fonts/CW01.ttf",revision:"5e6922aa8c34d06d90b95892fbbf6dfa"},{url:"fonts/CharisSIL-Bold.woff2",revision:"e886211a38cee0a7522a3c05196a3bc7"},{url:"fonts/CharisSIL-BoldItalic.woff2",revision:"e41aac077cfa274af98b634ae90d2b52"},{url:"fonts/CharisSIL-Italic.woff2",revision:"1aeb73090fa3062ef1083a94c003ab4e"},{url:"fonts/CharisSIL-Regular.woff2",revision:"ea167d3822b0fc61e21b5136ac0f5c98"},{url:"fonts/HPPrime.ttf",revision:"68edf5bb0cad8da5e784dd2429d47a46"},{url:"fonts/KaTeX_AMS-Regular.1608a09b.woff",revision:null},{url:"fonts/KaTeX_AMS-Regular.4aafdb68.ttf",revision:null},{url:"fonts/KaTeX_AMS-Regular.a79f1c31.woff2",revision:null},{url:"fonts/KaTeX_Caligraphic-Bold.cce5b8ec.ttf",revision:null},{url:"fonts/KaTeX_Caligraphic-Regular.07ef19e7.ttf",revision:null},{url:"fonts/KaTeX_Fraktur-Bold.9f256b85.woff",revision:null},{url:"fonts/KaTeX_Fraktur-Bold.b18f59e1.ttf",revision:null},{url:"fonts/KaTeX_Fraktur-Bold.d42a5579.woff2",revision:null},{url:"fonts/KaTeX_Fraktur-Regular.7c187121.woff",revision:null},{url:"fonts/KaTeX_Fraktur-Regular.d3c882a6.woff2",revision:null},{url:"fonts/KaTeX_Fraktur-Regular.ed38e79f.ttf",revision:null},{url:"fonts/KaTeX_Main-Bold.b74a1a8b.ttf",revision:null},{url:"fonts/KaTeX_Main-Bold.c3fb5ac2.woff2",revision:null},{url:"fonts/KaTeX_Main-Bold.d181c465.woff",revision:null},{url:"fonts/KaTeX_Main-BoldItalic.6f2bb1df.woff2",revision:null},{url:"fonts/KaTeX_Main-BoldItalic.70d8b0a5.ttf",revision:null},{url:"fonts/KaTeX_Main-BoldItalic.e3f82f9d.woff",revision:null},{url:"fonts/KaTeX_Main-Italic.47373d1e.ttf",revision:null},{url:"fonts/KaTeX_Main-Italic.8916142b.woff2",revision:null},{url:"fonts/KaTeX_Main-Italic.9024d815.woff",revision:null},{url:"fonts/KaTeX_Main-Regular.0462f03b.woff2",revision:null},{url:"fonts/KaTeX_Main-Regular.7f51fe03.woff",revision:null},{url:"fonts/KaTeX_Main-Regular.b7f8fe9b.ttf",revision:null},{url:"fonts/KaTeX_Math-BoldItalic.572d331f.woff2",revision:null},{url:"fonts/KaTeX_Math-BoldItalic.a879cf83.ttf",revision:null},{url:"fonts/KaTeX_Math-BoldItalic.f1035d8d.woff",revision:null},{url:"fonts/KaTeX_Math-Italic.5295ba48.woff",revision:null},{url:"fonts/KaTeX_Math-Italic.939bc644.ttf",revision:null},{url:"fonts/KaTeX_Math-Italic.f28c23ac.woff2",revision:null},{url:"fonts/KaTeX_SansSerif-Bold.8c5b5494.woff2",revision:null},{url:"fonts/KaTeX_SansSerif-Bold.94e1e8dc.ttf",revision:null},{url:"fonts/KaTeX_SansSerif-Bold.bf59d231.woff",revision:null},{url:"fonts/KaTeX_SansSerif-Italic.3b1e59b3.woff2",revision:null},{url:"fonts/KaTeX_SansSerif-Italic.7c9bc82b.woff",revision:null},{url:"fonts/KaTeX_SansSerif-Italic.b4c20c84.ttf",revision:null},{url:"fonts/KaTeX_SansSerif-Regular.74048478.woff",revision:null},{url:"fonts/KaTeX_SansSerif-Regular.ba21ed5f.woff2",revision:null},{url:"fonts/KaTeX_SansSerif-Regular.d4d7ba48.ttf",revision:null},{url:"fonts/KaTeX_Script-Regular.03e9641d.woff2",revision:null},{url:"fonts/KaTeX_Script-Regular.07505710.woff",revision:null},{url:"fonts/KaTeX_Script-Regular.fe9cbbe1.ttf",revision:null},{url:"fonts/KaTeX_Size1-Regular.fabc004a.ttf",revision:null},{url:"fonts/KaTeX_Size2-Regular.d6b476ec.ttf",revision:null},{url:"fonts/KaTeX_Size4-Regular.fbccdabe.ttf",revision:null},{url:"fonts/KaTeX_Typewriter-Regular.6258592b.woff",revision:null},{url:"fonts/KaTeX_Typewriter-Regular.a8709e36.woff2",revision:null},{url:"fonts/KaTeX_Typewriter-Regular.d97aaf4a.ttf",revision:null},{url:"fonts/materialdesignicons-webfont.1dab7af5.woff",revision:null},{url:"fonts/materialdesignicons-webfont.2474c2c1.woff2",revision:null},{url:"fonts/materialdesignicons-webfont.a1c852b2.eot",revision:null},{url:"fonts/materialdesignicons-webfont.b33ccf64.ttf",revision:null},{url:"index.html",revision:"872b9076d78a795d3a33587bfe1cdf93"},{url:"js/11.fee72b39.js",revision:null},{url:"js/119.371c147c.js",revision:null},{url:"js/235.bcbd5048.js",revision:null},{url:"js/590.64e2c832.js",revision:null},{url:"js/637.1be5e050.js",revision:null},{url:"js/688.1a4c31ab.js",revision:null},{url:"js/724.9e2672f9.js",revision:null},{url:"js/775.6cdc403e.js",revision:null},{url:"js/868.c581f453.js",revision:null},{url:"js/944.1bbe887b.js",revision:null},{url:"js/app.546475bb.js",revision:null},{url:"js/chunk-vendors.646bfd41.js",revision:null},{url:"manifest.json",revision:"773c5146cef2756feecc2c37bbc22f1e"},{url:"robots.txt",revision:"b6216d61c03e6ce0c9aea6ca7808f7ca"}],{})}));
//# sourceMappingURL=service-worker.js.map

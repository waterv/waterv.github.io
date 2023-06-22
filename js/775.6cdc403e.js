"use strict";(self["webpackChunkwaterv_github_io"]=self["webpackChunkwaterv_github_io"]||[]).push([[775],{9282:function(t,e,i){i.d(e,{Z:function(){return g}});var s=i(4192),a=function(){var t=this,e=t._self._c;return e("div",[e(s.Z,{staticClass:"my-4"}),e("ul",[t._l(t.tutorials,(function(i){return[i[2]&&t.$root.locale!=i[2]?t._e():e("li",{key:i[0]},[e("v-link",{attrs:{href:i[1],target:"_blank",external:""}},[t._v(" "+t._s(i[0])+" ")])],1)]}))],2)],1)},n=[],l=i(5057),r=function(){var t=this,e=t._self._c;return e("a",{staticClass:"a",class:`${t.color}--text`},[t.external||t.icon?e(l.Z,{attrs:{small:"",color:t.color}},[t._v(" "+t._s(t.external?"mdi-link-variant":t.icon)+" ")]):t._e(),t._t("default"),e("div",{staticClass:"underline",class:t.color})],2)},o=[],c={name:"VLink",props:{color:{type:String,default:"primary"},icon:{type:String,default:""},external:{type:Boolean,default:!1}}},h=c,u=i(3736),p=(0,u.Z)(h,r,o,!1,null,"0ba4f406",null),d=p.exports,v={name:"TutorialList",components:{VLink:d},props:{tutorials:Array}},m=v,f=(0,u.Z)(m,a,n,!1,null,null,null),g=f.exports},1775:function(t,e,i){i.r(e),i.d(e,{default:function(){return S}});var s=i(3058),a=i(5223),n=i(4944),l=i(3484),r=i(3422),o=i(8714),c=i(6487),h=i(1911),u=i(1133),p=i(4397),d=i(6660),v=i(3333),m=i(6878),f=i(921),g=i(7233),b=i(3176),w=function(){var t=this,e=t._self._c;return e("div",{staticClass:"ipa-editor"},[e("v-editor",{ref:"editor",attrs:{font:"charis-sil",placeholder:"◌"},on:{focus:function(e){t.focused=!0}},model:{value:t.$root.editorValue,callback:function(e){t.$set(t.$root,"editorValue",e)},expression:"$root.editorValue"}}),e(r.Fx,[e(s.Z,{directives:[{name:"show",rawName:"v-show",value:t.focused,expression:"focused"}],staticClass:"elevation-2"},[e(a.ZB,[e(f.Z,{staticClass:"mt-2",attrs:{"center-active":"","show-arrows":""},model:{value:t.tab,callback:function(e){t.tab=e},expression:"tab"}},t._l(t.cates,(function(i){return e(v.Z,{key:i,domProps:{textContent:t._s(t.$t(`ipa.${i}`))}})})),1),e(g.Z,{attrs:{touchless:""},model:{value:t.tab,callback:function(e){t.tab=e},expression:"tab"}},t._l(t.cates,(function(i,s){return e(m.Z,{key:i},["table"==t.catesType[s]?e(p.Z,{staticClass:"no-select",attrs:{dense:""}},[e("thead",[e("tr",[e("th"),t._l(t.$range(t.$data[i][0].length/2),(function(s){return e("th",{key:s,staticClass:"text-center no-wrap",attrs:{colspan:"2"}},[t._v(" "+t._s(t.$t(`ipa.${i}Col[${s}]`))+" ")])}))],2)]),e("tbody",t._l(t.$range(t.$data[i].length),(function(s){return e("tr",{key:s},[e("th",{staticClass:"no-wrap"},[t._v(" "+t._s(t.$t(`ipa.${i}Row[${s}]`))+" ")]),t._l(t.$data[i][s],(function(i,s){return[e("td","/"==i?{key:s,staticClass:"grey",class:{"lighten-4":!t.$root.theme,"darken-3":t.$root.theme}}:" "==i?{key:s}:{directives:[{def:b.Z,name:"ripple",rawName:"v-ripple"}],key:s,staticClass:"charis-sil text-center",class:{"grey--text":t.unicodeLength(i)>1},staticStyle:{cursor:"pointer"},domProps:{textContent:t._s(i)},on:{click:function(e){return t.append(i)}}})]}))],2)})),0)]):e(l.Z,{attrs:{column:"",mandatory:""}},t._l(t.$data[i],(function(s,a){return e(n.Z,{key:a,attrs:{label:"",outlined:!!s,color:s?"":"primary"},on:{click:function(e){return t.append(s)}}},[e("span",{directives:[{name:"show",rawName:"v-show",value:t.tips||!s,expression:"tips || !char"}]},[t._v(" "+t._s(t.$t(`ipa.${i}s[${a}]`))+" ")]),e("span",{directives:[{name:"show",rawName:"v-show",value:s,expression:"char"}],staticClass:"charis-sil ml-1",domProps:{textContent:t._s(s)}})])})),1)],1)})),1)],1)],1)],1),e(u.Z,{staticClass:"mt-4",model:{value:t.panel,callback:function(e){t.panel=e},expression:"panel"}},[e(o.Z,[e(h.Z,[t._v(" "+t._s(t.$t("_.settings"))+" ")]),e(c.Z,[e(d.Z,{attrs:{label:t.$t("ipa.tips")},model:{value:t.tips,callback:function(e){t.tips=e},expression:"tips"}})],1)],1)],1),e("tutorial-list",{attrs:{tutorials:t.tutorials}})],1)},C=[],$=i(1949),y=i(9282);let _=i(5517);var x={name:"IpaEditor",components:{VEditor:$.Z,TutorialList:y.Z},data:t=>({..._,focused:!1,tab:0,panel:0,tips:t.$ls.data("boolean","ipaTips",!0)}),watch:{tips(t){this.$ls.watch("boolean","ipaTips",t)}},methods:{unicodeLength(t){let e=0;for(let i of t)e+=1;return e},append(t){this.$refs.editor.replace(t,"◌")}}},k=x,Z=i(3736),V=(0,Z.Z)(k,w,C,!1,null,null,null),S=V.exports},4397:function(t,e,i){i.d(e,{Z:function(){return l}});var s=i(1050),a=i(3276),n=i(4987),l=(0,n.Z)(a.Z).extend({name:"v-simple-table",props:{dense:Boolean,fixedHeader:Boolean,height:[Number,String]},computed:{classes(){return{"v-data-table--dense":this.dense,"v-data-table--fixed-height":!!this.height&&!this.fixedHeader,"v-data-table--fixed-header":this.fixedHeader,"v-data-table--has-top":!!this.$slots.top,"v-data-table--has-bottom":!!this.$slots.bottom,...this.themeClasses}}},methods:{genWrapper(){return this.$slots.wrapper||this.$createElement("div",{staticClass:"v-data-table__wrapper",style:{height:(0,s.kb)(this.height)}},[this.$createElement("table",this.$slots.default)])}},render(t){return t("div",{staticClass:"v-data-table",class:this.classes},[this.$slots.top,this.genWrapper(),this.$slots.bottom])}})},6660:function(t,e,i){i.d(e,{Z:function(){return c}});i(7393);var s=i(911),a=i(3316),n=i(3134),l=i(3422),r=i(6275),o=i(1050),c=s.Z.extend({name:"v-switch",directives:{Touch:n.Z},props:{inset:Boolean,loading:{type:[Boolean,String],default:!1},flat:{type:Boolean,default:!1}},computed:{classes(){return{...a.Z.options.computed.classes.call(this),"v-input--selection-controls v-input--switch":!0,"v-input--switch--flat":this.flat,"v-input--switch--inset":this.inset}},attrs(){return{"aria-checked":String(this.isActive),"aria-disabled":String(this.isDisabled),role:"switch"}},validationState(){return this.hasError&&this.shouldValidate?"error":this.hasSuccess?"success":null!==this.hasColor?this.computedColor:void 0},switchData(){return this.setTextColor(this.loading?void 0:this.validationState,{class:this.themeClasses})}},methods:{genDefaultSlot(){return[this.genSwitch(),this.genLabel()]},genSwitch(){const{title:t,...e}=this.attrs$;return this.$createElement("div",{staticClass:"v-input--selection-controls__input"},[this.genInput("checkbox",{...this.attrs,...e}),this.genRipple(this.setTextColor(this.validationState,{directives:[{name:"touch",value:{left:this.onSwipeLeft,right:this.onSwipeRight}}]})),this.$createElement("div",{staticClass:"v-input--switch__track",...this.switchData}),this.$createElement("div",{staticClass:"v-input--switch__thumb",...this.switchData},[this.genProgress()])])},genProgress(){return this.$createElement(l.b0,{},[!1===this.loading?null:this.$slots.progress||this.$createElement(r.Z,{props:{color:!0===this.loading||""===this.loading?this.color||"primary":this.loading,size:16,width:2,indeterminate:!0}})])},onSwipeLeft(){this.isActive&&this.onChange()},onSwipeRight(){this.isActive||this.onChange()},onKeydown(t){(t.keyCode===o.Do.left&&this.isActive||t.keyCode===o.Do.right&&!this.isActive)&&this.onChange()}}})},1734:function(t,e,i){var s=i(3176),a=i(144);e["Z"]=a.ZP.extend({name:"rippleable",directives:{ripple:s.Z},props:{ripple:{type:[Boolean,Object],default:!0}},methods:{genRipple(t={}){return this.ripple?(t.staticClass="v-input--selection-controls__ripple",t.directives=t.directives||[],t.directives.push({name:"ripple",value:{center:!0}}),this.$createElement("div",t)):null}}})},911:function(t,e,i){i.d(e,{X:function(){return r}});var s=i(3316),a=i(1734),n=i(564),l=i(4987);function r(t){t.preventDefault()}e["Z"]=(0,l.Z)(s.Z,a.Z,n.Z).extend({name:"selectable",model:{prop:"inputValue",event:"change"},props:{id:String,inputValue:null,falseValue:null,trueValue:null,multiple:{type:Boolean,default:null},label:String},data(){return{hasColor:this.inputValue,lazyValue:this.inputValue}},computed:{computedColor(){if(this.isActive)return this.color?this.color:this.isDark&&!this.appIsDark?"white":"primary"},isMultiple(){return!0===this.multiple||null===this.multiple&&Array.isArray(this.internalValue)},isActive(){const t=this.value,e=this.internalValue;return this.isMultiple?!!Array.isArray(e)&&e.some((e=>this.valueComparator(e,t))):void 0===this.trueValue||void 0===this.falseValue?t?this.valueComparator(t,e):Boolean(e):this.valueComparator(e,this.trueValue)},isDirty(){return this.isActive},rippleState(){return this.isDisabled||this.validationState?this.validationState:void 0}},watch:{inputValue(t){this.lazyValue=t,this.hasColor=t}},methods:{genLabel(){const t=s.Z.options.methods.genLabel.call(this);return t?(t.data.on={click:r},t):t},genInput(t,e){return this.$createElement("input",{attrs:Object.assign({"aria-checked":this.isActive.toString(),disabled:this.isDisabled,id:this.computedId,role:t,type:t},e),domProps:{value:this.value,checked:this.isActive},on:{blur:this.onBlur,change:this.onChange,focus:this.onFocus,keydown:this.onKeydown,click:r},ref:"input"})},onClick(t){this.onChange(),this.$emit("click",t)},onChange(){if(!this.isInteractive)return;const t=this.value;let e=this.internalValue;if(this.isMultiple){Array.isArray(e)||(e=[]);const i=e.length;e=e.filter((e=>!this.valueComparator(e,t))),e.length===i&&e.push(t)}else e=void 0!==this.trueValue&&void 0!==this.falseValue?this.valueComparator(e,this.trueValue)?this.falseValue:this.trueValue:t?this.valueComparator(e,t)?null:t:!e;this.validate(!0,e),this.internalValue=e,this.hasColor=e},onFocus(t){this.isFocused=!0,this.$emit("focus",t)},onBlur(t){this.isFocused=!1,this.$emit("blur",t)},onKeydown(t){}}})},7393:function(){},5517:function(t){t.exports=JSON.parse('{"consonant":[["m̥","m"," ","ɱ"," "," ","n̥","n"," "," ","ɳ̊","ɳ"," "," ","ɲ̊","ɲ","ŋ̊","ŋ"," ","ɴ","/","/","/","/","/","/"],["p","b","p̪","b̪"," "," ","t","d"," "," ","ʈ","ɖ"," "," ","c","ɟ","k","ɡ","q","ɢ"," ","/","ʡ","/","ʔ","/"],["/","/","/","/"," "," ","s","z","ʃ","ʒ","ʂ","ʐ","ɕ","ʑ","/","/","/","/","/","/","/","/","/","/","/","/"],["ɸ","β","f","v","θ","ð","θ̠","ð̠","ɹ̠̊˔","ɹ̠˔"," ","ɻ˔"," "," ","ç","ʝ","x","ɣ","χ","ʁ","ħ","ʕ","ʜ","ʢ","h","ɦ"],[" "," ","ʋ̥","ʋ"," "," ","ɹ̥","ɹ"," "," ","ɻ̊","ɻ"," "," ","j̊","j","ɰ̊","ɰ"," "," "," "," "," "," "," ","ʔ̞"],[" ","ⱱ̟"," ","ⱱ"," "," ","ɾ̥","ɾ"," "," ","ɽ̊","ɽ"," "," "," "," ","/","/"," ","ɢ̆"," "," "," ","ʡ̆","/","/"],["ʙ̥","ʙ"," "," "," "," ","r̥","r"," "," ","ɽ̊r̥","ɽr"," "," "," "," ","/","/","ʀ̥","ʀ"," "," "," "," ","/","/"],["/","/","/","/"," "," ","ɬ","ɮ"," "," ","ɭ̊˔","ɭ˔"," "," ","ʎ̝̊","ʎ̝","ʟ̝̊","ʟ̝"," "," ","/","/"," "," ","/","/"],["/","/","/","/"," "," ","l̥","l"," "," ","ɭ̊","ɭ"," "," ","ʎ̥","ʎ","ʟ̥","ʟ"," ","ʟ̠","/","/"," "," ","/","/"],["/","/","/","/"," "," "," ","ɺ"," "," "," ","ɭ̆"," "," "," ","ʎ̆"," ","ʟ̆"," "," ","/","/"," "," ","/","/"]],"nonpulmonic":["","","ʘ","ǀ","ǃ","ǂ","ǁ","","ɓ","ɗ","ᶑ","ʄ","ɠ","ʛ","","◌ʼ","","◌͡","◌͜","","ʍ","w","ɥ","ɧ"],"vowel":[["i","y"," "," ","ɨ","ʉ"," "," ","ɯ","u"],[" "," ","ɪ","ʏ","ɨ̞","ʉ̞","ɯ̞","ʊ"," "," "],[" ","e","ø"," ","ɘ","ɵ"," "," ","ɤ","o"],[" "," ","e̞","ø̞"," ","ə"," "," ","ɤ̞","o̞"],[" "," ","ɛ","œ"," ","ɜ","ɞ"," ","ʌ","ɔ"],[" "," "," ","æ"," "," ","ɐ"," "," "," "],[" "," "," "," ","a","ɶ","ä","ɒ̈","ɑ","ɒ"]],"diacritic":["◌","","◌̩","◌̍","◌̯","◌̑","","◌ʰ","◌ⁿ","◌ˡ","◌̚","","◌̥","◌̊","◌̬","◌̌","◌̤","◌̰","","◌̪","◌̼","◌̺","◌̻","◌̟","◌˖","◌̠","◌˗","◌̈","◌̽","◌̝","◌˔","◌̞","◌˕","","◌̹","◌͗","◌̜","◌͑","◌ʷ","◌ʲ","◌ˠ","◌ˤ","◌̴","◌̘","◌̙","◌̃","◌˞"],"suprasegmental":["","ˈ","ˌ","ː","ˑ","◌̆",".","‿","","|","‖","↗","↘","","","◌̋","˥","◌́","˦","◌̄","˧","◌̀","˨","◌̏","˩","ꜜ","ꜛ","","◌̌","˩˥","◌̂","˥˩","◌᷄","˧˥","◌᷅","˩˧","◌᷈","˧˦˨"],"extIpaConsonant":[[" "," "," "," ","p͇","b͇","p͆","b͆","/","/","t̼","d̼","t̪͆","d̪͆"," "," "," "," "," "," ","𝼃","𝼁","/","/","ꞯ","𝼂"],[" "," "," "," ","m͇̊","m͇","m̥͆","m͆","/","/","n̼̊","n̼","n̪̥͆","n̪͆"," "," "," "," "," "," "," ","𝼇","/","/","/","/"],[" "," "," "," "," "," "," "," ","/","/"," ","r̼"," ","r̪͆"," "," "," "," ","/","/","/","/","𝼀","𝼀̬","/","/"],[" "," "," "," ","f͇","v͇","f͆","v͆","h̪͆","ɦ̪͆","θ̼","ð̼","θ̪͆","ð̪͆","θ͇","ð͇"," "," "," "," "," "," ","ʩ","ʩ̬"," "," "],["/","/","/","/","/","/","/","/","/","/","ɬ̼","ɮ̼","ɬ̪͆","ɮ̪͆"," "," ","ꞎ","𝼅","𝼆","𝼆̬","𝼄","𝼄̬","/","/","/","/"],["/","/","/","/","/","/","/","/","/","/"," "," "," "," ","ʪ","ʫ"," "," "," "," "," "," ","/","/","/","/"],["m̥͋","m͋","ɱ̥͋","ɱ͋"," "," "," "," ","/","/"," "," "," "," ","n̥͋","n͋","ɳ̥͋","ɳ͋","ɲ̥͋","ɲ͋","ŋ̥͋","ŋ͋","/","/","/","/"],["/","/","/","/","/","/","/","/","/","/"," ","l̼"," ","l̪͆"," "," "," "," "," "," "," "," ","/","/","/","/"],["ʬ"," "," "," "," "," "," "," ","ʭ"," "," "," "," "," ","¡"," "," "," "," "," "," "," ","/","/","/","/"]],"extIpaDiacritic":["","↓","↑","","ʰ◌","◌˭","","◌͋","◌͌","◌͊","","◌͈","◌͉","","◌͆","◌̪͆","◌͇","◌͍","◌͎","◌̈","◌͕","◌͔","","◌͢","\\\\","","◌̬","₍◌","◌₎","ˬ"],"extIpaOther":["𝑓","𝑝","(◌)","{◌}","⸨◌⸩","","◯","Ⓒ","Ⓕ","Ⓖ","Ⓚ","Ⓛ","Ⓝ","Ⓟ","Ⓡ","Ⓢ","Ⓣ","Ⓥ"],"cates":["consonant","nonpulmonic","vowel","diacritic","suprasegmental","extIpaConsonant","extIpaDiacritic","extIpaOther"],"catesType":["table","chip","table","chip","chip","table","chip","chip"],"tutorials":[["国际语音学会 > 国际音标与国际音标表 [ENG]","https://www.internationalphoneticassociation.org/content/ipa-chart","zh-CN"],["IPA > The International Phonetic Alphabet and the IPA Chart","https://www.internationalphoneticassociation.org/content/ipa-chart","en-US"],["国际临床语音学及语言学协会 > 期刊和出版物 [ENG]","https://www.icpla.info/journal-publications","zh-CN"],["ICPLA > Journal & Publications","https://www.icpla.info/journal-publications","en-US"]]}')}}]);
//# sourceMappingURL=775.6cdc403e.js.map
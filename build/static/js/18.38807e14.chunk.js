(this["webpackJsonpisomorphic-servers"]=this["webpackJsonpisomorphic-servers"]||[]).push([[18],{718:function(e,t,n){"use strict";var a=n(0),r=n.n(a),o=n(44);function i(){var e=Object(o.a)(["\n  padding: 40px 20px;\n  display: flex;\n  flex-flow: column;\n  overflow: hidden;\n  @media only screen and (max-width: 767px) {\n    padding: 50px 20px;\n  }\n\n  @media (max-width: 580px) {\n    padding: 15px;\n  }\n"]);return i=function(){return e},e}var c=n(31).b.div(i());t.a=function(e){return r.a.createElement(c,Object.assign({className:null!=e.className?"".concat(e.className," isoLayoutContentWrapper"):"isoLayoutContentWrapper"},e),e.children)}},770:function(e,t){},822:function(e,t){},823:function(e,t){},928:function(e,t,n){"use strict";n.r(t);n(539);var a=n(537),r=(n(580),n(578)),o=(n(541),n(542)),i=(n(582),n(583)),c=(n(544),n(545)),l=(n(563),n(566)),u=(n(572),n(575)),s=n(717),p=n(0),d=n.n(p),f=n(29),m=n(30),h=n(37),g=n(36),b=n(38),O=n(44),j=n(31),v=n(5);function y(){var e=Object(O.a)(["\n  align-content: flex-start;\n"]);return y=function(){return e},e}function E(){var e=Object(O.a)(["\n  width: 100%;\n  height: ",";\n  padding: ",";\n  background-color: #ffffff;\n  border: 1px solid ",";\n\n  canvas {\n    width: 100% !important;\n    height: 100% !important;\n  }\n"]);return E=function(){return e},e}function x(){var e=Object(O.a)(["\n  margin: 0 10px;\n\n  @media only screen and (max-width: 767) {\n    margin-right: 0 !important;\n  }\n"]);return x=function(){return e},e}var C=j.b.div(x()),w=(j.b.div(E(),(function(e){return e.height?"".concat(e.height,"px"):"100%"}),(function(e){return e.padding?e.padding:"30px"}),Object(v.palette)("border",2)),j.b.div(y()),function(e){function t(){return Object(f.a)(this,t),Object(h.a)(this,Object(g.a)(t).apply(this,arguments))}return Object(b.a)(t,e),Object(m.a)(t,[{key:"render",value:function(){var e=this.props,t=e.width,n=e.gutterTop,a=e.gutterRight,r=e.gutterBottom,o=e.gutterLeft,i=e.padding,c=e.bgColor,l=e.children,u={width:t,marginTop:n,marginRight:a,marginBottom:r,marginLeft:o,padding:i,backgroundColor:c,borderBottomLeftRadius:30};return d.a.createElement(C,{className:"isoWidgetsWrapper",style:u},l)}}]),t}(p.Component));function S(){var e=Object(O.a)(["\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  padding: 0px;\n  background-color: #ffffff;\n  overflow: hidden;\n  border: 1px solid ",";\n  border-radius: 25px;\n  margin: auto;\n  text-align: center;\n\n  .footer {\n    padding: 0px;\n    height: 50px;\n    left: 0;\n    bottom: 0;\n    width: 100%;\n    background-image: url('/images/icons/footer.png');\n    background-position: center;\n    background-repeat: no-repeat;\n    background-size: cover;\n    color: white;\n    text-align: center;\n    font-size: 150%;\n  }\n  .isoContent {\n  }\n"]);return S=function(){return e},e}var T=j.b.div(S(),Object(v.palette)("border",2)),R=n(768),k=function(e){function t(){return Object(f.a)(this,t),Object(h.a)(this,Object(g.a)(t).apply(this,arguments))}return Object(b.a)(t,e),Object(m.a)(t,[{key:"render",value:function(){var e=this.props,t=e.options,n=e.data,a=e.chartType,r=e.title;return d.a.createElement(T,{className:"isoSaleWidget"},d.a.createElement(R.a,{className:"isoContent",height:300,width:"100%",chartType:a,loader:d.a.createElement("div",null,"Loading Chart"),data:n,options:t,legendToggle:!0}),d.a.createElement("div",{class:"footer"},d.a.createElement("span",{style:{fontWeight:"bold"}},r)))}}]),t}(p.Component);function Y(){var e=Object(O.a)(["\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  padding: 30px;\n  background-color: #ffffff;\n  overflow: hidden;\n  border: 1px solid ",";\n  border-radius: 25px;\n  .isoSaleLabel {\n    font-size: 14px;\n    font-weight: 700;\n    line-height: 1.2;\n    text-transform: uppercase;\n    color: ",";\n    margin: 0 0 20px;\n  }\n\n  .isoSalePrice {\n    font-size: 28px;\n    font-weight: 300;\n    line-height: 1.2;\n    margin: 0 0 20px;\n  }\n\n  .isoSaleDetails {\n    font-size: 13px;\n    font-weight: 400;\n    line-height: 1.5;\n    color: ",";\n    margin: 0;\n  }\n"]);return Y=function(){return e},e}var A=j.b.div(Y(),Object(v.palette)("border",2),Object(v.palette)("text",0),Object(v.palette)("text",2)),D=function(e){function t(){return Object(f.a)(this,t),Object(h.a)(this,Object(g.a)(t).apply(this,arguments))}return Object(b.a)(t,e),Object(m.a)(t,[{key:"render",value:function(){var e=this.props,t=e.options,n=e.data,a=e.chartType;return d.a.createElement(A,{className:"isoSaleWidget"},d.a.createElement(R.a,{height:300,chartType:a,loader:d.a.createElement("div",null,"Loading Chart"),data:n,options:t,legendToggle:!0}))}}]),t}(p.Component),V={rowStyle:{width:"100%",display:"flex",flexFlow:"row wrap",marginBottom:"16px"},colStyle:{marginBottom:"16px"},gutter:16},M=n(50),P=n(19),L=n(17),N=n(718),I=n(125),B=n.n(I),U=n(820),_=n.n(U),W=n(824),F=n.n(W);function z(){var e=Object(p.useState)(!0),t=Object(s.a)(e,2),n=t[0],f=t[1],m=Object(p.useState)(!0),h=Object(s.a)(m,2),g=h[0],b=h[1],O=Object(p.useState)(!0),j=Object(s.a)(O,2),v=j[0],y=j[1],E=Object(p.useState)(!0),x=Object(s.a)(E,2),C=x[0],S=x[1],T=Object(p.useState)(!0),R=Object(s.a)(T,2),Y=R[0],A=R[1],I=Object(p.useState)(!0),U=Object(s.a)(I,2),W=U[0],z=U[1],G=Object(p.useState)([]),J=Object(s.a)(G,2),X=J[0],$=J[1],q=Object(p.useState)([]),H=Object(s.a)(q,2),K=H[0],Q=H[1],Z=Object(p.useState)([]),ee=Object(s.a)(Z,2),te=ee[0],ne=ee[1],ae=Object(p.useState)([]),re=Object(s.a)(ae,2),oe=re[0],ie=re[1],ce=Object(p.useState)([]),le=Object(s.a)(ce,2),ue=le[0],se=le[1],pe=Object(p.useState)([]),de=Object(s.a)(pe,2),fe=de[0],me=de[1],he=Object(p.useState)([]),ge=Object(s.a)(he,2),be=ge[0],Oe=ge[1],je=Object(p.useState)([B()().subtract(1,"months").format(),B()().format()]),ve=Object(s.a)(je,2),ye=ve[0],Ee=ve[1];Object(p.useEffect)((function(){f(!0),P.a.get("report/turnaroundTime",ye).then((function(e){if(200===e.status){var t=e.data.reduce((function(e,t){return e+B()(t.updatedAt).diff(B()(t.createdAt),"days")}),0)/e.data.length,n=e.data.length/90;$([["Label","Value"],["Turnaround",t]]),Q([["Label","Value"],["Per Day",n]]),f(!1)}else Object(L.a)("error",e.error.message)})).catch((function(e){return console.log(e)}))}),[ye]),Object(p.useEffect)((function(){b(!0),P.a.get("report/approvedClaimedCountByType",ye).then((function(e){if(200===e.status){var t=e.data.map((function(e){return[e.policyType,e.policyTypeCount]}));t.unshift(["Type","Count"]),ne(t),b(!1)}else Object(L.a)("error","Something wrong in retrieving CSV")})).catch((function(e){return console.log(e)}))}),[ye]),Object(p.useEffect)((function(){y(!0),P.a.get("report/USDApproved",ye).then((function(e){if(200===e.status){var t=e.data.map((function(e){return{approved:e.ClaimInfoVisits.reduce((function(e,t){return e+=t.BillingInfos.reduce((function(e,t){return e+t.approved}),0)/t.billingRate}),0)}})),n=t.length,a=t.filter((function(e){return e.approved>250})).length,r=[];r.push(["Amount","Count"]),r.push(["greater or equal then $250",n-a]),r.push(["less than $250",a]),ie(r),y(!1)}else Object(L.a)("error","Something wrong in retrieving CSV")})).catch((function(e){return console.log(e)}))}),[ye]),Object(p.useEffect)((function(){S(!0),P.a.get("report/claimCount",ye).then((function(e){if(200===e.status){var t=e.data.map((function(e){return[B()(e.month).format("MM-YYYY"),e.prCount,e.cpCount]}));t.unshift(["Month","pr Count","cp Count"]),se(t),S(!1)}else Object(L.a)("error","Something wrong in retrieving CSV")})).catch((function(e){return console.log(e)}))}),[ye]),Object(p.useEffect)((function(){A(!0),P.a.get("report/USDApproved",ye).then((function(e){if(200===e.status){var t=e.data.map((function(e){return{month:B()(e.createdAt).format("MM-YYYY"),approved:e.ClaimInfoVisits.reduce((function(e,t){return e+=t.BillingInfos.reduce((function(e,t){return e+t.approved}),0)/t.billingRate}),0)}})).reduce((function(e,t){var n=e.findIndex((function(e){return e[0]===t.month}));return n<0?e.push([t.month,t.approved]):e[n][1]+=t.approved,e}),[]);t.unshift(["Month","USD total"]),me(t),A(!1)}else Object(L.a)("error","Something wrong in retrieving CSV")})).catch((function(e){return console.log(e)}))}),[ye]),Object(p.useEffect)((function(){z(!0),P.a.get("report/USDRejected",ye).then((function(e){if(200===e.status){var t=e.data.map((function(e){return{month:B()(e.createdAt).format("MM-YYYY"),rejected:e.ClaimInfoVisits.reduce((function(e,t){return e+=t.BillingInfos.reduce((function(e,t){return e+(t.value-t.approved)}),0)/t.billingRate}),0)}})).reduce((function(e,t){var n=e.findIndex((function(e){return e[0]===t.month}));return n<0?e.push([t.month,t.rejected]):e[n][1]+=t.rejected,e}),[]);t.unshift(["Month","USD total"]),Oe(t),z(!1)}else Object(L.a)("error","Something wrong in retrieving CSV")})).catch((function(e){return console.log(e)}))}),[ye]);var xe=Object(p.useRef)(null),Ce=Object(p.useRef)(null),we=Object(p.useRef)(null),Se=V.rowStyle,Te=V.colStyle;return console.log("heheheh",W||Y||Y),W||Y||C||v||g||n?d.a.createElement("div",{style:{marginTop:"20%",display:"flex",alignItems:"center",justifyContent:"center"}},d.a.createElement(u.a,{size:"large"})):d.a.createElement(N.a,null,d.a.createElement(o.a,{style:Se},d.a.createElement(c.a,null,d.a.createElement(l.a.Title,null,"Reporting")),d.a.createElement(i.a,null)),d.a.createElement(o.a,{style:Se,type:"flex",justify:"space-around"},d.a.createElement(c.a,null,d.a.createElement(r.a.RangePicker,{defaultValue:[B()().subtract(1,"months"),B()()],format:"DD MMM YYYY",ref:Ce}),d.a.createElement(a.a,{type:"primary",onClick:function(){var e=Ce.current.picker.state.value.map((function(e){return e.format()}));e.push("claims"),P.a.get("report/csv",e).then((function(e){if(console.log("response",e),200===e.status){var t=_.a.utils.json_to_sheet(e.data),n=_.a.utils.book_new();_.a.utils.book_append_sheet(n,t,"report"),_.a.writeFile(n,"claims report.xlsb")}else Object(L.a)("error","Something wrong in retrieving CSV")})).catch((function(e){return console.log(e)}))}},"EXPORT MONTHLY REPORT")),d.a.createElement(c.a,null,d.a.createElement(r.a.RangePicker,{defaultValue:[B()().subtract(1,"months"),B()()],format:"DD MMM YYYY",ref:we}),d.a.createElement(a.a,{type:"primary",onClick:function(){var e=we.current.picker.state.value.map((function(e){return e.format()}));e.push("pendings"),P.a.get("report/csv",e).then((function(e){if(console.log("response",e),200===e.status){var t=_.a.utils.json_to_sheet(e.data),n=_.a.utils.book_new();_.a.utils.book_append_sheet(n,t,"report"),_.a.writeFile(n,"pendings report.xlsb")}else Object(L.a)("error","Something wrong in retrieving CSV")})).catch((function(e){return console.log(e)}))}},"EXPORT CURRENT PENDING REPORT"))),d.a.createElement("div",{style:{border:"1px solid white",padding:"35px",borderRadius:"25px"}},d.a.createElement(o.a,{style:Se,type:"flex",justify:"space-around"},d.a.createElement(c.a,null,d.a.createElement(r.a.RangePicker,{defaultValue:[B()().subtract(1,"months"),B()()],format:"DD MMM YYYY",ref:xe}),d.a.createElement(a.a,{type:"primary",onClick:function(){Ee(xe.current.picker.state.value.map((function(e){return e.format()})))}},"Submit")),d.a.createElement(c.a,null,d.a.createElement(a.a,{type:"primary",onClick:function(){for(var e=document.getElementsByClassName("isoSaleWidget"),t=0;t<e.length;t++)F()(e[t]).then((function(e){var t=document.createElement("a");t.href=e.toDataURL(),t.download="chart.png",t.click()}))}},"DOWNLOAD IMAGES"))),d.a.createElement(o.a,{style:Se,gutter:0,justify:"start"},d.a.createElement(c.a,{lg:6,md:12,sm:12,xs:24,style:Te},d.a.createElement(w,{gutterLeft:0},d.a.createElement(k,{data:X,chartType:"Gauge",label:d.a.createElement(M.a,{id:"widget.salewidget1.label"}),title:"TURNAROUND",options:{title:"turnaround",redFrom:90,redTo:100,yellowFrom:75,yellowTo:90,minorTicks:5,forceIFrame:!0}}))),d.a.createElement(c.a,{lg:6,md:12,sm:12,xs:24,style:Te},d.a.createElement(w,null,d.a.createElement(k,{title:"PROCESSED PER DAY",data:K,chartType:"Gauge",label:d.a.createElement(M.a,{id:"widget.salewidget1.label"}),options:{title:"Per Day",redFrom:90,redTo:100,yellowFrom:75,yellowTo:90,minorTicks:5}}))),d.a.createElement(c.a,{lg:6,md:12,sm:12,xs:24,style:Te},d.a.createElement(w,null,d.a.createElement(k,{title:"APPROVED BY POLICY",data:te,chartType:"PieChart",options:{title:"Approved Claims Count: Split by Type",is3D:!1}}))),d.a.createElement(c.a,{lg:6,md:12,sm:12,xs:24,style:Te},d.a.createElement(w,null,d.a.createElement(k,{title:"APPROVED BY VALUE",data:oe,chartType:"PieChart",options:{title:"Approved Claims Count: Split by Value",is3D:!1}})))),d.a.createElement(o.a,{style:Se},d.a.createElement(D,{data:ue,chartType:"ColumnChart",options:{title:"Claims Count",chartArea:{width:"30%"},hAxis:{title:"Month",minValue:0},vAxis:{title:"Count"}}})),d.a.createElement(o.a,{style:Se},d.a.createElement(D,{data:fe,chartType:"ColumnChart",options:{title:"USD Approved",chartArea:{width:"30%"},hAxis:{title:"Month",minValue:0},vAxis:{title:"Amount",minValue:0}}})),d.a.createElement(o.a,{style:Se},d.a.createElement(D,{data:be,chartType:"ColumnChart",options:{title:"USD Reject",chartArea:{width:"30%"},hAxis:{title:"Month",minValue:0},vAxis:{title:"Amount",minValue:0}}}))))}n.d(t,"default",(function(){return z}))}}]);
//# sourceMappingURL=18.38807e14.chunk.js.map
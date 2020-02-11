(this["webpackJsonpisomorphic-servers"]=this["webpackJsonpisomorphic-servers"]||[]).push([[22],{554:function(t,e,n){"use strict";var a={rowStyle:{width:"100%",marginBottom:"16px"},colStyle:{marginBottom:"16px"},gutter:16};e.a=a},678:function(t,e,n){"use strict";var a=n(0),r=n.n(a),i=n(44);function o(){var t=Object(i.a)(["\n  padding: 40px 20px;\n  display: flex;\n  flex-flow: column;\n  overflow: hidden;\n  @media only screen and (max-width: 767px) {\n    padding: 50px 20px;\n  }\n\n  @media (max-width: 580px) {\n    padding: 15px;\n  }\n"]);return o=function(){return t},t}var c=n(29).b.div(o());e.a=function(t){return r.a.createElement(c,Object.assign({className:null!=t.className?"".concat(t.className," isoLayoutContentWrapper"):"isoLayoutContentWrapper"},t),t.children)}},757:function(t,e){},849:function(t,e){},850:function(t,e){},961:function(t,e,n){"use strict";n.r(e);n(536);var a=n(535),r=(n(587),n(586)),i=(n(537),n(538)),o=(n(578),n(580)),c=(n(539),n(540)),l=(n(559),n(561)),u=(n(575),n(576)),s=n(552),d=n(0),f=n.n(d),p=n(30),m=n(31),h=n(38),g=n(37),b=n(39),y=n(44),O=n(29),v=n(5);function x(){var t=Object(y.a)(["\n  align-content: flex-start;\n"]);return x=function(){return t},t}function j(){var t=Object(y.a)(["\n  width: 100%;\n  height: ",";\n  padding: ",";\n  background-color: #ffffff;\n  border: 1px solid ",";\n\n  canvas {\n    width: 100% !important;\n    height: 100% !important;\n  }\n"]);return j=function(){return t},t}function E(){var t=Object(y.a)(["\n  margin: 0 10px;\n\n  @media only screen and (max-width: 767) {\n    margin-right: 0 !important;\n  }\n"]);return E=function(){return t},t}var w=O.b.div(E()),S=(O.b.div(j(),(function(t){return t.height?"".concat(t.height,"px"):"100%"}),(function(t){return t.padding?t.padding:"30px"}),Object(v.palette)("border",2)),O.b.div(x()),function(t){function e(){return Object(p.a)(this,e),Object(h.a)(this,Object(g.a)(e).apply(this,arguments))}return Object(b.a)(e,t),Object(m.a)(e,[{key:"render",value:function(){var t=this.props,e=t.width,n=t.gutterTop,a=t.gutterRight,r=t.gutterBottom,i=t.gutterLeft,o=t.padding,c=t.bgColor,l=t.children,u={width:e,marginTop:n,marginRight:a,marginBottom:r,marginLeft:i,padding:o,backgroundColor:c,borderBottomLeftRadius:30};return f.a.createElement(w,{className:"isoWidgetsWrapper",style:u},l)}}]),e}(d.Component));function C(){var t=Object(y.a)(["\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  padding: 0px;\n  background-color: #ffffff;\n  overflow: hidden;\n  border: 1px solid ",";\n  border-radius: 25px;\n  margin: auto;\n  text-align: center;\n\n  .footer {\n    padding: 0px;\n    height: 50px;\n    left: 0;\n    bottom: 0;\n    width: 100%;\n    background-image: url('/images/icons/footer.png');\n    background-position: center;\n    background-repeat: no-repeat;\n    background-size: cover;\n    color: white;\n    text-align: center;\n    font-size: 150%;\n  }\n  .isoContent {\n  }\n"]);return C=function(){return t},t}var k=O.b.div(C(),Object(v.palette)("border",2)),T=n(755),A=function(t){function e(){return Object(p.a)(this,e),Object(h.a)(this,Object(g.a)(e).apply(this,arguments))}return Object(b.a)(e,t),Object(m.a)(e,[{key:"render",value:function(){var t=this.props,e=t.options,n=t.data,a=t.chartType,r=t.title;return f.a.createElement(k,{className:"isoSaleWidget"},f.a.createElement(T.a,{className:"isoContent",height:300,width:"100%",chartType:a,loader:f.a.createElement("div",null,"Loading Chart"),data:n,options:e,legendToggle:!0}),f.a.createElement("div",{className:"footer"},f.a.createElement("span",{style:{fontWeight:"bold"}},r)))}}]),e}(d.Component);function D(){var t=Object(y.a)(["\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  padding: 30px;\n  background-color: #ffffff;\n  overflow: hidden;\n  border: 1px solid ",";\n  border-radius: 25px;\n  .isoSaleLabel {\n    font-size: 14px;\n    font-weight: 700;\n    line-height: 1.2;\n    text-transform: uppercase;\n    color: ",";\n    margin: 0 0 20px;\n  }\n\n  .isoSalePrice {\n    font-size: 28px;\n    font-weight: 300;\n    line-height: 1.2;\n    margin: 0 0 20px;\n  }\n\n  .isoSaleDetails {\n    font-size: 13px;\n    font-weight: 400;\n    line-height: 1.5;\n    color: ",";\n    margin: 0;\n  }\n"]);return D=function(){return t},t}var R=O.b.div(D(),Object(v.palette)("border",2),Object(v.palette)("text",0),Object(v.palette)("text",2)),Y=function(t){function e(){return Object(p.a)(this,e),Object(h.a)(this,Object(g.a)(e).apply(this,arguments))}return Object(b.a)(e,t),Object(m.a)(e,[{key:"render",value:function(){var t=this.props,e=t.options,n=t.data,a=t.chartType;return f.a.createElement(R,{className:"isoSaleWidget"},f.a.createElement(T.a,{height:300,chartType:a,loader:f.a.createElement("div",null,"Loading Chart"),data:n,options:e,legendToggle:!0}))}}]),e}(d.Component);function L(){var t=Object(y.a)(["\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  background-color: #ffffff;\n  padding: 30px;\n  overflow: hidden;\n  border: 1px solid ",";\n  border-radius: 25px;\n  .isoSaleLabel {\n    font-size: 14px;\n    font-weight: 700;\n    line-height: 1.2;\n    text-transform: uppercase;\n    color: ",";\n    margin: 0 0 20px;\n  }\n\n  .isoSalePrice {\n    font-size: 28px;\n    font-weight: 300;\n    line-height: 1.2;\n    margin: 0 0 20px;\n  }\n\n  .isoSaleDetails {\n    font-size: 13px;\n    font-weight: 400;\n    line-height: 1.5;\n    color: ",";\n    margin: 0;\n  }\n"]);return L=function(){return t},t}var P=O.b.div(L(),Object(v.palette)("border",2),Object(v.palette)("text",0),Object(v.palette)("text",2)),M=n(125),V=n.n(M),N=n(950),W=function(t){var e=Object(d.useRef)(null),n=Object(d.useState)(window.innerWidth),a=Object(s.a)(n,2),r=a[0],i=a[1];return Object(d.useEffect)((function(){function t(){i(window.innerWidth)}return window.addEventListener("resize",t),function(){return window.removeEventListener("resize",t)}}),[r]),Object(d.useEffect)((function(){var n=N.f(e.current),a=e.current.parentNode.clientWidth-80-80,r=t.height-160,i=n.append("g").attr("transform","translate(".concat(80,", ").concat(80,")")),o=N.c().range([0,a]).domain(t.data.map((function(t){return V()(t.month).format("L")}))).padding(.4),c=Object.keys(t.data[0]);c.shift();var l=N.c().range([0,o.bandwidth()]).domain(c),u=N.d().range([r,0]).domain([0,500]),s=N.e(["#d6e9c6","#bce8f1","#faebcc","#ebccd1"]);i.append("g").attr("transform","translate(0, ".concat(r,")")).call(N.a(o)),i.append("g").call(N.b(u)),i.append("g").attr("class","grid").call(N.b().scale(u).tickSize(-a,0,0).tickFormat(""));var d,f=["ApprovedCount","DeclinedCount"],p=i.append("g").selectAll("g").data(t.data).join("g").attr("transform",(function(t){return"translate(".concat(o(V()(t.month).format("L")),",0)")})).selectAll("rect").data((function(t){return f.map((function(e){return{key:e,value:t[e]}}))})).enter();p.append("rect").attr("x",(function(t){return l(t.key)})).attr("y",(function(t){return u(t.value)})).attr("width",l.bandwidth()).attr("height",(function(t){return u(0)-u(t.value)})).attr("fill",(function(t){return s(t.key)})).attr("stroke","#31708f").attr("stroke-width","1").on("mouseenter",(function(t,e){d=this.style.fill,N.f(this).transition().duration(300).style("fill","#3c763d")})).on("mouseleave",(function(){N.g(".value").attr("opacity",1),N.f(this).transition().duration(300).attr("opacity",1).style("fill",d)})),p.append("text").attr("class","value").attr("x",(function(t){return l(t.key)+l.bandwidth()/2})).attr("y",(function(t){return u(t.value)})).attr("height",5).attr("text-anchor","middle").text((function(t){return"".concat(t.value)})),n.append("text").attr("class","label").attr("x",-r/2-80).attr("y",80/2.4).attr("transform","rotate(-90)").attr("text-anchor","middle").text("Count"),n.append("text").attr("class","label").attr("x",a/2+80).attr("y",r+136).attr("text-anchor","middle").text("Month"),n.append("text").attr("class","title").attr("x",a/2+80).attr("y",40).attr("text-anchor","middle").text("Claim Count");var m=n.append("g").attr("class","legend").attr("transform","translate("+a+", 0)");return m.selectAll("rect").data(f).enter().append("rect").attr("x",0).attr("y",(function(t,e){return 18*e})).attr("width",12).attr("height",12).attr("fill",(function(t,e){return s(t)})),m.selectAll("text").data(f).enter().append("text").text((function(t){return t})).attr("x",18).attr("y",(function(t,e){return 18*e})).attr("text-anchor","start").attr("alignment-baseline","hanging"),function(){n.selectAll("*").remove()}}),[t.data,t.height,r]),f.a.createElement(P,{className:"isoSaleWidget"},f.a.createElement("svg",{width:t.width,height:t.height,ref:e}))},z=n(554),U=n(51),B=n(19),_=n(17),F=n(678),I=n(847),G=n.n(I),J=n(851),X=n.n(J);function $(){var t=Object(d.useState)(!0),e=Object(s.a)(t,2),n=e[0],p=e[1],m=Object(d.useState)(!0),h=Object(s.a)(m,2),g=h[0],b=h[1],y=Object(d.useState)(!0),O=Object(s.a)(y,2),v=O[0],x=O[1],j=Object(d.useState)(!0),E=Object(s.a)(j,2),w=E[0],C=E[1],k=Object(d.useState)(!0),T=Object(s.a)(k,2),D=T[0],R=T[1],L=Object(d.useState)(!0),P=Object(s.a)(L,2),M=P[0],N=P[1],I=Object(d.useState)([]),J=Object(s.a)(I,2),$=J[0],q=J[1],H=Object(d.useState)([]),K=Object(s.a)(H,2),Q=K[0],Z=K[1],tt=Object(d.useState)([]),et=Object(s.a)(tt,2),nt=et[0],at=et[1],rt=Object(d.useState)([]),it=Object(s.a)(rt,2),ot=it[0],ct=it[1],lt=Object(d.useState)([]),ut=Object(s.a)(lt,2),st=ut[0],dt=ut[1],ft=Object(d.useState)([]),pt=Object(s.a)(ft,2),mt=pt[0],ht=pt[1],gt=Object(d.useState)([]),bt=Object(s.a)(gt,2),yt=bt[0],Ot=bt[1],vt=Object(d.useState)([V()().subtract(2,"years").format(),V()().format()]),xt=Object(s.a)(vt,2),jt=xt[0],Et=xt[1],wt=Object(d.useState)([V()().subtract(2,"years"),V()()]),St=Object(s.a)(wt,2),Ct=St[0],kt=St[1];Object(d.useEffect)((function(){p(!0),B.a.get("report/turnaroundTime",jt).then((function(t){if(200===t.status){var e=t.data.reduce((function(t,e){return t+V()(e.updatedAt).diff(V()(e.createdAt),"days")}),0)/t.data.length,n=t.data.length/V()(jt[1]).diff(V()(jt[0]),"days");q([["Label","Value"],["Turnaround",e]]),Z([["Label","Value"],["Per Day",n]]),p(!1)}else Object(_.a)("error",t.error.message)})).catch((function(t){return console.log(t)}))}),[jt]),Object(d.useEffect)((function(){b(!0),B.a.get("report/approvedClaimedCountByType",jt).then((function(t){if(200===t.status){var e=t.data.map((function(t){return[t.policyType,t.policyTypeCount]}));e.unshift(["Type","Count"]),at(e),b(!1)}else Object(_.a)("error","Something wrong in retrieving CSV")})).catch((function(t){return console.log(t)}))}),[jt]),Object(d.useEffect)((function(){x(!1),B.a.get("report/approvedClaimedCountByValue",jt).then((function(t){if(200===t.status){var e=[];e.push(["Amount","Count"]),e.push(["greater then $250",t.data[0].gt]),e.push(["less  or equal than $250",t.data[0].lte]),ct(e),x(!1)}else Object(_.a)("error","Something wrong in retrieving CSV")})).catch((function(t){return console.log(t)}))}),[jt]),Object(d.useEffect)((function(){C(!0),B.a.get("report/claimCount",jt).then((function(t){200===t.status?(dt(t.data),C(!1)):Object(_.a)("error","Something wrong in retrieving CSV")})).catch((function(t){return console.log(t)}))}),[jt]),Object(d.useEffect)((function(){R(!0),B.a.get("report/USDApproved",jt).then((function(t){if(200===t.status){var e=t.data.map((function(t){return[V()(t.month).format("MM-YYYY"),t.sum]}));e.unshift(["Month","USD total"]),ht(e),R(!1)}else Object(_.a)("error","Something wrong in retrieving CSV")})).catch((function(t){return console.log(t)}))}),[jt]),Object(d.useEffect)((function(){N(!0),B.a.get("report/USDRejected",jt).then((function(t){if(200===t.status){var e=t.data.map((function(t){return[V()(t.month).format("MM-YYYY"),t.sum]}));e.unshift(["Month","USD total"]),Ot(e),N(!1)}else Object(_.a)("error","Something wrong in retrieving CSV")})).catch((function(t){return console.log(t)}))}),[jt]);var Tt=Object(d.useRef)(null),At=Object(d.useRef)(null),Dt=z.a.rowStyle,Rt=z.a.colStyle;return M||D||w||v||g||n?f.a.createElement("div",{style:{marginTop:"20%",display:"flex",alignItems:"center",justifyContent:"center"}},f.a.createElement(u.a,{size:"large"})):f.a.createElement(F.a,null,f.a.createElement(i.a,{style:Dt},f.a.createElement(c.a,null,f.a.createElement(l.a.Title,null,"Reporting")),f.a.createElement(o.a,null)),f.a.createElement(i.a,{style:Dt,type:"flex",justify:"space-around"},f.a.createElement(c.a,null,f.a.createElement(r.a.RangePicker,{defaultValue:[V()().subtract(1,"months"),V()()],format:"DD MMM YYYY",ref:Tt}),f.a.createElement(a.a,{type:"primary",onClick:function(){var t=Tt.current.picker.state.value.map((function(t){return t.format()}));t.push("claims"),B.a.get("report/csv",t).then((function(t){if(console.log("response",t),200===t.status){var e=G.a.utils.json_to_sheet(t.data),n=G.a.utils.book_new();G.a.utils.book_append_sheet(n,e,"report"),G.a.writeFile(n,"claims report.xlsb")}else Object(_.a)("error","Something wrong in retrieving CSV")})).catch((function(t){return console.log(t)}))}},"EXPORT MONTHLY REPORT")),f.a.createElement(c.a,null,f.a.createElement(r.a.RangePicker,{defaultValue:[V()().subtract(1,"months"),V()()],format:"DD MMM YYYY",ref:At}),f.a.createElement(a.a,{type:"primary",onClick:function(){var t=At.current.picker.state.value.map((function(t){return t.format()}));t.push("pendings"),B.a.get("report/csv",t).then((function(t){if(console.log("response",t),200===t.status){var e=G.a.utils.json_to_sheet(t.data),n=G.a.utils.book_new();G.a.utils.book_append_sheet(n,e,"report"),G.a.writeFile(n,"pendings report.xlsb")}else Object(_.a)("error","Something wrong in retrieving CSV")})).catch((function(t){return console.log(t)}))}},"EXPORT CURRENT PENDING REPORT"))),f.a.createElement("div",{style:{border:"1px solid white",padding:"35px",borderRadius:"25px"}},f.a.createElement(i.a,{style:Dt,type:"flex",justify:"space-around"},f.a.createElement(c.a,null,f.a.createElement(r.a.RangePicker,{format:"DD MMM YYYY",value:Ct,onChange:function(t){kt(t)}}),f.a.createElement(a.a,{type:"primary",onClick:function(t){Et(Ct.map((function(t){return t.format()})))}},"Submit")),f.a.createElement(c.a,null,f.a.createElement(a.a,{type:"primary",onClick:function(){for(var t=document.getElementsByClassName("isoSaleWidget"),e=0;e<t.length;e++)X()(t[e]).then((function(t){var e=document.createElement("a");e.href=t.toDataURL(),e.download="chart.png",e.click()}))}},"DOWNLOAD IMAGES"))),f.a.createElement(i.a,{style:Dt,gutter:0,justify:"start"},f.a.createElement(c.a,{lg:6,md:12,sm:12,xs:24,style:Rt},f.a.createElement(S,{gutterLeft:0},f.a.createElement(A,{data:$,chartType:"Gauge",label:f.a.createElement(U.a,{id:"widget.salewidget1.label"}),title:"TURNAROUND",options:{title:"turnaround",redFrom:90,redTo:100,yellowFrom:75,yellowTo:90,minorTicks:5,forceIFrame:!0}}))),f.a.createElement(c.a,{lg:6,md:12,sm:12,xs:24,style:Rt},f.a.createElement(S,null,f.a.createElement(A,{title:"PROCESSED PER DAY",data:Q,chartType:"Gauge",label:f.a.createElement(U.a,{id:"widget.salewidget1.label"}),options:{title:"Per Day",redFrom:90,redTo:100,yellowFrom:75,yellowTo:90,minorTicks:5}}))),f.a.createElement(c.a,{lg:6,md:12,sm:12,xs:24,style:Rt},f.a.createElement(S,null,f.a.createElement(A,{title:"APPROVED BY POLICY",data:nt,chartType:"PieChart",options:{title:"Approved Claims Count: Split by Type",chartArea:{width:"80%"},is3D:!1}}))),f.a.createElement(c.a,{lg:6,md:12,sm:12,xs:24,style:Rt},f.a.createElement(S,null,f.a.createElement(A,{title:"APPROVED BY VALUE",data:ot,chartType:"PieChart",options:{chartArea:{width:"80%"},title:"Approved Claims Count: Split by Value",is3D:!1}})))),f.a.createElement(i.a,{style:Dt},f.a.createElement(W,{data:st,width:"100%",height:300})),f.a.createElement(i.a,{style:Dt},f.a.createElement(Y,{data:mt,chartType:"ColumnChart",options:{isStacked:!0,title:"USD Approved",chartArea:{width:"80%"},hAxis:{title:"Month",minValue:0},vAxis:{title:"Amount",minValue:0}}})),f.a.createElement(i.a,{style:Dt},f.a.createElement(Y,{data:yt,chartType:"ColumnChart",options:{title:"USD Reject",chartArea:{width:"80%"},hAxis:{title:"Month",minValue:0},vAxis:{title:"Amount",minValue:0}}}))))}n.d(e,"default",(function(){return $}))}}]);
//# sourceMappingURL=22.a31e0805.chunk.js.map
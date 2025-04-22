"use strict";(()=>{var e={};e.id=4898,e.ids=[4898],e.modules={53524:e=>{e.exports=require("@prisma/client")},72934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},39491:e=>{e.exports=require("assert")},14300:e=>{e.exports=require("buffer")},6113:e=>{e.exports=require("crypto")},82361:e=>{e.exports=require("events")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},63477:e=>{e.exports=require("querystring")},57310:e=>{e.exports=require("url")},73837:e=>{e.exports=require("util")},59796:e=>{e.exports=require("zlib")},78147:(e,t,a)=>{a.r(t),a.d(t,{headerHooks:()=>f,originalPathname:()=>h,patchFetch:()=>v,requestAsyncStorage:()=>y,routeModule:()=>u,serverHooks:()=>m,staticGenerationAsyncStorage:()=>d,staticGenerationBailout:()=>g});var r={};a.r(r),a.d(r,{POST:()=>p});var n=a(95419),i=a(69108),s=a(99678),o=a(78070),l=a(81355),c=a(76163);async function p(e){try{let t=await (0,l.getServerSession)(c.L);if(!t?.user)return o.Z.json({error:"Unauthorized"},{status:401});let a=t.user.tier||"free";if("free"===a)return o.Z.json({error:"Upgrade required"},{status:403});let{calculatorType:r,formData:n}=await e.json();if(!r||!n)return o.Z.json({error:"Missing required data"},{status:400});n.propertyPrice,n.propertyData?.address,n.propertyData?.bedrooms,n.propertyData?.bathrooms,n.propertyData?.squareFeet,n.propertyData?.yearBuilt,n.propertyData?.propertyType,n.propertyData?.lotSize,n.downPayment,n.downPaymentPercent,n.interestRate,n.loanTerm,n.monthlyPayment,"airbnb"===r?(n.nightlyRate,n.occupancyRate,n.cleaningFee,n.maintenanceCosts,n.utilities,n.platformFee,n.analytics?.monthlyRevenue,n.analytics?.noi,n.analytics?.cashOnCashReturn,n.analytics?.capRate,n.analytics?.roi,n.analytics?.breakEvenOccupancy,n.analytics?.revpar,n.analytics?.adr):"rental"===r?(n.monthlyRent,n.vacancyRate,n.propertyManagement,n.hoaFees,n.maintenance,n.utilities,n.propertyTaxes,n.insurance,n.analytics?.monthlyCashFlow,n.analytics?.annualCashFlow,n.analytics?.capRate,n.analytics?.cashOnCashReturn,n.analytics?.breakEvenRent,n.analytics?.grossRentMultiplier,n.analytics?.debtCoverageRatio,n.analytics?.operatingExpenseRatio):"wholesale"===r?(n.arv,n.repairCosts,n.offerPrice,n.closingCosts,n.holdingCosts,n.wholesaleFee,n.analytics?.potentialProfit,n.analytics?.maxAllowableOffer,n.analytics?.equityAfterRepair,n.analytics?.roi,n.analytics?.arvToOfferRatio,n.analytics?.riskLevel,n.analytics?.profitMargin,n.analytics?.repairRatio,n.analytics?.totalInvestmentRequired,n.analytics?.netProfit,n.analytics?.cashOnCash,n.analytics?.buyerPotentialProfit,n.analytics?.buyerROI,n.analytics?.wholesaleSpread,n.analytics?.assignmentFeeRatio):"mortgage"===r&&(n.analytics?.loanSummary?.totalLoanAmount,n.analytics?.loanSummary?.totalInterest,n.analytics?.loanSummary?.totalPayments,n.analytics?.monthlyPayment,n.pmiAmount,n.analytics?.paymentBreakdown?.principal,n.analytics?.paymentBreakdown?.interest,n.analytics?.paymentBreakdown?.propertyTax,n.analytics?.paymentBreakdown?.insurance,n.analytics?.paymentBreakdown?.pmi,n.analytics?.riskAnalysis?.debtToIncomeRatio,n.analytics?.riskAnalysis?.loanToValueRatio,n.analytics?.riskAnalysis?.frontEndRatio,n.analytics?.riskAnalysis?.backEndRatio,n.analytics?.riskAnalysis?.housingExpenseRatio);let i="elite"===a?`Comprehensive Investment Analysis

ROI Projection:
Based on the provided data, we project an annualized ROI of 14.7%. This calculation factors in:
- Gross Revenue: $4,050/month (75% occupancy @ $180/night)
- Operating Expenses: $2,820/month
- Net Cash Flow: $1,230/month

Market Context:
- Your location shows strong seasonal demand (peak: Jun-Aug)
- Local market occupancy averages 72%
- Your price point is competitive for the amenities

Risk Assessment:
1. Seasonality Impact: Moderate risk - consider dynamic pricing
2. Market Competition: Low risk - limited inventory in area
3. Regulatory Environment: Low risk - stable short-term rental policies
4. Interest Rate Exposure: Moderate risk - fixed rate recommended

Optimization Recommendations:
1. Pricing Strategy: Implement seasonal adjustments (+15% during peak)
2. Operational Efficiency: Bundle cleaning services for better margins
3. Marketing: Improve listing photos and description
4. Revenue Management: Consider minimum stay requirements during peak

Benchmark Comparison:
- Your projected RevPAR: $135 (Top 25% in market)
- Market Average RevPAR: $112
- Your Cost Basis: 15% below market average

Long-term Outlook:
Property value appreciation potential is strong due to:
- Area development plans
- Historical 5.8% annual appreciation
- Growing rental demand

Overall: Strong investment opportunity with multiple optimization levers available.`:`Investment Analysis Summary

Based on a 75% occupancy rate and $180/night average:
- Estimated monthly revenue: $4,050
- Net cash flow: $1,230

Key Risks:
1. Seasonal demand fluctuations
2. Market competition

Recommendations:
1. Consider increasing daily rate by 10%
2. Implement dynamic pricing for peak seasons

Overall: Deal shows good profit potential in current market conditions.`;return o.Z.json({success:!0,insight:i})}catch(e){return console.error("GPT analysis error:",e),o.Z.json({error:"Failed to generate analysis"},{status:500})}}let u=new n.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/gpt/analyze/route",pathname:"/api/gpt/analyze",filename:"route",bundlePath:"app/api/gpt/analyze/route"},resolvedPagePath:"/Users/wolf/bnb-calc-clone/app/api/gpt/analyze/route.ts",nextConfigOutput:"standalone",userland:r}),{requestAsyncStorage:y,staticGenerationAsyncStorage:d,serverHooks:m,headerHooks:f,staticGenerationBailout:g}=u,h="/api/gpt/analyze/route";function v(){return(0,s.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:d})}},76163:(e,t,a)=>{a.d(t,{L:()=>p});var r=a(54896),n=a(86485),i=a(10375),s=a(53524);let o=globalThis.prisma??new s.PrismaClient({log:["query"]});var l=a(6521),c=a.n(l);let p={adapter:(0,r.N)(o),providers:[(0,i.Z)({clientId:process.env.GOOGLE_CLIENT_ID,clientSecret:process.env.GOOGLE_CLIENT_SECRET}),(0,n.Z)({name:"credentials",credentials:{email:{label:"Email",type:"email"},password:{label:"Password",type:"password"},mode:{label:"Mode",type:"text"}},async authorize(e){if(!e?.email||!e?.password)throw Error("Missing credentials");let t=await o.user.findUnique({where:{email:e.email}});if("signup"===e.mode){if(t)throw Error("User already exists");let a=await c().hash(e.password,10),r=await o.user.create({data:{email:e.email,password:a,subscriptionTier:"free"}});return{id:r.id,email:r.email,name:r.name,subscriptionTier:r.subscriptionTier}}if(!t||!await c().compare(e.password,t.password||""))throw Error("Invalid credentials");return{id:t.id,email:t.email,name:t.name,subscriptionTier:t.subscriptionTier}}})],session:{strategy:"jwt"},callbacks:{jwt:async({token:e,user:t})=>(t&&(e.id=t.id,e.subscriptionTier=t.subscriptionTier),e),session:async({session:e,token:t})=>(e.user&&t&&(e.user.id=t.id,e.user.subscriptionTier=t.subscriptionTier),e)},pages:{signIn:"/login"}}},77381:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},81355:(e,t,a)=>{Object.defineProperty(t,"__esModule",{value:!0});var r={};Object.defineProperty(t,"default",{enumerable:!0,get:function(){return i.default}});var n=a(77381);Object.keys(n).forEach(function(e){!("default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(r,e))&&(e in t&&t[e]===n[e]||Object.defineProperty(t,e,{enumerable:!0,get:function(){return n[e]}}))});var i=function(e,t){if(!t&&e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var a=s(t);if(a&&a.has(e))return a.get(e);var r={__proto__:null},n=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var i in e)if("default"!==i&&({}).hasOwnProperty.call(e,i)){var o=n?Object.getOwnPropertyDescriptor(e,i):null;o&&(o.get||o.set)?Object.defineProperty(r,i,o):r[i]=e[i]}return r.default=e,a&&a.set(e,r),r}(a(49605));function s(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,a=new WeakMap;return(s=function(e){return e?a:t})(e)}Object.keys(i).forEach(function(e){!("default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(r,e))&&(e in t&&t[e]===i[e]||Object.defineProperty(t,e,{enumerable:!0,get:function(){return i[e]}}))})}};var t=require("../../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),r=t.X(0,[1638,6206,4496],()=>a(78147));module.exports=r})();
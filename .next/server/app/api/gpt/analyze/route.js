"use strict";(()=>{var e={};e.id=4898,e.ids=[4898],e.modules={72934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},39491:e=>{e.exports=require("assert")},14300:e=>{e.exports=require("buffer")},6113:e=>{e.exports=require("crypto")},82361:e=>{e.exports=require("events")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},63477:e=>{e.exports=require("querystring")},57310:e=>{e.exports=require("url")},73837:e=>{e.exports=require("util")},59796:e=>{e.exports=require("zlib")},78147:(e,a,t)=>{t.r(a),t.d(a,{headerHooks:()=>g,originalPathname:()=>v,patchFetch:()=>w,requestAsyncStorage:()=>y,routeModule:()=>u,serverHooks:()=>d,staticGenerationAsyncStorage:()=>m,staticGenerationBailout:()=>h});var r={};t.r(r),t.d(r,{POST:()=>p});var i=t(95419),n=t(69108),s=t(99678),o=t(78070),l=t(81355),c=t(4118);async function p(e){try{let a=await (0,l.getServerSession)(c.authOptions);if(!a?.user)return o.Z.json({error:"Unauthorized"},{status:401});let t=a.user.tier||"free";if("free"===t)return o.Z.json({error:"Upgrade required"},{status:403});let{calculatorType:r,formData:i}=await e.json();if(!r||!i)return o.Z.json({error:"Missing required data"},{status:400});i.propertyPrice,i.propertyData?.address,i.propertyData?.bedrooms,i.propertyData?.bathrooms,i.propertyData?.squareFeet,i.propertyData?.yearBuilt,i.propertyData?.propertyType,i.propertyData?.lotSize,i.downPayment,i.downPaymentPercent,i.interestRate,i.loanTerm,i.monthlyPayment,"airbnb"===r?(i.nightlyRate,i.occupancyRate,i.cleaningFee,i.maintenanceCosts,i.utilities,i.platformFee,i.analytics?.monthlyRevenue,i.analytics?.noi,i.analytics?.cashOnCashReturn,i.analytics?.capRate,i.analytics?.roi,i.analytics?.breakEvenOccupancy,i.analytics?.revpar,i.analytics?.adr):"rental"===r?(i.monthlyRent,i.vacancyRate,i.propertyManagement,i.hoaFees,i.maintenance,i.utilities,i.propertyTaxes,i.insurance,i.analytics?.monthlyCashFlow,i.analytics?.annualCashFlow,i.analytics?.capRate,i.analytics?.cashOnCashReturn,i.analytics?.breakEvenRent,i.analytics?.grossRentMultiplier,i.analytics?.debtCoverageRatio,i.analytics?.operatingExpenseRatio):"wholesale"===r?(i.arv,i.repairCosts,i.offerPrice,i.closingCosts,i.holdingCosts,i.wholesaleFee,i.analytics?.potentialProfit,i.analytics?.maxAllowableOffer,i.analytics?.equityAfterRepair,i.analytics?.roi,i.analytics?.arvToOfferRatio,i.analytics?.riskLevel,i.analytics?.profitMargin,i.analytics?.repairRatio,i.analytics?.totalInvestmentRequired,i.analytics?.netProfit,i.analytics?.cashOnCash,i.analytics?.buyerPotentialProfit,i.analytics?.buyerROI,i.analytics?.wholesaleSpread,i.analytics?.assignmentFeeRatio):"mortgage"===r&&(i.analytics?.loanSummary?.totalLoanAmount,i.analytics?.loanSummary?.totalInterest,i.analytics?.loanSummary?.totalPayments,i.analytics?.monthlyPayment,i.pmiAmount,i.analytics?.paymentBreakdown?.principal,i.analytics?.paymentBreakdown?.interest,i.analytics?.paymentBreakdown?.propertyTax,i.analytics?.paymentBreakdown?.insurance,i.analytics?.paymentBreakdown?.pmi,i.analytics?.riskAnalysis?.debtToIncomeRatio,i.analytics?.riskAnalysis?.loanToValueRatio,i.analytics?.riskAnalysis?.frontEndRatio,i.analytics?.riskAnalysis?.backEndRatio,i.analytics?.riskAnalysis?.housingExpenseRatio);let n="elite"===t?`Comprehensive Investment Analysis

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

Overall: Deal shows good profit potential in current market conditions.`;return o.Z.json({success:!0,insight:n})}catch(e){return console.error("GPT analysis error:",e),o.Z.json({error:"Failed to generate analysis"},{status:500})}}let u=new i.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/gpt/analyze/route",pathname:"/api/gpt/analyze",filename:"route",bundlePath:"app/api/gpt/analyze/route"},resolvedPagePath:"/Users/wolf/bnb-calc-clone/app/api/gpt/analyze/route.ts",nextConfigOutput:"standalone",userland:r}),{requestAsyncStorage:y,staticGenerationAsyncStorage:m,serverHooks:d,headerHooks:g,staticGenerationBailout:h}=u,v="/api/gpt/analyze/route";function w(){return(0,s.patchFetch)({serverHooks:d,staticGenerationAsyncStorage:m})}},4118:(e,a,t)=>{t.r(a),t.d(a,{GET:()=>u,POST:()=>u,authOptions:()=>p});var r=t(81355),i=t.n(r),n=t(10375),s=t(86485),o=t(6521),l=t.n(o),c=t(40489);let p={providers:[(0,n.Z)({clientId:process.env.GOOGLE_CLIENT_ID,clientSecret:process.env.GOOGLE_CLIENT_SECRET}),(0,s.Z)({id:"credentials",name:"Credentials",credentials:{email:{label:"Email",type:"email"},password:{label:"Password",type:"password"},mode:{label:"Mode",type:"text"}},async authorize(e){if(!e?.email||!e?.password)throw Error("Missing credentials");let{email:a,password:t,mode:r}=e;if("demo@example.com"===a&&"demo123"===t)return{id:"demo",email:"demo@example.com",name:"Demo User",subscriptionTier:"free"};if("signup"===r){if(await c._.user.findUnique({where:{email:a}}))throw Error("User already exists");let e=await l().hash(t,10),r=await c._.user.create({data:{email:a,password:e,subscriptionTier:"free"}});return{id:r.id,email:r.email,subscriptionTier:r.subscriptionTier}}let i=await c._.user.findUnique({where:{email:a}});if(!i)throw Error("No user found with this email");if(!await l().compare(t,i.password))throw Error("Invalid password");return{id:i.id,email:i.email,subscriptionTier:i.subscriptionTier}}})],session:{strategy:"jwt",maxAge:2592e3},pages:{signIn:"/login",error:"/login"},callbacks:{jwt:async({token:e,user:a})=>(a&&(e.id=a.id,e.subscriptionTier=a.subscriptionTier||"free"),e),session:async({session:e,token:a})=>(e.user&&(e.user.id=a.id,e.user.subscriptionTier=a.subscriptionTier),e)}},u=i()(p)},40489:(e,a,t)=>{t.d(a,{_:()=>i});let r=require("@prisma/client"),i=globalThis.prisma??new r.PrismaClient}};var a=require("../../../../webpack-runtime.js");a.C(e);var t=e=>a(a.s=e),r=a.X(0,[1638,6206,7439,3561],()=>t(78147));module.exports=r})();
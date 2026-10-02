import {normalizeProduct} from "./schemas.mjs";
import {buildOpportunity} from "./opportunity.mjs";
export function researchProducts(rawProducts,criteria={}){
 return rawProducts.map(normalizeProduct).map(buildOpportunity)
 .filter(p=>p.netProfit>=(criteria.minProfit??0)&&p.marginRate>=(criteria.minMargin??0))
 .sort((a,b)=>b.score-a.score||b.netProfit-a.netProfit).map((p,index)=>({...p,rank:index+1}));
}
export function researchSummary(products){
 return {total:products.length,profitable:products.filter(p=>p.netProfit>0).length,candidates:products.filter(p=>p.status==="candidate").length,top:products.slice(0,10)};
}
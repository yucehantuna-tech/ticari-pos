import {calculateUnitEconomics,scoreProduct} from "./economics.mjs";
export function rankProducts(products,criteria={}){
  const minProfit=criteria.minProfit??0;
  const minMargin=criteria.minMargin??0;
  return products.map(p=>{
    const economics=calculateUnitEconomics(p);
    const enriched={...p,...economics};
    enriched.marginRate=economics.marginRate;
    enriched.score=scoreProduct(enriched);
    return enriched;
  }).filter(p=>p.netProfit>=minProfit&&p.marginRate>=minMargin)
    .sort((a,b)=>b.score-a.score||b.netProfit-a.netProfit);
}

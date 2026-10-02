import {calculateUnitEconomics,scoreProduct} from "./economics.mjs";
export function buildOpportunity(product){
  const economics=calculateUnitEconomics(product);
  const enriched={...product,...economics};
  const score=scoreProduct(enriched);
  return {
    ...enriched,
    score,
    status:economics.netProfit<=0?"reject":score>=75?"candidate":"test",
    warnings:[
      economics.netProfit<=0?"Kâr negatif veya sıfır":"",
      economics.marginRate<15?"Marj düşük":"",
      product.stock===0?"Stok yok":""
    ].filter(Boolean)
  };
}

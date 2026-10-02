import {normalizeProduct} from "./schemas.mjs";
import {rankProducts} from "./product-hunter.mjs";

export function researchProducts(rawProducts,criteria={}){
  const normalized=rawProducts.map(normalizeProduct);
  return rankProducts(normalized,criteria).map((p,index)=>({
    rank:index+1,
    ...p,
    recommendation:p.score>=75&&p.netProfit>0?"incelemeye değer":
      p.score>=55&&p.netProfit>0?"test edilebilir":"elenebilir"
  }));
}

export function researchSummary(products){
  return {
    total:products.length,
    profitable:products.filter(p=>p.netProfit>0).length,
    testable:products.filter(p=>p.recommendation==="test edilebilir").length,
    top:products.slice(0,10)
  };
}

export function calculateUnitEconomics({supplierCost,salePrice,shipping=0,platformFeeRate=0,otherCosts=0,tax=0}){
  const fee=salePrice*(platformFeeRate/100);
  const net=salePrice-supplierCost-shipping-fee-otherCosts-tax;
  return {supplierCost,salePrice,shipping,platformFee:fee,otherCosts,tax,netProfit:net,marginRate:salePrice?net/salePrice*100:0};
}
export function scoreProduct(p){
  const margin=Math.max(0,Math.min(100,p.marginRate||0));
  const demand=Math.max(0,Math.min(100,p.demandScore||0));
  const supplier=Math.max(0,Math.min(100,p.supplierScore||0));
  const risk=100-Math.max(0,Math.min(100,p.riskScore||0));
  return Math.round(margin*.35+demand*.30+supplier*.20+risk*.15);
}

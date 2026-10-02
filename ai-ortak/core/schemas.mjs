export function normalizeProduct(input={}){
  return {
    id:String(input.id||crypto.randomUUID()),
    title:String(input.title||""),
    source:String(input.source||"unknown"),
    sourceUrl:String(input.sourceUrl||""),
    supplier:String(input.supplier||""),
    supplierCost:Number(input.supplierCost||0),
    salePrice:Number(input.salePrice||0),
    shipping:Number(input.shipping||0),
    platformFeeRate:Number(input.platformFeeRate||0),
    otherCosts:Number(input.otherCosts||0),
    tax:Number(input.tax||0),
    stock:Number.isFinite(Number(input.stock))?Number(input.stock):null,
    demandScore:Number(input.demandScore||0),
    supplierScore:Number(input.supplierScore||0),
    riskScore:Number(input.riskScore||0),
    checkedAt:new Date().toISOString()
  };
}

import assert from "node:assert/strict";
import {researchProducts} from "./research-engine.mjs";

const result=researchProducts([
 {title:"Test Ürün",supplier:"Test",supplierCost:100,salePrice:250,shipping:20,platformFeeRate:10,demandScore:80,supplierScore:80,riskScore:20}
],{minProfit:50,minMargin:10});

assert.equal(result.length,1);
assert.equal(result[0].netProfit,105);
assert.ok(result[0].score>0);
console.log("research-engine: OK");

import {researchProducts,researchSummary} from "../core/research-engine.mjs";
import {mockCatalog} from "../core/mock-catalog.mjs";
export function runResearch(input={}){
 const products=Array.isArray(input.products)&&input.products.length?input.products:mockCatalog;
 const results=researchProducts(products,input.criteria||{}); return {summary:researchSummary(results),products:results};
}
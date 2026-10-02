import {runResearch} from "../server/research-route.mjs";
import {mockCatalog} from "./mock-catalog.mjs";
import {authorize,ACTIONS} from "./permissions.mjs";
export function runSandbox(){
 const research=runResearch({products:mockCatalog,criteria:{minProfit:20,minMargin:10}});
 const checks=[
  {name:"product_research",pass:research.products.length>0},
  {name:"profit_calculation",pass:research.products.every(p=>Number.isFinite(p.netProfit))},
  {name:"negative_profit_filter",pass:research.products.every(p=>p.netProfit>=20)},
  {name:"publish_requires_approval",pass:authorize({permissions:["publish"],action:ACTIONS.PUBLISH}).reason==="user_approval_required"},
  {name:"money_requires_approval",pass:authorize({permissions:["money"],action:ACTIONS.MONEY}).reason==="user_approval_required"},
  {name:"read_permission",pass:authorize({permissions:["read"],action:ACTIONS.READ}).allowed===true}
 ];
 return {ok:checks.every(x=>x.pass),checks,research};
}

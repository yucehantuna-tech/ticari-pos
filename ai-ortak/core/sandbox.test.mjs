import assert from "node:assert/strict";
import {runSandbox} from "./sandbox.mjs";
const result=runSandbox();
assert.equal(result.ok,true);
assert.ok(result.checks.every(x=>x.pass));
console.log(JSON.stringify(result,null,2));

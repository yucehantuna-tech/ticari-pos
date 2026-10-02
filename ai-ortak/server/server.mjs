import http from "node:http";
import {URL} from "node:url";
import {researchProducts} from "../core/research-engine.mjs";

const port=Number(process.env.PORT||8787);
const model=process.env.OPENAI_MODEL||"";

function json(res,status,data){
  res.writeHead(status,{"content-type":"application/json; charset=utf-8","access-control-allow-origin":"*"});
  res.end(JSON.stringify(data));
}
function body(req){
  return new Promise((resolve,reject)=>{
    let raw="";
    req.on("data",c=>{raw+=c;if(raw.length>1_000_000) req.destroy();});
    req.on("end",()=>{try{resolve(raw?JSON.parse(raw):{});}catch(e){reject(e);}});
    req.on("error",reject);
  });
}

const server=http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,"http://localhost");
    if(req.method==="OPTIONS"){
      res.writeHead(204,{"access-control-allow-origin":"*","access-control-allow-methods":"GET,POST,OPTIONS","access-control-allow-headers":"content-type"});
      return res.end();
    }
    if(req.method==="GET"&&url.pathname==="/api/health")
      return json(res,200,{ok:true,model,openaiConfigured:Boolean(process.env.OPENAI_API_KEY)});
    if(req.method==="POST"&&url.pathname==="/api/research"){
      const input=await body(req);
      const products=Array.isArray(input.products)?input.products:[];
      return json(res,200,researchProducts(products,input.criteria||{}));
    }
    if(req.method==="POST"&&url.pathname==="/api/chat"){
      const input=await body(req);
      const message=String(input.message||"").trim();
      if(!message) return json(res,400,{error:"message_required"});
      if(!process.env.OPENAI_API_KEY)
        return json(res,200,{reply:"AI motoru hazır. Gerçek konuşma modelini bağlamak için OPENAI_API_KEY sunucu ortamına eklenmeli.",mode:"setup_required"});
      const upstream=await fetch("https://api.openai.com/v1/responses",{
        method:"POST",
        headers:{"content-type":"application/json","authorization":`Bearer ${process.env.OPENAI_API_KEY}`},
        body:JSON.stringify({
          model,
          input:[
            {role:"system",content:"Sen kullanıcının Türkçe konuşan yapay zeka iş ortağısın. Stoksuz e-ticaret araştırması, ürün ekonomisi, tedarikçi ve operasyon planlamasında yardımcı ol. Para harcama, sipariş, yayınlama veya müşteri mesajı gibi kritik işlemleri kullanıcı onayı olmadan gerçekleştirme. Kâr garantisi verme."},
            {role:"user",content:message}
          ]
        })
      });
      const data=await upstream.json();
      if(!upstream.ok) return json(res,502,{error:"openai_request_failed",details:data});
      const text=data.output_text||data.output?.flatMap(x=>x.content||[]).map(x=>x.text||"").join("")||"";
      return json(res,200,{reply:text,mode:"openai",model});
    }
    return json(res,404,{error:"not_found"});
  }catch(error){
    return json(res,500,{error:"server_error",message:error.message});
  }
});
server.listen(port,()=>console.log(`AI Ortak API listening on :${port}`));

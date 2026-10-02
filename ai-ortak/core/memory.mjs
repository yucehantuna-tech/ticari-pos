export function createMemoryStore(){
  const entries=[];
  return {
    add(type,content,metadata={}){
      const entry={id:crypto.randomUUID(),type,content,metadata,createdAt:new Date().toISOString()};
      entries.push(entry); return entry;
    },
    search(query){
      const q=String(query).toLocaleLowerCase("tr-TR");
      return entries.filter(e=>String(e.content).toLocaleLowerCase("tr-TR").includes(q));
    },
    all(){return [...entries];}
  };
}

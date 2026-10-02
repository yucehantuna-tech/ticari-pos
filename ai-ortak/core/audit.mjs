export function auditEntry({action,user,resource,status,details={}}){
  return {id:crypto.randomUUID(),timestamp:new Date().toISOString(),action,user,resource,status,details};
}

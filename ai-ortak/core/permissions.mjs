export const ACTIONS={READ:"read",PREPARE:"prepare",PUBLISH:"publish",ORDER:"order",MESSAGE:"message",MONEY:"money"};
export function canExecute(userPermissions,action){
  return Boolean(userPermissions?.includes(action)||userPermissions?.includes("*"));
}
export function requiresApproval(action){
  return [ACTIONS.PUBLISH,ACTIONS.ORDER,ACTIONS.MESSAGE,ACTIONS.MONEY].includes(action);
}
export function authorize({permissions,action,explicitApproval=false}){
  if(!canExecute(permissions,action)) return {allowed:false,reason:"permission_missing"};
  if(requiresApproval(action)&&!explicitApproval) return {allowed:false,reason:"user_approval_required"};
  return {allowed:true,reason:"authorized"};
}

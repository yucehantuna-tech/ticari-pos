export const CONNECTOR_TYPES=["marketplace","supplier","shipping","payment","messaging","analytics"];
export function connectorManifest({id,name,type,capabilities=[],requiresOAuth=true}){
  return {id,name,type,capabilities,requiresOAuth,enabled:false,connected:false};
}
export const requiredCapabilities=[
  "catalog.read","price.read","stock.read","order.create","order.status",
  "listing.create","listing.update","listing.status","message.read","message.send",
  "shipping.quote","tracking.read","analytics.read"
];

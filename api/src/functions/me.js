import { app } from '@azure/functions';
function decodePrincipal(req){
  const raw=req.headers.get('x-ms-client-principal');
  if(!raw) return null;
  try{return JSON.parse(Buffer.from(raw,'base64').toString('utf8'));}catch{return null;}
}
app.http('me',{methods:['GET'],authLevel:'anonymous',route:'me',handler:async(req)=>({jsonBody:{principal:decodePrincipal(req)}})});

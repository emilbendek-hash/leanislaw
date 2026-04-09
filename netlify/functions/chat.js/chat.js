exports.handler = async function(event) {
  if(event.httpMethod==='OPTIONS'){
    return{statusCode:200,headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type','Access-Control-Allow-Methods':'POST,OPTIONS'},body:''};
  }
  if(event.httpMethod!=='POST') return{statusCode:405,body:'Method Not Allowed'};
  try{
    var body=JSON.parse(event.body);
    var resp=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'x-api-key':process.env.ANTHROPIC_API_KEY,
        'anthropic-version':'2023-06-01'
      },
      body:JSON.stringify({
        model:'claude-sonnet-4-20250514',
        max_tokens:500,
        system:body.system||'',
        messages:body.messages||[]
      })
    });
    var data=await resp.json();
    var content=data.content&&data.content[0]?data.content[0].text:'No response';
    return{
      statusCode:200,
      headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'},
      body:JSON.stringify({content:content})
    };
  }catch(err){
    return{
      statusCode:500,
      headers:{'Access-Control-Allow-Origin':'*'},
      body:JSON.stringify({error:err.message})
    };
  }
};

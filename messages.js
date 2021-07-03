const generatemessage=(username,text)=>
{
return {

username,
    text,
    createdat:new Date().getTime()
}


}

const generatelocationmessage=(username,url)=>
{
return {

username,
    url,
    createdat:new Date().getTime()
}


}





module.exports={
    generatemessage,
    generatelocationmessage
}
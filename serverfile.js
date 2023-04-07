let express=require("express")
let app=express()
//let {arr}=require('./data.js')
//let {arr2}=require('./data2.js')
const fs=require('fs')
const { constants } = require("buffer")
app.use(express.json())
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*")
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"

    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin,X-Requested-With ,Content-Type, Accept"

    );
    next();

   
});
let filename='furniture.txt'
let filename2='register.txt'
//const port=2410
var port=process.env.PORT ||2410
app.listen(port,()=>console.log(`Node app is listinng${port}`))

/*app.get('/resetData',function(req,res){
    let str=JSON.stringify(arr)
    fs.promises.writeFile(filename,str)
    .then(()=>res.send('file is reset successfully'))
})
app.get('/resetRegister',function(req,res){
   let str=JSON.stringify(arr2)
   fs.promises.writeFile(filename2,str)
  .then(()=>res.send('file is reset successfully'))
})*/
app.get('/products',async function(req,res){
   try{
     let result=await fs.promises.readFile(filename,'utf-8')
     let data=JSON.parse(result)
     res.send(data)
   }
   catch(err){
    res.status(404).send(err)
   }
   

})
app.get('/products/:category',async function(req,res){
    let {category}=req.params
    try{
      let result=await fs.promises.readFile(filename,'utf-8')
      let data=JSON.parse(result)
      data=data.filter(elem=>elem.category==category)
      res.send(data)
    }
    catch(err){
     res.status(404).send(err)
    }
    
 
 })
 app.get('/products/category/:id',async function(req,res){
    let {id}=req.params
    try{
      let result=await fs.promises.readFile(filename,'utf-8')
      let data=JSON.parse(result)
      let js=data.find(elem=>elem.prodCode==id)
      data=data.filter(elem=>elem.category==js.category) 
      res.send(data)
    }
    catch(err){
     res.status(404).send(err)
    }
    
 
 })
 app.post('/register',async function(req,res){
  let {body}=req
  let {username,password}=body
  try{
    let result=await fs.promises.readFile(filename2,'utf-8')
    let data=JSON.parse(result)
    let user=data.find(elem=>elem.username==username&&elem.password==password)
    if(user){
      let js={username:user.username,role:user.role}
      res.send(js)
    }
    else{
      res.status(401).send('invalid username and password')
    }
  }
  catch(err){
   res.status(404).send(err)
  }

 })
 app.post('/addProduct',async function(req,res){
     let {body}=req
    try{
      let result=await fs.promises.readFile(filename,'utf-8')
      let arr=JSON.parse(result)
      arr.push(body)
      let str=JSON.stringify(arr)
      await fs.promises.writeFile(filename,str)
      res.send('new item is added successfully')
    }
    catch(err){
      res.status(404).send(err)
    }



 })
 app.put('/editProduct/:prodCode',async function(req,res){
  let {body}=req
  let {prodCode}=req.params
 try{
   let result=await fs.promises.readFile(filename,'utf-8')
   let arr=JSON.parse(result)
   let index=arr.findIndex(elem=>elem.prodCode==prodCode)
   arr[index]=body
   let str=JSON.stringify(arr)
   await fs.promises.writeFile(filename,str)
   res.send(arr[index])
 }
 catch(err){
   res.status(404).send(err)
 }

})
app.delete('/deleteProduct/:prodCode',async function(req,res){
 
  let {prodCode}=req.params
 try{
   let result=await fs.promises.readFile(filename,'utf-8')
   let arr=JSON.parse(result)
   let index=arr.findIndex(elem=>elem.prodCode==prodCode)
   arr.splice(index,1)
   let str=JSON.stringify(arr)
   await fs.promises.writeFile(filename,str)
   res.send('item is deleted successfully')
 }
 catch(err){
   res.status(404).send(err)
 }

})
 
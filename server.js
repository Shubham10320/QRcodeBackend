const express=require('express')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const {connection}=require('./Configs/db')
const UserModel=require('./Models/User.model')
const cors = require('cors');
const app=express();

app.use(cors({
    origin: '*'
}));
require('dotenv').config();

app.use(express.json())
const PORT=process.env.PORT

app.get('/', (req, res)=>{
    res.send('base url')
})

app.post('/signup', (req, res)=>{
    const{name, mobile, email, password}=req.body;
    bcrypt.hash(password, 4, async(err, hash)=>{
       const newUser=new UserModel({
        name, 
        mobile, 
        email, 
        password:hash
       })
       await newUser.save();
       res.send({message:"Registered Successfully Done..."})
    })
})

app.post('/login', async(req, res)=>{
    const{email, password}=req.body;
    const isUser=await UserModel.findOne({email})
    if(isUser){
        const hashedPassword=isUser.password;
        const result=bcrypt.compareSync(password, hashedPassword);
        if(result){
            const token=jwt.sign({ foo: 'bar' }, process.env.SECRET_KEY, (err, token)=>{
                if(err){
                    res.send({message:"Login Failed!"})
                }else{
                    res.send({message:"Login Successfully...", token:token})
                }
            })
        }else{
            res.send({message:"Login Failed!"})
        }
    }
})


app.listen(PORT, async()=>{
    try{
        await connection;
        console.log('connect to db')
    }catch(err){
        console.log('unable to connect')
    }
})
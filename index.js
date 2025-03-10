const express=require('express');
const jwt=require('jsonwebtoken');
const JWT_SECRET='JWT_SECRET';

const app=express();

app.use(express.json());

const users=[];


// auth middleware to varify the user

function auth(req,res,next){
    const token=req.headers.authorization;
    const userdetails=jwt.verify(token,JWT_SECRET)
    const user= users.find(user=>user.username===userdetails.username);
    if(user){
        req.userdetails=userdetails;
        next();
    }
    else{
        res.json({
            'message':'Unauthorized user'
        });
    }
}

// function generateToken() {
//     let options = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

//    let token="";
//    for(let i=0;i<32;i++){
//         token+=options[Math.floor(Math.random() * options.length)]
//    }
//    return token;
// }


app.get('/',function(req,res){
    res.sendFile(__dirname+'/frontend/index.html')
})

// singup endpoint

app.post('/signup',function(req,res){

    const username=req.body.username;
    const password=req.body.password;

    const user=users.find(user=>user.username===username &&user.password===password);
    if(username.length<5){
        res.json({
            message:'username must be 6 charecter long'
        })
    }else if(password.length<5){
        res.json({
            message:"password must be 6 charecter long"
        })
    }
    else if(user){
        res.json({
            message:'User already exist'
        })
    }else{
        users.push({
            username:username,
            password:password
        })
    
        res.json({
            message:'user signed up successfully',
            username:username
        })
    }

})

//signin endpoint

app.post('/signin',function(req,res){

    const username=req.body.username;
    const password=req.body.password;

    let user=users.find(user=>user.username===username&&user.password===password);
    if(user){
        // const token=generateToken();   ==> custom token logic
        const token=jwt.sign({username:username},JWT_SECRET);
        user.token=token;
        // res.header('jwt',token)
        res.json({
            message:'User successfully signed in',
            token:token
        })
    }
    res.json({
        message:'Invalid username or password'
    })

    
})


// authenticated end point

app.get('/userDetails',auth,function(req,res){
    const userdetails=req.userdetails;
    const user=users.find(user=>user.username===userdetails.username);
    if(user){
        res.json({
            message:'Authorized user',
            username:user.username,
            password:user.password
        })
    }else{
        res.json({
            message:'Unauthorized'
        })
    }
})




app.listen(3000)
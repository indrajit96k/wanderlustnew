function otpgenerator(){
    let num=0;
    for(let i=1;i<=6;i++){
       let x= Math.floor(Math.random()*10)+1;
        num=num*10+x;

    }
    // return num;
    // console.log(num);
    return num;
}
module.exports=otpgenerator;
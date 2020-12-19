
const AWS=require('aws-sdk');

AWS.config.update({
  accessKeyId:process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
  region:process.env.AWS_REGION
});

const ses=new AWS.SES({apiVersion:'2010-12-01'});


exports.register = (req, res) => {
  const{name,email,password}=req.body;
  const params={
    Source: process.env.EMAIL_FROM,
    Destination:{
      ToAddresses:[email]
    },
    ReplyToAddresses:[process.env.EMAIL_TO],
    Message:{
      Body:{
        Html:{
          Charset:'UTF-8',
          Data:`<html><body><h1 style='color:red'>Hello ${name}</h1><p>Test email</p></body></html>`
        }
      },
      Subject:{
        Charset:'UTF-8',
        Data: 'Complete your registration'
      }
    }
  };

  const sendEmailOnregister=ses.sendEmail(params).promise();

  sendEmailOnregister
  .then(data=>{
    console.log('email submitted to ses!',data);
    res.send('Email sent');
  })
  .catch(error=>{
    console.log(error);
    res.send('email failed');
  });
};










const express=require('express');
const router=express.Router();


router.get('/register', (req, res) => {
  res.json({
    data: 'you hit register end point middleware'
  })
});

module.exports=router;

exports.read=(req,res)=>{
  const profile=req.profile;
  profile.hashed_password=undefined;
  profile.salt=undefined;
  return res.status(200).json(profile);
}
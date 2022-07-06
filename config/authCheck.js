module.exports = {
    isAuthorized: async (req,res,next) => {
        if (req.session.user) {
            next()
        } else {
            res.redirect("/");
        }
    },
    isVerified: async (req,res,next) => {
        if(req.session.user.isVerified){
            next()
        }else{
            res.redirect('/auth/verify')
        }
    }
}
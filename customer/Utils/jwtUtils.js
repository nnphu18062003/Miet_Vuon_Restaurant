
function authMiddleware(options = { session: true }) {
    return (req, res, next) => {
      if (options.session) {
        if (req.isAuthenticated()) {
          return next();
        } else {
          res.redirect('/login'); 
        }
      } else {
        return next();
      }
    };
  }

module.exports.authMiddleware=authMiddleware;

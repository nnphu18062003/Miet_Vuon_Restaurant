const logoutService = require('./logoutService');

function logout(req, res) {
    if (req.session) {
        
        req.session.destroy(err => {
          if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Could not log out.');
          }
          
          res.clearCookie('connect.sid');
       
          res.redirect('/login');
        });
      } else {
    
        res.redirect('/login');
      }
}


module.exports = {
    logout,
};
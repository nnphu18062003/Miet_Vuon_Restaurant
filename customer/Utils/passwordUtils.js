const crypto=require('crypto');
function genPassword(password) {
    return new Promise((resolve, reject) => {
        var salt = crypto.randomBytes(16).toString('hex');
        crypto.pbkdf2(password, salt, 310000, 32, 'sha256', (err, genHashedPassword) => {
            if (err) return reject(err);
            resolve({
                salt: salt,
                hashedPassword: genHashedPassword.toString('hex')
            });
        });
    });
}

function validPassword(password, hashedPassword, salt) {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, 310000, 32, 'sha256', (err, hashVerify) => {
            if (err) return reject(err);
          
            console.log(hashedPassword);

            console.log(hashVerify.toString('hex'));
            resolve(hashedPassword === hashVerify.toString('hex'));
        });
    }); 
}



module.exports.validPassword=validPassword;
module.exports.genPassword=genPassword;





const {genPassword, validPassword} = require('../Utils/passwordUtils');
const pool = require('../../config/database');

async function getUserById(id) {
    try {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        if (result.rows.length > 0) {
            return result.rows[0];
        }
        return null;
    } catch (error) {
        console.error('Error fetching user by id', error);
        return null;
    }
}
async function getUserProfile(id) {
    try {
        const result = await pool.query(`
            SELECT email, name, address_line, phone
            FROM users u 
            LEFT JOIN addresses a ON u.id = a.user_id AND a.isdefault = true 
            WHERE u.id = $1
        `, [id]);

        if (result.rows.length > 0) {
            const userProfile = result.rows[0];
            
            
            if (!userProfile.address_line) {
                userProfile.address_line = '';  
            }
            if(!userProfile.phone){
                userProfile.phone='';
            }

            return userProfile;
        }

        return null;
    } catch (error) {
        console.error('Error fetching user profile by id', error);
        return null;
    }
}

async function getAllUserAddressById(id) {
    try {
        const query = "SELECT address_id, address_line, phone, email, name, isdefault FROM addresses a join users u on a.user_id=u.id WHERE a.user_id = $1";
        const result = await pool.query(query, [id]);

        if (result.rows.length > 0) {
            return result.rows;
        } else {
            return []; 
        }
    } catch (error) {
        console.error('Error fetching user address by id:', error);
        return null;
    }
}


async function createUserProfile(id, address, isdefault) {
    try {
        if (isdefault) {
            await pool.query(
                "UPDATE addresses SET isdefault = false WHERE user_id = $1 AND isdefault = true",
                [id]
            );
        }

        await pool.query(
            "insert into addresses (address_line, isdefault, user_id) VALUES ($1, $2, $3)",
            [address, isdefault, id]
        );
    } catch (error) {
        console.error('Error updating user address', error);
        throw error;
    }
}

async function updateUserProfile(user_id,name,email,address_line,phoneNumber){
    try{
       
        await pool.query(
            "UPDATE addresses SET address_line=$1 WHERE isdefault = true",
            [address_line]
        );
        

        await pool.query(
            "UPDATE users SET name=$1, email=$2, phone=$3 WHERE id = $4",
            [name,email,phoneNumber,user_id]
        );
    }catch (error) {
        console.error('Error updating user address', error);
        throw error;
    }
}

async function updateUserAddress(address_id,user_id,isdefault,address_line) {
    try{
        if (isdefault) {
            await pool.query(
                "UPDATE addresses SET isdefault = false WHERE user_id = $1 AND isdefault = true",
                [user_id]
            );
        }

        await pool.query(
            "UPDATE addresses SET isdefault = $1, address_line=$2 WHERE user_id = $3 AND address_id =$4 ",
            [isdefault,address_line, user_id, address_id]
        );
    }catch (error) {
        console.error('Error updating user address', error);
        throw error;
    }
}

async function deleteAddressById(address_id,user_id){
    try{
        await pool.query(
            "DELETE FROM addresses WHERE address_id = $1 and user_id = $2 ",
            [ address_id,user_id]
        );
    }catch (error) {
        console.error('Error updating user address', error);
        throw error;
    }
}
// async function updateUserEmail(id, email) {
//     try {
//         await pool.query(
//             "UPDATE users SET email = $1 WHERE id = $2",
//             [email, id]
//         );
//     } catch (error) {
//         console.error('Error updating user email', error);
//         throw error;
//     }
// }


module.exports = {
    getUserById,
    getAllUserAddressById,
    getUserProfile,
    createUserProfile,
    updateUserAddress,
    deleteAddressById,
    updateUserProfile
};
const User = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-confirmPassword')
        res.json({
            status: "SUCCESS",
            data: users
        });
    } catch (error) {
        res.status(500).json({
            status: 'Failure',
            message: 'Something went wrong'
        });
    }
};

const getUser = async (req, res) => {
    try {
      const userId = req.params.id;
      
      // Fetch the user by ID and select the fields you need, excluding 'confirmPassword'
      const user = await User.findById(userId).select('firstName lastName email ');
  
      if (!user) {
        return res.status(404).json({
          status: 'Failure',
          message: 'User not found',
        });
      }

    
  
      // Respond with the user's data, including the desired statistics
      res.json({
        status: "SUCCESS",
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        }
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({
        status: 'Failure',
        message: 'Something went wrong',
      });
    }
  };
  
const registerUser = async (req, res) => {
    try {
        const { firstName,lastName, email, password, confirmPassword } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists, please login or use another email address'
            });
        } else {
            if (password !== confirmPassword) {
                return res.status(400).json({
                    message: 'Passwords do not match'
                });
            }

            const encryptedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                firstName,
                lastName,
                email,
                password: encryptedPassword
            });
            res.json({
                status: "SUCCESS",
                message: 'User Signup successful',
                userId: newUser._id // Include the userId in the response
            });

            console.log('userId:', newUser._id) // Correct logging
        }
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({
            status: 'Failure',
            message: 'Something went wrong'
        });
    }
};


const loginUser = async (req, res, next) => {
    console.log('Login function called');
    try {
        console.log('Received login request:', req.body);
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            console.log('User not found with email:', email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        console.log('Found user:', existingUser);

        const correctPassword = await bcrypt.compare(password, existingUser.password);
        if (!correctPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userID: existingUser._id },
            process.env.Private_key,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            message: 'User login successful',
            email: existingUser.email,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            token,
            userId: existingUser._id
        });
    } catch (error) {
        console.error('Error during login process:', error);
        next(error);
    }
};


const updateUser = async (req,res)=>{
    try{
        const userId = req.params.id;
        const {firstName,lastName,email, oldPassword, newPassword} = req.body;

        console.log('Update request:', { userId,firstName,lastName, email, oldPassword, newPassword });

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: 'Failure',
                message: 'User not found'
            });
        }

        console.log('Found user:', user);

        if (!oldPassword || !user.password) {
            return res.status(400).json({
                message: 'Old password is required'
            });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Incorrect old password'
            });
        }

        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.password = encryptedPassword;

        await user.save();

        res.json({
            status: 'SUCCESS',
            message: 'User updated successfully'
        });

    }catch(error){
        console.error('Error updating user:', error);
        res.status(500).json({
            status: 'Failure',
            message: 'Something went wrong'
        });

    }
}

module.exports = {
    getUser,
    getUsers,
    registerUser,
    loginUser,
    updateUser
};

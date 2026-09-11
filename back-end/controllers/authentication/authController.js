const authModel = require('../../models/authentication/authModel');
const bcrypt = require('bcrypt');
const {
    generateAccessToken,
    generateRefreshToken
} = require('../../utils/jwt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Required all fields!'
        });
    }

    try {

        const existing = await authModel.findByEmail(email);

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'User not found!'
            });
        }

        const match = await bcrypt.compare(
            password,
            existing.password
        );

        if (!match) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password!'
            });
        }

        const accessToken = generateAccessToken(existing);
        const refreshToken = generateRefreshToken(existing);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: 'Login successful!',
            token: accessToken,
            user: {
                id: existing.id,
                email: existing.email,
                role: existing.role
            }
        });

    } catch (err) {

        console.error('Login error:', err);

        return res.status(500).json({
            success: false,
            message: 'Please try again later!'
        });
    }
};


exports.refresh = async (req, res) => {

    const token = req.cookies?.refreshToken;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No refresh token'
        });
    }

    try {

        const payload = jwt.verify(
            token,
            process.env.REFRESH_SECRET
        );

        const user = await authModel.findById(payload.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const newAccessToken = generateAccessToken(user);

        return res.status(200).json({
            success: true,
            token: newAccessToken
        });

    } catch (err) {

        console.error('Refresh token error:', err);

        return res.status(403).json({
            success: false,
            message: 'Invalid refresh token'
        });
    }
};


exports.logout = async (req, res) => {

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax'
    });

    return res.status(200).json({
        success: true,
        message: 'Logout successful'
    });
};
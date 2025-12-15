// app/profile/profileController.js
const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const profileService = require('./profileService');
const pool = require('../../config/database');
const { response } = require('express');
const { user } = require('pg/lib/defaults');

async function renderProfilePage(req, res) {
    try {
        const userID = res.locals.user ? res.locals.user.id : null;
        if (!userID) {
            return res.redirect('/login');
        }
        const userAddresses=await profileService.getAllUserAddressById(userID);
        const userProfile = await profileService.getUserProfile(userID);
        const response={
            title: 'Profile - Miet Vuon Restaurant', 
            user_id: userID, 
            addresses: userAddresses,
            userProfile:userProfile
        }
        res.render('profile',response);
    } catch (error) {
        console.error('Error rendering profile page:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    }
}

async function createUserAddress(req, res) {
    try {
        const userID = res.locals.user ? res.locals.user.id : null;
        if (!userID) {
            return res.redirect('/login');
        }
        
        const {  address_line, setAsDefault } = req.body;
        const isDefault = setAsDefault === 'on';

        await  profileService.createUserProfile(userID,address_line,isDefault);
        res.redirect('/account');

    } catch (error) {
        console.error('Error create address:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    }
}

async function updateUserProfile(req,res){
    try {
        const userID = res.locals.user ? res.locals.user.id : null;
        if (!userID) {
            return res.redirect('/login');
        }
        
        const {name,email, phonenumber, address_line } = req.body;
        await  profileService.updateUserProfile(userID,name,email,address_line,phonenumber);
        res.redirect('/account');

    } catch (error) {
        console.error('Error create address:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    }
}

async function updateUserAddressInfo(req,res){
    try{
        const userID = res.locals.user ? res.locals.user.id : null;
        if (!userID) {
            return res.redirect('/login');
        }
       
        const {address_id, address_line, setAsDefault } = req.body;
        console.log(address_id);
        const isDefault = setAsDefault === 'on';
        await  profileService.updateUserAddress(address_id,userID,isDefault,address_line);
        res.redirect('/account');

    }catch(error){
        console.error('Error updating address:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    }
}

async function deleteUserAddress(req,res){
    try{
        const userID = res.locals.user ? res.locals.user.id : null;
        if (!userID) {
            return res.redirect('/login');
        }
        const addressId = req.params.addressId;
        console.log(addressId);

        await  profileService.deleteAddressById(addressId,userID);
        res.status(200).json({ message: "Address deleted successfully" });
    }catch(error){
        console.error('Error delete address:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    }
}

module.exports = {
    renderProfilePage,
    createUserAddress,
    updateUserAddressInfo,
    deleteUserAddress,
    updateUserProfile
};
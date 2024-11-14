const express=require('express');
const router=express.Router();
const authRoutes =require('./auth.route');
const contactRoutes=require('./contact.route');
const messagesRoutes =require('./messages.route');
const channelRoutes=require('./channel.route');

// Include user routes
router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/contacts', contactRoutes);
router.use('/api/v1/messages', messagesRoutes);
router.use('/api/v1/channel', channelRoutes);


module.exports = router;
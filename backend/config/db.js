const mongoose = require('mongoose');
 
const connectDB= async () => {
    try {
        await
        mongoose.connect('mongodb+srv://shubhammjadhavv:yMWt0AtgZ6SM0d1B@cluster0.dugriwc.mongodb.net/meanAuth?retryWrites=true&w=majority&appName=Cluster0',{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
module.exports=connectDB;
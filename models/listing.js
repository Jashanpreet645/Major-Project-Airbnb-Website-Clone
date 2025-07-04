const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image:{
        type:String,
        default:"https://imgs.search.brave.com/xFfxOIAozO56BYoMu-OBb4u8SZcg4hSkTNqQ9W69oMc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzE0LzAzLzcwLzU0/LzM2MF9GXzE0MDM3/MDU0OTJfSXo5YjZW/OGJlajhoejhidklS/YUVsQlltN0ZvaFVG/VnQuanBn",
        set: (v)=>v===""?"https://www.istockphoto.com/photos/image-not-found":v
    },
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    }
})

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
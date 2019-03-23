const mongoose = require('mongoose');

const carSchema = mongoose.Schema({
    userId : String,

    carDetails : {
        nameOfCar : String,
        modelYear : String,
        plateNumber : String,
        engineNumber : String,
        colour : String,
        stereo : String,
        spareTire : String,
        repairTools : String,
        fireExtinguisher : String,
        challenges : String,
        price : String,
        noteToRenter: String
        

    }
});

module.exports = mongoose.model('car', carSchema);
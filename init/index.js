const Listing=require("../models/listings");
const initData=require("./data.js");
const mongoose=require("mongoose");
main()
.then(()=>{
    console.log("Connected");
})
.catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/interngecacs');
}
const intiData=async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}
intiData(); 
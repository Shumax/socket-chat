import mongoose from "mongoose"

const mongooseConnect = mongoose.connect(process.env.DB_STRING)

export default mongooseConnect

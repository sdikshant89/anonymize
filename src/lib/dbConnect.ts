import mongoose from "mongoose";
const adminPassword = encodeURIComponent(process.env.MONGO_ATLAS_ADMIN_PASS_PW || "");

type ConnectionObject = {
    isConnedted?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void>{
    if(connection.isConnedted){
        console.log("Already connected to db");
        return;
    }
    try{
        const db = await mongoose.connect('mongodb+srv://'+ 
            process.env.MONGO_ATLAS_ADMIN_USER +':' +
            adminPassword +
            process.env.MONGO_ATLAS_DATA_CLUSTER_EXT || '', {});
            
        connection.isConnedted = db.connections[0].readyState;
        console.log("Db connected!");
    }catch(err){
        console.log("DB connection failed", err);
        process.exit(1);
    }
}

export default dbConnect;
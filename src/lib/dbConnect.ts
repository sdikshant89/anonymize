import mongoose from "mongoose";

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
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {});
        connection.isConnedted = db.connections[0].readyState;
        console.log("Db connected!");
    }catch(err){
        console.log("DB connection failed", err);
        process.exit(1);
    }
}

export default dbConnect;
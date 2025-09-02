import mongoose from "mongoose";
import { DB_NAME } from "../utils/constants.js";
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${ DB_NAME}`);

        console.log(
            `\n🔗 ================================\n` +
            `✅ MongoDB Connected!\n` +
            `   🖥️  Host: ${conn.connection.host}\n` +
            `   📂 Database: ${conn.connection.name}\n` +
            `==================================\n`
        );
    } catch (error) {
        console.error(
            `\n❌ ================================\n` +
            ` MongoDB Connection Failed!\n` +
            ` Error: ${error.message}\n` +
            `==================================\n`
        );
        process.exit(1);
    }
};



export default connectDB;

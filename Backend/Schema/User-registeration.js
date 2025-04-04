import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const UserRegisterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin'],


  },
}, { timestamps: true });

const UserRegister = mongoose.models.UserRegister || mongoose.model("UserRegister", UserRegisterSchema);

export default UserRegister;

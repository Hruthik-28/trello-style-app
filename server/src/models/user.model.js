import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: [true, "fullName is required"]
        },
        email: {
            type: String,
            required: [true, "email is required"],
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: [true, "Password is required"]
        }
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    return next();
});

userSchema.methods = {
    comparePassword: async function (plainTextPassword) {
        return await bcrypt.compare(plainTextPassword, this.password);
    },
    generateAccessToken: function () {
        return jwt.sign(
            {
                _id: this._id,
                email: this.email,
                fullName: this.fullName
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            }
        );
    }
};

export const User = model("User", userSchema);

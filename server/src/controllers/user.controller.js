import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;

    if ([fullName, email, password].some((field) => field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const userExists = await User.findOne({
        email
    });

    if (userExists) {
        throw new ApiError(409, "user with this email already exists");
    }

    const user = await User.create({
        fullName,
        email,
        password
    });

    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
        throw new ApiError(500, "user registration failed, please try again");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                createdUser,
                "user registered successfully!!!."
            )
        );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if ([email, password].some((field) => field.trim() === "")) {
        throw new ApiError(400, "Email and password both are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "user with email not found. Please Register");
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid credentials.");
    }

    const accessToken = await user.generateAccessToken();

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(
                200,
                { accessToken },
                "user loggedIn successfully!!!."
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, {}, "User logout successfull !!!."));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(200, req.user, "current user fetched successfully")
        );
});

export { registerUser, loginUser, logoutUser, getCurrentUser };

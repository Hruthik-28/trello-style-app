import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    loginUser,
    registerUser,
    logoutUser,
    getCurrentUser
} from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);

export default router;

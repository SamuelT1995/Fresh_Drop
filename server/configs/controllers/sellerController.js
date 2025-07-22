//login seller: /api/seller/login

import jwt from "jsonwebtoken";
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      password === process.env.SELLER_PASSWORD &&
      email === process.env.SELLER_EMAIL
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.cookie("token", token, {
        httpOnly: true,
        seecure: process.env.NODE_ENV === "production", //use secure cookie in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //csrf protection
        maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiration time
      });

      returnres.json({ success: true, message: "Logged out" });
    } else {
      return res.json({ success: false, message: "invalid credentials" });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
//seller isauth/api/seller/is-auth
export const isSellerAuth = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//seller logout: /api/seller/logout

export const sellerLogout = async (req, res) => {
  try {
    res.clearCookie("sellerToken", {
      httpOnly: true,
      seecure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "null" : "strict",
    });
    return res.json({ success: true, message: "Logged out" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

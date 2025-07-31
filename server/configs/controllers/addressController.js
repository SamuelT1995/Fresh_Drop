import Address from "../../models/address.js";

// add address: /api/address/add
export const addAddress = async (req, res) => {
  try {
    // --- FIX 1: Get userId from the authUser middleware, NOT the request body ---
    const userId = req.userId;
    const addressData = req.body.address;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication required." });
    }

    // Combine the form data with the secure user ID
    const newAddress = { ...addressData, userId };

    await Address.create(newAddress);

    // --- FIX 2: Send a proper success message ---
    res.json({ success: true, message: "Address added successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

// get addresses: /api/address/get
export const getAddress = async (req, res) => {
  try {
    // --- FIX 3: Get userId from the middleware to securely fetch the user's addresses ---
    const userId = req.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication required." });
    }

    const addresses = await Address.find({ userId });
    res.json({ success: true, addresses });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

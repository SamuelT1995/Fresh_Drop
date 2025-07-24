import { v2 as cloudinary } from "cloudinary";
import Product from "../../models/product.js"; // Make sure this path to your model is correct

// =========================================================================
// ADD PRODUCT - THIS IS THE CORRECTED FUNCTION
// =========================================================================
export const addProduct = async (req, res) => {
  try {
    const productData = JSON.parse(req.body.productData);
    const files = req.files; // Files from the upload form

    // Check if any files were uploaded
    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Error: No images were uploaded." });
    }

    // Upload all files to Cloudinary and get an array of their URLs
    const imageUrls = await Promise.all(
      files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "image",
          folder: "products", // This keeps your Cloudinary account organized
        });
        return result.secure_url;
      })
    );

    // --- THIS IS THE FIX ---
    // Your schema has a field named `image` which must be an array.
    // This code creates the product object correctly by putting the array
    // of Cloudinary URLs (`imageUrls`) into the `image` field.
    const newProduct = {
      ...productData,
      image: imageUrls, // The array of URLs is placed in the 'image' field
    };

    // Save the new product to the database
    await Product.create(newProduct);

    res.json({ success: true, message: "Product Added Successfully" });
  } catch (error) {
    // This provides better error information in your server logs
    console.error("Error in addProduct controller:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Could not add product.",
    });
  }
};

// =========================================================================
// Your other functions (These were already okay)
// =========================================================================

// GET PRODUCT LIST
export const productList = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET PRODUCT BY ID
export const productById = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// CHANGE PRODUCT STOCK
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    await Product.findByIdAndUpdate(id, { inStock });
    res.json({ success: true, message: "Stock Updated" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

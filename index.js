import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());

// ==================== Configuration ====================
const MONGO_URI =
  "mongodb+srv://xjarifx:nca2aesv3fkEt8MA@cluster0.uh9xe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // I know it should be in .env
const SECRET_KEY = "haha"; // Replace with a secure key in production
const PORT = 3000;

// ==================== Database Connection ====================
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  });

// ==================== Schemas and Models ====================
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
});

const User = mongoose.model("User", userSchema);

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const Item = mongoose.model("Item", itemSchema);

// ==================== Middleware ====================
// Authentication Middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ msg: "No token provided" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

// Authorization Middleware
const authorize = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ msg: "Access denied" });
  }
  next();
};

// ==================== Utility Functions ====================
// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, {
    expiresIn: "1h",
  });
};

// Validate Request Data
const validateFields = (fields, data) => {
  for (const field of fields) {
    if (!data[field]) {
      return `${field} is required`;
    }
  }
  return null;
};

// ==================== Routes ====================
// User Registration
app.post("/register", async (req, res) => {
  const { email, password, role } = req.body;

  const validationError = validateFields(["email", "password"], req.body);
  if (validationError) return res.status(400).json({ msg: validationError });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ msg: "Error registering user", error: err.message });
  }
});

// User Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const validationError = validateFields(["email", "password"], req.body);
  if (validationError) return res.status(400).json({ msg: validationError });

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    const token = generateToken(user);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: "Error logging in", error: err.message });
  }
});

// Get All Items (Authenticated)
app.get("/items", authenticate, async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching items", error: err.message });
  }
});

// Create Item (Admin Only)
app.post("/items", authenticate, authorize("admin"), async (req, res) => {
  const { name, description, quantity } = req.body;

  const validationError = validateFields(
    ["name", "description", "quantity"],
    req.body
  );
  if (validationError) return res.status(400).json({ msg: validationError });

  try {
    const newItem = new Item({ name, description, quantity });
    await newItem.save();
    res.status(201).json({ msg: "Item created successfully" });
  } catch (err) {
    res.status(400).json({ msg: "Error creating item", error: err.message });
  }
});

// Update Item (Admin Only)
app.put("/items/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedItem) return res.status(404).json({ msg: "Item not found" });

    res.json({ msg: "Item updated successfully", updatedItem });
  } catch (err) {
    res.status(400).json({ msg: "Error updating item", error: err.message });
  }
});

// Delete Item (Admin Only)
app.delete("/items/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ msg: "Item not found" });

    res.json({ msg: "Item deleted successfully" });
  } catch (err) {
    res.status(400).json({ msg: "Error deleting item", error: err.message });
  }
});

// ==================== Start Server ====================
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

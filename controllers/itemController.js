import Item from "../models/itemModel.js";

// ==================== Controllers ====================

// Get All Items (Authenticated)
export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching items", error: err.message });
  }
};

// Create Item (Admin Only)
export const createItem = async (req, res) => {
  const { name, description, quantity } = req.body;

  try {
    const newItem = new Item({ name, description, quantity });
    await newItem.save();
    res.status(201).json({ msg: "Item created successfully" });
  } catch (err) {
    res.status(400).json({ msg: "Error creating item", error: err.message });
  }
};

// Update Item (Admin Only)
export const updateItem = async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedItem) return res.status(404).json({ msg: "Item not found" });

    res.json({ msg: "Item updated successfully", updatedItem });
  } catch (err) {
    res.status(400).json({ msg: "Error updating item", error: err.message });
  }
};

// Delete Item (Admin Only)
export const deleteItem = async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ msg: "Item not found" });

    res.json({ msg: "Item deleted successfully" });
  } catch (err) {
    res.status(400).json({ msg: "Error deleting item", error: err.message });
  }
};

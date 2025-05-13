import mongoose from "mongoose"; // Use import instead of require

const shopSchema = new mongoose.Schema({
  name: String,
  image: String,
  address: String,
  mapsLink: String,
  telephone: {
    type: String,
    required: true, // Optional: make it required if necessary
  },
});

export default mongoose.model("Shop", shopSchema); // Use export default

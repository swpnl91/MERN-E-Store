import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {            // used for slugifying, for ex. - '.../package-slugify'. To get the '-'/'_' in URLs (which is great for SEO)
    type: String,
    lowercase: true,
  },
});

export default mongoose.model("Category", categorySchema);
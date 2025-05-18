const {articleModel} = require("../model/ArticleModel")
const handleCreateBlog = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res
      .status(400)
      .json({ status: 400, message: "Title and content are required" });
  }

  try {
    const blog = await articleModel.create({
      title,
      content,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      status: 201,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (err) {
    return res.status(500).json({ status: 500, message: err.message });
  }
};
const handleGetAllBlogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 6; 
  const skip = (page - 1) * limit;

  try {
    const blogs = await articleModel
      .find()
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await articleModel.countDocuments();

    return res.status(200).json({
      status: 200,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      data: blogs,
    });
  } catch (err) {
    return res.status(500).json({ status: 500, message: err.message });
  }
};


// Edit blog
const handleEditBlog = async (req, res) => {
  const blogId = req.params.id;
  const userId = req.user.id;
  const { title, content } = req.body;

  try {
    const blog = await articleModel.findById(blogId);

    if (!blog) {
      return res.status(404).json({ status: 404, message: "Blog not found" });
    }

    if (blog.createdBy.toString() !== userId) {
      return res
        .status(403)
        .json({ status: 403, message: "Unauthorized to edit this blog" });
    }

    const updatedFields = {};
    if (title) updatedFields.title = title;
    if (content) updatedFields.content = content;

    const updatedBlog = await articleModel.findByIdAndUpdate(
      blogId,
      updatedFields,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      status: 200,
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (err) {
    return res.status(500).json({ status: 500, message: err.message });
  }
};

// Delete blog
const handleDeleteBlog = async (req, res) => {
  const blogId = req.params.id;
  const userId = req.user.id;

  try {
    const blog = await articleModel.findById(blogId);

    if (!blog) {
      return res.status(404).json({ status: 404, message: "Blog not found" });
    }

    if (blog.createdBy.toString() !== userId) {
      return res
        .status(403)
        .json({ status: 403, message: "Unauthorized to delete this blog" });
    }

    await articleModel.findByIdAndDelete(blogId);

    return res
      .status(200)
      .json({ status: 200, message: "Blog deleted successfully" });
  } catch (err) {
    return res.status(500).json({ status: 500, message: err.message });
  }
};



// Get a blog by ID
const handleGetBlogById = async (req, res) => {
  const blogId = req.params.id;

  try {
    const blog = await articleModel
      .findById(blogId)
      .populate("createdBy", "name");

    if (!blog) {
      return res.status(404).json({ status: 404, message: "Blog not found" });
    }

    return res.status(200).json({
      status: 200,
      message: "Blog fetched successfully",
      data: blog,
    });
  } catch (err) {
    return res.status(500).json({ status: 500, message: err.message });
  }
};

const handleGetMyBlogs = async (req, res) => {
  const userId = req.user.id; 
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const skip = (page - 1) * limit;

  try {
    
    const blogs = await articleModel
      .find({ createdBy: userId })
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    
    const total = await articleModel.countDocuments({ createdBy: userId });

    return res.status(200).json({
      status: 200,
      message: "User blogs fetched successfully",
      total,
      data: blogs,
    });
  } catch (err) {
    return res.status(500).json({ status: 500, message: err.message });
  }
};




module.exports = {
  handleCreateBlog,
  handleGetAllBlogs,
  handleEditBlog,
  handleDeleteBlog,
  handleGetBlogById,
  handleGetMyBlogs,
};
  
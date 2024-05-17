const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const { ErrorHandler } = require("../middlewares/error");
const userModel = require("../models/userModel");
const blogModel = require("../models/blogModel");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

// ! post a blog
const blogPost = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Please upload blog main image!", 400));
  }

  const { mainImage, paraOneImage, paraTwoImage } = req.files;
  if (!mainImage) {
    return next(new ErrorHandler("Please upload blog main image!", 400));
  }

  const allowedFormats = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  if (
    !allowedFormats.includes(mainImage.mimetype) ||
    (paraOneImage && !allowedFormats.includes(paraOneImage.mimetype)) ||
    (paraTwoImage && !allowedFormats.includes(paraTwoImage.mimetype))
  ) {
    return next(
      new ErrorHandler(
        "Invalid file type. Only JPG, JPEG, PNG and WEBP Formats Are Allowed!",
        400
      )
    );
  }

  const {
    title,
    intro,
    paraOneDescription,
    paraOneTitle,
    paraTwoDescription,
    paraTwoTitle,
    category,
    published,
  } = req.body;

  const createdBy = req.user._id;
  const authorName = req.user.name;
  const authorAvatar = req.user.avatar.url;

  if (!title || !category || !intro) {
    return next(
      new ErrorHandler("Please fill Title, Intro and Category!", 400)
    );
  }

  const uploadPromises = [
    cloudinary.uploader.upload(mainImage.tempFilePath),
    paraOneImage
      ? cloudinary.uploader.upload(paraOneImage.tempFilePath)
      : Promise.resolve(null),
    paraTwoImage
      ? cloudinary.uploader.upload(paraTwoImage.tempFilePath)
      : Promise.resolve(null),
  ];

  const [mainImageRes, paraOneImageRes, paraTwoImageRes] = await Promise.all(
    uploadPromises
  );

  if (
    !mainImageRes ||
    mainImageRes.error ||
    (paraOneImage && (!paraOneImageRes || paraOneImageRes.error)) ||
    (paraTwoImage && (!paraTwoImageRes || paraTwoImageRes.error))
  ) {
    return next(
      new ErrorHandler("Error occured while uploading one or more images!", 500)
    );
  }

  const blogData = {
    title,
    intro,
    paraOneDescription,
    paraOneTitle,
    paraTwoDescription,
    paraTwoTitle,
    category,
    createdBy,
    authorAvatar,
    authorName,
    published,
    mainImage: {
      public_id: mainImageRes.public_id,
      url: mainImageRes.secure_url,
    },
  };

  if (paraOneImageRes) {
    blogData.paraOneImage = {
      public_id: paraOneImageRes.public_id,
      url: paraOneImageRes.secure_url,
    };
  }
  if (paraTwoImageRes) {
    blogData.paraTwoImage = {
      public_id: paraTwoImageRes.public_id,
      url: paraTwoImageRes.secure_url,
    };
  }

  const blog = await blogModel.create(blogData);

  res.status(200).json({
    success: true,
    message: "Blog Uploaded!",
    blog: blog,
  });
});

// ! delete a blog
const deleteBlog = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const blog = await blogModel.findByIdAndDelete({ _id: id });
  if (!blog) {
    return next(new ErrorHandler("Blog not found!", 404));
  }
  res.status(200).json({
    success: true,
    message: "Blog deleted!",
  });
});

//! get all blogs
const getAllBlogs = catchAsyncErrors(async (req, res, next) => {
  const allBlogs = await blogModel.find({ published: true });
  res.status(200).json({
    success: true,
    blogs: allBlogs,
  });
});

// ! get single blog
const getSingleBlog = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const blog = await blogModel.findById({ _id: id });
  if (!blog) {
    return next(new ErrorHandler("Blog not found!", 404));
  }
  res.status(200).json({
    success: true,
    blog: blog,
  });
});

// ! get my blogs
const getMyBlogs = catchAsyncErrors(async (req, res, next) => {
  const createdBy = req.user._id;
  const blogs = await blogModel.find({ createdBy: createdBy });
  res.status(200).json({
    success: true,
    blogs: blogs,
  });
});

//! update blog
const updateBlog = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let blog = await blogModel.findById(id);
  if (!blog) {
    return next(new ErrorHandler("Blog not found!", 404));
  }
  const newBlogData = {
    title: req.body.title,
    intro: req.body.intro,
    category: req.body.category,
    paraOneTitle: req.body.paraOneTitle,
    paraOneDescription: req.body.paraOneDescription,
    paraTwoTitle: req.body.paraTwoTitle,
    paraTwoDescription: req.body.paraTwoDescription,
    published: req.body.published,
  };
  if (req.files) {
    const { mainImage, paraOneImage, paraTwoImage } = req.files;
    const allowedFormats = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];
    if (
      (mainImage && !allowedFormats.includes(mainImage.mimetype)) ||
      (paraOneImage && !allowedFormats.includes(paraOneImage.mimetype)) ||
      (paraTwoImage && !allowedFormats.includes(paraTwoImage.mimetype))
    ) {
      return next(
        new ErrorHandler(
          "Invalid file format. Only PNG, JPG, JPEG and WEBp formats are allowed.",
          400
        )
      );
    }
    if (req.files && mainImage) {
      const blogMainImageId = blog.mainImage.public_id;
      await cloudinary.uploader.destroy(blogMainImageId);
      const newBlogMainImage = await cloudinary.uploader.upload(
        mainImage.tempFilePath
      );
      newBlogData.mainImage = {
        public_id: newBlogMainImage.public_id,
        url: newBlogMainImage.secure_url,
      };
    }

    if (req.files && paraOneImage) {
      if (blog.paraOneImage && blog.paraOneImage.public_id) {
        const blogParaOneImageId = blog.paraOneImage.public_id;
        await cloudinary.uploader.destroy(blogParaOneImageId);
      }
      const newBlogParaOneImage = await cloudinary.uploader.upload(
        paraOneImage.tempFilePath
      );
      newBlogData.paraOneImage = {
        public_id: newBlogParaOneImage.public_id,
        url: newBlogParaOneImage.secure_url,
      };
    }
    if (req.files && paraTwoImage) {
      if (blog.paraTwoImage && blog.paraTwoImage.public_id) {
        const blogParaTwoImageId = blog.paraTwoImage.public_id;
        await cloudinary.uploader.destroy(blogParaTwoImageId);
      }
      const newBlogParaTwoImage = await cloudinary.uploader.upload(
        paraTwoImage.tempFilePath
      );
      newBlogData.paraTwoImage = {
        public_id: newBlogParaTwoImage.public_id,
        url: newBlogParaTwoImage.secure_url,
      };
    }
  }

  blog = await blogModel.findByIdAndUpdate({ _id: id }, newBlogData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Blog Updated!",
    blog: blog,
  });
});

module.exports = {
  blogPost,
  deleteBlog,
  getAllBlogs,
  getSingleBlog,
  getMyBlogs,
  updateBlog,
};

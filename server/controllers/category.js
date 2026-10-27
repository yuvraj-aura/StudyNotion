const Category = require('../models/category');

exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        // validation
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required!',
            })
        }

        // create an entry in DB
        const categoryDetails = await Category.create({
            name: name,
            description: description,
        });
        console.log(categoryDetails);


        return res.status(200).json({
            success: true,
            data: categoryDetails,
            message: 'Category created Successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// getting all tgs
exports.showAllCategories = async (req, res) => {
    try {
        // fetch details from req body
        const allCategory = await Category.find(
            {},
            {
                name: true,
                description: true,
            });

        return res.status(200).json({
            success: true,
            message: 'All Category returned Successfully',
            data: allCategory,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error',
        });
    }
};

exports.categoryPageDetails = async (req, res) => {
    try {
        const { categoryId } = req.body;

        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: "categoryId is required",
            });
        }

        // get courses for the specified category
        const selectedCategory = await Category.findById(categoryId)
            .populate({
                path: "course",
                populate: {
                    path: "instructor",
                    select: "firstName lastName email image",
                },
            })
            .exec();

        if (!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        const selectedCourses = selectedCategory.course || [];

        // Get courses for other categories 
        const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId },
        })
            .populate({
                path: "course",
                populate: {
                    path: "instructor",
                    select: "firstName lastName email image",
                },
            })
            .exec();

        let differentCourses = [];
        for (const cat of categoriesExceptSelected) {
            if (cat.course && cat.course.length > 0) {
                differentCourses.push(...cat.course);
            }
        }

        // Get all courses across all categories
        const allCategories = await Category.find().populate({
            path: "course",
            populate: {
                path: "instructor",
                select: "firstName lastName email image",
            },
        });
        const allCourses = allCategories.flatMap((cat) => cat.course || []);
        const mostSellingCourses = allCourses.slice(0, 10);

        return res.status(200).json({
            success: true,
            data: {
                selectedCategory: {
                    _id: selectedCategory._id,
                    name: selectedCategory.name,
                    description: selectedCategory.description,
                    courses: selectedCourses,
                },
                differentCourses,
                mostSellingCourses,
            },
            message: "Category page details fetched successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to find category",
            error: error.message,
        });
    }
};
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
        // fetch details from req body
        const { categoryId } = req.body

        // get courses for the specified category
        const selectedCategory = await Category.findById(categoryId)
            .populate("courses")
            .exec();

        console.log(selectedCategory);

        if (!selectedCategory) {
            console.log("Category not found");
            return res.status(404).json({
                    success: false,
                    message: 'Category not found',
                })
        }

        // Handle the case when there are no courses
        if (selectedCategory.course.length === 0) {
            console.log("No courses found for the selected category");
            return res
                .status(404)
                .json({
                    success: false,
                    message: 'No courses found for the selected category',
                })
        }

        const selectedCourses = selectedCategory.course;

        // GEt courses for other categories 
        const categoriesExceptSelected = await Category.find({
            _id: {
                $ne: categoryId,
            },
        }).populate("courses").exec();
 
        let differentCourses = [];
        for (const categoroy of categoriesExceptSelected) {
            differentCourses.push(...category.courses);
        }

        // GEt top-selling courses accross all categories
        const allCategories = await Category.find().populate("courses");
        const allCourses = allCategories.flatMap((category) => category.course);
        const mostSellingCourses = allCourses
            .sort((a,b) => b.sold - a.sold)
            .slice(0,10);


        return res.status(200).json({
            success: true,
            message: 'Successfully!',
            selectedCourses: selectedCourses,
            differentCourses: differentCourses,
            mostSellingCourses: mostSellingCourses,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Unable to find category',
            error: error.message
        });
    }
};
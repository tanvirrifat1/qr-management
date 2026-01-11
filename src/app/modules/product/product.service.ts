import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IProduct, UpdateProductPayload } from './product.interface';
import { Product } from './product.model';
import { Category } from '../category/category.model';
import { SubCategory } from '../subCategory/subCategory.model';

const createProductFromDb = async (payload: IProduct) => {
  const { categoryId, subCategoryId } = payload;

  // Fetch both in parallel for better performance
  const [category, subCategory] = await Promise.all([
    Category.findById(categoryId),
    SubCategory.findById(subCategoryId),
  ]);

  // Validate independently
  if (!category) {
    throw new ApiError(StatusCodes.NOT_FOUND, `Category not found`);
  }

  if (!subCategory) {
    throw new ApiError(StatusCodes.NOT_FOUND, `Subcategory not found`);
  }

  return Product.create(payload);
};

// const getAllProducts = async (query: Record<string, unknown>) => {
//   const { page, limit, searchTerm, categoryName, subCategory, ...filterData } =
//     query;

//   const anyConditions: any[] = [{ status: 'active' }];

//   if (categoryName) {
//     const categoriesIds = await Category.find({
//       title: { $regex: categoryName, $options: 'i' },
//     }).distinct('_id');

//     if (categoriesIds.length > 0) {
//       anyConditions.push({ categoryId: { $in: categoriesIds } });
//     }
//   }

//   if (subCategory) {
//     const categoriesIds = await SubCategory.find({
//       title: { $regex: subCategory, $options: 'i' },
//     }).distinct('_id');

//     if (categoriesIds.length > 0) {
//       anyConditions.push({ subCategoryId: { $in: categoriesIds } });
//     }
//   }

//   if (searchTerm) {
//     anyConditions.push({
//       $or: [
//         { title: { $regex: searchTerm, $options: 'i' } },
//         { brand: { $regex: searchTerm, $options: 'i' } },
//         {
//           $expr: {
//             $regexMatch: {
//               input: { $toString: '$price' },
//               regex: searchTerm,
//               options: 'i',
//             },
//           },
//         },
//       ],
//     });
//   }

//   if (Object.keys(filterData).length > 0) {
//     const filterConditions = Object.entries(filterData).map(
//       ([field, value]) => ({ [field]: value })
//     );
//     anyConditions.push({ $and: filterConditions });
//   }

//   // Combine all conditions
//   const whereConditions =
//     anyConditions.length > 0 ? { $and: anyConditions } : {};

//   const pages = parseInt(page as string) || 1;
//   const size = parseInt(limit as string) || 10;
//   const skip = (pages - 1) * size;

//   const result = await Product.find(whereConditions)
//     .populate({
//       path: 'categoryId',
//       select: 'title -_id',
//     })
//     .populate({
//       path: 'subCategoryId',
//       select: 'title -_id',
//     })
//     .sort({
//       rating: -1, // ⭐ Top rating first
//       createdAt: -1, // If same rating, show latest first
//     })
//     .skip(skip)
//     .limit(size)
//     .lean();
//   const count = await Product.countDocuments(whereConditions);

//   return {
//     result,
//     meta: {
//       page: pages,
//       total: count,
//     },
//   };
// };

//get single prodcut

const getAllProducts = async (query: Record<string, unknown>) => {
  const {
    page,
    limit,
    searchTerm,
    categoryName,
    subCategory,
    minPrice,
    maxPrice,
    ...filterData
  } = query;

  const anyConditions: any[] = [{ status: 'active' }];

  // 🔹 Category filter
  if (categoryName) {
    const categoriesIds = await Category.find({
      title: { $regex: categoryName, $options: 'i' },
    }).distinct('_id');

    if (categoriesIds.length > 0) {
      anyConditions.push({ categoryId: { $in: categoriesIds } });
    }
  }

  // 🔹 SubCategory filter
  if (subCategory) {
    const categoriesIds = await SubCategory.find({
      title: { $regex: subCategory, $options: 'i' },
    }).distinct('_id');

    if (categoriesIds.length > 0) {
      anyConditions.push({ subCategoryId: { $in: categoriesIds } });
    }
  }

  // 🔹 Search filter
  if (searchTerm) {
    anyConditions.push({
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { brand: { $regex: searchTerm, $options: 'i' } },
      ],
    });
  }

  // 🔹 Price range filter
  if (minPrice || maxPrice) {
    const priceCondition: any = {};

    if (minPrice) {
      priceCondition.$gte = Number(minPrice);
    }

    if (maxPrice) {
      priceCondition.$lte = Number(maxPrice);
    }

    anyConditions.push({ price: priceCondition });
  }

  // 🔹 Other dynamic filters
  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({ [field]: value })
    );
    anyConditions.push({ $and: filterConditions });
  }

  // 🔹 Final condition
  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await Product.find(whereConditions)
    .populate({
      path: 'categoryId',
      select: 'title -_id',
    })
    .populate({
      path: 'subCategoryId',
      select: 'title -_id',
    })
    .sort({
      rating: -1,
      createdAt: -1,
    })
    .skip(skip)
    .limit(size)
    .lean();

  const count = await Product.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      total: count,
    },
  };
};

const getSingleProduct = async (id: string) => {
  const isExist = await Product.findById(id);
  if (!isExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
  }

  const result = await Product.findById(id);
  return result;
};

const updateProduct = async (id: string, payload: UpdateProductPayload) => {
  const isExistProduct = await Product.findById(id);

  if (!isExistProduct) {
    throw new Error('Product not found');
  }

  isExistProduct.image = isExistProduct.image.filter(
    (img: string) => !payload.imagesToDelete?.includes(img)
  );

  const updateImages = payload.image
    ? [...isExistProduct.image, ...payload.image]
    : isExistProduct.image;

  const updateData = {
    ...payload,
    image: updateImages,
  };

  const result = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  return result;
};

const getMyProduct = async (userId: string, query: Record<string, unknown>) => {
  const { page = 1, limit = 10, searchTerm, ...filterData } = query;

  const andConditions: any[] = [{ userId }];

  // Search term conditions
  if (searchTerm) {
    const term = String(searchTerm);

    andConditions.push({
      $or: [
        { title: { $regex: term, $options: 'i' } },
        { brand: { $regex: term, $options: 'i' } },
        {
          $expr: {
            $regexMatch: {
              input: { $toString: '$price' },
              regex: term,
              options: 'i',
            },
          },
        },
      ],
    });
  }

  // Filter conditions (dynamic fields)
  if (Object.keys(filterData).length > 0) {
    andConditions.push(filterData);
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const skip = (Number(page) - 1) * Number(limit);

  const productQuery = Product.find(whereConditions)
    .populate({ path: 'categoryId', select: 'title -_id' })
    .populate({ path: 'subCategoryId', select: 'title -_id' })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  const [result, count] = await Promise.all([
    productQuery,
    Product.countDocuments(whereConditions),
  ]);

  return {
    result,
    meta: {
      page: Number(page),
      total: count,
    },
  };
};

const deleteProduct = async (id: string) => {
  const isExistProduct = await Product.findById(id);

  if (!isExistProduct) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
  }

  const result = await Product.findByIdAndUpdate(
    id,
    { status: 'deleted' },
    {
      new: true,
    }
  );

  return result;
};

//discout api
const getAllDiscoutProduct = async (query: Record<string, unknown>) => {
  const { page, limit, searchTerm, ...filterData } = query;

  const andConditions: any[] = [{ discount: { $gte: 40 } }];

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({ [field]: value })
    );
    andConditions.push({ $and: filterConditions });
  }

  const whereConditions = { $and: andConditions };

  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await Product.find(whereConditions)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const count = await Product.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      total: count,
    },
  };
};

export const ProductServiceHello = {
  createProductFromDb,
  getAllProducts,
  updateProduct,
  getMyProduct,
  deleteProduct,
  getAllDiscoutProduct,
  getSingleProduct,
};

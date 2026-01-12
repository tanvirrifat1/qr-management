import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Product } from '../product/product.model';
import { IWishlist } from './wishlist.interface';
import { Wishlist } from './wishlist.model';

const createWishList = async (data: IWishlist) => {
  const [product, existingWish] = await Promise.all([
    Product.findById(data.productId),
    Wishlist.findOne({ userId: data.userId, productId: data.productId }),
  ]);

  if (!product) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
  }

  if (existingWish) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Product already in wishlist');
  }

  return Wishlist.create(data);
};

const removeWishList = async (data: IWishlist): Promise<IWishlist | null> => {
  const wishListItem = await Wishlist.findOneAndDelete({
    userId: data.userId,
    productId: data.productId,
  });

  if (!wishListItem) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Wish List item not found');
  }

  return wishListItem;
};

const getAllWishLists = async (
  userId: string,
  query: Record<string, unknown>
) => {
  const { searchTerm, page = '1', limit = '10', ...filters } = query;

  const conditions: any[] = [{ userId }];

  // Search by category name
  if (searchTerm) {
    const productIds = await Product.find({
      name: { $regex: searchTerm, $options: 'i' },
    }).distinct('_id');

    if (productIds.length) {
      conditions.push({ product: { $in: productIds } });
    }
  }

  // Additional filters
  if (Object.keys(filters).length) {
    conditions.push({
      $and: Object.entries(filters).map(([key, value]) => ({ [key]: value })),
    });
  }

  const where = conditions.length ? { $and: conditions } : {};

  // Pagination
  const pageNumber = parseInt(page as string, 10);
  const pageSize = parseInt(limit as string, 10);
  const skip = (pageNumber - 1) * pageSize;

  // Fetch products with category populated
  const [products, total] = await Promise.all([
    Wishlist.find(where)
      .populate({
        path: 'productId',
        model: 'Product',
        select: 'title image brand price',
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean(),
    Wishlist.countDocuments(where),
  ]);

  return {
    result: products,
    meta: {
      page: pageNumber,
      total,
    },
  };
};

const getWishList = async (id: string) => {
  const isExist = await Wishlist.findById(id);
  if (!isExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Wishlist not found');
  }

  const result = await Wishlist.findById(id).populate('productId');
  return result;
};

export const WishlistService = {
  createWishList,
  removeWishList,
  getAllWishLists,
  getWishList,
};

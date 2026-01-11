import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IPackage } from './package.interface';
import { Package } from './package.model';
import { stripe } from '../../../shared/stripe';

const createPackage = async (payload: Partial<IPackage>) => {
  try {
    const { name, description, unitAmount, interval } = payload;

    // Basic validation
    if (!name || !description || !unitAmount || !interval) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid package data');
    }

    // Check existing package
    const isPackageExist = await Package.findOne({ name });
    if (isPackageExist) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Package already exists');
    }

    // Convert description array → string (for Stripe)
    const descriptionString = Array.isArray(description)
      ? description.join(' ')
      : description;

    // Create Stripe product
    const product = await stripe.products.create({
      name,
      description: descriptionString,
    });

    // Create Stripe price
    const price = await stripe.prices.create({
      unit_amount: unitAmount * 100,
      currency: 'usd',
      recurring: { interval },
      product: product.id,
    });

    // Save package to DB
    const plan = await Package.create({
      name,
      description,
      unitAmount,
      interval,
      productId: product.id,
      priceId: price.id,
    });

    return plan;
  } catch (error: any) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Error creating package: ${error.message}`
    );
  }
};

const getAllPackage = async () => {
  const result = await Package.find({});

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Package not found');
  }

  return result;
};

const getSinglePackage = async (id: string) => {
  const result = await Package.findById(id);

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Package not found');
  }

  return result;
};

const updatePackage = async (packageId: string, payload: Partial<IPackage>) => {
  const isPack = await Package.findById(packageId);

  if (!isPack) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Package not found');
  }

  const updatedDescription = Array.isArray(payload.description)
    ? payload.description.join(' ')
    : payload.description;

  if (payload.name || updatedDescription) {
    await stripe.products.update(isPack.productId, {
      name: payload.name || isPack.name,
      description: updatedDescription,
    });
  }

  if (payload.unitAmount || payload.interval) {
    const stripeInterval = payload.interval || isPack.interval;

    if (isPack.priceId) {
      await stripe.prices.update(isPack.priceId, {
        active: false, // Archive the old price
      });
    }

    const newPrice = await stripe.prices.create({
      unit_amount: payload.unitAmount
        ? payload.unitAmount * 100
        : isPack.unitAmount * 100,
      currency: 'usd',
      recurring: { interval: stripeInterval },
      product: isPack.productId,
    });

    payload.priceId = newPrice.id;
  }

  // Update the plan in the database
  const updatedPlan = await Package.findByIdAndUpdate(packageId, payload, {
    new: true,
    runValidators: true,
  });

  return updatedPlan;
};

const deletePackage = async (id: string) => {
  // Check package existence
  const pack = await Package.findById(id);
  if (!pack) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Package not found');
  }

  // Deactivate price on Stripe
  try {
    await stripe.prices.update(pack.priceId, { active: false });
  } catch (error) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Failed to deactivate price in Stripe'
    );
  }

  // Delete package from DB
  await Package.findByIdAndDelete(id);

  return 'Package deleted successfully';
};

export const PackageService = {
  createPackage,
  getAllPackage,
  getSinglePackage,
  updatePackage,
  deletePackage,
};

import Product from '../models/product.model.js';
import { redis } from '../lib/redis.js';
import cloudinary from '../lib/cloudinary.js';

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get('featured_products');
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }
    featuredProducts = await Product.find({ isFeatured: true }).lean();
    if (!featuredProducts) {
      return res.status(404).json({ message: 'No featured products found' });
    }
    await redis.set('featured_products', JSON.stringify(featuredProducts));
    res.json(featuredProducts);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, description, image, category } = req.body;
    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: 'products',
      });
    }
    const product = await Product.create({
      name,
      price,
      description,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : '',
      category,
    });
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.image) {
      const publicId = product.image.split('/').pop().split('.')[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        return res
          .status(500)
          .json({ message: 'Error deleting image from Cloudinary' });
      }
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $sample: { size: 3 } },
      { $project: { _id: 1, name: 1, description: 1, image: 1, price: 1 } },
    ]);
    res.json(products);
  } catch (error) {
    console.error('Error fetching recommended products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      await updateFeaturedProductsCache();
      res.json(updatedProduct);
    }
    res.json({ message: 'Product featured status updated', product });
  } catch (error) {
    console.error('Error toggling featured product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

async function updateFeaturedProductsCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set('featured_products', JSON.stringify(featuredProducts));
  } catch (error) {
    console.log('error in update cache function');
  }
}

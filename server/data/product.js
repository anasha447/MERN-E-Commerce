// ✅ Product Data (using images from public/images)
const products = [
  {
    name: "Yerba Mate Masala",
    images: ["/images/masala.png"], // ✅ array
    description: "Rich and spicy yerba mate blend.",
    brand: "Matessa",
    category: "Mate",
    price: 350,
    countInStock: 20,
    isFeatured: true,
  },
  {
    name: "Yerba Mate Ginger-Lemon",
    images: ["/images/lemon.png"], // ✅ array
    description: "Refreshing ginger and lemon infusion.",
    brand: "Matessa",
    category: "Mate",
    price: 370,
    countInStock: 18,
    isFeatured: true,
  },
  {
    name: "Yerba Mate Tulsi-Mint",
    images: ["/images/tulsi.png"], // ✅ array
    description: "Cooling mint and tulsi herbal mix.",
    brand: "Matessa",
    category: "Mate",
    price: 360,
    countInStock: 15,
    isFeatured: true,
  },
  {
    name: "Berry Bliss Mate",
    images: ["/images/berry.png"],
    description: "Fruity berry flavors with energizing mate.",
    brand: "Matessa",
    category: "Mate",
    price: 380,
    countInStock: 12,
  },
  {
    name: "Mint Breeze Mate",
    images: ["/images/mint.png"],
    description: "Fresh mint leaves blended with yerba mate.",
    brand: "Matessa",
    category: "Mate",
    price: 340,
    countInStock: 22,
  },
  {
    name: "Chai Spice Mate",
    images: ["/images/chai.png"],
    description: "Aromatic chai spices with a mate twist.",
    brand: "Matessa",
    category: "Mate",
    price: 390,
    countInStock: 10,
  },
  {
    name: "Citrus Zest Mate",
    images: ["/images/citrus.png"],
    description: "Citrusy tang with smooth yerba mate.",
    brand: "Matessa",
    category: "Mate",
    price: 375,
    countInStock: 16,
  },
  {
    name: "Mate Cup Accessory",
    images: ["/images/matecup.png"],
    description: "Traditional mate gourd cup with straw.",
    brand: "Matessa",
    category: "Accessories",
    price: 450,
    countInStock: 8,
  },
];

export default products;

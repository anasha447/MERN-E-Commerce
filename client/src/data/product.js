// src/data/product.js

// ✅ Import product images
import product1 from "../assets/masala.png";
import product2 from "../assets/lemon.png";
import product3 from "../assets/tulsi.png";
import product4 from "../assets/masala.png";
import product5 from "../assets/masala.png";
import product6 from "../assets/masala.png";
import product7 from "../assets/masala.png";
import product8 from "../assets/masala.png";

// ✅ Product Data
const products = [
  { id: 1, name: "Yerba Mate Masala", price: 350, img: product1, desc: "Rich and spicy yerba mate blend.", category: "Mate" },
  { id: 2, name: "Yerba Mate Ginger-Lemon", price: 370, img: product2, desc: "Refreshing ginger and lemon infusion.", category: "Mate" },
  { id: 3, name: "Yerba Mate Tulsi-Mint", price: 360, img: product3, desc: "Cooling mint and tulsi herbal mix.", category: "Mate" },
  { id: 4, name: "Berry Bliss Mate", price: 380, img: product4, desc: "Fruity berry flavors with energizing mate.", category: "Mate" },
  { id: 5, name: "Mint Breeze Mate", price: 340, img: product5, desc: "Fresh mint leaves blended with yerba mate.", category: "Mate" },
  { id: 6, name: "Chai Spice Mate", price: 390, img: product6, desc: "Aromatic chai spices with a mate twist.", category: "Mate" },
  { id: 7, name: "Citrus Zest Mate", price: 375, img: product7, desc: "Citrusy tang with smooth yerba mate.", category: "Mate" },
  { id: 8, name: "Mate Cup Accessory", price: 450, img: product8, desc: "Traditional mate gourd cup with straw.", category: "Accessories" },
];

export default products;

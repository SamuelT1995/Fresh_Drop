import React from "react";
import ProductCard from "./productCard";

const BestSeller = () => {
  return (
    <div className="mt16">
      <p className="text-3xl md:text-3xl font-medium">Best sellers</p>
      <div>
        <ProductCard />
      </div>
    </div>
  );
};

export default BestSeller;

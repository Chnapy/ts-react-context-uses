import React, { useContext as useFoo } from 'react';

const ProductIdContext = React.createContext(0);

// const useContext = (toto) => 5;
const useFooBar = () => 8;
// useContext()
export const ProductIdComponent = () => {
  const productId = useFoo(ProductIdContext);
  const foo = useFooBar();
  const foo2 = React.useContext(ProductIdContext);

  return (
    <div>
      {productId}
      {foo}
      {foo2}
    </div>
  );
};

export const MainComponent = () => (
  <main>
    <ProductIdContext.Provider value={2}>
      <div>
        <ProductIdComponent />
      </div>
    </ProductIdContext.Provider>
  </main>
);

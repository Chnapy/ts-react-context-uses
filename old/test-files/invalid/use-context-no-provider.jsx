import Foo, {useContext as useFoo} from 'react';

// const useContext = (toto) => 5;
const useFooBar = () => 8;
// useContext()
const ProductIdComponent = () => {
  const productId = useFoo(ProductIdContext);
  const foo = useFooBar();
  const foo2 = Foo.useContext(ProductIdContext);

  return <div>{productId}{foo}</div>;
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

const ProductIdContext = Foo.createContext(0);

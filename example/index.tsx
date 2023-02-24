/* eslint-disable */
import React, { useContext, useEffect } from 'react';
import * as Foo from 'react';
// import { goo } from './foo';
import { useExtra } from 'foobar';

const useAction = () => {
  useSecond();
  return 3;
};

const FooContext = React.createContext(-1);

const FooProvider = FooContext.Provider;

export const App: React.FC = () => {
  const [foo] = React.useState(12);
  const bar = useAction();

  useEffect(() => {
    console.log(foo);
  }, [foo]);

  const child = <Child />;
  const childFn = () => <Child />;

  return (
    <div>
      <FooProvider value={1}>
        <h1>Toto {bar}</h1>
        <main>
          {foo}
          <Parent>
            <Parent>
              <Child />
            </Parent>
          </Parent>

          {child}
        </main>
      </FooProvider>
      {childFn()}
    </div>
  );
};

const useFoo = () => React.useContext(FooContext);
const useFoo2 = () => useContext(FooContext);

const useSecond = () => 12;

const Parent: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div>{children}</div>
);

const Child: React.FC = () => {
  const value = useSecond();
  const foo = useFoo();
  const foo2 = useFoo2();
  useExtra();

  return (
    <span>
      {value}
      {foo}
      {foo2}
    </span>
  );
};

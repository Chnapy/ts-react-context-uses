import React, { useEffect } from 'react';

const useAction = () => {
  useSecond();
  return 3;
};

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
      <h1>Toto {bar}</h1>
      <main>
        {foo}
        <Parent>
          <Parent>
            <Child />
          </Parent>
        </Parent>

        {child}
        {childFn()}
      </main>
    </div>
  );
};

const useSecond = () => 12;

const Parent: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div>{children}</div>
);

const Child: React.FC = () => {
  const value = useSecond();

  return <span>{value}</span>;
};

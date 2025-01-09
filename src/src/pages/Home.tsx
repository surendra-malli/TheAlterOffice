// No need to import React when using the new JSX transform
import { FC } from 'react';

interface HomeProps {}

const Home: FC<HomeProps> = () => {
  return (
    <div>
      <h1>Welcome to the Task Management App</h1>
      <p>Your tasks will be displayed here.</p>
    </div>
  );
};

export default Home;
import React, { useEffect } from 'react';
import './App.css';

import { PollyApp } from './components/PollyApp';

const App: React.FC = () => {
  useEffect(() => {
    console.log('useEffect');
  }, []);

  return (
    <div className='App'>
      <main id='pollyApp'>
        <PollyApp />
      </main>
    </div>
  );
};

export default App;

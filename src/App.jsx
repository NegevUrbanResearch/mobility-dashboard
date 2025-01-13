import React from 'react';
import PageNavigator from './components/page-navigator';
//import TestComponent from './components/test-component';

function App() {
  return (
    <div className="App" style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/*<TestComponent />*/}
      <PageNavigator />
    </div>
  );
}

export default App;
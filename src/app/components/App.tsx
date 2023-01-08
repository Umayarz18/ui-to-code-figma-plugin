import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import '../styles/ui.css';
import { ComponentButton } from './button';

function App() {
  // const textbox = React.useRef<HTMLInputElement>(undefined);
  const [code, setCode] = React.useState('');

  // const countRef = React.useCallback((element: HTMLInputElement) => {
  //   if (element) element.value = '5';
  //   textbox.current = element;
  // }, []);

  const onCreateCodeMockUp = () => {
    parent.postMessage({ pluginMessage: { type: 'create-code' } }, '*');
  };

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
  };

  React.useEffect(() => {
    // This is how we read messages sent from the plugin controller
    window.onmessage = (event) => {
      const { type, message } = event.data.pluginMessage;
      if (type === 'create-code') {
        const { mockUp } = event.data.pluginMessage;
        setCode(mockUp);
        console.log(`Figma Says: ${message}`);
      }
    };
  }, []);

  return (
    <div>
      <img src={require('../assets/logo.svg')} />
      <h2>Figma to UI Component</h2>
      <p>Select the frame with the mockup, then press to output the code.</p>
      <h3>Code Mock Up</h3>
      <div style={{ textAlign: 'initial' }}>
        {code && (
          <SyntaxHighlighter language="tsx" style={docco}>
            {code}
          </SyntaxHighlighter>
        )}
      </div>
      <ComponentButton color={'blue'} eventHandler={onCreateCodeMockUp}>
        Create Mock Up
      </ComponentButton>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}

export default App;

figma.showUI(__html__, { width: 400, height: 250 });

figma.ui.onmessage = (msg) => {
  /**
   * Mock Up Steps
   * 1.) Find the currently select figma node (ideally a frame or the component itself)
   * 2.) Recursively grab the node properties/styles then write to text
   *    a.) If team libary, need to get componentKey from original file
   * 3.) Get text output and display to plugin
   * STRETCH GOAL: 4.) Display coded mock-up in the plugin as well or link
   */
  if (msg.type === 'create-code') {
    const imports = [`import React from 'react';`];
    const selectedNode = figma.currentPage.selection[0];

    const generatedCode = createCode(selectedNode);
    const generateScript = () => {
      const script = `
        ${imports.toString().split(',')}
        export const MockUp = ()=> {
          return (
            <>
            {/** Generated Code: Always check for Functionality! **/}
            ${generatedCode}
            </>
          )
      }`;

      return script.replace(/^\s+|\s+$|\s+(?=\s)/, `\n`);
    };
    const fullCodeScript = generateScript();

    function getRGBValue(fillValue: { color: any }) {
      const { color } = fillValue;
      return `rgb(${color.r},${color.g},${color.b})`;
    }

    function createCode(node) {
      if ('children' in node) {
        if (node.type === 'FRAME') {
          // Get the width, height, background color
          const { width, height, fills } = node;
          return `<div 
            style={
              {
                width:"${width}px", 
                height:"${height}px", 
                backgroundColor: "${getRGBValue(fills[0])}"
              }
            }>${node.children.map((childNode) => createCode(childNode))} <div>`;
        }
        // Access the node when its an component instance of a button
        else if (node.type === 'INSTANCE' && node.name === 'Button') {
          // TODO: Need to search for master component + extra logic when
          // originating from a team file
          // https://forum.figma.com/t/how-access-other-file-by-figma-api/20947/7
          const { componentProperties } = node;

          const transformedProps = {
            label: componentProperties[`Label#1114:1`].value,
            color: componentProperties['color'].value,
          };

          const buttonImport = `import {Button} from '@library';`;
          if (!imports.includes(buttonImport)) imports.push(buttonImport);
          return `
            <Button 
              eventHandler={()=>{/** Include onClick function */}}
              color={"${transformedProps.color}"}
              >${transformedProps.label}</Button>`;
        }
      } else {
        return '';
      }
    }

    // console.log(selectedNode)
    // console.log("fullcode", fullCodeScript)
    // This is how figma responds back to the ui
    figma.ui.postMessage({
      type: 'create-code',
      message: `Created Mock Up`,
      mockUp: fullCodeScript,
    });
    figma.ui.resize(400, 600);
  } else if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};

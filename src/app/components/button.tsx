import React, { ReactNode } from "react";

export interface ButtonProps {
    children: ReactNode;
    color?: 'green' | 'blue';
    eventHandler: EventListener
}
export const ComponentButton = ({children, color, eventHandler})=> {
    let backgroundColor = "";

    switch(color){
        case('green'):
            backgroundColor = '#219653';
            break;
        case('blue'):
            backgroundColor = '#3050FC';
            break;
        default:
            backgroundColor = ''
            break;    
    }


    const buttonStyle = {
        backgroundColor: backgroundColor,
        color: 'white',
        fontSize: '12px',
        fontWeight: 'bold',
        borderRadius: '4px'
    }
    
    return (<button style={buttonStyle} onClick={eventHandler}>{children}</button>)
}
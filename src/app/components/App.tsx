import * as React from 'react';
import {Input, Label} from 'react-figma-plugin-ds';
import '../styles/ui.css';
import 'react-figma-plugin-ds/figma-plugin-ds.css';

declare function require(path: string): any;

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : null;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
}

function rgbToHex(r, g, b) {
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

const App = ({}) => {
    const [state, setState] = React.useState({
        ruler: 20,
        mark: 1,
        gutter: 9,
        offset: 0,
        opacity: 100,
        color: {
            r: 255,
            g: 0,
            b: 255,
        },
    });
    React.useEffect(() => {
        // This is how we read messages sent from the plugin controller
        window.onmessage = event => {
            const {type, message} = event.data.pluginMessage;
            if (type === 'create-rectangles') {
                console.log(`Figma Says: ${message}`);
            }
        };
    }, []);

    function handleClick() {
        parent.postMessage({pluginMessage: {type: 'create-ruler', state}}, '*');
    }

    function handleChange(e) {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    }

    function handleColorChange(e) {
        setState({
            ...state,
            color: hexToRgb(e.target.value),
        });
    }

    return (
        <form className="root">
            <div className="inputRow">
                <div className="inputContainer">
                    <Label htmlFor="ruler">Ruler Width</Label>
                    <Input
                        type="number"
                        name="ruler"
                        id="ruler"
                        onChange={handleChange}
                        defaultValue={20}
                        value={state.ruler}
                    />
                </div>
                <div className="inputContainer">
                    <Label htmlFor="mark">Mark Width</Label>
                    <Input
                        type="number"
                        name="mark"
                        id="mark"
                        onChange={handleChange}
                        defaultValue={1}
                        value={state.mark}
                    />
                </div>
            </div>
            <div className="inputRow">
                <div className="inputContainer">
                    <Label htmlFor="gutter">Gutter</Label>
                    <Input
                        type="number"
                        name="gutter"
                        id="gutter"
                        onChange={handleChange}
                        defaultValue={9}
                        value={state.gutter}
                    />
                </div>
                <div className="inputContainer">
                    <Label htmlFor="offset">Offset</Label>
                    <Input
                        type="number"
                        name="offset"
                        id="offset"
                        onChange={handleChange}
                        defaultValue={0}
                        value={state.offset}
                    />
                </div>
            </div>
            <div className="inputRow">
                <div className="inputContainer">
                    <Label htmlFor="color">Color</Label>
                    <Input
                        className="colorInput"
                        type="color"
                        name="color"
                        id="color"
                        onChange={handleColorChange}
                        defaultValue={rgbToHex(255, 0, 255)}
                        value={rgbToHex(state.color.r, state.color.g, state.color.b)}
                    />
                </div>
                <div className="inputContainer">
                    <Label htmlFor="opacity">Opacity</Label>
                    <Input
                        type="number"
                        name="opacity"
                        id="opacity"
                        onChange={handleChange}
                        defaultValue={100}
                        value={state.opacity}
                        max={100}
                        min={state.opacity}
                    />
                </div>
            </div>
            <button onClick={handleClick}>Create Ruler</button>
        </form>
    );
};

export default App;

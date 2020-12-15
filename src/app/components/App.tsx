import * as React from 'react';
import {Button, Input, Label, Select, Text} from 'react-figma-plugin-ds';
import GithubIcon from '../assets/github';
import '../styles/ui.css';
import 'react-figma-plugin-ds/figma-plugin-ds.css';

declare function require(path: string): any;

onmessage = event => {
    let button = document.querySelector('.submitButton');
    console.log(event.data.pluginMessage.length);
    if (event.data.pluginMessage.length !== 0) {
        console.log('Enabling button');
        button.removeAttribute('disabled');
    } else {
        console.log('Disabling button');
        button.setAttribute('disabled', '');
    }
};

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

const defaultState = {
    ruler: 10,
    mark: 1,
    gutter: 9,
    offset: 0,
    opacity: 50,
    color: {
        r: 255,
        g: 0,
        b: 255,
    },
};

const App = ({}) => {
    const [state, setState] = React.useState(defaultState);

    function handleClick() {
        parent.postMessage({pluginMessage: {type: 'create-ruler', state}}, '*');
    }

    function handleChange(e, name) {
        setState({
            ...state,
            [name]: +e,
        });
    }

    function handleSelectChange(event, name) {
        console.log(event);
        setState({
            ...state,
            [name]: event.value,
        });
    }

    function handleColorChange(e) {
        setState({
            ...state,
            color: hexToRgb(e),
        });
    }

    return (
        <div id="root">
            <div id="form">
                <Text size="large" className="text">
                    Select an object to wrap a ruler around it.
                </Text>
                <div className="inputRow">
                    <div className="inputContainer">
                        <Label htmlFor="gutter">Increment</Label>
                        <Select
                            name="gutter"
                            id="gutter"
                            onChange={e => {
                                handleSelectChange(e, 'gutter');
                            }}
                            options={[
                                {value: 9, label: '10'},
                                {value: 7, label: '8'},
                            ]}
                            defaultValue={defaultState.gutter}
                        />
                    </div>
                    <div className="inputContainer">
                        <Label htmlFor="offset">Offset</Label>
                        <Input
                            type="number"
                            name="offset"
                            id="offset"
                            onChange={e => {
                                handleChange(e, 'offset');
                            }}
                            defaultValue={defaultState.offset}
                        />
                    </div>
                </div>
                <div className="inputRow">
                    <div id="colorContainer" className="inputContainer">
                        <Label htmlFor="color">Color</Label>
                        <Input
                            className="colorInput"
                            type="color"
                            name="color"
                            id="color"
                            onChange={handleColorChange}
                            defaultValue={rgbToHex(defaultState.color.r, defaultState.color.g, defaultState.color.b)}
                        />
                    </div>
                    <div className="inputContainer">
                        <Label htmlFor="opacity">Opacity</Label>
                        <Input
                            type="number"
                            name="opacity"
                            id="opacity"
                            onChange={e => {
                                handleChange(e, 'opacity');
                            }}
                            defaultValue={defaultState.opacity}
                            max={100}
                            min={0}
                        />
                    </div>
                </div>
                <Button className="submitButton" onClick={handleClick}>
                    Create Ruler
                </Button>
            </div>
            <div className="footer">
                <Text>Version 1.0</Text>
                <a
                    className="ghLink"
                    href="https://github.com/MarcelloPaiva/figma-component-organizer"
                    target="_blank"
                    rel="noreferrer"
                >
                    <Text>Feedback / Issues</Text>
                    <GithubIcon />
                </a>
            </div>
        </div>
    );
};

export default App;

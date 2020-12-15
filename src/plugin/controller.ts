figma.showUI(__html__, {
    height: 300,
});

figma.loadFontAsync({family: 'Roboto', style: 'Regular'});

figma.ui.postMessage(figma.currentPage.selection);

figma.on('selectionchange', () => {
    figma.ui.postMessage(figma.currentPage.selection);
});

figma.ui.onmessage = msg => {
    switch (msg.type) {
        case 'create-ruler':
            let Xruler = createRuler(msg.state, 'x', figma.currentPage.selection[0]);
            let Yruler = createRuler(msg.state, 'y', figma.currentPage.selection[0]);
            let Xticks = createNumbers(msg.state, Xruler);
            let Yticks = createNumbers(msg.state, Yruler);
            let group = figma.group([Xruler, Yruler, Xticks, Yticks], figma.currentPage);

            figma.currentPage.selection = [group];
            break;
        default:
            break;
    }
};

function createRuler(state, axis: 'x' | 'y', parent: SceneNode = undefined): FrameNode {
    const rulerFrame = figma.createFrame();
    const {opacity, color, gutter, mark, offset, ruler} = state;
    let count;
    if (parent === undefined) {
        if (axis === 'x') {
            count = Math.round(figma.viewport.bounds.width / gutter);
        } else {
            count = Math.round(figma.viewport.bounds.height / gutter);
        }
    } else {
        if (axis === 'x') {
            count = Math.round(parent.width / gutter);
        } else {
            count = Math.round(parent.height / gutter);
        }
    }
    const grid: LayoutGrid = {
        pattern: axis === 'x' ? 'COLUMNS' : 'ROWS',
        color: {
            r: color.r / 255,
            g: color.g / 255,
            b: color.b / 255,
            a: opacity / 100,
        },
        alignment: 'MIN',
        gutterSize: gutter,
        count: count,
        offset: offset,
        sectionSize: mark,
    };
    const fill: SolidPaint = {
        opacity: 0,
        type: 'SOLID',
        color: {
            r: 0,
            g: 0,
            b: 0,
        },
    };
    rulerFrame.layoutGrids = [grid];
    rulerFrame.fills = [fill];
    if (parent === undefined) {
        if (axis === 'x') {
            rulerFrame.resize(figma.viewport.bounds.width - ruler, ruler);
            rulerFrame.x = figma.viewport.bounds.x + ruler;
            rulerFrame.y = figma.viewport.bounds.y;
        } else {
            rulerFrame.resize(ruler, figma.viewport.bounds.height - ruler);
            rulerFrame.x = figma.viewport.bounds.x;
            rulerFrame.y = figma.viewport.bounds.y + ruler;
        }
    } else {
        if (axis === 'x') {
            rulerFrame.resize(parent.width, ruler);
            rulerFrame.x = parent.x;
            rulerFrame.y = parent.y - ruler;
        } else {
            rulerFrame.resize(ruler, parent.height);
            rulerFrame.x = parent.x - ruler;
            rulerFrame.y = parent.y;
        }
    }
    rulerFrame.name = `${axis === 'x' ? 'X' : 'Y'} Axis`;
    return rulerFrame;
}

function createNumbers(state, ruler: FrameNode): FrameNode {
    const {opacity, color} = state;
    let numberFrame = figma.createFrame();
    let increment = ruler.layoutGrids[0]['gutterSize'] + ruler.layoutGrids[0]['sectionSize'];
    console.log(increment);
    console.log(ruler.layoutGrids[0]);
    for (let index = 0; index < ruler.layoutGrids[0]['count']; index++) {
        let text = figma.createText();

        text.characters = `${index * increment}`;
        text.fontSize = 4;
        text.resize(increment, increment);
        text.textAlignHorizontal = 'CENTER';
        text.textAlignVertical = 'CENTER';
        text.fills = [
            {
                opacity: opacity / 100,
                type: 'SOLID',
                color: {
                    r: color.r / 255,
                    g: color.g / 255,
                    b: color.b / 255,
                },
            },
        ];
        numberFrame.appendChild(text);
    }
    numberFrame.layoutMode = ruler.name[0] === 'X' ? 'HORIZONTAL' : 'VERTICAL';
    const fill: SolidPaint = {
        opacity: 0,
        type: 'SOLID',
        color: {
            r: 0,
            g: 0,
            b: 0,
        },
    };
    numberFrame.fills = [fill];
    if (ruler.name[0] === 'X') {
        numberFrame.resize(ruler.width + increment / 2 - ruler.layoutGrids[0]['offset'], increment);
        numberFrame.x = ruler.x - increment / 2 + ruler.layoutGrids[0]['offset'];
        numberFrame.y = ruler.y - increment;
    } else {
        numberFrame.resize(increment, ruler.height + increment / 2 - ruler.layoutGrids[0]['offset']);
        numberFrame.x = ruler.x - increment;
        numberFrame.y = ruler.y - increment / 2 + ruler.layoutGrids[0]['offset'];
    }
    return numberFrame;
}

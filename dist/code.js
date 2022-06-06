/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/code.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/code.ts":
/*!*********************!*\
  !*** ./src/code.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function main() {
    const selection = figma.currentPage.selection;
    if (selection.length !== 1) {
        figma.notify("Select exactly 1 frame to start game");
        figma.closePlugin();
        return;
    }
    let game = selection[0];
    if (game.type !== "FRAME") {
        figma.notify("Must select a frame node");
        figma.closePlugin();
        return;
    }
    const MARGIN = 100;
    game.setRelaunchData({
        reset: "Reset the game to the default state",
    });
    figma.root.setPluginData("url", "");
    for (const node of game.children) {
        if (node.getPluginData("gameId") === game.id || (node.name === "assets" && node.type === "COMPONENT")) {
            node.remove();
        }
    }
    let itemIdx = 0;
    for (const page of figma.root.children) {
        if (page.name === "Assets") {
            let xOffset = MARGIN;
            for (const frame of page.children) {
                if (frame.type !== "FRAME")
                    continue;
                itemIdx++;
                let back = null;
                let yOffset = MARGIN;
                for (const child of frame.children) {
                    if (back === null) {
                        back = child;
                    }
                    else if (child.type === "COMPONENT") {
                        continue;
                    }
                    else {
                        const item = createCard(back, child, game, frame.name, xOffset, yOffset, itemIdx);
                        item.setRelaunchData({
                            shuffle: '',
                            gather: '',
                            flip: '',
                            tidy: '',
                            show: 'Only you see the hidden info',
                            count: `Count ${frame.name}s`
                        });
                        yOffset--;
                    }
                }
                if (back) {
                    xOffset += MARGIN + back.width;
                }
            }
        }
    }
    figma.closePlugin();
}
function createCard(back, child, game, name, xOffset, yOffset, itemIdx) {
    const backClone = back.clone();
    backClone.x = 0;
    backClone.y = 0;
    backClone.locked = true;
    const clone = child.clone();
    clone.x = 0;
    clone.y = 0;
    clone.locked = true;
    const widget = figma.createFrame();
    game.appendChild(widget);
    widget.name = name;
    widget.fills = [];
    widget.clipsContent = false;
    widget.appendChild(clone);
    widget.appendChild(backClone);
    widget.resize(clone.width, clone.height);
    widget.x = xOffset;
    widget.y = yOffset;
    const spacer = figma.createRectangle();
    game.appendChild(spacer);
    spacer.name = "----";
    spacer.resize(clone.width, 1);
    spacer.x = widget.x;
    spacer.y = widget.y + widget.height;
    spacer.fills = [];
    const item = figma.group([widget, spacer], game);
    item.setPluginData("gameId", game.id);
    item.setPluginData("class", `item-${itemIdx}`);
    item.name = child.name;
    return item;
}
function swap(arr, i, j) {
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}
function shuffleArray(arr, startIdx) {
    for (let i = startIdx; i < arr.length; i++) {
        const idx = Math.floor(Math.random() * (arr.length - i));
        swap(arr, i, i + idx);
    }
}
function setupCatan(board) {
    const indexToPosition = [
        [2, 4],
        [2, 6],
        [3, 5],
        [3, 3],
        [2, 2],
        [1, 3],
        [1, 5],
        [2, 8],
        [3, 7],
        [4, 6],
        [4, 4],
        [4, 2],
        [3, 1],
        [2, 0],
        [1, 1],
        [0, 2],
        [0, 4],
        [0, 6],
        [1, 7],
    ].reverse();
    const positionToIndex = {};
    for (let i = 0; i < indexToPosition.length; i++) {
        const position = indexToPosition[i];
        positionToIndex[`${position}`] = i;
    }
    const biomes = ["Field", "Forest", "Ore", "Desert", "Wheat", "Clay"];
    const allBiomes = [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 3, 4, 4, 4, 4, 5, 5, 5];
    const biomeComponents = [null, null, null, null, null, null];
    let biomesFound = 0;
    const ports = ["Field", "Forest", "Ore", "Any", "Wheat", "Clay"];
    const allPorts = [0, 1, 2, 3, 3, 3, 3, 4, 5];
    const portComponents = [null, null, null, null, null, null];
    let portsFound = 0;
    const numbers = ["2", "3", "4", "5", "6", "8", "9", "10", "11", "12"];
    const allNumbers = [0, 1, 1, 2, 2, 3, 3, 6, 6, 7, 7, 8, 8, 9];
    const numberComponents = [null, null, null, null, null, null, null, null, null, null];
    let numbersFound = 0;
    for (const child of figma.root.children) {
        if (child.name.indexOf("Components") < 0)
            continue;
        for (const candidate of child.children) {
            if (candidate.type !== "COMPONENT")
                continue;
            if (candidate.name.indexOf("Biome / ") === 0) {
                const biomeName = candidate.name.substring(8);
                const biomeIdx = biomes.indexOf(biomeName);
                if (biomeIdx < 0)
                    continue;
                if (biomeComponents[biomeIdx] != null)
                    continue;
                biomesFound++;
                biomeComponents[biomeIdx] = candidate;
            }
            else if (candidate.name.indexOf("Port / ") === 0) {
                const portName = candidate.name.substring(7);
                const portIdx = ports.indexOf(portName);
                if (portIdx < 0)
                    continue;
                if (portComponents[portIdx] != null)
                    continue;
                portsFound++;
                portComponents[portIdx] = candidate;
            }
            else if (candidate.name.indexOf("Number Tile / ") === 0) {
                const numberName = candidate.name.substring(14);
                const numberIdx = numbers.indexOf(numberName);
                if (numberIdx < 0)
                    continue;
                if (numberComponents[numberIdx] != null)
                    continue;
                numbersFound++;
                numberComponents[numberIdx] = candidate;
            }
            if (biomesFound === 6 && portsFound === 6 && numbersFound === 10)
                break;
        }
        if (biomesFound === 6 && portsFound === 6 && numbersFound === 10)
            break;
    }
    shuffleArray(allBiomes, 0);
    shuffleArray(allPorts, 0);
    let currBiomeIdx = 0;
    let currPortIdx = 0;
    const numberPositions = [];
    for (let i = 0; i < allBiomes.length; i++) {
        if (allBiomes[i] !== 3)
            numberPositions.push(i);
    }
    const specialNumbers = [4, 4, 5, 5];
    let currIdx = 0;
    for (let i = 0; i < 4; i++) {
        const num = specialNumbers[i];
        allNumbers.splice(currIdx, 0, num);
        const idx = Math.floor(Math.random() * (numberPositions.length - currIdx));
        swap(numberPositions, currIdx, idx + currIdx);
        const coords = indexToPosition[numberPositions[currIdx]];
        currIdx++;
        const neighbors = [
            [coords[0] - 1, coords[1] - 1], [coords[0] - 1, coords[1] + 1],
            [coords[0], coords[1] - 2], [coords[0], coords[1] + 2],
            [coords[0] + 1, coords[1] - 1], [coords[0] + 1, coords[1] + 1],
        ];
        for (const neighbor of neighbors) {
            const position = positionToIndex[`${neighbor}`];
            if (position == undefined)
                continue;
            const idx = numberPositions.indexOf(position);
            if (idx < currIdx)
                continue;
            swap(numberPositions, currIdx, idx);
            const toSwap = Math.floor(Math.random() * (allNumbers.length - currIdx));
            swap(allNumbers, currIdx, currIdx + toSwap);
            currIdx++;
        }
    }
    shuffleArray(allNumbers, currIdx);
    const positionToComponent = {};
    for (let i = 0; i < allNumbers.length; i++) {
        positionToComponent[numberPositions[i]] = numberComponents[allNumbers[i]];
    }
    for (const child of board.children) {
        if (child.type !== "INSTANCE")
            continue;
        if (child.name.indexOf("Biome / ") === 0) {
            child.masterComponent = biomeComponents[allBiomes[currBiomeIdx]];
            if (positionToComponent[currBiomeIdx] && child.children[1].type === "INSTANCE") {
                child.children[1].masterComponent = positionToComponent[currBiomeIdx];
            }
            currBiomeIdx++;
        }
        if (child.name.indexOf("Port / ") === 0) {
            child.masterComponent = portComponents[allPorts[currPortIdx]];
            currPortIdx++;
        }
    }
    figma.closePlugin();
}
function setupMahjong(board) {
    let itemIdx = 0;
    const MARGIN_Y = 1500;
    const MARGIN_X = 1500 + 675;
    const TILES_PER_ROW = 28; // 36 incl. all tiles, 28 for just 3 suits 
    const tiles = [];
    for (const page of figma.root.children) {
        if (page.name === "Assets") {
            let xOffset = MARGIN_X;
            let yOffset = MARGIN_Y;
            let rowHeight = MARGIN_Y;
            let tileNum = 1;
            let rotation = 0;
            for (const frame of page.children) {
                if (frame.type !== "FRAME")
                    continue;
                itemIdx++;
                let back = null;
                for (const child of frame.children) {
                    if (back === null) {
                        back = child;
                    }
                    else if (child.type === "COMPONENT") {
                        continue;
                    }
                    else {
                        const item = createCard(back, child, board, child.name, xOffset, yOffset, itemIdx);
                        board.appendChild(item);
                        tiles.push(item);
                        item.rotation = rotation;
                        item.setRelaunchData({
                            shuffle_in_place: '',
                            gather: '',
                            flip: '',
                            tidy: '',
                            tidy_show: '',
                            show: 'Only you see the hidden info',
                            count: `Count ${frame.name}s`
                        });
                        if (tileNum % 2 === 0) {
                            if (rotation != 0) { // rotated
                                yOffset += back.width;
                            }
                            else {
                                xOffset += back.width;
                                yOffset = rowHeight;
                            }
                        }
                        else {
                            yOffset--;
                        }
                        if (tileNum % TILES_PER_ROW === 0) { // end of row, reset
                            switch (tileNum / TILES_PER_ROW) {
                                case 1:
                                    xOffset = MARGIN_X - back.height - back.width;
                                    rowHeight = MARGIN_Y + back.height + 2 * back.width;
                                    break;
                                case 2: // about to start bottom row
                                    rowHeight = yOffset;
                                    xOffset = MARGIN_X;
                                    break;
                                case 3: // about to start right row
                                    xOffset += back.width;
                                    rowHeight = MARGIN_Y + back.height + 2 * back.width;
                                    break;
                                default:
                                    xOffset = MARGIN_X;
                                    rowHeight += 800;
                            }
                            yOffset = rowHeight;
                            if (rotation === 90) {
                                rotation = 0;
                            }
                            else {
                                rotation = 90;
                            }
                        }
                        tileNum++;
                    }
                }
                figma.currentPage.selection = tiles;
                shuffleInPlace();
            }
        }
    }
}
function turnFaceDown(node) {
    if (node.type === "GROUP") {
        if (node.children.length > 0 && node.children[0].type === "FRAME") {
            node = node.children[0];
            if (node.children.length === 3) {
                node.children[2].remove();
            }
        }
    }
}
function shuffle() {
    const toShuffle = figma.currentPage.selection.map((node) => node.id);
    if (toShuffle.length === 0)
        return;
    const node = figma.getNodeById(toShuffle[0]);
    const parent = node.parent;
    let xPos = node.x;
    let yPos = node.y;
    for (let i = 0; i < toShuffle.length; i++) {
        const idx = Math.floor(Math.random() * (toShuffle.length - i)) + i;
        const target = figma.getNodeById(toShuffle[idx]);
        turnFaceDown(target);
        target.x = xPos;
        target.y = yPos;
        yPos--;
        parent.insertChild(i, target);
        const tmp = toShuffle[idx];
        toShuffle[idx] = toShuffle[i];
        toShuffle[i] = tmp;
    }
    figma.notify("Finished shuffling");
    figma.closePlugin();
}
function shuffleInPlace() {
    const toShuffle = figma.currentPage.selection;
    if (toShuffle.length === 0)
        return;
    for (let i = 0; i < toShuffle.length; i++) {
        const idx = Math.floor(Math.random() * (toShuffle.length - i)) + i;
        const tmpX = toShuffle[idx].x;
        const tmpY = toShuffle[idx].y;
        const tmpRotation = toShuffle[idx].rotation;
        toShuffle[idx].x = toShuffle[i].x;
        toShuffle[idx].y = toShuffle[i].y;
        toShuffle[idx].rotation = toShuffle[i].rotation;
        toShuffle[i].x = tmpX;
        toShuffle[i].y = tmpY;
        toShuffle[i].rotation = tmpRotation;
    }
    figma.notify("Finished shuffling in place");
    figma.closePlugin();
}
function gather() {
    const toGather = [...figma.currentPage.selection];
    if (toGather.length === 0) {
        figma.notify("Select item or itmes to gather");
        return;
    }
    let target = toGather[0];
    let xPos = target.x;
    let yPos = target.y;
    const assetNode = target.parent;
    if (assetNode.removed)
        return;
    if (assetNode.type !== "FRAME" && assetNode.type !== "PAGE")
        return;
    if (toGather.length > 1) {
        toGather.sort((a, b) => {
            if (a.x < b.x)
                return -1;
            if (a.x > b.x)
                return 1;
            if (a.y < b.y)
                return -1;
            if (a.y > b.y)
                return 1;
            return 0;
        });
        target = toGather[0];
        xPos = target.x;
        yPos = target.y;
        for (const item of toGather) {
            item.x = xPos;
            item.y = yPos;
            xPos += item.width + 2;
            item.rotation = 0;
            assetNode.appendChild(item);
        }
        return;
    }
    const targetName = target.getPluginData("class");
    const children = assetNode.children;
    const gathered = [];
    for (const candidate of children) {
        if (candidate.getPluginData("class") === targetName) {
            gathered.push(candidate);
            turnFaceDown(candidate);
            candidate.x = xPos;
            candidate.y = yPos;
            yPos--;
        }
    }
    figma.currentPage.selection = gathered;
}
function flip() {
    const selected = figma.currentPage.selection;
    for (let node of selected) {
        if (node.type !== "GROUP")
            continue;
        if (node.children.length === 0 || node.children[0].type !== "FRAME")
            continue;
        node.parent.appendChild(node);
        node = node.children[0];
        if (node.children.length === 2) {
            const clone = node.children[0].clone();
            node.appendChild(clone);
        }
        else if (node.children.length === 3) {
            node.children[2].remove();
        }
    }
    figma.closePlugin();
}
function show() {
    figma.showUI(__html__, { width: 400, height: 400 });
    let cachedHash = {};
    const recompute = () => __awaiter(this, void 0, void 0, function* () {
        const selection = figma.currentPage.selection;
        let all_same = true;
        for (const node of selection) {
            if (cachedHash[node.id] !== `${node.x}:${node.y}`) {
                cachedHash[node.id] = `${node.x}:${node.y}`;
                all_same = false;
            }
        }
        if (all_same)
            return;
        const container = figma.createFrame();
        container.clipsContent = false;
        container.x = -100000000;
        for (const node of selection) {
            if (node.type === "GROUP" && node.getPluginData("gameId") !== "") {
                if (node.children.length === 0 || node.children[0].type !== "FRAME")
                    continue;
                const inner = node.children[0];
                const child = inner.children[0].clone();
                container.appendChild(child);
                child.x = inner.absoluteTransform[0][2];
                child.y = inner.absoluteTransform[1][2];
            }
        }
        let uri = null;
        if (container.children.length > 0) {
            const group = figma.group(container.children, container);
            yield new Promise(resolve => setTimeout(resolve, 100));
            const bytes = yield group.exportAsync({ format: "PNG", contentsOnly: false });
            uri = bytes.reduce((data, byte) => data + String.fromCharCode(byte), '');
        }
        figma.ui.postMessage({ type: "img", uri });
        container.remove();
    });
    recompute();
    figma.ui.on("message", (msg) => {
        if (msg.type === "trigger-refresh")
            recompute();
    });
    figma.on("selectionchange", () => {
        cachedHash = {};
        recompute();
    });
}
const selection = figma.currentPage.selection;
if (selection.length === 1 && (selection[0].name === "Catan Game Board" || figma.command === "reset_catan") && selection[0].type === "FRAME") {
    selection[0].setRelaunchData({ reset_catan: "" });
    setupCatan(selection[0]);
}
else if (selection.length === 1 && (selection[0].name === "Mahjong Game Board" || figma.command === "reset_mahjong") && selection[0].type === "FRAME") {
    selection[0].setRelaunchData({ reset_mahjong: "" });
    setupMahjong(selection[0]);
}
else if (figma.command && figma.command !== "" && figma.command !== "reset") {
    const selection = figma.currentPage.selection;
    if (figma.root.getPluginData("url") !== "" ||
        (selection.length > 0 && selection[0].getPluginData("assetNode") !== "")) {
        figma.showUI(__html__, { width: 400, height: 400 });
        figma.ui.postMessage({ type: "warn" });
    }
    else if (figma.command === "shuffle")
        shuffle();
    else if (figma.command === "shuffle_in_place")
        shuffleInPlace();
    else if (figma.command === "flip")
        flip();
    else if (figma.command === "gather" || figma.command === "tidy") {
        gather();
        figma.closePlugin();
    }
    else if (figma.command === "show")
        show();
    else if (figma.command === "count") {
        figma.notify(`${figma.currentPage.selection.length} selected`);
        figma.closePlugin();
    }
    else if (figma.command === "tidy_show") {
        gather();
        show();
    }
}
else
    main();


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0EsMkJBQTJCLCtEQUErRCxnQkFBZ0IsRUFBRSxFQUFFO0FBQzlHO0FBQ0EsbUNBQW1DLE1BQU0sNkJBQTZCLEVBQUUsWUFBWSxXQUFXLEVBQUU7QUFDakcsa0NBQWtDLE1BQU0saUNBQWlDLEVBQUUsWUFBWSxXQUFXLEVBQUU7QUFDcEcsK0JBQStCLHFGQUFxRjtBQUNwSDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QTtBQUNBO0FBQ0Esa0NBQWtDLGtCQUFrQjtBQUNwRDtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0Msb0JBQW9CO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQywwQkFBMEI7QUFDMUQsOEJBQThCLGVBQWU7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixtQ0FBbUM7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImNvZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9jb2RlLnRzXCIpO1xuIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5mdW5jdGlvbiBtYWluKCkge1xuICAgIGNvbnN0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICBpZiAoc2VsZWN0aW9uLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICBmaWdtYS5ub3RpZnkoXCJTZWxlY3QgZXhhY3RseSAxIGZyYW1lIHRvIHN0YXJ0IGdhbWVcIik7XG4gICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IGdhbWUgPSBzZWxlY3Rpb25bMF07XG4gICAgaWYgKGdhbWUudHlwZSAhPT0gXCJGUkFNRVwiKSB7XG4gICAgICAgIGZpZ21hLm5vdGlmeShcIk11c3Qgc2VsZWN0IGEgZnJhbWUgbm9kZVwiKTtcbiAgICAgICAgZmlnbWEuY2xvc2VQbHVnaW4oKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBNQVJHSU4gPSAxMDA7XG4gICAgZ2FtZS5zZXRSZWxhdW5jaERhdGEoe1xuICAgICAgICByZXNldDogXCJSZXNldCB0aGUgZ2FtZSB0byB0aGUgZGVmYXVsdCBzdGF0ZVwiLFxuICAgIH0pO1xuICAgIGZpZ21hLnJvb3Quc2V0UGx1Z2luRGF0YShcInVybFwiLCBcIlwiKTtcbiAgICBmb3IgKGNvbnN0IG5vZGUgb2YgZ2FtZS5jaGlsZHJlbikge1xuICAgICAgICBpZiAobm9kZS5nZXRQbHVnaW5EYXRhKFwiZ2FtZUlkXCIpID09PSBnYW1lLmlkIHx8IChub2RlLm5hbWUgPT09IFwiYXNzZXRzXCIgJiYgbm9kZS50eXBlID09PSBcIkNPTVBPTkVOVFwiKSkge1xuICAgICAgICAgICAgbm9kZS5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBsZXQgaXRlbUlkeCA9IDA7XG4gICAgZm9yIChjb25zdCBwYWdlIG9mIGZpZ21hLnJvb3QuY2hpbGRyZW4pIHtcbiAgICAgICAgaWYgKHBhZ2UubmFtZSA9PT0gXCJBc3NldHNcIikge1xuICAgICAgICAgICAgbGV0IHhPZmZzZXQgPSBNQVJHSU47XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGZyYW1lIG9mIHBhZ2UuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICBpZiAoZnJhbWUudHlwZSAhPT0gXCJGUkFNRVwiKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBpdGVtSWR4Kys7XG4gICAgICAgICAgICAgICAgbGV0IGJhY2sgPSBudWxsO1xuICAgICAgICAgICAgICAgIGxldCB5T2Zmc2V0ID0gTUFSR0lOO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgZnJhbWUuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJhY2sgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2sgPSBjaGlsZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChjaGlsZC50eXBlID09PSBcIkNPTVBPTkVOVFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBjcmVhdGVDYXJkKGJhY2ssIGNoaWxkLCBnYW1lLCBmcmFtZS5uYW1lLCB4T2Zmc2V0LCB5T2Zmc2V0LCBpdGVtSWR4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc2V0UmVsYXVuY2hEYXRhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaHVmZmxlOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYXRoZXI6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsaXA6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZHk6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3c6ICdPbmx5IHlvdSBzZWUgdGhlIGhpZGRlbiBpbmZvJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudDogYENvdW50ICR7ZnJhbWUubmFtZX1zYFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB5T2Zmc2V0LS07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgeE9mZnNldCArPSBNQVJHSU4gKyBiYWNrLndpZHRoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xufVxuZnVuY3Rpb24gY3JlYXRlQ2FyZChiYWNrLCBjaGlsZCwgZ2FtZSwgbmFtZSwgeE9mZnNldCwgeU9mZnNldCwgaXRlbUlkeCkge1xuICAgIGNvbnN0IGJhY2tDbG9uZSA9IGJhY2suY2xvbmUoKTtcbiAgICBiYWNrQ2xvbmUueCA9IDA7XG4gICAgYmFja0Nsb25lLnkgPSAwO1xuICAgIGJhY2tDbG9uZS5sb2NrZWQgPSB0cnVlO1xuICAgIGNvbnN0IGNsb25lID0gY2hpbGQuY2xvbmUoKTtcbiAgICBjbG9uZS54ID0gMDtcbiAgICBjbG9uZS55ID0gMDtcbiAgICBjbG9uZS5sb2NrZWQgPSB0cnVlO1xuICAgIGNvbnN0IHdpZGdldCA9IGZpZ21hLmNyZWF0ZUZyYW1lKCk7XG4gICAgZ2FtZS5hcHBlbmRDaGlsZCh3aWRnZXQpO1xuICAgIHdpZGdldC5uYW1lID0gbmFtZTtcbiAgICB3aWRnZXQuZmlsbHMgPSBbXTtcbiAgICB3aWRnZXQuY2xpcHNDb250ZW50ID0gZmFsc2U7XG4gICAgd2lkZ2V0LmFwcGVuZENoaWxkKGNsb25lKTtcbiAgICB3aWRnZXQuYXBwZW5kQ2hpbGQoYmFja0Nsb25lKTtcbiAgICB3aWRnZXQucmVzaXplKGNsb25lLndpZHRoLCBjbG9uZS5oZWlnaHQpO1xuICAgIHdpZGdldC54ID0geE9mZnNldDtcbiAgICB3aWRnZXQueSA9IHlPZmZzZXQ7XG4gICAgY29uc3Qgc3BhY2VyID0gZmlnbWEuY3JlYXRlUmVjdGFuZ2xlKCk7XG4gICAgZ2FtZS5hcHBlbmRDaGlsZChzcGFjZXIpO1xuICAgIHNwYWNlci5uYW1lID0gXCItLS0tXCI7XG4gICAgc3BhY2VyLnJlc2l6ZShjbG9uZS53aWR0aCwgMSk7XG4gICAgc3BhY2VyLnggPSB3aWRnZXQueDtcbiAgICBzcGFjZXIueSA9IHdpZGdldC55ICsgd2lkZ2V0LmhlaWdodDtcbiAgICBzcGFjZXIuZmlsbHMgPSBbXTtcbiAgICBjb25zdCBpdGVtID0gZmlnbWEuZ3JvdXAoW3dpZGdldCwgc3BhY2VyXSwgZ2FtZSk7XG4gICAgaXRlbS5zZXRQbHVnaW5EYXRhKFwiZ2FtZUlkXCIsIGdhbWUuaWQpO1xuICAgIGl0ZW0uc2V0UGx1Z2luRGF0YShcImNsYXNzXCIsIGBpdGVtLSR7aXRlbUlkeH1gKTtcbiAgICBpdGVtLm5hbWUgPSBjaGlsZC5uYW1lO1xuICAgIHJldHVybiBpdGVtO1xufVxuZnVuY3Rpb24gc3dhcChhcnIsIGksIGopIHtcbiAgICBjb25zdCB0bXAgPSBhcnJbaV07XG4gICAgYXJyW2ldID0gYXJyW2pdO1xuICAgIGFycltqXSA9IHRtcDtcbn1cbmZ1bmN0aW9uIHNodWZmbGVBcnJheShhcnIsIHN0YXJ0SWR4KSB7XG4gICAgZm9yIChsZXQgaSA9IHN0YXJ0SWR4OyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGlkeCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChhcnIubGVuZ3RoIC0gaSkpO1xuICAgICAgICBzd2FwKGFyciwgaSwgaSArIGlkeCk7XG4gICAgfVxufVxuZnVuY3Rpb24gc2V0dXBDYXRhbihib2FyZCkge1xuICAgIGNvbnN0IGluZGV4VG9Qb3NpdGlvbiA9IFtcbiAgICAgICAgWzIsIDRdLFxuICAgICAgICBbMiwgNl0sXG4gICAgICAgIFszLCA1XSxcbiAgICAgICAgWzMsIDNdLFxuICAgICAgICBbMiwgMl0sXG4gICAgICAgIFsxLCAzXSxcbiAgICAgICAgWzEsIDVdLFxuICAgICAgICBbMiwgOF0sXG4gICAgICAgIFszLCA3XSxcbiAgICAgICAgWzQsIDZdLFxuICAgICAgICBbNCwgNF0sXG4gICAgICAgIFs0LCAyXSxcbiAgICAgICAgWzMsIDFdLFxuICAgICAgICBbMiwgMF0sXG4gICAgICAgIFsxLCAxXSxcbiAgICAgICAgWzAsIDJdLFxuICAgICAgICBbMCwgNF0sXG4gICAgICAgIFswLCA2XSxcbiAgICAgICAgWzEsIDddLFxuICAgIF0ucmV2ZXJzZSgpO1xuICAgIGNvbnN0IHBvc2l0aW9uVG9JbmRleCA9IHt9O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5kZXhUb1Bvc2l0aW9uLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gaW5kZXhUb1Bvc2l0aW9uW2ldO1xuICAgICAgICBwb3NpdGlvblRvSW5kZXhbYCR7cG9zaXRpb259YF0gPSBpO1xuICAgIH1cbiAgICBjb25zdCBiaW9tZXMgPSBbXCJGaWVsZFwiLCBcIkZvcmVzdFwiLCBcIk9yZVwiLCBcIkRlc2VydFwiLCBcIldoZWF0XCIsIFwiQ2xheVwiXTtcbiAgICBjb25zdCBhbGxCaW9tZXMgPSBbMCwgMCwgMCwgMCwgMSwgMSwgMSwgMSwgMiwgMiwgMiwgMywgNCwgNCwgNCwgNCwgNSwgNSwgNV07XG4gICAgY29uc3QgYmlvbWVDb21wb25lbnRzID0gW251bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGxdO1xuICAgIGxldCBiaW9tZXNGb3VuZCA9IDA7XG4gICAgY29uc3QgcG9ydHMgPSBbXCJGaWVsZFwiLCBcIkZvcmVzdFwiLCBcIk9yZVwiLCBcIkFueVwiLCBcIldoZWF0XCIsIFwiQ2xheVwiXTtcbiAgICBjb25zdCBhbGxQb3J0cyA9IFswLCAxLCAyLCAzLCAzLCAzLCAzLCA0LCA1XTtcbiAgICBjb25zdCBwb3J0Q29tcG9uZW50cyA9IFtudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsXTtcbiAgICBsZXQgcG9ydHNGb3VuZCA9IDA7XG4gICAgY29uc3QgbnVtYmVycyA9IFtcIjJcIiwgXCIzXCIsIFwiNFwiLCBcIjVcIiwgXCI2XCIsIFwiOFwiLCBcIjlcIiwgXCIxMFwiLCBcIjExXCIsIFwiMTJcIl07XG4gICAgY29uc3QgYWxsTnVtYmVycyA9IFswLCAxLCAxLCAyLCAyLCAzLCAzLCA2LCA2LCA3LCA3LCA4LCA4LCA5XTtcbiAgICBjb25zdCBudW1iZXJDb21wb25lbnRzID0gW251bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGxdO1xuICAgIGxldCBudW1iZXJzRm91bmQgPSAwO1xuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgZmlnbWEucm9vdC5jaGlsZHJlbikge1xuICAgICAgICBpZiAoY2hpbGQubmFtZS5pbmRleE9mKFwiQ29tcG9uZW50c1wiKSA8IDApXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgZm9yIChjb25zdCBjYW5kaWRhdGUgb2YgY2hpbGQuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIGlmIChjYW5kaWRhdGUudHlwZSAhPT0gXCJDT01QT05FTlRcIilcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIGlmIChjYW5kaWRhdGUubmFtZS5pbmRleE9mKFwiQmlvbWUgLyBcIikgPT09IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBiaW9tZU5hbWUgPSBjYW5kaWRhdGUubmFtZS5zdWJzdHJpbmcoOCk7XG4gICAgICAgICAgICAgICAgY29uc3QgYmlvbWVJZHggPSBiaW9tZXMuaW5kZXhPZihiaW9tZU5hbWUpO1xuICAgICAgICAgICAgICAgIGlmIChiaW9tZUlkeCA8IDApXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGlmIChiaW9tZUNvbXBvbmVudHNbYmlvbWVJZHhdICE9IG51bGwpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGJpb21lc0ZvdW5kKys7XG4gICAgICAgICAgICAgICAgYmlvbWVDb21wb25lbnRzW2Jpb21lSWR4XSA9IGNhbmRpZGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNhbmRpZGF0ZS5uYW1lLmluZGV4T2YoXCJQb3J0IC8gXCIpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcG9ydE5hbWUgPSBjYW5kaWRhdGUubmFtZS5zdWJzdHJpbmcoNyk7XG4gICAgICAgICAgICAgICAgY29uc3QgcG9ydElkeCA9IHBvcnRzLmluZGV4T2YocG9ydE5hbWUpO1xuICAgICAgICAgICAgICAgIGlmIChwb3J0SWR4IDwgMClcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgaWYgKHBvcnRDb21wb25lbnRzW3BvcnRJZHhdICE9IG51bGwpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIHBvcnRzRm91bmQrKztcbiAgICAgICAgICAgICAgICBwb3J0Q29tcG9uZW50c1twb3J0SWR4XSA9IGNhbmRpZGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNhbmRpZGF0ZS5uYW1lLmluZGV4T2YoXCJOdW1iZXIgVGlsZSAvIFwiKSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG51bWJlck5hbWUgPSBjYW5kaWRhdGUubmFtZS5zdWJzdHJpbmcoMTQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG51bWJlcklkeCA9IG51bWJlcnMuaW5kZXhPZihudW1iZXJOYW1lKTtcbiAgICAgICAgICAgICAgICBpZiAobnVtYmVySWR4IDwgMClcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgaWYgKG51bWJlckNvbXBvbmVudHNbbnVtYmVySWR4XSAhPSBudWxsKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBudW1iZXJzRm91bmQrKztcbiAgICAgICAgICAgICAgICBudW1iZXJDb21wb25lbnRzW251bWJlcklkeF0gPSBjYW5kaWRhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYmlvbWVzRm91bmQgPT09IDYgJiYgcG9ydHNGb3VuZCA9PT0gNiAmJiBudW1iZXJzRm91bmQgPT09IDEwKVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChiaW9tZXNGb3VuZCA9PT0gNiAmJiBwb3J0c0ZvdW5kID09PSA2ICYmIG51bWJlcnNGb3VuZCA9PT0gMTApXG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgc2h1ZmZsZUFycmF5KGFsbEJpb21lcywgMCk7XG4gICAgc2h1ZmZsZUFycmF5KGFsbFBvcnRzLCAwKTtcbiAgICBsZXQgY3VyckJpb21lSWR4ID0gMDtcbiAgICBsZXQgY3VyclBvcnRJZHggPSAwO1xuICAgIGNvbnN0IG51bWJlclBvc2l0aW9ucyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWxsQmlvbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChhbGxCaW9tZXNbaV0gIT09IDMpXG4gICAgICAgICAgICBudW1iZXJQb3NpdGlvbnMucHVzaChpKTtcbiAgICB9XG4gICAgY29uc3Qgc3BlY2lhbE51bWJlcnMgPSBbNCwgNCwgNSwgNV07XG4gICAgbGV0IGN1cnJJZHggPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG51bSA9IHNwZWNpYWxOdW1iZXJzW2ldO1xuICAgICAgICBhbGxOdW1iZXJzLnNwbGljZShjdXJySWR4LCAwLCBudW0pO1xuICAgICAgICBjb25zdCBpZHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobnVtYmVyUG9zaXRpb25zLmxlbmd0aCAtIGN1cnJJZHgpKTtcbiAgICAgICAgc3dhcChudW1iZXJQb3NpdGlvbnMsIGN1cnJJZHgsIGlkeCArIGN1cnJJZHgpO1xuICAgICAgICBjb25zdCBjb29yZHMgPSBpbmRleFRvUG9zaXRpb25bbnVtYmVyUG9zaXRpb25zW2N1cnJJZHhdXTtcbiAgICAgICAgY3VycklkeCsrO1xuICAgICAgICBjb25zdCBuZWlnaGJvcnMgPSBbXG4gICAgICAgICAgICBbY29vcmRzWzBdIC0gMSwgY29vcmRzWzFdIC0gMV0sIFtjb29yZHNbMF0gLSAxLCBjb29yZHNbMV0gKyAxXSxcbiAgICAgICAgICAgIFtjb29yZHNbMF0sIGNvb3Jkc1sxXSAtIDJdLCBbY29vcmRzWzBdLCBjb29yZHNbMV0gKyAyXSxcbiAgICAgICAgICAgIFtjb29yZHNbMF0gKyAxLCBjb29yZHNbMV0gLSAxXSwgW2Nvb3Jkc1swXSArIDEsIGNvb3Jkc1sxXSArIDFdLFxuICAgICAgICBdO1xuICAgICAgICBmb3IgKGNvbnN0IG5laWdoYm9yIG9mIG5laWdoYm9ycykge1xuICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSBwb3NpdGlvblRvSW5kZXhbYCR7bmVpZ2hib3J9YF07XG4gICAgICAgICAgICBpZiAocG9zaXRpb24gPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgY29uc3QgaWR4ID0gbnVtYmVyUG9zaXRpb25zLmluZGV4T2YocG9zaXRpb24pO1xuICAgICAgICAgICAgaWYgKGlkeCA8IGN1cnJJZHgpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICBzd2FwKG51bWJlclBvc2l0aW9ucywgY3VycklkeCwgaWR4KTtcbiAgICAgICAgICAgIGNvbnN0IHRvU3dhcCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChhbGxOdW1iZXJzLmxlbmd0aCAtIGN1cnJJZHgpKTtcbiAgICAgICAgICAgIHN3YXAoYWxsTnVtYmVycywgY3VycklkeCwgY3VycklkeCArIHRvU3dhcCk7XG4gICAgICAgICAgICBjdXJySWR4Kys7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc2h1ZmZsZUFycmF5KGFsbE51bWJlcnMsIGN1cnJJZHgpO1xuICAgIGNvbnN0IHBvc2l0aW9uVG9Db21wb25lbnQgPSB7fTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFsbE51bWJlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcG9zaXRpb25Ub0NvbXBvbmVudFtudW1iZXJQb3NpdGlvbnNbaV1dID0gbnVtYmVyQ29tcG9uZW50c1thbGxOdW1iZXJzW2ldXTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBib2FyZC5jaGlsZHJlbikge1xuICAgICAgICBpZiAoY2hpbGQudHlwZSAhPT0gXCJJTlNUQU5DRVwiKVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIGlmIChjaGlsZC5uYW1lLmluZGV4T2YoXCJCaW9tZSAvIFwiKSA9PT0gMCkge1xuICAgICAgICAgICAgY2hpbGQubWFzdGVyQ29tcG9uZW50ID0gYmlvbWVDb21wb25lbnRzW2FsbEJpb21lc1tjdXJyQmlvbWVJZHhdXTtcbiAgICAgICAgICAgIGlmIChwb3NpdGlvblRvQ29tcG9uZW50W2N1cnJCaW9tZUlkeF0gJiYgY2hpbGQuY2hpbGRyZW5bMV0udHlwZSA9PT0gXCJJTlNUQU5DRVwiKSB7XG4gICAgICAgICAgICAgICAgY2hpbGQuY2hpbGRyZW5bMV0ubWFzdGVyQ29tcG9uZW50ID0gcG9zaXRpb25Ub0NvbXBvbmVudFtjdXJyQmlvbWVJZHhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VyckJpb21lSWR4Kys7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNoaWxkLm5hbWUuaW5kZXhPZihcIlBvcnQgLyBcIikgPT09IDApIHtcbiAgICAgICAgICAgIGNoaWxkLm1hc3RlckNvbXBvbmVudCA9IHBvcnRDb21wb25lbnRzW2FsbFBvcnRzW2N1cnJQb3J0SWR4XV07XG4gICAgICAgICAgICBjdXJyUG9ydElkeCsrO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XG59XG5mdW5jdGlvbiBzZXR1cE1haGpvbmcoYm9hcmQpIHtcbiAgICBsZXQgaXRlbUlkeCA9IDA7XG4gICAgY29uc3QgTUFSR0lOX1kgPSAxNTAwO1xuICAgIGNvbnN0IE1BUkdJTl9YID0gMTUwMCArIDY3NTtcbiAgICBjb25zdCBUSUxFU19QRVJfUk9XID0gMjg7IC8vIDM2IGluY2wuIGFsbCB0aWxlcywgMjggZm9yIGp1c3QgMyBzdWl0cyBcbiAgICBjb25zdCB0aWxlcyA9IFtdO1xuICAgIGZvciAoY29uc3QgcGFnZSBvZiBmaWdtYS5yb290LmNoaWxkcmVuKSB7XG4gICAgICAgIGlmIChwYWdlLm5hbWUgPT09IFwiQXNzZXRzXCIpIHtcbiAgICAgICAgICAgIGxldCB4T2Zmc2V0ID0gTUFSR0lOX1g7XG4gICAgICAgICAgICBsZXQgeU9mZnNldCA9IE1BUkdJTl9ZO1xuICAgICAgICAgICAgbGV0IHJvd0hlaWdodCA9IE1BUkdJTl9ZO1xuICAgICAgICAgICAgbGV0IHRpbGVOdW0gPSAxO1xuICAgICAgICAgICAgbGV0IHJvdGF0aW9uID0gMDtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZnJhbWUgb2YgcGFnZS5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgIGlmIChmcmFtZS50eXBlICE9PSBcIkZSQU1FXCIpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGl0ZW1JZHgrKztcbiAgICAgICAgICAgICAgICBsZXQgYmFjayA9IG51bGw7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBjaGlsZCBvZiBmcmFtZS5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYmFjayA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmFjayA9IGNoaWxkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGNoaWxkLnR5cGUgPT09IFwiQ09NUE9ORU5UXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IGNyZWF0ZUNhcmQoYmFjaywgY2hpbGQsIGJvYXJkLCBjaGlsZC5uYW1lLCB4T2Zmc2V0LCB5T2Zmc2V0LCBpdGVtSWR4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvYXJkLmFwcGVuZENoaWxkKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGlsZXMucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0ucm90YXRpb24gPSByb3RhdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0uc2V0UmVsYXVuY2hEYXRhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaHVmZmxlX2luX3BsYWNlOiAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYXRoZXI6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsaXA6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZHk6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpZHlfc2hvdzogJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvdzogJ09ubHkgeW91IHNlZSB0aGUgaGlkZGVuIGluZm8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiBgQ291bnQgJHtmcmFtZS5uYW1lfXNgXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aWxlTnVtICUgMiA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3RhdGlvbiAhPSAwKSB7IC8vIHJvdGF0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeU9mZnNldCArPSBiYWNrLndpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeE9mZnNldCArPSBiYWNrLndpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB5T2Zmc2V0ID0gcm93SGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHlPZmZzZXQtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aWxlTnVtICUgVElMRVNfUEVSX1JPVyA9PT0gMCkgeyAvLyBlbmQgb2Ygcm93LCByZXNldFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodGlsZU51bSAvIFRJTEVTX1BFUl9ST1cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeE9mZnNldCA9IE1BUkdJTl9YIC0gYmFjay5oZWlnaHQgLSBiYWNrLndpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93SGVpZ2h0ID0gTUFSR0lOX1kgKyBiYWNrLmhlaWdodCArIDIgKiBiYWNrLndpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMjogLy8gYWJvdXQgdG8gc3RhcnQgYm90dG9tIHJvd1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93SGVpZ2h0ID0geU9mZnNldDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhPZmZzZXQgPSBNQVJHSU5fWDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDM6IC8vIGFib3V0IHRvIHN0YXJ0IHJpZ2h0IHJvd1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeE9mZnNldCArPSBiYWNrLndpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm93SGVpZ2h0ID0gTUFSR0lOX1kgKyBiYWNrLmhlaWdodCArIDIgKiBiYWNrLndpZHRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB4T2Zmc2V0ID0gTUFSR0lOX1g7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3dIZWlnaHQgKz0gODAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5T2Zmc2V0ID0gcm93SGVpZ2h0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyb3RhdGlvbiA9PT0gOTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm90YXRpb24gPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm90YXRpb24gPSA5MDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aWxlTnVtKys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gdGlsZXM7XG4gICAgICAgICAgICAgICAgc2h1ZmZsZUluUGxhY2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIHR1cm5GYWNlRG93bihub2RlKSB7XG4gICAgaWYgKG5vZGUudHlwZSA9PT0gXCJHUk9VUFwiKSB7XG4gICAgICAgIGlmIChub2RlLmNoaWxkcmVuLmxlbmd0aCA+IDAgJiYgbm9kZS5jaGlsZHJlblswXS50eXBlID09PSBcIkZSQU1FXCIpIHtcbiAgICAgICAgICAgIG5vZGUgPSBub2RlLmNoaWxkcmVuWzBdO1xuICAgICAgICAgICAgaWYgKG5vZGUuY2hpbGRyZW4ubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICAgICAgbm9kZS5jaGlsZHJlblsyXS5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIHNodWZmbGUoKSB7XG4gICAgY29uc3QgdG9TaHVmZmxlID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLm1hcCgobm9kZSkgPT4gbm9kZS5pZCk7XG4gICAgaWYgKHRvU2h1ZmZsZS5sZW5ndGggPT09IDApXG4gICAgICAgIHJldHVybjtcbiAgICBjb25zdCBub2RlID0gZmlnbWEuZ2V0Tm9kZUJ5SWQodG9TaHVmZmxlWzBdKTtcbiAgICBjb25zdCBwYXJlbnQgPSBub2RlLnBhcmVudDtcbiAgICBsZXQgeFBvcyA9IG5vZGUueDtcbiAgICBsZXQgeVBvcyA9IG5vZGUueTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvU2h1ZmZsZS5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBpZHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAodG9TaHVmZmxlLmxlbmd0aCAtIGkpKSArIGk7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGZpZ21hLmdldE5vZGVCeUlkKHRvU2h1ZmZsZVtpZHhdKTtcbiAgICAgICAgdHVybkZhY2VEb3duKHRhcmdldCk7XG4gICAgICAgIHRhcmdldC54ID0geFBvcztcbiAgICAgICAgdGFyZ2V0LnkgPSB5UG9zO1xuICAgICAgICB5UG9zLS07XG4gICAgICAgIHBhcmVudC5pbnNlcnRDaGlsZChpLCB0YXJnZXQpO1xuICAgICAgICBjb25zdCB0bXAgPSB0b1NodWZmbGVbaWR4XTtcbiAgICAgICAgdG9TaHVmZmxlW2lkeF0gPSB0b1NodWZmbGVbaV07XG4gICAgICAgIHRvU2h1ZmZsZVtpXSA9IHRtcDtcbiAgICB9XG4gICAgZmlnbWEubm90aWZ5KFwiRmluaXNoZWQgc2h1ZmZsaW5nXCIpO1xuICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XG59XG5mdW5jdGlvbiBzaHVmZmxlSW5QbGFjZSgpIHtcbiAgICBjb25zdCB0b1NodWZmbGUgPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XG4gICAgaWYgKHRvU2h1ZmZsZS5sZW5ndGggPT09IDApXG4gICAgICAgIHJldHVybjtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvU2h1ZmZsZS5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBpZHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAodG9TaHVmZmxlLmxlbmd0aCAtIGkpKSArIGk7XG4gICAgICAgIGNvbnN0IHRtcFggPSB0b1NodWZmbGVbaWR4XS54O1xuICAgICAgICBjb25zdCB0bXBZID0gdG9TaHVmZmxlW2lkeF0ueTtcbiAgICAgICAgY29uc3QgdG1wUm90YXRpb24gPSB0b1NodWZmbGVbaWR4XS5yb3RhdGlvbjtcbiAgICAgICAgdG9TaHVmZmxlW2lkeF0ueCA9IHRvU2h1ZmZsZVtpXS54O1xuICAgICAgICB0b1NodWZmbGVbaWR4XS55ID0gdG9TaHVmZmxlW2ldLnk7XG4gICAgICAgIHRvU2h1ZmZsZVtpZHhdLnJvdGF0aW9uID0gdG9TaHVmZmxlW2ldLnJvdGF0aW9uO1xuICAgICAgICB0b1NodWZmbGVbaV0ueCA9IHRtcFg7XG4gICAgICAgIHRvU2h1ZmZsZVtpXS55ID0gdG1wWTtcbiAgICAgICAgdG9TaHVmZmxlW2ldLnJvdGF0aW9uID0gdG1wUm90YXRpb247XG4gICAgfVxuICAgIGZpZ21hLm5vdGlmeShcIkZpbmlzaGVkIHNodWZmbGluZyBpbiBwbGFjZVwiKTtcbiAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xufVxuZnVuY3Rpb24gZ2F0aGVyKCkge1xuICAgIGNvbnN0IHRvR2F0aGVyID0gWy4uLmZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbl07XG4gICAgaWYgKHRvR2F0aGVyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBmaWdtYS5ub3RpZnkoXCJTZWxlY3QgaXRlbSBvciBpdG1lcyB0byBnYXRoZXJcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IHRhcmdldCA9IHRvR2F0aGVyWzBdO1xuICAgIGxldCB4UG9zID0gdGFyZ2V0Lng7XG4gICAgbGV0IHlQb3MgPSB0YXJnZXQueTtcbiAgICBjb25zdCBhc3NldE5vZGUgPSB0YXJnZXQucGFyZW50O1xuICAgIGlmIChhc3NldE5vZGUucmVtb3ZlZClcbiAgICAgICAgcmV0dXJuO1xuICAgIGlmIChhc3NldE5vZGUudHlwZSAhPT0gXCJGUkFNRVwiICYmIGFzc2V0Tm9kZS50eXBlICE9PSBcIlBBR0VcIilcbiAgICAgICAgcmV0dXJuO1xuICAgIGlmICh0b0dhdGhlci5sZW5ndGggPiAxKSB7XG4gICAgICAgIHRvR2F0aGVyLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgIGlmIChhLnggPCBiLngpXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgaWYgKGEueCA+IGIueClcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIGlmIChhLnkgPCBiLnkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgaWYgKGEueSA+IGIueSlcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9KTtcbiAgICAgICAgdGFyZ2V0ID0gdG9HYXRoZXJbMF07XG4gICAgICAgIHhQb3MgPSB0YXJnZXQueDtcbiAgICAgICAgeVBvcyA9IHRhcmdldC55O1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdG9HYXRoZXIpIHtcbiAgICAgICAgICAgIGl0ZW0ueCA9IHhQb3M7XG4gICAgICAgICAgICBpdGVtLnkgPSB5UG9zO1xuICAgICAgICAgICAgeFBvcyArPSBpdGVtLndpZHRoICsgMjtcbiAgICAgICAgICAgIGl0ZW0ucm90YXRpb24gPSAwO1xuICAgICAgICAgICAgYXNzZXROb2RlLmFwcGVuZENoaWxkKGl0ZW0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgdGFyZ2V0TmFtZSA9IHRhcmdldC5nZXRQbHVnaW5EYXRhKFwiY2xhc3NcIik7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBhc3NldE5vZGUuY2hpbGRyZW47XG4gICAgY29uc3QgZ2F0aGVyZWQgPSBbXTtcbiAgICBmb3IgKGNvbnN0IGNhbmRpZGF0ZSBvZiBjaGlsZHJlbikge1xuICAgICAgICBpZiAoY2FuZGlkYXRlLmdldFBsdWdpbkRhdGEoXCJjbGFzc1wiKSA9PT0gdGFyZ2V0TmFtZSkge1xuICAgICAgICAgICAgZ2F0aGVyZWQucHVzaChjYW5kaWRhdGUpO1xuICAgICAgICAgICAgdHVybkZhY2VEb3duKGNhbmRpZGF0ZSk7XG4gICAgICAgICAgICBjYW5kaWRhdGUueCA9IHhQb3M7XG4gICAgICAgICAgICBjYW5kaWRhdGUueSA9IHlQb3M7XG4gICAgICAgICAgICB5UG9zLS07XG4gICAgICAgIH1cbiAgICB9XG4gICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gZ2F0aGVyZWQ7XG59XG5mdW5jdGlvbiBmbGlwKCkge1xuICAgIGNvbnN0IHNlbGVjdGVkID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgIGZvciAobGV0IG5vZGUgb2Ygc2VsZWN0ZWQpIHtcbiAgICAgICAgaWYgKG5vZGUudHlwZSAhPT0gXCJHUk9VUFwiKVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIGlmIChub2RlLmNoaWxkcmVuLmxlbmd0aCA9PT0gMCB8fCBub2RlLmNoaWxkcmVuWzBdLnR5cGUgIT09IFwiRlJBTUVcIilcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICBub2RlLnBhcmVudC5hcHBlbmRDaGlsZChub2RlKTtcbiAgICAgICAgbm9kZSA9IG5vZGUuY2hpbGRyZW5bMF07XG4gICAgICAgIGlmIChub2RlLmNoaWxkcmVuLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgY29uc3QgY2xvbmUgPSBub2RlLmNoaWxkcmVuWzBdLmNsb25lKCk7XG4gICAgICAgICAgICBub2RlLmFwcGVuZENoaWxkKGNsb25lKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChub2RlLmNoaWxkcmVuLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgbm9kZS5jaGlsZHJlblsyXS5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmaWdtYS5jbG9zZVBsdWdpbigpO1xufVxuZnVuY3Rpb24gc2hvdygpIHtcbiAgICBmaWdtYS5zaG93VUkoX19odG1sX18sIHsgd2lkdGg6IDQwMCwgaGVpZ2h0OiA0MDAgfSk7XG4gICAgbGV0IGNhY2hlZEhhc2ggPSB7fTtcbiAgICBjb25zdCByZWNvbXB1dGUgPSAoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICAgICAgbGV0IGFsbF9zYW1lID0gdHJ1ZTtcbiAgICAgICAgZm9yIChjb25zdCBub2RlIG9mIHNlbGVjdGlvbikge1xuICAgICAgICAgICAgaWYgKGNhY2hlZEhhc2hbbm9kZS5pZF0gIT09IGAke25vZGUueH06JHtub2RlLnl9YCkge1xuICAgICAgICAgICAgICAgIGNhY2hlZEhhc2hbbm9kZS5pZF0gPSBgJHtub2RlLnh9OiR7bm9kZS55fWA7XG4gICAgICAgICAgICAgICAgYWxsX3NhbWUgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoYWxsX3NhbWUpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGZpZ21hLmNyZWF0ZUZyYW1lKCk7XG4gICAgICAgIGNvbnRhaW5lci5jbGlwc0NvbnRlbnQgPSBmYWxzZTtcbiAgICAgICAgY29udGFpbmVyLnggPSAtMTAwMDAwMDAwO1xuICAgICAgICBmb3IgKGNvbnN0IG5vZGUgb2Ygc2VsZWN0aW9uKSB7XG4gICAgICAgICAgICBpZiAobm9kZS50eXBlID09PSBcIkdST1VQXCIgJiYgbm9kZS5nZXRQbHVnaW5EYXRhKFwiZ2FtZUlkXCIpICE9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuY2hpbGRyZW4ubGVuZ3RoID09PSAwIHx8IG5vZGUuY2hpbGRyZW5bMF0udHlwZSAhPT0gXCJGUkFNRVwiKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjb25zdCBpbm5lciA9IG5vZGUuY2hpbGRyZW5bMF07XG4gICAgICAgICAgICAgICAgY29uc3QgY2hpbGQgPSBpbm5lci5jaGlsZHJlblswXS5jbG9uZSgpO1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgICAgICAgICAgICAgY2hpbGQueCA9IGlubmVyLmFic29sdXRlVHJhbnNmb3JtWzBdWzJdO1xuICAgICAgICAgICAgICAgIGNoaWxkLnkgPSBpbm5lci5hYnNvbHV0ZVRyYW5zZm9ybVsxXVsyXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgdXJpID0gbnVsbDtcbiAgICAgICAgaWYgKGNvbnRhaW5lci5jaGlsZHJlbi5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBncm91cCA9IGZpZ21hLmdyb3VwKGNvbnRhaW5lci5jaGlsZHJlbiwgY29udGFpbmVyKTtcbiAgICAgICAgICAgIHlpZWxkIG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDApKTtcbiAgICAgICAgICAgIGNvbnN0IGJ5dGVzID0geWllbGQgZ3JvdXAuZXhwb3J0QXN5bmMoeyBmb3JtYXQ6IFwiUE5HXCIsIGNvbnRlbnRzT25seTogZmFsc2UgfSk7XG4gICAgICAgICAgICB1cmkgPSBieXRlcy5yZWR1Y2UoKGRhdGEsIGJ5dGUpID0+IGRhdGEgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGUpLCAnJyk7XG4gICAgICAgIH1cbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiBcImltZ1wiLCB1cmkgfSk7XG4gICAgICAgIGNvbnRhaW5lci5yZW1vdmUoKTtcbiAgICB9KTtcbiAgICByZWNvbXB1dGUoKTtcbiAgICBmaWdtYS51aS5vbihcIm1lc3NhZ2VcIiwgKG1zZykgPT4ge1xuICAgICAgICBpZiAobXNnLnR5cGUgPT09IFwidHJpZ2dlci1yZWZyZXNoXCIpXG4gICAgICAgICAgICByZWNvbXB1dGUoKTtcbiAgICB9KTtcbiAgICBmaWdtYS5vbihcInNlbGVjdGlvbmNoYW5nZVwiLCAoKSA9PiB7XG4gICAgICAgIGNhY2hlZEhhc2ggPSB7fTtcbiAgICAgICAgcmVjb21wdXRlKCk7XG4gICAgfSk7XG59XG5jb25zdCBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XG5pZiAoc2VsZWN0aW9uLmxlbmd0aCA9PT0gMSAmJiAoc2VsZWN0aW9uWzBdLm5hbWUgPT09IFwiQ2F0YW4gR2FtZSBCb2FyZFwiIHx8IGZpZ21hLmNvbW1hbmQgPT09IFwicmVzZXRfY2F0YW5cIikgJiYgc2VsZWN0aW9uWzBdLnR5cGUgPT09IFwiRlJBTUVcIikge1xuICAgIHNlbGVjdGlvblswXS5zZXRSZWxhdW5jaERhdGEoeyByZXNldF9jYXRhbjogXCJcIiB9KTtcbiAgICBzZXR1cENhdGFuKHNlbGVjdGlvblswXSk7XG59XG5lbHNlIGlmIChzZWxlY3Rpb24ubGVuZ3RoID09PSAxICYmIChzZWxlY3Rpb25bMF0ubmFtZSA9PT0gXCJNYWhqb25nIEdhbWUgQm9hcmRcIiB8fCBmaWdtYS5jb21tYW5kID09PSBcInJlc2V0X21haGpvbmdcIikgJiYgc2VsZWN0aW9uWzBdLnR5cGUgPT09IFwiRlJBTUVcIikge1xuICAgIHNlbGVjdGlvblswXS5zZXRSZWxhdW5jaERhdGEoeyByZXNldF9tYWhqb25nOiBcIlwiIH0pO1xuICAgIHNldHVwTWFoam9uZyhzZWxlY3Rpb25bMF0pO1xufVxuZWxzZSBpZiAoZmlnbWEuY29tbWFuZCAmJiBmaWdtYS5jb21tYW5kICE9PSBcIlwiICYmIGZpZ21hLmNvbW1hbmQgIT09IFwicmVzZXRcIikge1xuICAgIGNvbnN0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICBpZiAoZmlnbWEucm9vdC5nZXRQbHVnaW5EYXRhKFwidXJsXCIpICE9PSBcIlwiIHx8XG4gICAgICAgIChzZWxlY3Rpb24ubGVuZ3RoID4gMCAmJiBzZWxlY3Rpb25bMF0uZ2V0UGx1Z2luRGF0YShcImFzc2V0Tm9kZVwiKSAhPT0gXCJcIikpIHtcbiAgICAgICAgZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7IHdpZHRoOiA0MDAsIGhlaWdodDogNDAwIH0pO1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6IFwid2FyblwiIH0pO1xuICAgIH1cbiAgICBlbHNlIGlmIChmaWdtYS5jb21tYW5kID09PSBcInNodWZmbGVcIilcbiAgICAgICAgc2h1ZmZsZSgpO1xuICAgIGVsc2UgaWYgKGZpZ21hLmNvbW1hbmQgPT09IFwic2h1ZmZsZV9pbl9wbGFjZVwiKVxuICAgICAgICBzaHVmZmxlSW5QbGFjZSgpO1xuICAgIGVsc2UgaWYgKGZpZ21hLmNvbW1hbmQgPT09IFwiZmxpcFwiKVxuICAgICAgICBmbGlwKCk7XG4gICAgZWxzZSBpZiAoZmlnbWEuY29tbWFuZCA9PT0gXCJnYXRoZXJcIiB8fCBmaWdtYS5jb21tYW5kID09PSBcInRpZHlcIikge1xuICAgICAgICBnYXRoZXIoKTtcbiAgICAgICAgZmlnbWEuY2xvc2VQbHVnaW4oKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoZmlnbWEuY29tbWFuZCA9PT0gXCJzaG93XCIpXG4gICAgICAgIHNob3coKTtcbiAgICBlbHNlIGlmIChmaWdtYS5jb21tYW5kID09PSBcImNvdW50XCIpIHtcbiAgICAgICAgZmlnbWEubm90aWZ5KGAke2ZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbi5sZW5ndGh9IHNlbGVjdGVkYCk7XG4gICAgICAgIGZpZ21hLmNsb3NlUGx1Z2luKCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGZpZ21hLmNvbW1hbmQgPT09IFwidGlkeV9zaG93XCIpIHtcbiAgICAgICAgZ2F0aGVyKCk7XG4gICAgICAgIHNob3coKTtcbiAgICB9XG59XG5lbHNlXG4gICAgbWFpbigpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==
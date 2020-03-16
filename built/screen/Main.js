"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var blessed_1 = __importDefault(require("blessed"));
var Main = /** @class */ (function () {
    function Main(screen, grid) {
        this.screen = screen;
        this.grid = grid;
        this.commit = this.grid.set(0, 0, 13, 20, blessed_1.default.list, {
            keys: true,
            //mouse: true,
            parent: this.screen,
            scrollable: true,
            alwaysScroll: true,
            label: 'COMMIT',
            width: '48%',
            height: '100%',
            selectedFg: 'black',
            selectedBg: 'white',
            align: 'left',
            //interactive: false,
            border: { type: 'line' },
            style: {
                fg: 'white',
                bg: 234,
                border: {
                    fg: 'cyan',
                    bg: 234
                },
                label: {
                    bg: 234
                }
            },
            noCellBorders: true,
            tags: true,
            wrap: false,
            vi: true,
            search: true
        });
        this.modefied = this.grid.set(13, 0, 7, 20, blessed_1.default.box, {
            keys: true,
            parent: this.screen,
            selectedFg: 'white',
            selectedBg: 'black',
            interactive: 'true',
            width: '48%',
            height: '100%',
            border: { type: 'line' },
            style: {
                bg: 234,
                border: {
                    fg: 'cyan',
                    bg: 234
                },
                label: {
                    bg: 234
                }
            },
        });
        this.contains = this.grid.set(0, 0, 0, 0, blessed_1.default.box, {
            keys: true,
            parent: this.screen,
            label: 'CONTAINS',
            width: '48%',
            height: '100%',
            fg: 'white',
            selectedFg: 'white',
            selectedBg: 'black',
            align: 'left',
            interactive: 'true',
            scrollable: true,
            alwaysScroll: true,
            border: { type: 'line', fg: 'white' },
            style: {
                focus: {
                    border: { type: 'line', fg: 'white' },
                }
            },
            noCellBorders: true,
            tags: true,
            vi: true
        });
        this.diff = this.grid.set(0, 0, 0, 0, blessed_1.default.box, {
            keys: true,
            parent: this.screen,
            fg: 'white',
            selectedFg: 'white',
            selectedBg: 'black',
            scrollable: true,
            alwaysScroll: true,
            scrollbar: {
                style: {
                    bg: 'cyan'
                }
            },
            interactive: 'true',
            label: '',
            width: '48%',
            height: '100%',
            border: { type: 'line', fg: 'cyan' },
        });
    }
    return Main;
}());
exports.default = Main;

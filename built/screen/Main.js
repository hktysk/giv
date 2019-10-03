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
        this.commit = this.grid.set(0, 0, 10, 20, blessed_1.default.listtable, {
            keys: true,
            mouse: true,
            parent: this.screen,
            label: 'COMMIT',
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
            vi: false
        });
        this.modefied = this.grid.set(10, 0, 10, 4, blessed_1.default.box, {
            keys: true,
            parent: this.screen,
            fg: 'white',
            selectedFg: 'white',
            selectedBg: 'black',
            interactive: 'true',
            label: 'MODEFIED',
            width: '48%',
            height: '100%',
            border: { type: 'line', fg: 'cyan' },
            columnSpacing: 10,
            columnWidth: [16, 12, 12],
        });
        this.contains = this.grid.set(10, 4, 10, 4, blessed_1.default.box, {
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
        this.diff = this.grid.set(10, 8, 10, 12, blessed_1.default.box, {
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

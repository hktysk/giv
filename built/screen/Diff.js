"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var blessed_1 = __importDefault(require("blessed"));
var Diff = /** @class */ (function () {
    function Diff(screen, grid) {
        this.screen = screen;
        this.grid = grid;
        this.modefied = this.grid.set(15, 0, 5, 20, blessed_1.default.list, {
            keys: true,
            parent: this.screen,
            selectedFg: 'black',
            selectedBg: 'cyan',
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
        this.diff = this.grid.set(0, 0, 15, 20, blessed_1.default.box, {
            keys: true,
            parent: this.screen,
            selectedFg: 'white',
            selectedBg: 'black',
            scrollable: true,
            alwaysScroll: true,
            scrollbar: {
                style: {
                    bg: 'cyan'
                }
            },
            border: { type: 'line' },
            style: {
                bg: 234,
                border: {
                    fg: 234,
                    bg: 234
                },
                label: {
                    bg: 234
                }
            },
            interactive: 'true',
            label: '',
            width: '48%',
            height: '100%',
            vi: false
        });
    }
    return Diff;
}());
exports.default = Diff;

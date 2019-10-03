"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var blessed_1 = __importDefault(require("blessed"));
var colors_1 = __importDefault(require("colors"));
var SelectBranch = /** @class */ (function () {
    function SelectBranch(screen, grid) {
        this.screen = screen;
        this.grid = grid;
        this.list = this.grid.set(5, 5, 10, 10, blessed_1.default.list, {
            keys: true,
            mouse: true,
            parent: this.screen,
            label: colors_1.default.cyan(' [enter]checkout [v]only commit view '),
            top: 'center',
            left: 'center',
            fg: 'white',
            selectedFg: 'white',
            selectedBg: 'black',
            border: { type: 'line', fg: 'cyan' },
            scrollable: true,
            alwaysScroll: true,
        });
        this.checkoutError = blessed_1.default.text({
            parent: this.screen,
            top: '15%',
            left: 'center',
            content: colors_1.default.magenta('Please execute commit or stash first.')
        });
    }
    return SelectBranch;
}());
exports.default = SelectBranch;

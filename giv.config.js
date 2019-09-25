"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config = /** @class */ (function () {
    function Config(screen) {
        this.screen = screen;
        this.Grid = {
            rows: 20,
            cols: 20,
            screen: this.screen
        };
        this.CommitTable = {
            keys: true,
            parent: this.screen,
            fg: 'white',
            selectedFg: 'white',
            selectedBg: 'black',
            interactive: 'true',
            label: 'COMMIT',
            width: '48%',
            height: '100%',
            border: { type: 'line', fg: 'cyan' },
            columnSpacing: 0,
            columnWidth: [10, 10, 40, 13, 23],
            alwaysScroll: true
        };
        this.BranchTable = {
            keys: true,
            parent: this.screen,
            fg: 'white',
            selectedFg: 'white',
            selectedBg: 'black',
            interactive: 'true',
            label: 'BRANCH',
            width: '48%',
            height: '100%',
            border: { type: 'line', fg: 'cyan' },
            columnSpacing: 10,
            columnWidth: [16, 12, 12],
        };
        this.ModefiedTable = {
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
        };
        this.DiffTable = {
            keys: true,
            parent: this.screen,
            fg: 'white',
            selectedFg: 'white',
            selectedBg: 'black',
            interactive: 'true',
            label: '',
            width: '48%',
            height: '100%',
            border: { type: 'line', fg: 'cyan' },
            columnSpacing: 10,
            columnWidth: [1000],
        };
    }
    return Config;
}());
exports.Config = Config;

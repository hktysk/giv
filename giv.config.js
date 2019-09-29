"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var colors_1 = __importDefault(require("colors"));
var Config = /** @class */ (function () {
    function Config(screen) {
        this.screen = screen;
        this.Main = {
            Grid: {
                rows: 20,
                cols: 20,
                screen: this.screen
            },
            CommitTable: {
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
            },
            BranchTable: {
                keys: true,
                mouse: true,
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
            },
            ModefiedTable: {
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
            },
            DiffTable: {
                keys: true,
                mouse: true,
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
            }
        };
        this.Help = {
            Text: {
                parent: this.screen,
                top: 'center',
                left: 'center',
                fg: 'white',
                content: [
                    '[a]add stage',
                    '[b]checkout branch',
                    '[c]commit',
                    '[f]full screen',
                    '[h]help',
                    '[n]create new branch',
                    '[j]diff view scroll to bottom',
                    '[k]diff view scroll to top',
                    '[q][C-\'[\'][esc]exit'
                ].join('\n') + colors_1.default.cyan('\n\n\n\n\n[esc][q][C-\'[\'] back to main view')
            }
        };
        this.NewBranch = {
            Name: {
                parent: this.screen,
                input: true,
                inputOnFocus: true,
                top: '43%',
                left: 'center',
                width: '50%',
                height: '11%',
                padding: {
                    left: 2,
                    top: 1,
                    right: 2
                },
                vi: false,
                style: {
                    fg: 'white',
                    bg: 'black'
                }
            },
            Label: {
                parent: this.screen,
                top: '60%',
                left: 'center',
                content: "Please enter a new branch name."
            },
            Label2: {
                parent: this.screen,
                top: '66%',
                left: 'center',
                content: "Create a new branch with 'Enter' and press 'ESC' or 'C- [' twice to go back"
            },
            CreatedLabel: {
                parent: this.screen,
                top: '45%',
                left: 'center',
                content: colors_1.default.green('Successfully created a new branch !')
            },
            StrErrorLabel: {
                parent: this.screen,
                top: '60%',
                left: 'center',
                content: colors_1.default.magenta('Please enter at least one character')
            },
            BranchErrorLabel: {
                parent: this.screen,
                top: '60%',
                left: 'center',
                content: colors_1.default.red('This name has already been registered')
            }
        };
        this.CheckoutBranch = {
            List: {
                keys: true,
                mouse: true,
                parent: this.screen,
                label: 'COMMIT',
                top: 'center',
                left: 'center',
                fg: 'white',
                selectedFg: 'white',
                selectedBg: 'black',
                scrollable: true,
                alwaysScroll: true,
            }
        };
    }
    return Config;
}());
exports.Config = Config;

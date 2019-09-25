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
            },
            BranchTable: {
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
            }
        };
        this.Loading = {
            Diff: {
                parent: this.screen,
                align: "center",
                valign: "middle",
                padding: {
                    left: 20
                },
                content: "Loading ..."
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
    }
    return Config;
}());
exports.Config = Config;

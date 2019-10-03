"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var blessed_1 = __importDefault(require("blessed"));
var colors_1 = __importDefault(require("colors"));
var NewBranch = /** @class */ (function () {
    function NewBranch(screen) {
        this.screen = screen;
        this.name = blessed_1.default.textbox({
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
        });
        this.nameExplanation = blessed_1.default.text({
            parent: this.screen,
            top: '60%',
            left: 'center',
            content: "Please enter a new branch name."
        });
        this.backExplanation = blessed_1.default.text({
            parent: this.screen,
            top: '66%',
            left: 'center',
            content: "Create a new branch with 'Enter' and press 'ESC' or 'C- [' twice to go back"
        });
        this.creationSuccessText = blessed_1.default.text({
            parent: this.screen,
            top: '45%',
            left: 'center',
            content: colors_1.default.green('Successfully created a new branch !')
        });
        this.emptyErrorText = blessed_1.default.text({
            parent: this.screen,
            top: '60%',
            left: 'center',
            content: colors_1.default.magenta('Please enter at least one character')
        });
        this.registerdErrorText = blessed_1.default.text({
            parent: this.screen,
            top: '60%',
            left: 'center',
            content: colors_1.default.red('This name has already been registered')
        });
    }
    return NewBranch;
}());
exports.default = NewBranch;

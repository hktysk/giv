"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var blessed_1 = __importDefault(require("blessed"));
var colors_1 = __importDefault(require("colors"));
var Help = /** @class */ (function () {
    function Help(screen) {
        this.screen = screen;
        this.text = blessed_1.default.text({
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
        });
    }
    return Help;
}());
exports.default = Help;

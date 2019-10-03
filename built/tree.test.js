"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tree_1 = __importDefault(require("./tree"));
describe('gitTree convert newTree', function () {
    var input = "*\n|\\\n| *\n* |\n* |\n|\\ \\\n| * |\n* | |\n|\\ \\ \\\n| | |/\n| |/|\n| * |\n* | |\n* | |\n|\\ \\ \\\n| |/ /\n| | /\n| |/\n|/|\n| *\n|/\n*\n*\n";
    var ans = "\n*\u2500\u2510\n\u2502 *\n* \u2502\n*\u2500\u2502\u2500\u2510\n\u2502 * \u2502\n*\u2500\u2502\u2500\u2502\u2500\u2510\n\u2502 *\u2500\u2502\u2500\u2518\n* \u2502 \u2502\n*\u2500\u2502\u2500\u2502\u2500\u2510\n\u2502 *\u2500\u2534\u2500\u2518\n*\u2500\u2518\n*".trim();
    it('check Answer', function () {
        var r = tree_1.default(input);
        expect(r.join('\n').trim()).toBe(ans);
    });
});

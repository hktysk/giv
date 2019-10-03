"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diff = {
    iterationCount: 10,
    interval: 10,
    scroll: function (s, direction) {
        for (var i = 1; i <= this.iterationCount; i++) {
            setTimeout(function () {
                s.Main.diff.scroll(direction === 'down' ? 1 : -1);
                s.screen.render();
            }, i * this.interval);
        }
    },
    scrollUp: function (s) {
        this.scroll(s, 'up');
    },
    scrollDown: function (s) {
        this.scroll(s, 'down');
    }
};
exports.default = exports.diff;

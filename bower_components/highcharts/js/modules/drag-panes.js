/*
 Highcharts JS v6.0.1 (2017-10-05)
 Drag-panes module

 (c) 2010-2017 Highsoft AS
 Author: Kacper Madej

 License: www.highcharts.com/license
 */
(function (f) {
    "object" === typeof module && module.exports ? module.exports = f : f(Highcharts)
})(function (f) {
    (function (b) {
        var f = b.hasTouch, v = b.merge, t = b.wrap, m = b.each, w = b.isNumber, k = b.addEvent, u = b.relativeLength, x = b.objectEach, n = b.Axis, y = b.Pointer;
        v(!0, n.prototype.defaultYAxisOptions, {
            minLength: "10%",
            maxLength: "100%",
            resize: {controlledAxis: {next: [], prev: []}, enabled: !1, x: 0, y: 0}
        });
        b.AxisResizer = function (a) {
            this.init(a)
        };
        b.AxisResizer.prototype = {
            init: function (a, c) {
                this.axis = a;
                this.options = a.options.resize;
                this.render();
                c || this.addMouseEvents()
            }, render: function () {
                var a = this.axis, c = a.chart, d = this.options, b = d.x, e = d.y, d = Math.min(Math.max(a.top + a.height + e, c.plotTop), c.plotTop + c.plotHeight), l = {};
                this.lastPos = d - e;
                this.controlLine || (this.controlLine = c.renderer.path().addClass("highcharts-axis-resizer"));
                this.controlLine.add(a.axisGroup);
                e = this.controlLine.strokeWidth();
                l.d = c.renderer.crispLine(["M", a.left + b, d, "L", a.left + a.width + b, d], e);
                this.controlLine.attr(l)
            }, addMouseEvents: function () {
                var a = this, c = a.controlLine.element,
                    d = a.axis.chart.container, b = [], e, l, p;
                a.mouseMoveHandler = e = function (c) {
                    a.onMouseMove(c)
                };
                a.mouseUpHandler = l = function (c) {
                    a.onMouseUp(c)
                };
                a.mouseDownHandler = p = function (c) {
                    a.onMouseDown(c)
                };
                b.push(k(d, "mousemove", e), k(d.ownerDocument, "mouseup", l), k(c, "mousedown", p));
                f && b.push(k(d, "touchmove", e), k(d.ownerDocument, "touchend", l), k(c, "touchstart", p));
                a.eventsToUnbind = b
            }, onMouseMove: function (a) {
                a.touches && 0 === a.touches[0].pageX || !this.grabbed || (this.hasDragged = !0, this.updateAxes(this.axis.chart.pointer.normalize(a).chartY -
                    this.options.y))
            }, onMouseUp: function (a) {
                this.hasDragged && this.updateAxes(this.axis.chart.pointer.normalize(a).chartY - this.options.y);
                this.grabbed = this.hasDragged = this.axis.chart.activeResizer = null
            }, onMouseDown: function () {
                this.axis.chart.pointer.reset(!1, 0);
                this.grabbed = this.axis.chart.activeResizer = !0
            }, updateAxes: function (a) {
                var c = this, d = c.axis.chart, f = c.options.controlledAxis, e = 0 === f.next.length ? [b.inArray(c.axis, d.yAxis) + 1] : f.next, f = [c.axis].concat(f.prev), l = [], p = !1, k = d.plotTop, n = d.plotHeight, r =
                    k + n, q;
                a = Math.max(Math.min(a, r), k);
                q = a - c.lastPos;
                1 > q * q || (m([f, e], function (b, f) {
                    m(b, function (b, h) {
                        var g = (b = w(b) ? d.yAxis[b] : f || h ? d.get(b) : b) && b.options, e, m;
                        g && (h = b.top, m = Math.round(u(g.minLength, n)), e = Math.round(u(g.maxLength, n)), f ? (q = a - c.lastPos, g = Math.round(Math.min(Math.max(b.len - q, m), e)), h = b.top + q, h + g > r && (e = r - g - h, a += e, h += e), h < k && (h = k, h + g > r && (g = n)), g === m && (p = !0), l.push({
                            axis: b,
                            options: {top: Math.round(h), height: g}
                        })) : (g = Math.round(Math.min(Math.max(a - h, m), e)), g === e && (p = !0), a = h + g, l.push({
                            axis: b,
                            options: {height: g}
                        })))
                    })
                }),
                p || (m(l, function (a) {
                    a.axis.update(a.options, !1)
                }), d.redraw(!1)))
            }, destroy: function () {
                var a = this;
                delete a.axis.resizer;
                this.eventsToUnbind && m(this.eventsToUnbind, function (a) {
                    a()
                });
                a.controlLine.destroy();
                x(a, function (b, d) {
                    a[d] = null
                })
            }
        };
        n.prototype.keepProps.push("resizer");
        t(n.prototype, "render", function (a) {
            a.apply(this, Array.prototype.slice.call(arguments, 1));
            var c = this.resizer, d = this.options.resize;
            d && (d = !1 !== d.enabled, c ? d ? c.init(this, !0) : c.destroy() : d && (this.resizer = new b.AxisResizer(this)))
        });
        t(n.prototype, "destroy", function (a, b) {
            !b && this.resizer && this.resizer.destroy();
            a.apply(this, Array.prototype.slice.call(arguments, 1))
        });
        t(y.prototype, "runPointActions", function (a) {
            this.chart.activeResizer || a.apply(this, Array.prototype.slice.call(arguments, 1))
        })
    })(f)
});

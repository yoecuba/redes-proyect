/*
 Highmaps JS v6.0.1 (2017-10-05)
 Highmaps as a plugin for Highcharts 4.1.x or Highstock 2.1.x (x being the patch version of this file)

 (c) 2011-2017 Torstein Honsi

 License: www.highcharts.com/license
 */
(function (w) {
    "object" === typeof module && module.exports ? module.exports = w : w(Highcharts)
})(function (w) {
    (function (a) {
        var h = a.Axis, q = a.each, g = a.pick;
        a = a.wrap;
        a(h.prototype, "getSeriesExtremes", function (a) {
            var f = this.isXAxis, x, r, u = [], e;
            f && q(this.series, function (a, b) {
                a.useMapGeometry && (u[b] = a.xData, a.xData = [])
            });
            a.call(this);
            f && (x = g(this.dataMin, Number.MAX_VALUE), r = g(this.dataMax, -Number.MAX_VALUE), q(this.series, function (a, b) {
                a.useMapGeometry && (x = Math.min(x, g(a.minX, x)), r = Math.max(r, g(a.maxX, r)), a.xData = u[b],
                    e = !0)
            }), e && (this.dataMin = x, this.dataMax = r))
        });
        a(h.prototype, "setAxisTranslation", function (a) {
            var k = this.chart, f = k.plotWidth / k.plotHeight, k = k.xAxis[0], g;
            a.call(this);
            "yAxis" === this.coll && void 0 !== k.transA && q(this.series, function (a) {
                a.preserveAspectRatio && (g = !0)
            });
            if (g && (this.transA = k.transA = Math.min(this.transA, k.transA), a = f / ((k.max - k.min) / (this.max - this.min)), a = 1 > a ? this : k, f = (a.max - a.min) * a.transA, a.pixelPadding = a.len - f, a.minPixelPadding = a.pixelPadding / 2, f = a.fixTo)) {
                f = f[1] - a.toValue(f[0], !0);
                f *= a.transA;
                if (Math.abs(f) > a.minPixelPadding || a.min === a.dataMin && a.max === a.dataMax)f = 0;
                a.minPixelPadding -= f
            }
        });
        a(h.prototype, "render", function (a) {
            a.call(this);
            this.fixTo = null
        })
    })(w);
    (function (a) {
        var h = a.Axis, q = a.Chart, g = a.color, f, k = a.each, x = a.extend, r = a.isNumber, u = a.Legend, e = a.LegendSymbolMixin, c = a.noop, b = a.merge, m = a.pick, t = a.wrap;
        f = a.ColorAxis = function () {
            this.init.apply(this, arguments)
        };
        x(f.prototype, h.prototype);
        x(f.prototype, {
            defaultColorAxisOptions: {
                lineWidth: 0,
                minPadding: 0,
                maxPadding: 0,
                gridLineWidth: 1,
                tickPixelInterval: 72,
                startOnTick: !0,
                endOnTick: !0,
                offset: 0,
                marker: {animation: {duration: 50}, width: .01, color: "#999999"},
                labels: {overflow: "justify", rotation: 0},
                minColor: "#e6ebf5",
                maxColor: "#003399",
                tickLength: 5,
                showInLegend: !0
            },
            keepProps: ["legendGroup", "legendItemHeight", "legendItemWidth", "legendItem", "legendSymbol"].concat(h.prototype.keepProps),
            init: function (a, l) {
                var d = "vertical" !== a.options.legend.layout, n;
                this.coll = "colorAxis";
                n = b(this.defaultColorAxisOptions, {side: d ? 2 : 1, reversed: !d}, l, {
                    opposite: !d,
                    showEmpty: !1,
                    title: null
                });
                h.prototype.init.call(this, a, n);
                l.dataClasses && this.initDataClasses(l);
                this.initStops();
                this.horiz = d;
                this.zoomEnabled = !1;
                this.defaultLegendLength = 200
            },
            initDataClasses: function (a) {
                var n = this.chart, d, p = 0, v = n.options.chart.colorCount, c = this.options, e = a.dataClasses.length;
                this.dataClasses = d = [];
                this.legendItems = [];
                k(a.dataClasses, function (a, l) {
                    a = b(a);
                    d.push(a);
                    a.color || ("category" === c.dataClassColor ? (l = n.options.colors, v = l.length, a.color = l[p], a.colorIndex = p, p++, p === v && (p = 0)) : a.color = g(c.minColor).tweenTo(g(c.maxColor),
                        2 > e ? .5 : l / (e - 1)))
                })
            },
            setTickPositions: function () {
                if (!this.dataClasses)return h.prototype.setTickPositions.call(this)
            },
            initStops: function () {
                this.stops = this.options.stops || [[0, this.options.minColor], [1, this.options.maxColor]];
                k(this.stops, function (a) {
                    a.color = g(a[1])
                })
            },
            setOptions: function (a) {
                h.prototype.setOptions.call(this, a);
                this.options.crosshair = this.options.marker
            },
            setAxisSize: function () {
                var a = this.legendSymbol, l = this.chart, d = l.options.legend || {}, p, b;
                a ? (this.left = d = a.attr("x"), this.top = p = a.attr("y"),
                    this.width = b = a.attr("width"), this.height = a = a.attr("height"), this.right = l.chartWidth - d - b, this.bottom = l.chartHeight - p - a, this.len = this.horiz ? b : a, this.pos = this.horiz ? d : p) : this.len = (this.horiz ? d.symbolWidth : d.symbolHeight) || this.defaultLegendLength
            },
            normalizedValue: function (a) {
                this.isLog && (a = this.val2lin(a));
                return 1 - (this.max - a) / (this.max - this.min || 1)
            },
            toColor: function (a, l) {
                var d = this.stops, p, n, b = this.dataClasses, c, e;
                if (b)for (e = b.length; e--;) {
                    if (c = b[e], p = c.from, d = c.to, (void 0 === p || a >= p) && (void 0 === d ||
                        a <= d)) {
                        n = c.color;
                        l && (l.dataClass = e, l.colorIndex = c.colorIndex);
                        break
                    }
                } else {
                    a = this.normalizedValue(a);
                    for (e = d.length; e-- && !(a > d[e][0]););
                    p = d[e] || d[e + 1];
                    d = d[e + 1] || p;
                    a = 1 - (d[0] - a) / (d[0] - p[0] || 1);
                    n = p.color.tweenTo(d.color, a)
                }
                return n
            },
            getOffset: function () {
                var a = this.legendGroup, b = this.chart.axisOffset[this.side];
                a && (this.axisParent = a, h.prototype.getOffset.call(this), this.added || (this.added = !0, this.labelLeft = 0, this.labelRight = this.width), this.chart.axisOffset[this.side] = b)
            },
            setLegendColor: function () {
                var a,
                    b = this.reversed;
                a = b ? 1 : 0;
                b = b ? 0 : 1;
                a = this.horiz ? [a, 0, b, 0] : [0, b, 0, a];
                this.legendColor = {linearGradient: {x1: a[0], y1: a[1], x2: a[2], y2: a[3]}, stops: this.stops}
            },
            drawLegendSymbol: function (a, b) {
                var d = a.padding, p = a.options, c = this.horiz, n = m(p.symbolWidth, c ? this.defaultLegendLength : 12), l = m(p.symbolHeight, c ? 12 : this.defaultLegendLength), e = m(p.labelPadding, c ? 16 : 30), p = m(p.itemDistance, 10);
                this.setLegendColor();
                b.legendSymbol = this.chart.renderer.rect(0, a.baseline - 11, n, l).attr({zIndex: 1}).add(b.legendGroup);
                this.legendItemWidth =
                    n + d + (c ? p : e);
                this.legendItemHeight = l + d + (c ? e : 0)
            },
            setState: c,
            visible: !0,
            setVisible: c,
            getSeriesExtremes: function () {
                var a = this.series, b = a.length;
                this.dataMin = Infinity;
                for (this.dataMax = -Infinity; b--;)void 0 !== a[b].valueMin && (this.dataMin = Math.min(this.dataMin, a[b].valueMin), this.dataMax = Math.max(this.dataMax, a[b].valueMax))
            },
            drawCrosshair: function (a, b) {
                var d = b && b.plotX, p = b && b.plotY, c, n = this.pos, e = this.len;
                b && (c = this.toPixels(b[b.series.colorKey]), c < n ? c = n - 2 : c > n + e && (c = n + e + 2), b.plotX = c, b.plotY = this.len - c,
                    h.prototype.drawCrosshair.call(this, a, b), b.plotX = d, b.plotY = p, this.cross && (this.cross.addClass("highcharts-coloraxis-marker").add(this.legendGroup), this.cross.attr({fill: this.crosshair.color})))
            },
            getPlotLinePath: function (a, b, d, p, c) {
                return r(c) ? this.horiz ? ["M", c - 4, this.top - 6, "L", c + 4, this.top - 6, c, this.top, "Z"] : ["M", this.left, c, "L", this.left - 6, c + 6, this.left - 6, c - 6, "Z"] : h.prototype.getPlotLinePath.call(this, a, b, d, p)
            },
            update: function (a, c) {
                var d = this.chart, p = d.legend;
                k(this.series, function (a) {
                    a.isDirtyData = !0
                });
                a.dataClasses && p.allItems && (k(p.allItems, function (a) {
                    a.isDataClass && a.legendGroup && a.legendGroup.destroy()
                }), d.isDirtyLegend = !0);
                d.options[this.coll] = b(this.userOptions, a);
                h.prototype.update.call(this, a, c);
                this.legendItem && (this.setLegendColor(), p.colorizeItem(this, !0))
            },
            remove: function () {
                this.legendItem && this.chart.legend.destroyItem(this);
                h.prototype.remove.call(this)
            },
            getDataClassLegendSymbols: function () {
                var b = this, l = this.chart, d = this.legendItems, p = l.options.legend, v = p.valueDecimals, m = p.valueSuffix ||
                    "", t;
                d.length || k(this.dataClasses, function (p, n) {
                    var f = !0, y = p.from, g = p.to;
                    t = "";
                    void 0 === y ? t = "\x3c " : void 0 === g && (t = "\x3e ");
                    void 0 !== y && (t += a.numberFormat(y, v) + m);
                    void 0 !== y && void 0 !== g && (t += " - ");
                    void 0 !== g && (t += a.numberFormat(g, v) + m);
                    d.push(x({
                        chart: l,
                        name: t,
                        options: {},
                        drawLegendSymbol: e.drawRectangle,
                        visible: !0,
                        setState: c,
                        isDataClass: !0,
                        setVisible: function () {
                            f = this.visible = !f;
                            k(b.series, function (a) {
                                k(a.points, function (a) {
                                    a.dataClass === n && a.setVisible(f)
                                })
                            });
                            l.legend.colorizeItem(this, f)
                        }
                    }, p))
                });
                return d
            },
            name: ""
        });
        k(["fill", "stroke"], function (b) {
            a.Fx.prototype[b + "Setter"] = function () {
                this.elem.attr(b, g(this.start).tweenTo(g(this.end), this.pos), null, !0)
            }
        });
        t(q.prototype, "getAxes", function (a) {
            var b = this.options.colorAxis;
            a.call(this);
            this.colorAxis = [];
            b && new f(this, b)
        });
        t(u.prototype, "getAllItems", function (a) {
            var b = [], d = this.chart.colorAxis[0];
            d && d.options && (d.options.showInLegend && (d.options.dataClasses ? b = b.concat(d.getDataClassLegendSymbols()) : b.push(d)), k(d.series, function (a) {
                a.options.showInLegend = !1
            }));
            return b.concat(a.call(this))
        });
        t(u.prototype, "colorizeItem", function (a, b, d) {
            a.call(this, b, d);
            d && b.legendColor && b.legendSymbol.attr({fill: b.legendColor})
        });
        t(u.prototype, "update", function (a) {
            a.apply(this, [].slice.call(arguments, 1));
            this.chart.colorAxis[0] && this.chart.colorAxis[0].update({}, arguments[2])
        })
    })(w);
    (function (a) {
        var h = a.defined, q = a.each, g = a.noop, f = a.seriesTypes;
        a.colorPointMixin = {
            isValid: function () {
                return null !== this.value
            }, setVisible: function (a) {
                var f = this, k = a ? "show" : "hide";
                q(["graphic",
                    "dataLabel"], function (a) {
                    if (f[a])f[a][k]()
                })
            }, setState: function (f) {
                a.Point.prototype.setState.call(this, f);
                this.graphic && this.graphic.attr({zIndex: "hover" === f ? 1 : 0})
            }
        };
        a.colorSeriesMixin = {
            pointArrayMap: ["value"],
            axisTypes: ["xAxis", "yAxis", "colorAxis"],
            optionalAxis: "colorAxis",
            trackerGroups: ["group", "markerGroup", "dataLabelsGroup"],
            getSymbol: g,
            parallelArrays: ["x", "y", "value"],
            colorKey: "value",
            pointAttribs: f.column.prototype.pointAttribs,
            translateColors: function () {
                var a = this, f = this.options.nullColor,
                    g = this.colorAxis, h = this.colorKey;
                q(this.data, function (e) {
                    var c = e[h];
                    if (c = e.options.color || (e.isNull ? f : g && void 0 !== c ? g.toColor(c, e) : e.color || a.color))e.color = c
                })
            },
            colorAttribs: function (a) {
                var f = {};
                h(a.color) && (f[this.colorProp || "fill"] = a.color);
                return f
            }
        }
    })(w);
    (function (a) {
        function h(a) {
            a && (a.preventDefault && a.preventDefault(), a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0)
        }

        function q(a) {
            this.init(a)
        }

        var g = a.addEvent, f = a.Chart, k = a.doc, x = a.each, r = a.extend, u = a.merge, e = a.pick, c = a.wrap;
        q.prototype.init =
            function (a) {
                this.chart = a;
                a.mapNavButtons = []
            };
        q.prototype.update = function (b) {
            var c = this.chart, f = c.options.mapNavigation, n, l, d, p, v, k = function (a) {
                this.handler.call(c, a);
                h(a)
            }, y = c.mapNavButtons;
            b && (f = c.options.mapNavigation = u(c.options.mapNavigation, b));
            for (; y.length;)y.pop().destroy();
            e(f.enableButtons, f.enabled) && !c.renderer.forExport && a.objectEach(f.buttons, function (a, b) {
                n = u(f.buttonOptions, a);
                l = n.theme;
                l.style = u(n.theme.style, n.style);
                p = (d = l.states) && d.hover;
                v = d && d.select;
                a = c.renderer.button(n.text,
                    0, 0, k, l, p, v, 0, "zoomIn" === b ? "topbutton" : "bottombutton").addClass("highcharts-map-navigation").attr({
                    width: n.width,
                    height: n.height,
                    title: c.options.lang[b],
                    padding: n.padding,
                    zIndex: 5
                }).add();
                a.handler = n.onclick;
                a.align(r(n, {width: a.width, height: 2 * a.height}), null, n.alignTo);
                g(a.element, "dblclick", h);
                y.push(a)
            });
            this.updateEvents(f)
        };
        q.prototype.updateEvents = function (a) {
            var b = this.chart;
            e(a.enableDoubleClickZoom, a.enabled) || a.enableDoubleClickZoomTo ? this.unbindDblClick = this.unbindDblClick || g(b.container,
                    "dblclick", function (a) {
                        b.pointer.onContainerDblClick(a)
                    }) : this.unbindDblClick && (this.unbindDblClick = this.unbindDblClick());
            e(a.enableMouseWheelZoom, a.enabled) ? this.unbindMouseWheel = this.unbindMouseWheel || g(b.container, void 0 === k.onmousewheel ? "DOMMouseScroll" : "mousewheel", function (a) {
                    b.pointer.onContainerMouseWheel(a);
                    h(a);
                    return !1
                }) : this.unbindMouseWheel && (this.unbindMouseWheel = this.unbindMouseWheel())
        };
        r(f.prototype, {
            fitToBox: function (a, c) {
                x([["x", "width"], ["y", "height"]], function (b) {
                    var e = b[0];
                    b = b[1];
                    a[e] + a[b] > c[e] + c[b] && (a[b] > c[b] ? (a[b] = c[b], a[e] = c[e]) : a[e] = c[e] + c[b] - a[b]);
                    a[b] > c[b] && (a[b] = c[b]);
                    a[e] < c[e] && (a[e] = c[e])
                });
                return a
            }, mapZoom: function (a, c, f, n, l) {
                var d = this.xAxis[0], b = d.max - d.min, v = e(c, d.min + b / 2), k = b * a, b = this.yAxis[0], g = b.max - b.min, m = e(f, b.min + g / 2), g = g * a, v = this.fitToBox({
                    x: v - k * (n ? (n - d.pos) / d.len : .5),
                    y: m - g * (l ? (l - b.pos) / b.len : .5),
                    width: k,
                    height: g
                }, {
                    x: d.dataMin,
                    y: b.dataMin,
                    width: d.dataMax - d.dataMin,
                    height: b.dataMax - b.dataMin
                }), k = v.x <= d.dataMin && v.width >= d.dataMax - d.dataMin && v.y <=
                    b.dataMin && v.height >= b.dataMax - b.dataMin;
                n && (d.fixTo = [n - d.pos, c]);
                l && (b.fixTo = [l - b.pos, f]);
                void 0 === a || k ? (d.setExtremes(void 0, void 0, !1), b.setExtremes(void 0, void 0, !1)) : (d.setExtremes(v.x, v.x + v.width, !1), b.setExtremes(v.y, v.y + v.height, !1));
                this.redraw()
            }
        });
        c(f.prototype, "render", function (a) {
            this.mapNavigation = new q(this);
            this.mapNavigation.update();
            a.call(this)
        })
    })(w);
    (function (a) {
        var h = a.extend, q = a.pick, g = a.Pointer;
        a = a.wrap;
        h(g.prototype, {
            onContainerDblClick: function (a) {
                var f = this.chart;
                a = this.normalize(a);
                f.options.mapNavigation.enableDoubleClickZoomTo ? f.pointer.inClass(a.target, "highcharts-tracker") && f.hoverPoint && f.hoverPoint.zoomTo() : f.isInsidePlot(a.chartX - f.plotLeft, a.chartY - f.plotTop) && f.mapZoom(.5, f.xAxis[0].toValue(a.chartX), f.yAxis[0].toValue(a.chartY), a.chartX, a.chartY)
            }, onContainerMouseWheel: function (a) {
                var f = this.chart, g;
                a = this.normalize(a);
                g = a.detail || -(a.wheelDelta / 120);
                f.isInsidePlot(a.chartX - f.plotLeft, a.chartY - f.plotTop) && f.mapZoom(Math.pow(f.options.mapNavigation.mouseWheelSensitivity,
                    g), f.xAxis[0].toValue(a.chartX), f.yAxis[0].toValue(a.chartY), a.chartX, a.chartY)
            }
        });
        a(g.prototype, "zoomOption", function (a) {
            var f = this.chart.options.mapNavigation;
            q(f.enableTouchZoom, f.enabled) && (this.chart.options.chart.pinchType = "xy");
            a.apply(this, [].slice.call(arguments, 1))
        });
        a(g.prototype, "pinchTranslate", function (a, g, q, h, u, e, c) {
            a.call(this, g, q, h, u, e, c);
            "map" === this.chart.options.chart.type && this.hasZoom && (a = h.scaleX > h.scaleY, this.pinchTranslateDirection(!a, g, q, h, u, e, c, a ? h.scaleX : h.scaleY))
        })
    })(w);
    (function (a) {
        var h = a.colorPointMixin, q = a.each, g = a.extend, f = a.isNumber, k = a.map, x = a.merge, r = a.noop, u = a.pick, e = a.isArray, c = a.Point, b = a.Series, m = a.seriesType, t = a.seriesTypes, n = a.splat, l = void 0 !== a.doc.documentElement.style.vectorEffect;
        m("map", "scatter", {
            allAreas: !0,
            animation: !1,
            nullColor: "#f7f7f7",
            borderColor: "#cccccc",
            borderWidth: 1,
            marker: null,
            stickyTracking: !1,
            joinBy: "hc-key",
            dataLabels: {
                formatter: function () {
                    return this.point.value
                }, inside: !0, verticalAlign: "middle", crop: !1, overflow: !1, padding: 0
            },
            turboThreshold: 0,
            tooltip: {followPointer: !0, pointFormat: "{point.name}: {point.value}\x3cbr/\x3e"},
            states: {normal: {animation: !0}, hover: {halo: null, brightness: .2}, select: {color: "#cccccc"}}
        }, x(a.colorSeriesMixin, {
            type: "map",
            getExtremesFromAll: !0,
            useMapGeometry: !0,
            forceDL: !0,
            searchPoint: r,
            directTouch: !0,
            preserveAspectRatio: !0,
            pointArrayMap: ["value"],
            getBox: function (d) {
                var b = Number.MAX_VALUE, c = -b, e = b, n = -b, l = b, g = b, m = this.xAxis, k = this.yAxis, t;
                q(d || [], function (d) {
                    if (d.path) {
                        "string" === typeof d.path && (d.path = a.splitPath(d.path));
                        var p = d.path || [], v = p.length, m = !1, k = -b, y = b, h = -b, q = b, A = d.properties;
                        if (!d._foundBox) {
                            for (; v--;)f(p[v]) && (m ? (k = Math.max(k, p[v]), y = Math.min(y, p[v])) : (h = Math.max(h, p[v]), q = Math.min(q, p[v])), m = !m);
                            d._midX = y + (k - y) * u(d.middleX, A && A["hc-middle-x"], .5);
                            d._midY = q + (h - q) * u(d.middleY, A && A["hc-middle-y"], .5);
                            d._maxX = k;
                            d._minX = y;
                            d._maxY = h;
                            d._minY = q;
                            d.labelrank = u(d.labelrank, (k - y) * (h - q));
                            d._foundBox = !0
                        }
                        c = Math.max(c, d._maxX);
                        e = Math.min(e, d._minX);
                        n = Math.max(n, d._maxY);
                        l = Math.min(l, d._minY);
                        g = Math.min(d._maxX - d._minX,
                            d._maxY - d._minY, g);
                        t = !0
                    }
                });
                t && (this.minY = Math.min(l, u(this.minY, b)), this.maxY = Math.max(n, u(this.maxY, -b)), this.minX = Math.min(e, u(this.minX, b)), this.maxX = Math.max(c, u(this.maxX, -b)), m && void 0 === m.options.minRange && (m.minRange = Math.min(5 * g, (this.maxX - this.minX) / 5, m.minRange || b)), k && void 0 === k.options.minRange && (k.minRange = Math.min(5 * g, (this.maxY - this.minY) / 5, k.minRange || b)))
            },
            getExtremes: function () {
                b.prototype.getExtremes.call(this, this.valueData);
                this.chart.hasRendered && this.isDirtyData && this.getBox(this.options.data);
                this.valueMin = this.dataMin;
                this.valueMax = this.dataMax;
                this.dataMin = this.minY;
                this.dataMax = this.maxY
            },
            translatePath: function (a) {
                var d = !1, b = this.xAxis, c = this.yAxis, e = b.min, n = b.transA, b = b.minPixelPadding, l = c.min, g = c.transA, c = c.minPixelPadding, m, k = [];
                if (a)for (m = a.length; m--;)f(a[m]) ? (k[m] = d ? (a[m] - e) * n + b : (a[m] - l) * g + c, d = !d) : k[m] = a[m];
                return k
            },
            setData: function (d, c, l, g) {
                var p = this.options, v = this.chart.options.chart, m = v && v.map, t = p.mapData, h = p.joinBy, u = null === h, B = p.keys || this.pointArrayMap, r = [], w = {}, z = this.chart.mapTransforms;
                !t && m && (t = "string" === typeof m ? a.maps[m] : m);
                u && (h = "_i");
                h = this.joinBy = n(h);
                h[1] || (h[1] = h[0]);
                d && q(d, function (a, b) {
                    var c = 0;
                    if (f(a))d[b] = {value: a}; else if (e(a)) {
                        d[b] = {};
                        !p.keys && a.length > B.length && "string" === typeof a[0] && (d[b]["hc-key"] = a[0], ++c);
                        for (var n = 0; n < B.length; ++n, ++c)B[n] && (d[b][B[n]] = a[c])
                    }
                    u && (d[b]._i = b)
                });
                this.getBox(d);
                (this.chart.mapTransforms = z = v && v.mapTransforms || t && t["hc-transform"] || z) && a.objectEach(z, function (a) {
                    a.rotation && (a.cosAngle = Math.cos(a.rotation), a.sinAngle = Math.sin(a.rotation))
                });
                if (t) {
                    "FeatureCollection" === t.type && (this.mapTitle = t.title, t = a.geojson(t, this.type, this));
                    this.mapData = t;
                    this.mapMap = {};
                    for (z = 0; z < t.length; z++)v = t[z], m = v.properties, v._i = z, h[0] && m && m[h[0]] && (v[h[0]] = m[h[0]]), w[v[h[0]]] = v;
                    this.mapMap = w;
                    d && h[1] && q(d, function (a) {
                        w[a[h[1]]] && r.push(w[a[h[1]]])
                    });
                    p.allAreas ? (this.getBox(t), d = d || [], h[1] && q(d, function (a) {
                        r.push(a[h[1]])
                    }), r = "|" + k(r, function (a) {
                            return a && a[h[0]]
                        }).join("|") + "|", q(t, function (a) {
                        h[0] && -1 !== r.indexOf("|" + a[h[0]] + "|") || (d.push(x(a, {value: null})),
                            g = !1)
                    })) : this.getBox(r)
                }
                b.prototype.setData.call(this, d, c, l, g)
            },
            drawGraph: r,
            drawDataLabels: r,
            doFullTranslate: function () {
                return this.isDirtyData || this.chart.isResizing || this.chart.renderer.isVML || !this.baseTrans
            },
            translate: function () {
                var a = this, b = a.xAxis, c = a.yAxis, e = a.doFullTranslate();
                a.generatePoints();
                q(a.data, function (d) {
                    d.plotX = b.toPixels(d._midX, !0);
                    d.plotY = c.toPixels(d._midY, !0);
                    e && (d.shapeType = "path", d.shapeArgs = {d: a.translatePath(d.path)})
                });
                a.translateColors()
            },
            pointAttribs: function (a, b) {
                a =
                    t.column.prototype.pointAttribs.call(this, a, b);
                l ? a["vector-effect"] = "non-scaling-stroke" : a["stroke-width"] = "inherit";
                return a
            },
            drawPoints: function () {
                var a = this, b = a.xAxis, c = a.yAxis, e = a.group, n = a.chart, f = n.renderer, m, g, h, k, u = this.baseTrans, r, x, z, w, G;
                a.transformGroup || (a.transformGroup = f.g().attr({
                    scaleX: 1,
                    scaleY: 1
                }).add(e), a.transformGroup.survive = !0);
                a.doFullTranslate() ? (n.hasRendered && q(a.points, function (b) {
                    b.shapeArgs && (b.shapeArgs.fill = a.pointAttribs(b, b.state).fill)
                }), a.group = a.transformGroup,
                    t.column.prototype.drawPoints.apply(a), a.group = e, q(a.points, function (a) {
                    a.graphic && (a.name && a.graphic.addClass("highcharts-name-" + a.name.replace(/ /g, "-").toLowerCase()), a.properties && a.properties["hc-key"] && a.graphic.addClass("highcharts-key-" + a.properties["hc-key"].toLowerCase()))
                }), this.baseTrans = {
                    originX: b.min - b.minPixelPadding / b.transA,
                    originY: c.min - c.minPixelPadding / c.transA + (c.reversed ? 0 : c.len / c.transA),
                    transAX: b.transA,
                    transAY: c.transA
                }, this.transformGroup.animate({
                    translateX: 0, translateY: 0,
                    scaleX: 1, scaleY: 1
                })) : (m = b.transA / u.transAX, g = c.transA / u.transAY, h = b.toPixels(u.originX, !0), k = c.toPixels(u.originY, !0), .99 < m && 1.01 > m && .99 < g && 1.01 > g && (g = m = 1, h = Math.round(h), k = Math.round(k)), r = this.transformGroup, n.renderer.globalAnimation ? (x = r.attr("translateX"), z = r.attr("translateY"), w = r.attr("scaleX"), G = r.attr("scaleY"), r.attr({animator: 0}).animate({animator: 1}, {
                    step: function (a, b) {
                        r.attr({
                            translateX: x + (h - x) * b.pos,
                            translateY: z + (k - z) * b.pos,
                            scaleX: w + (m - w) * b.pos,
                            scaleY: G + (g - G) * b.pos
                        })
                    }
                })) : r.attr({
                    translateX: h,
                    translateY: k, scaleX: m, scaleY: g
                }));
                l || a.group.element.setAttribute("stroke-width", a.options[a.pointAttrToOptions && a.pointAttrToOptions["stroke-width"] || "borderWidth"] / (m || 1));
                this.drawMapDataLabels()
            },
            drawMapDataLabels: function () {
                b.prototype.drawDataLabels.call(this);
                this.dataLabelsGroup && this.dataLabelsGroup.clip(this.chart.clipRect)
            },
            render: function () {
                var a = this, c = b.prototype.render;
                a.chart.renderer.isVML && 3E3 < a.data.length ? setTimeout(function () {
                    c.call(a)
                }) : c.call(a)
            },
            animate: function (a) {
                var b = this.options.animation,
                    d = this.group, c = this.xAxis, e = this.yAxis, n = c.pos, l = e.pos;
                this.chart.renderer.isSVG && (!0 === b && (b = {duration: 1E3}), a ? d.attr({
                    translateX: n + c.len / 2,
                    translateY: l + e.len / 2,
                    scaleX: .001,
                    scaleY: .001
                }) : (d.animate({translateX: n, translateY: l, scaleX: 1, scaleY: 1}, b), this.animate = null))
            },
            animateDrilldown: function (a) {
                var b = this.chart.plotBox, d = this.chart.drilldownLevels[this.chart.drilldownLevels.length - 1], c = d.bBox, e = this.chart.options.drilldown.animation;
                a || (a = Math.min(c.width / b.width, c.height / b.height), d.shapeArgs =
                {scaleX: a, scaleY: a, translateX: c.x, translateY: c.y}, q(this.points, function (a) {
                    a.graphic && a.graphic.attr(d.shapeArgs).animate({
                        scaleX: 1,
                        scaleY: 1,
                        translateX: 0,
                        translateY: 0
                    }, e)
                }), this.animate = null)
            },
            drawLegendSymbol: a.LegendSymbolMixin.drawRectangle,
            animateDrillupFrom: function (a) {
                t.column.prototype.animateDrillupFrom.call(this, a)
            },
            animateDrillupTo: function (a) {
                t.column.prototype.animateDrillupTo.call(this, a)
            }
        }), g({
            applyOptions: function (a, b) {
                a = c.prototype.applyOptions.call(this, a, b);
                b = this.series;
                var d =
                    b.joinBy;
                b.mapData && ((d = void 0 !== a[d[1]] && b.mapMap[a[d[1]]]) ? (b.xyFromShape && (a.x = d._midX, a.y = d._midY), g(a, d)) : a.value = a.value || null);
                return a
            }, onMouseOver: function (a) {
                clearTimeout(this.colorInterval);
                if (null !== this.value || this.series.options.nullInteraction)c.prototype.onMouseOver.call(this, a); else this.series.onMouseOut(a)
            }, zoomTo: function () {
                var a = this.series;
                a.xAxis.setExtremes(this._minX, this._maxX, !1);
                a.yAxis.setExtremes(this._minY, this._maxY, !1);
                a.chart.redraw()
            }
        }, h))
    })(w);
    (function (a) {
        var h =
            a.seriesType, q = a.seriesTypes;
        h("mapline", "map", {lineWidth: 1, fillColor: "none"}, {
            type: "mapline",
            colorProp: "stroke",
            pointAttrToOptions: {stroke: "color", "stroke-width": "lineWidth"},
            pointAttribs: function (a, f) {
                a = q.map.prototype.pointAttribs.call(this, a, f);
                a.fill = this.options.fillColor;
                return a
            },
            drawLegendSymbol: q.line.prototype.drawLegendSymbol
        })
    })(w);
    (function (a) {
        var h = a.merge, q = a.Point;
        a = a.seriesType;
        a("mappoint", "scatter", {
            dataLabels: {
                enabled: !0, formatter: function () {
                    return this.point.name
                }, crop: !1, defer: !1,
                overflow: !1, style: {color: "#000000"}
            }
        }, {type: "mappoint", forceDL: !0}, {
            applyOptions: function (a, f) {
                a = void 0 !== a.lat && void 0 !== a.lon ? h(a, this.series.chart.fromLatLonToPoint(a)) : a;
                return q.prototype.applyOptions.call(this, a, f)
            }
        })
    })(w);
    (function (a) {
        var h = a.arrayMax, q = a.arrayMin, g = a.Axis, f = a.color, k = a.each, x = a.isNumber, r = a.noop, u = a.pick, e = a.pInt, c = a.Point, b = a.Series, m = a.seriesType, t = a.seriesTypes;
        m("bubble", "scatter", {
            dataLabels: {
                formatter: function () {
                    return this.point.z
                }, inside: !0, verticalAlign: "middle"
            },
            marker: {lineColor: null, lineWidth: 1, radius: null, states: {hover: {radiusPlus: 0}}, symbol: "circle"},
            minSize: 8,
            maxSize: "20%",
            softThreshold: !1,
            states: {hover: {halo: {size: 5}}},
            tooltip: {pointFormat: "({point.x}, {point.y}), Size: {point.z}"},
            turboThreshold: 0,
            zThreshold: 0,
            zoneAxis: "z"
        }, {
            pointArrayMap: ["y", "z"],
            parallelArrays: ["x", "y", "z"],
            trackerGroups: ["group", "dataLabelsGroup"],
            specialGroup: "group",
            bubblePadding: !0,
            zoneAxis: "z",
            directTouch: !0,
            pointAttribs: function (a, c) {
                var d = u(this.options.marker.fillOpacity,
                    .5);
                a = b.prototype.pointAttribs.call(this, a, c);
                1 !== d && (a.fill = f(a.fill).setOpacity(d).get("rgba"));
                return a
            },
            getRadii: function (a, b, c, e) {
                var d, n, l, p = this.zData, m = [], f = this.options, h = "width" !== f.sizeBy, g = f.zThreshold, k = b - a;
                n = 0;
                for (d = p.length; n < d; n++)l = p[n], f.sizeByAbsoluteValue && null !== l && (l = Math.abs(l - g), b = Math.max(b - g, Math.abs(a - g)), a = 0), null === l ? l = null : l < a ? l = c / 2 - 1 : (l = 0 < k ? (l - a) / k : .5, h && 0 <= l && (l = Math.sqrt(l)), l = Math.ceil(c + l * (e - c)) / 2), m.push(l);
                this.radii = m
            },
            animate: function (a) {
                var b = this.options.animation;
                a || (k(this.points, function (a) {
                    var c = a.graphic, d;
                    c && c.width && (d = {x: c.x, y: c.y, width: c.width, height: c.height}, c.attr({
                        x: a.plotX,
                        y: a.plotY,
                        width: 1,
                        height: 1
                    }), c.animate(d, b))
                }), this.animate = null)
            },
            translate: function () {
                var b, c = this.data, d, e, f = this.radii;
                t.scatter.prototype.translate.call(this);
                for (b = c.length; b--;)d = c[b], e = f ? f[b] : 0, x(e) && e >= this.minPxSize / 2 ? (d.marker = a.extend(d.marker, {
                    radius: e,
                    width: 2 * e,
                    height: 2 * e
                }), d.dlBox = {
                    x: d.plotX - e,
                    y: d.plotY - e,
                    width: 2 * e,
                    height: 2 * e
                }) : d.shapeArgs = d.plotY = d.dlBox = void 0
            },
            alignDataLabel: t.column.prototype.alignDataLabel,
            buildKDTree: r,
            applyZones: r
        }, {
            haloPath: function (a) {
                return c.prototype.haloPath.call(this, 0 === a ? 0 : (this.marker ? this.marker.radius || 0 : 0) + a)
            }, ttBelow: !1
        });
        g.prototype.beforePadding = function () {
            var a = this, b = this.len, c = this.chart, f = 0, m = b, g = this.isXAxis, t = g ? "xData" : "yData", r = this.min, w = {}, H = Math.min(c.plotWidth, c.plotHeight), A = Number.MAX_VALUE, D = -Number.MAX_VALUE, E = this.max - r, C = b / E, F = [];
            k(this.series, function (b) {
                var d = b.options;
                !b.bubblePadding || !b.visible &&
                c.options.chart.ignoreHiddenSeries || (a.allowZoomOutside = !0, F.push(b), g && (k(["minSize", "maxSize"], function (a) {
                    var b = d[a], c = /%$/.test(b), b = e(b);
                    w[a] = c ? H * b / 100 : b
                }), b.minPxSize = w.minSize, b.maxPxSize = Math.max(w.maxSize, w.minSize), b = b.zData, b.length && (A = u(d.zMin, Math.min(A, Math.max(q(b), !1 === d.displayNegative ? d.zThreshold : -Number.MAX_VALUE))), D = u(d.zMax, Math.max(D, h(b))))))
            });
            k(F, function (b) {
                var c = b[t], d = c.length, e;
                g && b.getRadii(A, D, b.minPxSize, b.maxPxSize);
                if (0 < E)for (; d--;)x(c[d]) && a.dataMin <= c[d] && c[d] <=
                a.dataMax && (e = b.radii[d], f = Math.min((c[d] - r) * C - e, f), m = Math.max((c[d] - r) * C + e, m))
            });
            F.length && 0 < E && !this.isLog && (m -= b, C *= (b + f - m) / b, k([["min", "userMin", f], ["max", "userMax", m]], function (b) {
                void 0 === u(a.options[b[0]], a[b[1]]) && (a[b[0]] += b[2] / C)
            }))
        }
    })(w);
    (function (a) {
        var h = a.merge, q = a.Point, g = a.seriesType, f = a.seriesTypes;
        f.bubble && g("mapbubble", "bubble", {animationLimit: 500, tooltip: {pointFormat: "{point.name}: {point.z}"}}, {
            xyFromShape: !0, type: "mapbubble", pointArrayMap: ["z"], getMapData: f.map.prototype.getMapData,
            getBox: f.map.prototype.getBox, setData: f.map.prototype.setData
        }, {
            applyOptions: function (a, g) {
                return a && void 0 !== a.lat && void 0 !== a.lon ? q.prototype.applyOptions.call(this, h(a, this.series.chart.fromLatLonToPoint(a)), g) : f.map.prototype.pointClass.prototype.applyOptions.call(this, a, g)
            }, ttBelow: !1
        })
    })(w);
    (function (a) {
        var h = a.colorPointMixin, q = a.each, g = a.merge, f = a.noop, k = a.pick, w = a.Series, r = a.seriesType, u = a.seriesTypes;
        r("heatmap", "scatter", {
            animation: !1,
            borderWidth: 0,
            nullColor: "#f7f7f7",
            dataLabels: {
                formatter: function () {
                    return this.point.value
                },
                inside: !0, verticalAlign: "middle", crop: !1, overflow: !1, padding: 0
            },
            marker: null,
            pointRange: null,
            tooltip: {pointFormat: "{point.x}, {point.y}: {point.value}\x3cbr/\x3e"},
            states: {normal: {animation: !0}, hover: {halo: !1, brightness: .2}}
        }, g(a.colorSeriesMixin, {
            pointArrayMap: ["y", "value"],
            hasPointSpecificOptions: !0,
            getExtremesFromAll: !0,
            directTouch: !0,
            init: function () {
                var a;
                u.scatter.prototype.init.apply(this, arguments);
                a = this.options;
                a.pointRange = k(a.pointRange, a.colsize || 1);
                this.yAxis.axisPointRange = a.rowsize ||
                    1
            },
            translate: function () {
                var a = this.options, c = this.xAxis, b = this.yAxis, f = a.pointPadding || 0, g = function (a, b, c) {
                    return Math.min(Math.max(b, a), c)
                };
                this.generatePoints();
                q(this.points, function (e) {
                    var m = (a.colsize || 1) / 2, d = (a.rowsize || 1) / 2, n = g(Math.round(c.len - c.translate(e.x - m, 0, 1, 0, 1)), -c.len, 2 * c.len), m = g(Math.round(c.len - c.translate(e.x + m, 0, 1, 0, 1)), -c.len, 2 * c.len), h = g(Math.round(b.translate(e.y - d, 0, 1, 0, 1)), -b.len, 2 * b.len), d = g(Math.round(b.translate(e.y + d, 0, 1, 0, 1)), -b.len, 2 * b.len), t = k(e.pointPadding, f);
                    e.plotX = e.clientX = (n + m) / 2;
                    e.plotY = (h + d) / 2;
                    e.shapeType = "rect";
                    e.shapeArgs = {
                        x: Math.min(n, m) + t,
                        y: Math.min(h, d) + t,
                        width: Math.abs(m - n) - 2 * t,
                        height: Math.abs(d - h) - 2 * t
                    }
                });
                this.translateColors()
            },
            drawPoints: function () {
                u.column.prototype.drawPoints.call(this);
                q(this.points, function (a) {
                    a.graphic.attr(this.colorAttribs(a))
                }, this)
            },
            animate: f,
            getBox: f,
            drawLegendSymbol: a.LegendSymbolMixin.drawRectangle,
            alignDataLabel: u.column.prototype.alignDataLabel,
            getExtremes: function () {
                w.prototype.getExtremes.call(this, this.valueData);
                this.valueMin = this.dataMin;
                this.valueMax = this.dataMax;
                w.prototype.getExtremes.call(this)
            }
        }), a.extend({
            haloPath: function (a) {
                if (!a)return [];
                var c = this.shapeArgs;
                return ["M", c.x - a, c.y - a, "L", c.x - a, c.y + c.height + a, c.x + c.width + a, c.y + c.height + a, c.x + c.width + a, c.y - a, "Z"]
            }
        }, h))
    })(w);
    (function (a) {
        function h(a, c) {
            var b, e, f, g = !1, l = a.x, d = a.y;
            a = 0;
            for (b = c.length - 1; a < c.length; b = a++)e = c[a][1] > d, f = c[b][1] > d, e !== f && l < (c[b][0] - c[a][0]) * (d - c[a][1]) / (c[b][1] - c[a][1]) + c[a][0] && (g = !g);
            return g
        }

        var q = a.Chart, g = a.each, f = a.extend,
            k = a.format, w = a.merge, r = a.win, u = a.wrap;
        q.prototype.transformFromLatLon = function (e, c) {
            if (void 0 === r.proj4)return a.error(21), {x: 0, y: null};
            e = r.proj4(c.crs, [e.lon, e.lat]);
            var b = c.cosAngle || c.rotation && Math.cos(c.rotation), f = c.sinAngle || c.rotation && Math.sin(c.rotation);
            e = c.rotation ? [e[0] * b + e[1] * f, -e[0] * f + e[1] * b] : e;
            return {
                x: ((e[0] - (c.xoffset || 0)) * (c.scale || 1) + (c.xpan || 0)) * (c.jsonres || 1) + (c.jsonmarginX || 0),
                y: (((c.yoffset || 0) - e[1]) * (c.scale || 1) + (c.ypan || 0)) * (c.jsonres || 1) - (c.jsonmarginY || 0)
            }
        };
        q.prototype.transformToLatLon =
            function (e, c) {
                if (void 0 === r.proj4)a.error(21); else {
                    e = {
                        x: ((e.x - (c.jsonmarginX || 0)) / (c.jsonres || 1) - (c.xpan || 0)) / (c.scale || 1) + (c.xoffset || 0),
                        y: ((-e.y - (c.jsonmarginY || 0)) / (c.jsonres || 1) + (c.ypan || 0)) / (c.scale || 1) + (c.yoffset || 0)
                    };
                    var b = c.cosAngle || c.rotation && Math.cos(c.rotation), f = c.sinAngle || c.rotation && Math.sin(c.rotation);
                    c = r.proj4(c.crs, "WGS84", c.rotation ? {x: e.x * b + e.y * -f, y: e.x * f + e.y * b} : e);
                    return {lat: c.y, lon: c.x}
                }
            };
        q.prototype.fromPointToLatLon = function (e) {
            var c = this.mapTransforms, b;
            if (c) {
                for (b in c)if (c.hasOwnProperty(b) &&
                    c[b].hitZone && h({
                        x: e.x,
                        y: -e.y
                    }, c[b].hitZone.coordinates[0]))return this.transformToLatLon(e, c[b]);
                return this.transformToLatLon(e, c["default"])
            }
            a.error(22)
        };
        q.prototype.fromLatLonToPoint = function (e) {
            var c = this.mapTransforms, b, f;
            if (!c)return a.error(22), {x: 0, y: null};
            for (b in c)if (c.hasOwnProperty(b) && c[b].hitZone && (f = this.transformFromLatLon(e, c[b]), h({
                    x: f.x,
                    y: -f.y
                }, c[b].hitZone.coordinates[0])))return f;
            return this.transformFromLatLon(e, c["default"])
        };
        a.geojson = function (a, c, b) {
            var e = [], h = [], n = function (a) {
                var b,
                    c = a.length;
                h.push("M");
                for (b = 0; b < c; b++)1 === b && h.push("L"), h.push(a[b][0], -a[b][1])
            };
            c = c || "map";
            g(a.features, function (a) {
                var b = a.geometry, m = b.type, b = b.coordinates;
                a = a.properties;
                var l;
                h = [];
                "map" === c || "mapbubble" === c ? ("Polygon" === m ? (g(b, n), h.push("Z")) : "MultiPolygon" === m && (g(b, function (a) {
                    g(a, n)
                }), h.push("Z")), h.length && (l = {path: h})) : "mapline" === c ? ("LineString" === m ? n(b) : "MultiLineString" === m && g(b, n), h.length && (l = {path: h})) : "mappoint" === c && "Point" === m && (l = {
                    x: b[0],
                    y: -b[1]
                });
                l && e.push(f(l, {
                    name: a.name ||
                    a.NAME, properties: a
                }))
            });
            b && a.copyrightShort && (b.chart.mapCredits = k(b.chart.options.credits.mapText, {geojson: a}), b.chart.mapCreditsFull = k(b.chart.options.credits.mapTextFull, {geojson: a}));
            return e
        };
        u(q.prototype, "addCredits", function (a, c) {
            c = w(!0, this.options.credits, c);
            this.mapCredits && (c.href = null);
            a.call(this, c);
            this.credits && this.mapCreditsFull && this.credits.attr({title: this.mapCreditsFull})
        })
    })(w);
    (function (a) {
        function h(a, c, e, f, h, d, g, k) {
            return ["M", a + h, c, "L", a + e - d, c, "C", a + e - d / 2, c, a + e, c + d / 2, a +
            e, c + d, "L", a + e, c + f - g, "C", a + e, c + f - g / 2, a + e - g / 2, c + f, a + e - g, c + f, "L", a + k, c + f, "C", a + k / 2, c + f, a, c + f - k / 2, a, c + f - k, "L", a, c + h, "C", a, c + h / 2, a + h / 2, c, a + h, c, "Z"]
        }

        var q = a.Chart, g = a.defaultOptions, f = a.each, k = a.extend, w = a.merge, r = a.pick, u = a.Renderer, e = a.SVGRenderer, c = a.VMLRenderer;
        k(g.lang, {zoomIn: "Zoom in", zoomOut: "Zoom out"});
        g.mapNavigation = {
            buttonOptions: {
                alignTo: "plotBox",
                align: "left",
                verticalAlign: "top",
                x: 0,
                width: 18,
                height: 18,
                padding: 5,
                style: {fontSize: "15px", fontWeight: "bold"},
                theme: {"stroke-width": 1, "text-align": "center"}
            },
            buttons: {
                zoomIn: {
                    onclick: function () {
                        this.mapZoom(.5)
                    }, text: "+", y: 0
                }, zoomOut: {
                    onclick: function () {
                        this.mapZoom(2)
                    }, text: "-", y: 28
                }
            }, mouseWheelSensitivity: 1.1
        };
        a.splitPath = function (a) {
            var b;
            a = a.replace(/([A-Za-z])/g, " $1 ");
            a = a.replace(/^\s*/, "").replace(/\s*$/, "");
            a = a.split(/[ ,]+/);
            for (b = 0; b < a.length; b++)/[a-zA-Z]/.test(a[b]) || (a[b] = parseFloat(a[b]));
            return a
        };
        a.maps = {};
        e.prototype.symbols.topbutton = function (a, c, e, f, g) {
            return h(a - 1, c - 1, e, f, g.r, g.r, 0, 0)
        };
        e.prototype.symbols.bottombutton = function (a, c,
                                                     e, f, g) {
            return h(a - 1, c - 1, e, f, 0, 0, g.r, g.r)
        };
        u === c && f(["topbutton", "bottombutton"], function (a) {
            c.prototype.symbols[a] = e.prototype.symbols[a]
        });
        a.Map = a.mapChart = function (b, c, e) {
            var f = "string" === typeof b || b.nodeName, g = arguments[f ? 1 : 0], d = {
                endOnTick: !1,
                visible: !1,
                minPadding: 0,
                maxPadding: 0,
                startOnTick: !1
            }, h, k = a.getOptions().credits;
            h = g.series;
            g.series = null;
            g = w({
                chart: {panning: "xy", type: "map"}, credits: {
                    mapText: r(k.mapText, ' \u00a9 \x3ca href\x3d"{geojson.copyrightUrl}"\x3e{geojson.copyrightShort}\x3c/a\x3e'),
                    mapTextFull: r(k.mapTextFull, "{geojson.copyright}")
                }, tooltip: {followTouchMove: !1}, xAxis: d, yAxis: w(d, {reversed: !0})
            }, g, {chart: {inverted: !1, alignTicks: !1}});
            g.series = h;
            return f ? new q(b, g, e) : new q(g, c)
        }
    })(w)
});

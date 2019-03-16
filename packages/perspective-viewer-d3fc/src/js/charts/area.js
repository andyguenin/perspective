/******************************************************************************
 *
 * Copyright (c) 2017, the Perspective Authors.
 *
 * This file is part of the Perspective library, distributed under the terms of
 * the Apache License 2.0.  The full license can be found in the LICENSE file.
 *
 */
import * as fc from "d3fc";
import * as crossAxis from "../axis/crossAxis";
import * as mainAxis from "../axis/mainAxis";
import {areaSeries} from "../series/areaSeries";
import {seriesColours} from "../series/seriesColours";
import {splitAndBaseData} from "../data/splitAndBaseData";
import {colourLegend} from "../legend/legend";
import {filterData} from "../legend/filter";
import {withGridLines} from "../gridlines/gridlines";

import chartSvgCartesian from "../d3fc/chart/svg/cartesian";
import {hardLimitZeroPadding} from "../d3fc/padding/hardLimitZero";
import zoomableChart from "../zoom/zoomableChart";

function areaChart(container, settings) {
    const data = splitAndBaseData(settings, filterData(settings));

    const colour = seriesColours(settings);
    const legend = colourLegend()
        .settings(settings)
        .scale(colour);

    const series = fc.seriesSvgRepeat().series(areaSeries(settings, colour).orient("vertical"));

    const xScale = crossAxis.scale(settings);
    const chart = chartSvgCartesian(xScale, mainAxis.scale(settings))
        .xDomain(crossAxis.domain(settings)(data))
        .yDomain(
            mainAxis
                .domain(settings)
                .include([0])
                .paddingStrategy(hardLimitZeroPadding())(data)
        )
        .yOrient("left")
        .yNice()
        .plotArea(withGridLines(series).orient("vertical"));

    crossAxis.styleAxis(chart, "x", settings);
    mainAxis.styleAxis(chart, "y", settings);

    chart.xPaddingInner && chart.xPaddingInner(1);
    chart.xPaddingOuter && chart.xPaddingOuter(0.5);

    const zoomChart = zoomableChart()
        .chart(chart)
        .settings(settings)
        .xScale(xScale);

    // render
    container.datum(data).call(zoomChart);
    container.call(legend);
}
areaChart.plugin = {
    type: "d3_y_area",
    name: "[d3fc] Y Area Chart",
    max_size: 25000
};

export default areaChart;
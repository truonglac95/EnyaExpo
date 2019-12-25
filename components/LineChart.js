import React, { Component } from "react";
import { View } from "react-native";
import { Svg, Circle, Polygon, Line, Polyline, Path, Rect, Text, G } from "react-native-svg";

class LineChart extends Component {

  calcHeight = (val, height, yAxisLabels, paddingVert) => {

    //paddingVert the is the thickness of the clear area above 
    //and below the plot

    const canvasHeight = height - (2 * paddingVert);

    //this is always the min Y value
    const yMin = parseFloat(yAxisLabels[0]);

    //this is always the max Y value
    const yMax = parseFloat(yAxisLabels[yAxisLabels.length-1]);

    const plotRange = yMax - yMin;

    //calculate scale, to map data onto canvas
    const scale = canvasHeight / plotRange;

    //so now, for a datapoint i, we can calculate 
    //where it should go on the canvas...
    let yPosInCanvasUnits = height - (((val - yMin) * scale) + paddingVert);

    return yPosInCanvasUnits;

  };

  renderDots = config => {
    
    const { data, width, height, yAxisLabels, paddingVert,
      xStartPad, xEndPad } = config;

    //we assume equally spaced points along the x axis
    const range = width - (xEndPad + xStartPad);
    const step = Math.round(range / (data.length - 1));

    const output = [];

    data.forEach((x, i) => {

      const cx = Math.floor(xStartPad + (i * step));
      const yHeight = this.calcHeight(x, height, yAxisLabels, paddingVert);
      const cy = Math.floor(yHeight);

      output.push(
        <Circle
          key={Math.random()}
          cx={cx}
          cy={cy}
          r="6"
          fill={this.props.lineColor}
          fillOpacity={1.0}
        />,
        <Circle
          key={Math.random()}
          cx={cx}
          cy={cy}
          r="4"
          fill="#fff"
          fillOpacity={1.0}
        />
      );

    });

    return output;
  };

  renderLine = config => {

      const result = this.getBezierLinePoints(config);
      
      return (
        <Path
          key={0}
          d={result}
          fill="none"
          stroke={this.props.lineColor}
          strokeWidth={'2'}
        />
      );

  };

  getBezierLinePoints = (config) => {
    
    const { data, width, height, xStartPad, xEndPad, 
      yAxisLabels, paddingVert } = config;
    
    if (data.length === 0) {
      return "M0,0";
    }

    //we assume equally spaced points along the x axis
    const range = width - (xEndPad + xStartPad);
    const step = Math.round(range / (data.length - 1));
    const x = i => Math.floor(xStartPad + (i * step));

    const y = i => {
      const yHeight = this.calcHeight(data[i], height, yAxisLabels, paddingVert)
      return Math.floor(yHeight);
    };

    return [`M${x(0)},${y(0)}`]
      .concat(
        data.slice(0, -1).map((_, i) => {
          const x_mid = (x(i) + x(i + 1)) / 2;
          const y_mid = (y(i) + y(i + 1)) / 2;
          const cp_x1 = (x_mid + x(i)) / 2;
          const cp_x2 = (x_mid + x(i + 1)) / 2;
          return (
            `Q ${cp_x1}, ${y(i)}, ${x_mid}, ${y_mid}` +
            ` Q ${cp_x2}, ${y(i + 1)}, ${x(i + 1)}, ${y(i + 1)}`
          );
        })
      )
      .join(" ");
  };

  renderHorizontalLinesAndLabels = config => {
    
    const { data, width, height, yAxisLabels, paddingVert,
      xStartPad, xEndPad, backLineColor, labelColor, fontFam } = config;
    
    const output = [];

    yAxisLabels.forEach((x, i) => {

      const yHeight = this.calcHeight(x, height, yAxisLabels, paddingVert);
      const cy = Math.floor(yHeight);

      output.push(
        <Line
          key={Math.random()}
          x1={xStartPad - 10}
          y1={cy}
          x2={Math.floor(width - xEndPad + 20)}
          y2={cy}
          stroke={backLineColor}
          strokeWidth={0.3}
        />,
        <Text
          origin={`${xStartPad}, ${cy}`}
          key={Math.random()}
          x={xStartPad-14}
          textAnchor="end"
          y={cy+4}
          fontSize={14}
          fontWeight={'bold'}
          //fontFamily={fontFam} broken in expo / svg
          fill={labelColor}
        >
          {yAxisLabels[i]}
        </Text>
      );

    });

    return output;

  };

  render() {

    const {
      width,
      height,
      data,
      yAxisLabels,
      backLineColor,
      labelColor,
      fontFam,
    } = this.props;

    const config = {
      width,
      height,
      data,
      yAxisLabels,
      backLineColor,
      labelColor,
      fontFam,
      xStartPad: 40,
      xEndPad: 25,
      paddingVert: 15,
    };

    return (
      <View>
        <Svg height={height} width={width}>
          <G>
            <G>{this.renderHorizontalLinesAndLabels({...config})}</G>
            <G>{this.renderLine({...config})}</G>
            <G>{this.renderDots({...config})}</G>
          </G>
        </Svg>
      </View>
    );
  }
}

export default LineChart;

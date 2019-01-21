import * as d3 from "d3";
import React from "react";
import DataPoint from "../models/dataPoint";

interface LineGraphProps {
  height: number;
  width: number;
  values: DataPoint[];
}

class LineGraph extends React.Component<LineGraphProps, any> {
  private innerGRef: React.RefObject<SVGGElement>;
  private xAxisGRef: React.RefObject<SVGGElement>;
  private xAxisTextRef: React.RefObject<SVGTextElement>;
  private yAxisGRef: React.RefObject<SVGGElement>;
  private yAxisTextRef: React.RefObject<SVGTextElement>;
  private pathRef: React.RefObject<SVGPathElement>;
  private margin = { left: 120, right: 30, top: 20, bottom: 120 };
  private innerWidth: number;
  private innerHeight: number;

  constructor(props: LineGraphProps) {
    super(props);
    this.innerGRef = React.createRef();
    this.xAxisGRef = React.createRef();
    this.xAxisTextRef = React.createRef();
    this.yAxisGRef = React.createRef();
    this.yAxisTextRef = React.createRef();
    this.pathRef = React.createRef();
    this.innerWidth = props.width - this.margin.left - this.margin.right;
    this.innerHeight = props.height - this.margin.top - this.margin.bottom;
  }

  public componentDidUpdate() {
    this.updateLine();
  }

  public componentDidMount() {
    this.drawChart();
  }

  public render() {
    return (
      <svg id="graph" width={this.props.width} height={this.props.height}>
        <style jsx>{`
        .tick line {
          stroke: #C0C0BB;
        }
        .tick text {
          fill: #8E8883;
          font-size: 20pt;
          font-family: sans-serif;
        }
        .axis-label {
          fill: #635F5D;
          font-size: 30pt;
          font-family: sans-serif;
        }
        `}</style>
        <g ref={this.innerGRef}>
          <g ref={this.xAxisGRef}>
            <text ref={this.xAxisTextRef}></text>
          </g>
          <g ref={this.yAxisGRef}>
            <text ref={this.yAxisTextRef}></text>
          </g>
          <path id="line" ref={this.pathRef}></path>
        </g>
      </svg>
    );
  }

  private updateLine() {
    const xValue = (d: DataPoint) => d.date.getTime();
    const yValue = (d: DataPoint) => d.temperature;
    const ticks = 5;
    const tickPadding = 15;

    const xScale = d3.scaleTime()
      .domain(d3.extent(this.props.values, xValue))
      .range([0, this.innerWidth]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(this.props.values, yValue))
      .range([this.innerHeight, 0])
      .nice(ticks);

    const xAxis = d3.axisBottom(xScale)
      .ticks(ticks)
      .tickPadding(tickPadding)
      .tickSize(-this.innerHeight);

    const yAxis = d3.axisLeft(yScale)
      .ticks(ticks)
      .tickPadding(tickPadding)
      .tickSize(-this.innerWidth);

    const line = d3.line<DataPoint>()
      .x( (d) => xScale(xValue(d)))
      .y( (d) => yScale(yValue(d)))
      .curve(d3.curveBasis);

    d3.select(this.xAxisGRef.current)
      .call(xAxis);

    d3.select(this.yAxisGRef.current)
      .call(yAxis);

    d3.select(this.pathRef.current)
      .attr("d", line(this.props.values));
  }

  private drawChart() {
    const xLabel = "Time";
    const yLabel = "Temperature";

    const innerG = d3.select(this.innerGRef.current);
    const xAxisG = d3.select(this.xAxisGRef.current);
    const xAxisText = d3.select(this.xAxisTextRef.current);
    const yAxisText = d3.select(this.yAxisTextRef.current);

    innerG
      .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
    xAxisG
      .attr("transform", `translate(0, ${this.innerHeight})`);

    xAxisText
      .attr("class", "axis-label")
      .attr("x", this.innerWidth / 2)
      .attr("y", 100)
      .text(xLabel);

    yAxisText
      .attr("class", "axis-label")
      .attr("x", -this.innerHeight / 2)
      .attr("y", -60)
      .attr("transform", `rotate(-90)`)
      .style("text-anchor", "middle")
      .text(yLabel);

    d3.select(this.pathRef.current)
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("fill", "none");
  }
}

export default LineGraph;
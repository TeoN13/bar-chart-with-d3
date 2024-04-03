import * as d3 from "https://cdn.skypack.dev/d3@7.8.0";
document.addEventListener("DOMContentLoaded", () => {
  // Get chart data
  fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json").

  then(response => response.json()).
  then(data => {
    const chartData = data;
    //console.log('initial data:', chartData)
    const dataset = chartData["data"];
    //console.log("chart data is:", dataset);
    // [yy-mm-dd, value] = ['1957-07-01', 480.3]

    const w = 600;
    const h = 400;
    const padding = 50;

    const xScale = d3.
    scaleTime().
    domain([d3.min(dataset, d => d3.timeParse("%Y-%m-%d")(d[0])), d3.max(dataset, d => d3.timeParse("%Y-%m-%d")(d[0]))]).
    range([padding, w - padding]);

    const yScale = d3.
    scaleLinear().
    domain([0, d3.max(dataset, d => d[1])]).
    range([h - padding, padding]);

    //console.log('yScale')
    //console.log(d3.min(dataset, (d) => d[1]))
    //console.log()

    const svg = d3.
    select("#container").
    append("svg").
    attr("class", "chart").
    attr("width", w).
    attr("height", h);

    const title = svg.
    append("text").
    attr("x", w / 2).
    attr("y", padding / 1.5).
    attr("id", "title").
    attr("text-anchor", "middle").
    text("GDP Chart");

    const barWidth = 100 / dataset.length;

    svg.
    selectAll("rect").
    data(dataset).
    enter().
    append("rect").
    attr("class", "bar").
    attr("data-date", d => d[0]).
    attr("data-gdp", d => d[1]).
    attr("x", d => xScale(d3.timeParse("%Y-%m-%d")(d[0]))).
    attr("y", d => yScale(d[1])).
    attr("height", d => h - yScale(d[1]) - padding).
    attr("width", `${barWidth}%`).
    on("mouseover", showTooltip).
    on("mouseout", hideTooltip);

    function showTooltip() {
      //console.log("Showing tooltip!");
      //console.log(this.getAttribute("data-date"),this.getAttribute("data-gdp"));
      //console.log('event.pageX',event.pageX)
      //console.log('event.pageY',event.pageY)
      d3.select("#tooltip") // position already set to absolute in css
      .style("display", "block") // show the #tooltip div
      .style("left", event.pageX + "px") // show it next to mouse
      .style("top", event.pageY + "px").
      attr("data-date", this.getAttribute("data-date")).
      html(
      `Date: ${this.getAttribute(
      "data-date")
      }<br />GDP: ${this.getAttribute("data-gdp")}`);

    }

    function hideTooltip() {
      d3.select("#tooltip").style("display", "none");
    }

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.
    append("g").
    attr("id", "x-axis").
    attr("transform", `translate(0, ${h - padding})`).
    call(xAxis);

    svg.
    append("g").
    attr("id", "y-axis").
    attr("transform", `translate(${padding}, 0)`).
    call(yAxis);
  });
});
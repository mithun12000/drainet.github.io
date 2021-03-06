
var margin = {top: 150, right: 100, bottom: 70, left: 100},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var formatPercent = d3.format(".0f");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<div style='color:red; font-size:1em; text-align:center;'><span style='color:white'>Death:</span> " + d.death + "</div>"
        +"\t"+ "<div style='text-align:center';>Events:</strong> <span style='color:red'>" + d.events + "</span></div>"
        +"\t"+ "<div style='text-align:center';>Injured:</strong> <span style='color:red'>" + d.injured + "</span></div>"
    ;
  })

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("background-color","#d8f6ce")
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

d3.csv("/data/CountAccident.csv", type, function(error, data) {

  x.domain(data.map(function(d) { return d.months; }));
  y.domain([0, d3.max(data, function(d) { return d.death; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor","end")
      .attr("dx","-.8em")
      .attr("dy",".15em")
      .attr("transform","rotate(-65)");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 2)
      .attr("dy", ".71em")
      .attr("font-size", 15)
      .style("text-anchor", "end")
      .text("Number of deaths")
      .attr("fill","steelblue");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.months); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.death); })
      .attr("height", function(d) { return height - y(d.death);})
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  svg.append("g")
    .append("text")
    .attr("x", - margin.left + 20)
    .attr("y", - margin.top + 30)
    .text("Taipei trafic accident ( recent 3 years )")
    .attr("font-size",25)
    .attr("fill","orangered");


});

function type(d) {
  
  d.death = +d.death;
  d.events= +d.events;
  d.injured=+d.injured;
  return d;
}

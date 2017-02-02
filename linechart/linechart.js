function drawLine(node, data) {
	var parseDate = d3.timeParse("%Y-%m-%d");

	data = data.map(type)
	function type(d) {
		d.day = parseDate(d.day);
		d.value = +d.value;
		return d;
	}

	var svg = d3.select(node).append("svg"),
	margin = {
		top: 20,
		right: 20,
		bottom: 80,
		left: 40
	},
	margin2 = {
		top: +parseInt(d3.select(node).style("height")) - 60,
		right: 20,
		bottom: 30,
		left: 40
	},
	width = +parseInt(d3.select(node).style("width")) - margin.left - margin.right,
	height = +parseInt(d3.select(node).style("height")) - margin.top - margin.bottom,
	height2 = +parseInt(d3.select(node).style("height")) - margin2.top - margin2.bottom;

	svg.attr("width", parseInt(d3.select(node).style("width")))
	.attr("height", parseInt(d3.select(node).style("height")))

	var x = d3.scaleTime().range([0, width]),
	x2 = d3.scaleTime().range([0, width]),
	y = d3.scaleLinear().range([height, 0]).nice(),
	y2 = d3.scaleLinear().range([height2, 0]);

	var xAxis = d3.axisBottom(x),
	xAxis2 = d3.axisBottom(x2),
	yAxis = d3.axisLeft(y).tickSize(-width, 0, 0);

	var brush = d3.brushX()
		.extent([
				[0, 0],
				[width, height2]
			])
		.on("brush end", brushed);

	var zoom = d3.zoom()
		.scaleExtent([1, Infinity])
		.translateExtent([
				[0, 0],
				[width, height]
			])
		.extent([
				[0, 0],
				[width, height]
			])
		.on("zoom", zoomed);

	var area = d3.area()
		.curve(d3.curveMonotoneX)
		.x(function (d) {
			return x(d.day);
		})
		.y0(height)
		.y1(function (d) {
			return y(d.value);
		});

	var area2 = d3.area()
		.curve(d3.curveMonotoneX)
		.x(function (d) {
			return x2(d.day);
		})
		.y0(height2)
		.y1(function (d) {
			return y2(d.value);
		});

	svg.append("defs").append("clipPath")
	.attr("id", "clip")
	.append("rect")
	.attr("width", width)
	.attr("height", height);

	var focus = svg.append("g")
		.attr("class", "focus")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var context = svg.append("g")
		.attr("class", "context")
		.attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

	x.domain(d3.extent(data, function (d) {
			return d.day;
		}));
	y.domain([0, d3.max(data, function (d) {
				return d.value;
			})]);
	x2.domain(x.domain());
	y2.domain(y.domain());

	focus.append("g")
	.attr("class", "axis axis--y")
	.call(yAxis);

	focus.append("path")
	.datum(data)
	.attr("class", "area")
	.attr("d", area);

	focus.append("g")
	.attr("class", "axis axis--x")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis);

	context.append("path")
	.datum(data)
	.attr("class", "area")
	.attr("d", area2);

	context.append("g")
	.attr("class", "axis axis--x")
	.attr("transform", "translate(0," + height2 + ")")
	.call(xAxis2);

	context.append("g")
	.attr("class", "brush")
	.call(brush)
	.call(brush.move, x.range());

	svg.append("rect")
	.attr("class", "zoom")
	.attr("width", width)
	.attr("height", height)
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	.call(zoom);

	function brushed() {
		if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom")
			return; // ignore brush-by-zoom
		var s = d3.event.selection || x2.range();
		x.domain(s.map(x2.invert, x2));
		focus.select(".area").attr("d", area);
		focus.select(".axis--x").call(xAxis);
		svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
			.scale(width / (s[1] - s[0]))
			.translate(-s[0], 0));
	}

	function zoomed() {
		if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush")
			return; // ignore zoom-by-brush
		var t = d3.event.transform;
		x.domain(t.rescaleX(x2).domain());
		focus.select(".area").attr("d", area);
		focus.select(".axis--x").call(xAxis);
		context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
	}

}

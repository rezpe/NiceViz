function drawBar(node, data) {

	data = data.map(e => {
			return {
				category: e[0],
				values: [e[1], e[2]]
			}
		});

	var element = d3.select(node);
	var margin = {
		top: 20,
		right: 20,
		bottom: 30,
		left: 40
	};
	
	var mwidth = parseInt(element.style("width")) - margin.left - margin.right;
	var mheight = 30;

	var svg = element.append("svg")
		.attr("width", parseInt(element.style("width")))
		.attr("height", parseInt(element.style("width")));

	// Big Chart

	var width = parseInt(element.style("width")) - margin.left - margin.right;
	var height = parseInt(element.style("height")) - margin.top - margin.bottom - 70;

	var defs = svg.append("defs");
	//Append a clipPath element to the defs element, and a Shape
	// to define the cliping area
	defs.append("clipPath").attr('id', 'my-clip-path').append('rect')
	.attr('width', width) //Set the width of the clipping area
	.attr('height', height + margin.bottom); // set the height of the clipping area

	var x0 = d3.scaleBand()
		.rangeRound([0, width * (data.length) / 10])
		.padding(0.3);

	var x1 = d3.scaleBand()
		.padding(0.9);

	var y = d3.scaleLinear()
		.rangeRound([height, 0]);

	var colors = ["#005eb8", "#9bcaeb"]

	x0.domain(data.map(function (d) {
			return d.category;
		}));
	x1.domain([0, 1]).rangeRound([0, x0.bandwidth()]);
	y.domain([0, d3.max(data, function (d) {
				return d3.max(data, function (e) {
					return Math.max(...e.values);
				});
			})]).nice();

	svg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
	.call(d3.axisLeft(y).tickSize(-width, 0, 0).ticks(5));

	var g0 = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		.attr('clip-path', 'url(#my-clip-path)');

	var g = g0.append("g")

		g.append("g")
		.selectAll("g")
		.data(data)
		.enter().append("g")
		.attr("transform", function (d) {
			return "translate(" + x0(d.category) + ",0)";
		})
		.selectAll("rect")
		.data(function (d) {
			return d.values
		})
		.enter().append("rect")
		.attr("x", function (d, i) {
			return x1(i);
		})
		.attr("y", function (d) {
			return y(d);
		})
		.attr("width", 5)
		.attr("height", function (d) {
			return height - y(d);
		})
		.attr("fill", function (d, i) {
			return colors[i]
		})

		g.selectAll(".label")
		.data(data)
		.enter().append("text")
		.attr("class", "label")
		.attr("x", function (d) {
			return x0(d.category) + x0.bandwidth() / 2;
		})
		.attr("y", function (d) {
			return height + margin.bottom - 10;
		})
		.attr("width", x0.bandwidth())
		.text(function (d, i) {
			return d.category
		});

	// Small Chart

	var g1 = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + (margin.top + height + margin.bottom) + ")");

	var mx0 = d3.scaleBand()
		.rangeRound([0, mwidth])
		.padding(0.3);

	var mx1 = d3.scaleBand()
		.padding(0.9);

	var my = d3.scaleLinear()
		.rangeRound([mheight, 0]);

	mx0.domain(data.map(function (d) {
			return d.category;
		}));
	mx1.domain([0, 1]).rangeRound([0, mx0.bandwidth()]);
	my.domain([0, d3.max(data, function (d) {
				return d3.max(data, function (e) {
					return Math.max(...e.values);
				});
			})]).nice();

	var brush = d3.brushX()
		.extent([
				[0, 0],
				[mwidth, mheight]
			])
		.on("brush end", brushed);

	var brushe = g1.append("g")
		.attr("class", "brush")
		.call(brush)
		.call(brush.move, [0, mx0(data[10].category)]);

	//Can not resize
	brushe.selectAll(".handle").remove();
	//Can not create new area
	brushe.selectAll(".overlay").remove();

	g1.append("g")
	.selectAll("g")
	.data(data)
	.enter().append("g")
	.attr("transform", function (d) {
		return "translate(" + mx0(d.category) + ",0)";
	})
	.selectAll("rect")
	.data(function (d) {
		return d.values
	})
	.enter().append("rect")
	.attr("x", function (d, i) {
		return mx1(i);
	})
	.attr("y", function (d) {
		return my(d);
	})
	.attr("width", 2)
	.attr("height", function (d) {
		return mheight - my(d);
	})
	.attr("fill", function (d, i) {
		return colors[i]
	})

	function brushed() {
		var s = d3.event.selection || x2.range();
		var start = s[0] * data.length / 10
			g.attr("transform", "translate(-" + start + ",0)")

	}

}

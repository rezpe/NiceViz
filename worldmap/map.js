function drawMap(node, routes) {
	var element = d3.select(node)
	let width = parseInt(element.style("width"));
	let height = parseInt(element.style("width")) / 2;
	
	var svg = element
		.append("svg")
		.attr("width", width)
		.attr("height", height)

		var zoom = d3.zoom()
		.scaleExtent([1, 9])
		/*.translateExtent([
		[0, 0],
		[width, height]
		])*/
		.on("zoom", move);

	var projection = d3.geoMercator()
		.center([-15.2, 26.2])
		.scale(1.5 * height / Math.PI)

		var path = d3.geoPath().projection(projection);

	var interpolate = d3.line()
		.x(function (d) {
			return d[0]
		}).y(function (d) {
			return d[1]
		}).curve(d3.curveCardinal.tension(0));

	var smoothPath = function (pstr) {
		var sp = path(pstr).replace(/M|Z/, "").split("L").map(function (d) {
				return d.split(",")
			});
		return interpolate(sp);
	}

	var g = svg.append("g")
		var gr = svg.append("g")

		svg.append("rect")
		.attr("width", width)
		.attr("height", height)
		.style("fill", "none")
		.style("pointer-events", "all")
		.call(zoom)

		d3.json("https://raw.githubusercontent.com/hiebj/world-topo/master/world-topo-min.json", function (error, world) {

			var countries = topojson.feature(world, world.objects.countries).features;

			var country = g.selectAll(".country").data(countries);

			country.enter().insert("path")
			.attr("class", "country")
			.attr("d", path)
			.attr("id", function (d, i) {
				return d.id;
			})
			.attr("title", function (d, i) {
				return d.properties.name;
			})

		});

	function move() {
		g.attr("transform", d3.event.transform);
		gr.attr("transform", d3.event.transform);
		var s = d3.event.transform.k
			d3.selectAll(".country").attr("stroke-width", 1 / s)
			d3.selectAll(".route").attr("stroke-width", 1 / s)
			console.log(s)
			showText = s < 3 ? "none" : "block"
			d3.selectAll(".departure").style("display", showText)
			d3.selectAll(".arrival").style("display", showText)
	}

	gr.selectAll(".route")
	.data(routes)
	.enter()
	.append("path")
	.attr("class", "route")
	.attr("d", function (d) {
		return smoothPath({
			"type": "LineString",
			"coordinates": [
				[d.arr_lng, d.arr_lat],
				[d.dep_lng, d.dep_lat],
			]
		})
	})

	gr.selectAll(".arrivalPoint")
	.data(routes)
	.enter()
	.append("circle")
	.attr("class", "arrivalPoint")
	.attr("fill", "purple")
	.attr("cx", function (d) {
		return projection([d.arr_lng, d.arr_lat])[0];
	})
	.attr("cy", function (d) {
		return projection([d.arr_lng, d.arr_lat])[1];
	})

	gr.selectAll(".arrival")
	.data(routes)
	.enter()
	.append("text")
	.attr("class", "arrival")
	.style("display", "none")
	.attr("x", function (d) {
		return projection([d.arr_lng, d.arr_lat])[0] + 2;
	})
	.attr("y", function (d) {
		return projection([d.arr_lng, d.arr_lat])[1];
	})
	.text(function (d) {
		return d.arr_city
	});

	gr.selectAll(".departurePoint")
	.data(routes)
	.enter()
	.append("circle")
	.attr("class", "departurePoint")
	.attr("cx", function (d) {
		return projection([d.dep_lng, d.dep_lat])[0];
	})
	.attr("cy", function (d) {
		return projection([d.dep_lng, d.dep_lat])[1];
	})

	gr.selectAll(".departure")
	.data(routes)
	.enter()
	.append("text")
	.attr("class", "departure")
	.style("display", "none")
	.attr("x", function (d) {
		return projection([d.dep_lng, d.dep_lat])[0] + 2;
	})
	.attr("y", function (d) {
		return projection([d.dep_lng, d.dep_lat])[1];
	})
	.text(function (d) {
		return d.dep_city
	});

}

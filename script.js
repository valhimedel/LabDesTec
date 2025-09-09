import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const data = await d3.csv("./SimpsonsData.csv", d3.autoType);

const svg = d3.select("svg"); // selecciona el svg del hmtl 
const margin = {top:50, right:150, bottom:50, left:120}; // hace un margen al redeor del grafico 
const width = +svg.attr("width") - margin.left - margin.right;
const height = +svg.attr("height") - margin.top - margin.bottom;


const g = svg.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);


const xScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.episode)]) // empieza en 0 los capitulos para que no quede el 1 en la linea de y 
  .range([0, width]);

const yScale = d3.scaleBand()
  .domain([...new Set(data.map(d => d.season))]) //las temporadas
  .range([height, 0])
  .padding(0.2);

const colorScale = d3.scaleSequential()
  .domain([d3.min(data, d => d.voteCount), d3.max(data, d => d.voteCount)])
  .interpolator(d3.interpolateCubehelixLong("purple", "orange"));
  

const sizeScale = d3.scaleSqrt()
   .domain([5.0, 9.3]) // rango de rating
  .range([2, 30]);

// CIRCULOS
g.selectAll("circle")
  .data(data)
  .join("circle")
  .attr("cx", d => xScale(d.episode)) //posicion x segun capitulo
  .attr("cy", d => yScale(d.season) + yScale.bandwidth()/2) //posicion y segun temporada
  .attr("r", d => sizeScale(d.rating)) //  radio segun nota
  .attr("fill", d => colorScale(d.voteCount)) //color segun cantidad de votos
  .attr("stroke-width", 0.5);


const xAxis = d3.axisBottom(xScale)
  .tickValues(d3.range(1, d3.max(data, d => d.episode)+1)) // +para que empiece desde 0
  .tickFormat(d3.format("d")); // sin decimales
const yAxis = d3.axisLeft(yScale);



//Texto horizontal
g.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(xAxis)
  .append("text")
  .attr("x", width/2)
  .attr("y", 40)
  .attr("fill", "black")
  .attr("text-anchor", "middle")
  .text("Capítulo");


  //texto vertical
g.append("g")
  .call(yAxis)
  .append("text")
  .attr("x", -height/2)
  .attr("y", -50)
  .attr("transform", "rotate(-90)")
  .attr("fill", "black")
  .attr("text-anchor", "middle")
  .text("Temporada");


// barra de color
const legendHeight = 400; 
const legendWidth = 20;   
const legendX = width + 90; 
const legendY = 0;

const legendScale = d3.scaleLinear()
  .domain([d3.min(data, d => d.voteCount), d3.max(data, d => d.voteCount)])
  .range([legendHeight, 0]);

// gradiente
const defs = svg.append("defs");

const gradient = defs.append("linearGradient")
  .attr("id", "legend-gradient")
  .attr("x1", "0%")
  .attr("y1", "100%")
  .attr("x2", "0%")
  .attr("y2", "0%");


const stops = d3.range(0, 1.01, 0.1); 
stops.forEach(s => {
  gradient.append("stop")
    .attr("offset", `${s * 100}%`)
    .attr("stop-color", colorScale(
      d3.min(data, d => d.voteCount) + s * (d3.max(data, d => d.voteCount) - d3.min(data, d => d.voteCount))
    ));
});

// rectangulo con el colors
svg.append("g")
  .attr("transform", `translate(${margin.left + legendX},${margin.top + legendY})`)
  .append("rect")
  .attr("width", legendWidth)
  .attr("height", legendHeight)
  .style("fill", "url(#legend-gradient)");

// Eje de la leyenda
const legendAxis = d3.axisRight(legendScale)
  .ticks(6)
  .tickFormat(d3.format(".0f"));

svg.append("g")
  .attr("transform", `translate(${margin.left + legendX + legendWidth},${margin.top})`)
  .call(legendAxis)
  .call(g => g.select(".domain").remove());



// la etiketa
const etiqueta = d3.select('body')
  .append('div')
  .attr('class', 'etiqueta');


g.selectAll('circle')
  .data(data)
  .join('circle')
  .attr('cx', d => xScale(d.episode))
  .attr('cy', d => yScale(d.season) + yScale.bandwidth()/2)
  .attr('r', d => sizeScale(d.rating))  // tamaño según nota
  .attr('fill', d => colorScale(d.voteCount)) // color según votos
  .on('mouseenter', (event, d) => {
    etiqueta
      etiqueta.style('opacity', 1)
      etiqueta.html(
        `<strong>Nota:</strong> ${d.rating}<br>` +
        `<strong>Votos:</strong> ${d.voteCount}`
      )
      etiqueta.style('left', (event.pageX + 10) + 'px')
      etiqueta.style('top',  (event.pageY + 10) + 'px');
  })
  .on('mousemove', (event) => {
    etiqueta
      etiqueta.style('left', (event.pageX + 10) + 'px')
      etiqueta.style('top',  (event.pageY + 10) + 'px');
  })
  .on('mouseleave', () => {
    etiqueta.style('opacity', 0);
  });

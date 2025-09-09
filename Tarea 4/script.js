import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"
import data from './data.json' with {type : 'json'}

  const color = d3.scaleSequential()
    .domain([0, d3.max(data.features, d => d.properties.Poblacion)])
    .interpolator(d3.interpolatePurples);


const projection = d3.geoMercator()
    .fitSize([500,500], data)

    const path = d3.geoPath(projection)

    d3.select('.mapa')
    .selectAll('path')
    .data(data.features)
    .join('path')
    .attr('d', path)
    .attr('fill', d => color(d.properties.Poblacion))
     .attr('stroke-width', 1)
     .attr('stroke', 'black')

     const etiqueta = d3.select('body').append('div')
    .classed('etiqueta', true)

d3.select('.mapa').selectAll('path')
    .on('mouseenter', (e, d) => {
        etiqueta.style('opacity', 1)
        etiqueta.style('top', e.pageY + 10 + 'px')
        etiqueta.style('left', e.pageX + 10 + 'px')
        etiqueta.html(`<p>${d.properties.Comuna}, ${d.properties.Poblacion}<p>`)
    })
    .on('mouseout', (e, d) => {
        etiqueta.style('opacity', 0)
    })

  

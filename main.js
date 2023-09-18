let url='https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
let req=new XMLHttpRequest(); //to request data
let data;
let values;
let padding=40  
let xScale;
let xAxisScale;
let yScale;
let yAxisScale;
let heightScale;
let w=800;
let h=500;
let svg=d3.select('svg');

let drawChart = ()=>{
    svg.attr("width",w)
    svg.attr("height",h)
}

let generateScales = () =>{
     
    heightScale=d3.scaleLinear()
      .domain([0,d3.max(values,(item) => {
        return item[1];
      })])
      .range([0,h-(2*padding)])

      xScale=d3.scaleLinear()
      .domain([0,values.length-1])
      .range([padding,w-padding])

      let datesArray =values.map((items) => {
        return new Date(items[0])
      })

    xAxisScale=d3.scaleTime()
            .domain([d3.min(datesArray),d3.max(datesArray)])
            .range([padding,w-padding])
    yAxisScale=d3.scaleLinear()
            .domain([0,d3.max(values,(item)=>{
                return item[1]
            })])
            .range([h-padding,padding])        //we want to push it down by height then up by padding
                            //for the top we should just push it down by padding
     }
let drawBars = () => {
  let tooltip=d3.select("body")
  .append('div')
  .attr('id','tooltip')
  .style("visibilty",'hidden')
  .style("height",'auto')
  .style("width",'auto')
    svg.selectAll('rect')
        .data(values)
        .enter()
        .append("rect")
        .attr("class","bar")
        .attr("width",(w-(2*padding))/values.length)
        .attr("data-date",(item)=>{
        return item[0]
      })
        .attr("data-gdp",(item)=>{
          return item[1]})
         .attr("height",(d)=>{
            return heightScale(d[1])
          })
        .attr("x",(item,index) =>{
          return xScale(index)
        })
        .attr("y",(item)=>{
          return (h-padding)-heightScale(item[1])
        })
        .on("mouseover",(item)=>{
          tooltip.transition() //alerting we're gonna change style
                 .style("visibility","visible")
          tooltip.text(item[0])
          document.querySelector('#tooltip').setAttribute("data-date",item[0]) 
        })
        .on("mouseout",(item)=>{
          tooltip.transition()
          .style("visibility","hidden")
        })
    
      }
     


    let generateAxis  = () => {

    let xAxis=d3.axisBottom(xAxisScale)
    svg.append('g')
       .call(xAxis)
       .attr('id','x-axis')
       .attr("transform",'translate(0,'+(h-padding)+')')
        //0  for x , we push it down by height and bring it up by padding
    
    let yAxis=d3.axisLeft(yAxisScale)
    svg.append('g')
    .call(yAxis)
    .attr('id','y-axis')
    .attr('transform','translate('+ padding+ ',0)');
}




req.open('GET',url,true)
req.onload=() =>{ //response text
    data = JSON.parse(req.responseText) //converts JSON file into a js object
    values=data.data
    drawChart()
    generateScales()
    generateAxis()
    drawBars()
    

} 
req.send(); //send a string response in format other than json



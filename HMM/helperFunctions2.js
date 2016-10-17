function generateText(selector)
  {
      var text = [];
      text.push("STATES");
      // text.push("------------");
      for(var i =0;i<numStates;i++)
      {
        text.push("S"+i+" : "+stateData[i].name);
      }
      
      text.push("");
      text.push("OBSERVATIONS");
      
      for(var i =0;i<numObs;i++)
      {
        text.push("O"+i+" : "+obsData[i].name);
      }
      return text;
  }
  function getCenter(selector)
  {
    var width = svg.node().getBBox().width,
        startPos = 0.2*width;
    if(selector=="states")
    {
        var space = 0.6*width/(numStates+1);
        for(i=0;i<numStates;i++)
        {
          stateData[i].x = startPos + (i+1)*space;
          stateData[i].y = svg.node().getBBox().height + stateHeight*ht;
        }
    }else
    {
      var space = 0.6*width/(numObs+1);
      for(i=0;i<numObs;i++)
      {
        obsData[i].x = startPos + (i+1)*space;
        obsData[i].y = svg.node().getBBox().height + obsHeight*ht;
      }
    }
  }

function positionLink(d){

  if(d.source==d.target)
  {
    var pos = [stateData[d.source].x,stateData[d.source].y];
    var cp1 = [pos[0]-85,pos[1]-95];
    var cp2 = [pos[0]+85,pos[1]-95];

    return "M"+pos[0]+ "," + pos[1]+" C"+cp1[0]+","+cp1[1]+" "+
    cp2[0]+","+cp2[1]+" "+pos[0]+","+pos[1];
  
  }else
  {
    var startPos = [stateData[d.source].x,stateData[d.source].y],
      endPos = [stateData[d.target].x,stateData[d.target].y];
    var dx = startPos[0]-endPos[0],
    dy = startPos[1]-endPos[1],
    dr = Math.sqrt(dx*dx + dy*dy);
    return "M" + startPos[0]+ "," + startPos[1]
       + "A" + dr + "," + dr + " 0 0,1 "
       + endPos[0] + "," + endPos[1];

  }
}

function selectTextGen(id){
    if(id.indexOf("state")!=-1)
    {
    //State node
    var text='',
        stateID = id[5];
    for(i=0;i<numStates;i++)
    {
      text = text + "#state"+stateID+i+",";
    }
    for(i=0;i<numObs-1;i++)
    {
      text = text + "#obs"+stateID+i+",";
    }
    text = text + "#obs"+stateID+(numObs-1);
    return text;
    }else
    {
    //Obs node
    }
}

//// MOUSE FUNCTIONS

function getCurrentVisible()
{
  return currentVisible[0]+","+currentVisible[1];
}

function mouseSVGClick(d){
 
 if(hideLines==1)
 {
    plot.selectAll("circle").attr("opacity",1.0);
    plot.selectAll("path,line").attr("opacity",0.0);
    plot.selectAll(getCurrentVisible()).attr("opacity",1.0);
    selected = 0;
 }else
 {
    plot.selectAll("path,circle,line").attr("opacity",1.0);
    selected = 0;

 }
      
}

function mouseCircleClick(d){
    
    if(animationOn==1)
    {
      return;
    }
    if(selected==0)
    {
      selected=1;
      
    plot.selectAll("path,circle,line").attr("opacity",0.1);
    selectText = selectTextGen(this.id);
    
    plot.selectAll(selectText+",#"+this.id).attr("opacity",1.0);
    }else
    {
      mouseSVGClick(d);
    }
}

function mouseoverCircle(){

  d3.select(this).attr("fill","orange").attr("stroke","none");    
  var coords = d3.mouse(this);
    
  	if(this.id.length==6)
  	{
  		id = ""+this.id[4].toString()+""+this.id[5].toString();
  	}else
  	{
  		id = ""+this.id[4].toString();
  	}

     var coords = [nodeData[id].x,nodeData[id].y];
     //var name = stateData[id].name;
     var id = nodeData[id].id;
     var obs = (id-(id%numStates))/numStates,
  		state = id%numStates;
     var output = " S"+state+" O"+obs+" ";
     var length = 6*(output.length);
      
   
    plot.append("rect").attr("x",coords[0]-length/2).attr("opacity",0.0).attr("fill","black").attr("id","tipRect").attr("width",length).attr("height",30).attr("y",coords[1]+20);
    plot.append("text").attr("x",coords[0]).attr("fill","white").attr("id","tipText").text(output).attr("y",coords[1]+40).attr("font-size",12).attr("text-anchor","middle");
    plot.select("#tipRect").transition().duration(200).attr("opacity",0.7);
}

function mouseoutCircle(){
  
    
    plot.selectAll("#tipRect,#tipText").remove();
    if(this.id.length==6)
    {
      id = ""+this.id[4].toString()+""+this.id[5].toString();
    }else
    {
      id = ""+this.id[4].toString();
    }
    
    if(nodeData[id].selected==0)
    {
      d3.select(this).attr("stroke-width",3).attr("stroke","black").attr("fill","white");  
    }else
    {
      d3.select(this).attr("stroke-width",3).attr("stroke","black").attr("fill","black");  
    }
    
    
  
}


//// DRAG FUNCTIONS
function dragStart(d){
    //if(selected==1){return;}
    d3.select(this).attr("opacity",0.5);
    simulation.restart();
    simulation.alpha(0.7);

    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d){
    if(selected==1){return;}
    var coords = d3.mouse(this);

    if(this.id.length==6)
    {
      id = ""+this.id[4].toString()+""+this.id[5].toString();
    }else
    {
      id = ""+this.id[4].toString();
    }

    

    nodeData[id].x = coords[0];
    nodeData[id].y = coords[1];
    d3.select(this).attr("cx",coords[0]).attr("cy",coords[1]);
    plot.selectAll("line").data(stateLinks).attr("x1",function(d){ return nodeData[d.source].x ;}).attr("y1",function(d){ return nodeData[d.source].y ;})
                                           .attr("x2",function(d){ return nodeData[d.target].x ;}).attr("y2",function(d){ return nodeData[d.target].y ;});

    d.fx = d3.event.x;
    d.fy = d3.event.y;
  
}

function dragEnd(d){
    //if(selected==1){return;}
    d3.select(this).attr("opacity",1.0);   
    d.fx = null;
    d.fy = null;
    simulation.alphaTarget(0.1); 
}

function selectStartLines(selector)
{
  
  if(selector == "startNode")
  {
    var text='';
    for(i=0;i<numStates-1;i++)
    {
      text = text + "#start"+i+",";
    }
    text = text + "#start"+(numStates-1);
  }
  return text;
}




function createTable(nrow,ncol,containerName,tableName,width,height,prefix,fontsize){
  var table = document.createElement("table");
  table.id = tableName;
  table.style.borderSpacing = 0;
  table.style.borderCollapse = "collapse";
  table.style.width=0.97*width;
  table.style.height = height;
  //table.style.margin = "0px 0px 0px 0px";
  //table.style.padding = "0px 0px 0px 0px ";
    //Adding rows
  for(var i =0;i<nrow;i++)
  {
    var row = table.insertRow(0);
    row.id = prefix+"row"+i;
  
  if(i%2==0){ row.style.background = "#F3EFEF";} //row color
  else{ row.style.background = "white"; }
  
  
    for(var j =0;j<ncol+1;j++)
    {
      var col = row.insertCell();
      col.innerHTML = prefix+"Cell "+i+" "+j;
      col.id = prefix+"Cell "+i+" "+j;
    col.align="center";
    col.style.width=80;
    }
  }
  
  // Adding header
  var row = table.insertRow(0);
  row.style.background ="black";
  for(j=0;j<ncol+1;j++)
  {
  var col = row.insertCell();
      col.innerHTML = prefix+"Head "+i+" "+j;
      col.id = prefix+"Head "+i+" "+j;
    col.align="center";
    col.style.width=80;
    col.style.color  = "white";
    col.style.borderRight="1px white solid";
  }
  col.style.borderRight = "0px white solid";
  
  var divbox = document.getElementById(containerName);
  divbox.appendChild(table);
  
  fillData("seqTable",emissionMat);
}

function createTable2(nrow,ncol,containerName,tableName,width,height,prefix,data,fontsize){
  var table = document.createElement("table");
  table.id = tableName;
 // table.style.borderSpacing = 20;
  table.style.borderCollapse = "collapse";
  table.style.width=width;
  table.style.height = height;
  table.style.margin = "20px 20px 60px 20px";
  table.style.padding = "0px 30px 0px 0px ";
    //Adding rows
  for(var i =0;i<nrow;i++)
  {
    var row = table.insertRow(0);
    row.id = prefix+"row"+i;
  
  if(i%2==0){ row.style.background = "#F3EFEF";} //row color
  else{ row.style.background = "white"; }
  
  
    for(var j =0;j<ncol+1;j++)
    {
      var col = row.insertCell();
      col.innerHTML = 0.0;
      col.id = prefix+"Cell "+i+" "+j;
    col.align="center";
  col.style.fontSize = fontsize;
    col.style.width=80;
    }
  }
  
  // Adding header
  var row = table.insertRow(0);
  row.style.background ="black";
  for(j=0;j<ncol+1;j++)
  {
  var col = row.insertCell();
      col.innerHTML = '';
      col.id = prefix+"Head "+i+" "+j;
    col.align="center";
    col.style.width=80;
  col.style.fontSize = fontsize;
    col.style.color  = "white";
    col.style.borderRight="1px white solid";
  }
  col.style.borderRight = "0px white solid";
  
  
  var divbox = document.getElementById(containerName);
  divbox.appendChild(table);
  
  fillData(tableName,data);
}

function fillData(tableName,data){
  if(tableName=="emissionTable")
  {
    //obs names
    for(i=1;i<numObs+1;i++)
    {
      document.getElementById("emHead "+numStates+" "+i).innerHTML = "O"+obsData[i-1].id;
    }
    
    //state names
    for(i=1;i<numStates+1;i++)
    {
      document.getElementById("emCell "+(numStates-i)+" "+0).innerHTML = "S"+stateData[i-1].id;
    }
    
    //prob values
    for(i=1;i<numStates+1;i++)
    {
      for(j=1;j<numObs+1;j++)
      {
        document.getElementById("emCell "+(numStates-i)+" "+j).innerHTML = data[i-1][j-1].toPrecision(3);
        document.getElementById("emCell "+(numStates-i)+" "+j).id = "emTable"+(i-1)+""+(j-1);
      }
    }
  }else if(tableName=="transitionTable")
  {
  
    //obs names
    for(i=1;i<numStates+1;i++)
    {
      document.getElementById("transHead "+numStates+" "+i).innerHTML = "S"+stateData[i-1].id;
    }
    
    //state names
    for(i=1;i<numStates+1;i++)
    {
      document.getElementById("transCell "+(numStates-i)+" "+0).innerHTML = "S"+stateData[i-1].id;
    }
    
    //prob values
    for(i=1;i<numStates+1;i++)
    {
      for(j=1;j<numStates+1;j++)
      {
        document.getElementById("transCell "+(numStates-i)+" "+j).innerHTML = data[i-1][j-1].toPrecision(3);
        document.getElementById("transCell "+(numStates-i)+" "+j).id = "transTable"+(i-1)+""+(j-1);
      }
    }
  }else
  {
    var seqTable = document.getElementById("seqTable");
    for(i=1;i<obsLength+1;i++)
    {
      seqTable.rows[0].cells[i].innerHTML = "O"+obsSeq[i-1];
    }
    
    //state names
    for(i=1;i<numStates+1;i++)
    {
      seqTable.rows[i].cells[0].innerHTML = "S"+stateData[i-1].id;
    }
    
    //prob values
    for(i=1;i<numStates+1;i++)
    {
      for(j=1;j<obsLength+1;j++)
      {
        seqTable.rows[i].cells[j].innerHTML = 0.0;
      }
    }
  }
}

function cleanTable(tableID,prefix){
  var table = document.getElementById(tableID),
    nrow = table.rows.length;
  
  document.getElementById(prefix+"Head "+ (nrow-1) + " 0").style.background="white";
  document.getElementById(prefix+"Head "+ (nrow-1) + " 0").innerHTML="";
  
  for(i=0;i<nrow-1;i++)
  {
    var cell = document.getElementById(prefix+"Cell "+i+" 0");
    cell.style.color = "white";
    cell.style.background = "black";
    cell.style.borderBottom  = "1px white solid";
  }
  cell.style.borderTop  = "0px white solid";
}

function getCenter2(selector){
  var startPos = plotWidth*0.1;
  
  if(selector=="states")
  {
     var space = 0.8*plotWidth/(numStates+1);
     for(i=0;i<numStates;i++)
     {
      stateData[i].x = startPos + (i+1)*space;
      stateData[i].y = header.node().getBBox().height + stateHeight*plotHeight;
     }
  }else if(selector=="obs")
  {
    var space = 0.8*plotWidth/(numObs+1);
     for(i=0;i<numObs;i++)
     {
      obsData[i].x = startPos + (i+1)*space;
      obsData[i].y = header.node().getBBox().height + obsHeight*plotHeight;
     }
  }else
  {
  var space = 0.8*plotWidth/(2);
  startData[0].x  = startPos + space;
  startData[0].y  = header.node().getBBox().height + startHeight*plotHeight;
  }
}

function getCenter3()
{
	var spaceWidth = 0.9*plotWidth,
		spaceHeight = 0.9*plotHeight,
		startLeft = 0.05*plotWidth,
		startTop = 0.05*plotHeight,
		spaceLeft = spaceWidth/(obsLength+1),
		spaceTop = spaceHeight/(numStates+1);
		
	for(i=0;i<numStates*obsLength;i++)
	{
		id = nodeData[i].id;
		leftVar = (id-(id%numStates))/numStates;
		topVar = id%numStates;
		console.log(id);
		//console.log(leftVar);
		//console.log(topVar);
		
		nodeData[i].x = startLeft + (leftVar+1)*spaceLeft;
		nodeData[i].y = startTop + (topVar+1)*spaceTop;
    nodeData[i].staticx = startLeft + (leftVar+1)*spaceLeft;
    nodeData[i].staticy = startTop + (topVar+1)*spaceTop;
	
	}


}

function selectTextGen(id)
  {
    if(id.indexOf("state")!=-1)
    {
    //State node
    var text='',
        stateID = id[5];
    for(i=0;i<numStates;i++)
    {
      text = text + "#state"+stateID+i+",";
    }
    for(i=0;i<numObs;i++)
    {
      text = text + "#obs"+stateID+i+",";
    }
    text = text + "#start"+stateID;
    return text;
    }else
    {
    //Obs node
    }
}


function playAnimation()
{

  stepMode=0;
  if(animationOn==0)
  {
    d3.select("#playButton").attr("src","pause1.png");
    internalClock.restart(tickFn,1000*animationSpeed);
    animationOn=1;
  }else
  {
    d3.select("#playButton").attr("src","play1.png");
    internalClock.stop();
    animationOn=0;
  }
}

function resetPlot()
{
  internalClock.stop();
  d3.select("#playButton").attr("src","play1.png");


  if(currCol==1)
  {
    
    seqTable.rows[currRow].cells[currCol].bgColor=(currRow%2!=0)?"#F3EFEF":"white";
    emissionTable.rows[currRow].cells[obsSeq[currCol-1]+1].bgColor = (currRow%2!=0)?"#F3EFEF":"white";
    resetSelections();
  }else
  {
    transitionTable.rows[currInnerRow].cells[currRow].bgColor=(currInnerRow%2!=0)?"#F3EFEF":"white";
    emissionTable.rows[currRow].cells[obsSeq[currCol-1]+1].bgColor = (currRow%2!=0)?"#F3EFEF":"white";
    seqTable.rows[currInnerRow].cells[currCol-1].bgColor=(currInnerRow%2!=0)?"#F3EFEF":"white";
    seqTable.rows[currRow].cells[currCol].bgColor=(currRow%2!=0)?"#F3EFEF":"white";
    resetSelections();

  }
  if(finalMaxValState!=-1)
  {
    highlightSol(finalMaxValState,1);  
    finalMaxValState = -1;
  }
  

  for(i=0;i<numStates*obsLength;i++)
  {
    nodeData[i].bestPred=-1;
    nodeData[i].bestPredValue =0.0;
    nodeData[i].selected =0;
  }

  for(i=1;i<=numStates;i++)
  {
    for(j=1;j<=obsLength;j++)
    {
      seqTable.rows[i].cells[j].innerHTML = '0';
    }
  }


  seqSelect=0;
  seqSelect2=0;
  currRow=1;
  currCol=1;
  currInnerRow=1;

}

function stepForward()
{
  
  stepMode = 1;
  internalClock.restart(tickFn,2000*animationSpeed);
 
}



function createSlider(min,max)
{
  var sliderWidth = 0.6*summaryWidth

  var speedScale = d3.scaleLinear()
                .domain([0,sliderWidth])
                .range([1,0.001]);

  footer.append("rect").attr("x",0.22*summaryWidth).attr("y",0.2*footerElement.height)
        .attr("width",sliderWidth).attr("height",5).attr("id","sliderBar").attr("fill","#f0f0f0").attr("stroke","#ccc");
  
  

  footer.append("circle").attr("cx",0.5*summaryWidth).attr("cy",0.2*footerElement.height + 0.5*document.getElementById("sliderBar").getBoundingClientRect().height)
        .attr("r",7).attr("fill","gray").attr("stroke","black").attr("stroke-width",0.3)
        .call(d3.drag()
                .on("start",function()
                {
                  d3.select(this).attr("fill","orange").attr("stroke","black").attr("stroke-width",1.0);

                })
                .on("drag",function()
                {
                  var coords = d3.mouse(this);


    
                  if(coords[0]>= 0.2*summaryWidth & coords[0]<= (0.2*summaryWidth+sliderWidth) )
                  {
                    sliderOutput = speedScale(coords[0]-0.2*summaryWidth);
                    animationSpeed = sliderOutput;
                    d3.select(this).attr("cx",coords[0]);  
                  }
                })
                .on("end", function()
                {
                    d3.select(this).attr("fill","gray").attr("stroke","#ccc").attr("stroke-width",0.3);

                }))
        .on("mouseenter",function()
          {
            d3.select(this).attr("fill","orange");
          })
        .on("mouseleave",function()
          {
            d3.select(this).attr("fill","gray");
          }); 

  animationSpeed = speedScale(0.5*sliderWidth);

  return;

}




function slideDragStart()
{
  d3.select(this).attr("fill","orange");

}

function slideDragged()
{
  var coords = d3.mouse(this)
  
  if(coords[0]>= 0.2*summaryWidth & coords[0]<= 0.8*summaryWidth )
  {
    d3.select(this).attr("cx",coords[0]);  
  }
  

}


function slideDragEnd()
{
  d3.select(this).attr("fill","gray");

}

function nextCell()
{

  if(currRow== numStates)
  {
    currRow = 1;
    if(currCol== obsLength)
    { 

      resetSelections();

      var maxVal = 0,maxValState=0;

      for(i=0;i<numStates;i++)
      {
        if( nodeData[(currCol-1)*numStates + i].bestPredValue>maxVal )
        {
          maxVal = nodeData[(currCol-1)*numStates + i].bestPredValue;
          maxValState = (currCol-1)*numStates + i;
        }
      }
      predecessor = nodeData[maxValState].bestPred;

      d3.select("#node"+maxValState).attr("fill","black");
      d3.select("#state_"+ predecessor+"_"+maxValState).attr("stroke","black").attr("stroke-width",3.0);
      nodeData[maxValState].selected=1;

      backTrack(predecessor);
      finalMaxValState = maxValState;

      currCol = 1;
      currRow = 1;
      internalClock.stop();
      console.log("stopped")

      d3.select("#playButton").attr("src","play1.png");
      d3.timeout(highlightSolUtil,1000); //highlighting the final solution

      }
    else if (currCol == 1)
    {  
      //reached last row of first column
      currCol +=1; 
      var maxVal = 0,maxValState=0;

      for(i=0;i<numStates;i++)
      {
        if(nodeData[i].bestPredValue>maxVal)
        {
          maxVal = nodeData[i].bestPredValue;
          maxValState = i;
        }
      }

      d3.select("#node"+maxValState).attr("fill","black");
      nodeData[maxValState].selected=1;
   
    }else
    {
      //reached last row of column
      
      resetSelections();

      var maxVal = 0,maxValState=0;

      for(i=0;i<numStates;i++)
      {
        if( nodeData[(currCol-1)*numStates + i].bestPredValue>maxVal )
        {
          maxVal = nodeData[(currCol-1)*numStates + i].bestPredValue;
          maxValState = (currCol-1)*numStates + i;
        }
      }
      predecessor = nodeData[maxValState].bestPred;

      d3.select("#node"+maxValState).attr("fill","black");
      d3.select("#state_"+ predecessor+"_"+maxValState).attr("stroke","black").attr("stroke-width",3.0);
      nodeData[maxValState].selected=1;
    
      backTrack(predecessor);
      currCol += 1;

    }
  }else
  {
    currRow += 1; 
  }

}

function highlightSolUtil()
{
  highlightSol(finalMaxValState,0);
}

function highlightSol(nodeID,remove)
{ 

  console.log(nodeID);
  predID = nodeData[nodeID].bestPred;
  col = (nodeID-(nodeID%numStates))/numStates;
  row = nodeID%numStates;


  if(col==0)
  {
    if(remove==0)
    {
      d3.select("#node"+nodeID).attr("stroke","orange").attr("fill","orange"); 
      seqTable.rows[row+1].cells[col+1].bgColor="orange";    
    }else
    {
      d3.select("#node"+nodeID).attr("stroke","black").attr("fill","white"); 
      seqTable.rows[row+1].cells[col+1].bgColor=(row%2==0)?"#F3EFEF":"white";
    }
    
  }else
  {
    if(remove==0)
    {
      d3.select("#node"+nodeID).attr("stroke","orange").attr("fill","orange");
      d3.select("#state_"+predID+"_"+nodeID).attr("stroke","orange");
      seqTable.rows[row+1].cells[col+1].bgColor="orange";    
      highlightSol(predID,remove);
    }else
    {
      d3.select("#node"+nodeID).attr("stroke","black").attr("fill","white");
      d3.select("#state_"+predID+"_"+nodeID).attr("stroke","black");
      seqTable.rows[row+1].cells[col+1].bgColor=(row%2==0)?"#F3EFEF":"white";    
      highlightSol(predID,remove);
    }
    
  }
}

function resetSelections()
{
  
  for(i=0;i<numStates*obsLength;i++){ nodeData[i].selected=0;}
  plot.selectAll("line").attr("stroke","black").attr("stroke-width",0.5);
  plot.selectAll("circle").attr("fill","white").attr("stroke","black").attr("stroke-width",3.0);
}

function backTrack(id)
{
  col = (id-(id%numStates))/numStates;

  if(col==0)
  {

    d3.select("#node"+id).attr("fill","black");
    nodeData[id].selected=1;
  
  }else
  {
    predecessor = nodeData[id].bestPred;

    d3.select("#node"+id).attr("fill","black");
    d3.select("#state_"+ predecessor+"_"+id).attr("stroke","black").attr("stroke-width",3.0);
    nodeData[id].selected=1;
    backTrack(predecessor);
  }
}

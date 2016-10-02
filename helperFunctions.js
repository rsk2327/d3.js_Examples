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
  var startPos = [stateData[d.source].x,stateData[d.source].y],
      endPos = [stateData[d.target].x,stateData[d.target].y];
  var dx = startPos[0]-endPos[0],
    dy = startPos[1]-endPos[1],
    dr = Math.sqrt(dx*dx + dy*dy);
  return "M" + startPos[0]+ "," + startPos[1]
       + "A" + dr + "," + dr + " 0 0,1 "
       + endPos[0] + "," + endPos[1];
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

function mouseSVGClick(d){
 
      plot.selectAll("path,circle,line").attr("opacity",1.0);
      selected = 0;
}

function mouseCircleClick(d){
    
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
    if(this.id.indexOf("state")!=-1)
    {
      var coords = [stateData[this.id[5]].x,stateData[this.id[5]].y];
      var name = stateData[this.id[5]].name;
      var output = "State : "+name;
      var length = 6*(output.length);
      
    }else
    {
      var coords  = [obsData[this.id[3]].x,obsData[this.id[3]].y];
      var name = obsData[this.id[3]].name;
      var output = "Obs : "+name;
      var length = 6*(output.length);
    }
    plot.append("rect").attr("x",coords[0]-length/2).attr("opacity",0.0).attr("fill","black").attr("id","tipRect").attr("width",length).attr("height",30).attr("y",coords[1]+20);
    plot.append("text").attr("x",coords[0]).attr("fill","white").attr("id","tipText").text(output).attr("y",coords[1]+40).attr("font-size",12).attr("text-anchor","middle");
    plot.select("#tipRect").transition().duration(200).attr("opacity",0.7);
}

function mouseoutCircle(){
    console.log("triggered");
    
    plot.selectAll("#tipRect,#tipText").remove();
    if(this.id.indexOf("state")!=-1)
    {
      d3.select(this).attr("stroke-width",3).attr("stroke","black").attr("fill","white");
      
      
    }else
    {
      d3.select(this).attr("fill","black");
    }
}

function dragStart_O(d){
    if(selected==1){return;}
    d3.select(this).attr("opacity",0.5);
}

function dragged_O(d){
    if(selected==1){return;}
    var coords = d3.mouse(this);
    obsData[d.id].x = coords[0];
    obsData[d.id].y = coords[1];
    d3.select(this).attr("cx",coords[0]).attr("cy",coords[1]);
    plot.selectAll("line").data(obsLinks).attr("x2",function(d){ return obsData[d.target].x ;}).attr("y2",function(d){ return obsData[d.target].y ;});
}

function dragEnd_O(d){
    if(selected==1){return;}
    d3.select(this).attr("opacity",1.0);    
}

function dragStart_S(d){
	
	
    if(selected==1){return;}
    d3.select(this).attr("opacity",0.5);
}

function dragged_S(d){
    if(selected==1){return;}
    var coords = d3.mouse(this);
    stateData[d.id].x = coords[0];
    stateData[d.id].y = coords[1];
    d3.select(this).attr("cx",coords[0]).attr("cy",coords[1]);
    plot.selectAll("path").data(stateLinks).attr("d",positionLink);
    plot.selectAll("line").data(obsLinks).attr("x1",function(d){ return stateData[d.source].x ;}).attr("y1",function(d){ return stateData[d.source].y ;});
}

function dragEnd_S(d){
    if(selected==1){return;}
    d3.select(this).attr("opacity",1.0);    
}  
  

function createTable(nrow,ncol,containerName,tableName,width,height,prefix,fontsize){
  var table = document.createElement("table");
  table.id = tableName;
  table.style.borderSpacing = 0;
  table.style.borderCollapse = "collapse";
  table.style.width=width;
  table.style.height = height;
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

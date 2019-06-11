jQuery.extend({highlight:function(node,re,nodeName,className){if(3===node.nodeType){var match=node.data.match(re);if(match){var highlight=document.createElement(nodeName||"span");highlight.className=className||"highlight";var wordNode=node.splitText(match.index);wordNode.splitText(match[0].length);var wordClone=wordNode.cloneNode(!0);return highlight.appendChild(wordClone),wordNode.parentNode.replaceChild(highlight,wordNode),1}}else if(1===node.nodeType&&node.childNodes&&!/(script|style)/i.test(node.tagName)&&(node.tagName!==nodeName.toUpperCase()||node.className!==className))for(var i=0;i<node.childNodes.length;i++)i+=jQuery.highlight(node.childNodes[i],re,nodeName,className);return 0}}),jQuery.fn.unhighlight=function(options){var settings={className:"highlight",element:"span"};return jQuery.extend(settings,options),this.find(settings.element+"."+settings.className).each(function(){var parent=this.parentNode;parent.replaceChild(this.firstChild,this),parent.normalize()}).end()},jQuery.fn.highlight=function(words,options){var settings={className:"highlight",element:"span",caseSensitive:!1,wordsOnly:!1};if(jQuery.extend(settings,options),words.constructor===String&&(words=[words]),words=jQuery.grep(words,function(word,i){return""!=word}),words=jQuery.map(words,function(word,i){return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&")}),0==words.length)return this;var flag=settings.caseSensitive?"":"i",pattern="("+words.join("|")+")";settings.wordsOnly&&(pattern="\\b"+pattern+"\\b");var re=new RegExp(pattern,flag);return this.each(function(){jQuery.highlight(this,re,settings.element,settings.className)})},function(){"use strict";angular.module("ui.grid.draggable-rows",["ui.grid"]).constant("uiGridDraggableRowsConstants",{featureName:"draggableRows",ROW_OVER_CLASS:"ui-grid-draggable-row-over",ROW_OVER_ABOVE_CLASS:"ui-grid-draggable-row-over--above",ROW_OVER_BELOW_CLASS:"ui-grid-draggable-row-over--below",POSITION_ABOVE:"above",POSITION_BELOW:"below",publicEvents:{draggableRows:{rowDragged:function(scope,info,rowElement){},rowDropped:function(scope,info,targetElement){},rowOverRow:function(scope,info,rowElement){},rowEnterRow:function(scope,info,rowElement){},rowLeavesRow:function(scope,info,rowElement){},rowFinishDrag:function(scope){}}}}).factory("uiGridDraggableRowsCommon",[function(){return{draggedRow:null,draggedRowEntity:null,position:null,fromIndex:null,toIndex:null}}]).service("uiGridDraggableRowsService",["uiGridDraggableRowsConstants",function(uiGridDraggableRowsConstants){this.initializeGrid=function(grid,$scope,$element){grid.api.registerEventsFromObject(uiGridDraggableRowsConstants.publicEvents),grid.api.draggableRows.on.rowFinishDrag($scope,function(){angular.forEach($element[0].querySelectorAll("."+uiGridDraggableRowsConstants.ROW_OVER_CLASS),function(row){row.classList.remove(uiGridDraggableRowsConstants.ROW_OVER_CLASS),row.classList.remove(uiGridDraggableRowsConstants.ROW_OVER_ABOVE_CLASS),row.classList.remove(uiGridDraggableRowsConstants.ROW_OVER_BELOW_CLASS)})})}}]).service("uiGridDraggableRowService",["uiGridDraggableRowsConstants","uiGridDraggableRowsCommon","$parse",function(uiGridDraggableRowsConstants,uiGridDraggableRowsCommon,$parse){var move=function(from,to){this.splice(to,0,this.splice(from,1)[0])};this.prepareDraggableRow=function($scope,$element){var grid=$scope.grid,row=$element[0],data=function(){return angular.isString(grid.options.data)?$parse(grid.options.data)(grid.appScope):grid.options.data},listeners={onDragOverEventListener:function(e){e.preventDefault&&e.preventDefault();var dataTransfer=e.dataTransfer||e.originalEvent.dataTransfer;dataTransfer.effectAllowed="copyMove",dataTransfer.dropEffect="move";var offset=e.offsetY||e.layerY||(e.originalEvent?e.originalEvent.offsetY:0);offset<this.offsetHeight/2?(uiGridDraggableRowsCommon.position=uiGridDraggableRowsConstants.POSITION_ABOVE,$element.removeClass(uiGridDraggableRowsConstants.ROW_OVER_BELOW_CLASS),$element.addClass(uiGridDraggableRowsConstants.ROW_OVER_ABOVE_CLASS)):(uiGridDraggableRowsCommon.position=uiGridDraggableRowsConstants.POSITION_BELOW,$element.removeClass(uiGridDraggableRowsConstants.ROW_OVER_ABOVE_CLASS),$element.addClass(uiGridDraggableRowsConstants.ROW_OVER_BELOW_CLASS)),grid.api.draggableRows.raise.rowOverRow(uiGridDraggableRowsCommon,this)},onDragStartEventListener:function(e){e.dataTransfer.setData("Text","move"),uiGridDraggableRowsCommon.draggedRow=this,uiGridDraggableRowsCommon.draggedRowEntity=$scope.$parent.$parent.row.entity,uiGridDraggableRowsCommon.position=null,uiGridDraggableRowsCommon.fromIndex=data().indexOf(uiGridDraggableRowsCommon.draggedRowEntity),uiGridDraggableRowsCommon.toIndex=null,grid.api.draggableRows.raise.rowDragged(uiGridDraggableRowsCommon,this)},onDragLeaveEventListener:function(e){grid.api.draggableRows.raise.rowLeavesRow(uiGridDraggableRowsCommon,this)},onDragEnterEventListener:function(e){e.offsetY||e.layerY||(e.originalEvent?e.originalEvent.offsetY:0);$("."+uiGridDraggableRowsConstants.ROW_OVER_CLASS).removeClass(uiGridDraggableRowsConstants.ROW_OVER_CLASS),$element.addClass(uiGridDraggableRowsConstants.ROW_OVER_CLASS),grid.api.draggableRows.raise.rowEnterRow(uiGridDraggableRowsCommon,this)},onDragEndEventListener:function(){grid.api.draggableRows.raise.rowFinishDrag()},onDropEventListener:function(e){var draggedRow=uiGridDraggableRowsCommon.draggedRow;return e.stopPropagation&&e.stopPropagation(),e.preventDefault&&e.preventDefault(),draggedRow!==this&&(uiGridDraggableRowsCommon.toIndex=data().indexOf($scope.$parent.$parent.row.entity),uiGridDraggableRowsCommon.position===uiGridDraggableRowsConstants.POSITION_ABOVE?uiGridDraggableRowsCommon.fromIndex<uiGridDraggableRowsCommon.toIndex&&(uiGridDraggableRowsCommon.toIndex-=1):uiGridDraggableRowsCommon.fromIndex>=uiGridDraggableRowsCommon.toIndex&&(uiGridDraggableRowsCommon.toIndex+=1),$scope.$apply(function(){move.apply(data(),[uiGridDraggableRowsCommon.fromIndex,uiGridDraggableRowsCommon.toIndex])}),grid.api.draggableRows.raise.rowDropped(uiGridDraggableRowsCommon,this),void e.preventDefault())}};row.addEventListener("dragover",listeners.onDragOverEventListener,!1),row.addEventListener("dragstart",listeners.onDragStartEventListener,!1),row.addEventListener("dragleave",listeners.onDragLeaveEventListener,!1),row.addEventListener("dragenter",listeners.onDragEnterEventListener,!1),row.addEventListener("dragend",listeners.onDragEndEventListener,!1),row.addEventListener("drop",listeners.onDropEventListener)}}]).directive("uiGridDraggableRow",["uiGridDraggableRowService",function(uiGridDraggableRowService){return{restrict:"ACE",scope:{grid:"="},compile:function(){return{pre:function($scope,$element){uiGridDraggableRowService.prepareDraggableRow($scope,$element)}}}}}]).directive("uiGridDraggableRows",["uiGridDraggableRowsService",function(uiGridDraggableRowsService){return{restrict:"A",replace:!0,priority:0,require:"uiGrid",scope:!1,compile:function(){return{pre:function($scope,$element,$attrs,uiGridCtrl){uiGridDraggableRowsService.initializeGrid(uiGridCtrl.grid,$scope,$element)}}}}}])}();
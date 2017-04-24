
fl.outputPanel.clear()

var dom = fl.getDocumentDOM();
var timeline = dom.getTimeline();

//var outputFolderLocation = fl.browseForFolderURL("Select a folder.");
var outputFolderLocation = 'file://Users/brentmcivor/Intrepica/brents_scripts/export-flash-to-spine/output'
          
var layersAr  = fl.getDocumentDOM().getTimeline().layers;
var backupAr = backupData();

for (var j = 0; j < layersAr.length; j++) {
	hideAllLayers();
	exportLayer(j);
}

resetAllLayers(backupAr);

function backupData(){
	var ar = []
	for (var i = 0; i < layersAr.length; i++) {
		var layer = layersAr[i]
		ar.push({
			layerType:layer.layerType,
			name:layer.name,
			guide:layer.guide,
			locked:layer.locked,
			visible:layer.visible,
		})
	}
	return ar;
}

function hideAllLayers() {
	for (var i = 0; i < layersAr.length; i++) {
		var layer = layersAr[i]	
		layer.visible = false
		layer.layerType = 'guide'
	}
}

function exportLayer(index){
	var backupLayer = backupAr[index]
	var curLayer = layersAr[index]

	if(backupLayer.visible &&
	 backupLayer.layerType !== 'mask' &&
	 backupLayer.layerType !== 'guide'){

		curLayer.visible = true
		curLayer.layerType = 'normal'
        curLayer.locked = false

		var frames = curLayer.frames
        var maxWidth = 0
        var maxHeight = 0
		for (var i = 0; i < frames.length; i++) {

            // Scrub forward to the next frame
            timeline.currentFrame = i
            dom.selectAll()

            // Find the widest and tallest frames for this layer
            for (var j = 0; j < dom.selection.length; j++) {
                var sel = dom.selection[j];
                maxWidth = sel.width > maxWidth ? sel.width : maxWidth
                maxHeight = sel.height > maxHeight ? sel.height : maxHeight
            }
		}

        for (var k = 0; k < frames.length; k++) {                
            // Scrub forward to the next frame
            timeline.currentFrame = k
            dom.selectAll()

            // It appears trying to group on a tween throws an error
            try {
                dom.group()
                dom.clipCopy()
                dom.ungroup()
            }catch (error) {
                dom.clipCopy()
            }                   

            // Create a new FLA document.
            fl.createDocument()
            var newDom = fl.getDocumentDOM()
            newDom.width = maxWidth
            newDom.height = maxHeight

            // Paste the artwork to the stage.
            newDom.clipPaste(true)
            newDom.setAlignToDocument(true)   

             // Align to the center of the stage.
            newDom.align("top", true);
            newDom.align("left", true);

            // Output the image.
            var formattedFrameNum = formatFrameNum(k, 4)
            var fileURI = outputFolderLocation + '/' + curLayer.name + formattedFrameNum + '.png'
            newDom.exportPNG(fileURI, true, true);

            // Close the temporary FLA without saving.
            newDom.close(false);
        }           
	}
}

function formatFrameNum(num, max) {
    var tmp = "" + num;
    while (tmp.length < max) {
        tmp = "0" + tmp;
    }
    return tmp;
};

function resetAllLayers(backupAr){
	for (var i = 0; i < backupAr.length; i++) {
		var backupLayer = backupAr[i]
		var curLayer = layersAr[i]

		curLayer.layerType = backupLayer.layerType
		curLayer.name = backupLayer.name
		curLayer.guide = backupLayer.guide
		curLayer.locked = backupLayer.locked
		curLayer.visible = backupLayer.visible
	}
}
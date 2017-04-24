/*
change Log
 
ver 2
    remove publish all frames.
    skip empty frame.   
    after publish, restore to original publish settings.
     
*/
 
//fl.outputPanel.clear();
 
var doc = fl.getDocumentDOM();
var baseName = doc.name.slice(0, -4); //remove ".fla" from filename
var tl = doc.getTimeline();
var maxFL = 0;
var oldXML = doc.exportPublishProfileString();
var myXML = new XML(doc.exportPublishProfileString()); //Get publish settings as XML
 
//Change PublishFormatProperties
myXML.PublishFormatProperties.flash = 0;
myXML.PublishFormatProperties.publishFormat.(@id == "BBC1F406-65F2-4219-9304-FA48C7549E44")[0] = 0; //SVG
myXML.PublishFormatProperties.publishFormat.(@id == "BBC1F806-66F2-4339-9306-FA48C7549E59")[0] = 0; //MacProjector
myXML.PublishFormatProperties.publishFormat.(@id == "BBC2F906-78F3-4239-9305-FA48C8549E59")[0] = 0; //WinPorjector
myXML.PublishFormatProperties.projectorWin = 0;
myXML.PublishFormatProperties.projectorMac = 0;
myXML.PublishFormatProperties.html = 0;
myXML.PublishFormatProperties.gif = 0;
myXML.PublishFormatProperties.jpeg = 0;
myXML.PublishFormatProperties.png = 1; //enable publish PNG
myXML.PublishFormatProperties.swc = 0;
myXML.PublishFormatProperties.oam = 0;
 
//Change defaultNames
myXML.PublishFormatProperties.defaultNames = 0;//disable default name
myXML.PublishFormatProperties.pngDefaultName = 0;
 
//Change PublishProperties
myXML.PublishPNGProperties.@enabled = true;
myXML.PublishPNGProperties.MatchMovieDim = 1;
myXML.PublishPNGProperties.Smooth = 1;
 
 
//excute functions
/*var changeMode = prompt("01:All Frames / 02:Key Frames", "01");
if (changeMode === "01"){
    publishAllFrames();
    doc.importPublishProfileString(oldXML);
}else if (changeMode === "02"){
    publishKeyFrames(); 
    doc.importPublishProfileString(oldXML);
};*/
publishKeyFrames(); 
doc.importPublishProfileString(oldXML);
 
 
//functions
function changeFileName(num){
    return baseName + "_output_" + ZeroFormat(num, (maxFL.toString().length)) + ".png"; 
};
 
function ZeroFormat(num, max) {
    var tmp = "" + num;
    while (tmp.length < max) {
        tmp = "0" + tmp;
    }
    return tmp;
};
 
/*function publishAllFrames() {
    maxFL = tl.frameCount;
    for (var i = 0; i < maxFL; i++) {
        tl.currentFrame = i;
        myXML.PublishFormatProperties.pngFileName = changeFileName(i);
        doc.importPublishProfileString(String(myXML));
        doc.publish();
    };
};*/
 
function publishKeyFrames(){
    var layers = tl.layers;
    var layNum = tl.getSelectedLayers();
    var srcLay = layers[layNum];
 
    if (srcLay.layerType === "folder"){
        for (var i = Number(layNum) + 1; i <= (tl.layerCount); i ++){
            srcLay = layers[i];
            if (srcLay.layerType !== "folder"){break;}
        };
    };
 
    var frames = srcLay.frames;
    maxFL = frames.length;
    var fNum = 0;       
    for(var i = 0; i < maxFL; i++){
        if(i == frames[i].startFrame && !(frames[i].isEmpty)){
            tl.currentFrame = i;
            var fileName = changeFileName(fNum);
            myXML.PublishFormatProperties.pngFileName = changeFileName(i);
            doc.importPublishProfileString(String(myXML));
            doc.publish();
            fNum ++;
        };
    };
};
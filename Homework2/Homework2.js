"use strict";

var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;

var instanceMatrix;

var modelViewMatrixLoc;

var eye;
const cameraAt = vec3(0.0, 0.0, 0.0);
const cameraUp = vec3(0.0, 1.0, 0.0);
var radius = 7; 
var theta2 = 0.4;              
var phi = 2.5;
var dr = 5.0 * Math.PI/180.0;

var flagAnimation = false;
var flagAnimation1 = false;
var flagAnimation2 = false;

var vertices = [

    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];

// SCENE -------------------------------------------
var groundId= 0;
var skyId = 1;

var groundHeight = 0.5;
var groundWidth = 40;
var skyHeight = 20.0;
var skyDepth = 0.5;
var skyWidth = 40;

var numNodesScene = 2;

var stackScene = [];

var figureScene = [];

for( var i=0; i<numNodesScene; i++) figureScene[i] = createNode(i, null, null, null, null);

// TREE -------------------------------------------
var barkId= 0;
var leavesId1 = 1;
var leavesId2 = 2;
var leavesId3 = 3;
var leavesId4 = 4;
var leavesId5 = 5;
var leavesId6 = 6;
var leavesId7 = 7;
var leavesId8 = 8;
var leavesId9 = 9;
var leavesId10 = 10;

var barkHeight = 13.0;
var barkWidth = 1.0;
var leavesHeight = 1.0;
var leavesWidth = 5.0;

var numNodesTree = 11;
var thetaTree = [0,-45,180];
var posT =[
    [-4.5, -10, -3.0],
    [-barkWidth, 0.8*barkHeight, 0],
    [barkWidth, 0.8*barkHeight, 0],
    [0.2*leavesWidth, leavesHeight, 0]
]
var stackTree = [];

var figureTree = [];

for( var i=0; i<numNodesTree; i++) figureTree[i] = createNode(i, null, null, null, null);

// BEAR -------------------------------------------
var torsoId = 0;
var headId  = 1;
var ear1Id = 2;
var ear2Id = 3;
var leftUpperArmId = 4;
var leftLowerArmId = 5;
var rightUpperArmId = 6;
var rightLowerArmId = 7;
var leftUpperLegId = 8;
var leftLowerLegId = 9;
var rightUpperLegId = 10;
var rightLowerLegId = 11;
var tailId = 12;
var head2Id = 13;
var torso2Id = 14;
var tail2Id = 16;


var torsoHeight = 5.0;
var torsoWidth = 3.0;
var upperArmHeight = 0.8;
var lowerArmHeight = 1.2;
var upperArmWidth  = 1.0;
var lowerArmWidth  = 1.0;
var upperLegWidth  = 1.2;
var lowerLegWidth  = 1.2;
var lowerLegHeight = 1.2;
var upperLegHeight = 0.8;
var headHeight = 1.8;
var headWidth = 2.2;
var tailHeight = 0.8;
var tailWidth = 1;
var earHeight = 0.3;
var earWidth = 0.8;

var numNodes = 14;
var numAngles = 16;
var angle = 0;

var theta = [40, 0, 0, 90, -90, 0, -90, 0, -90, 0, -90, 0, 0, -90, -90, 0];

var posB = [
    [14.0, -6, -18.0],                                 //torso
    [0.0, torsoHeight+0.5*headHeight, -0.2],           //head
    [1.05, 0.7*headHeight, -0.62*headHeight],         //ear1
    [1.05, 0.7*headHeight, 0.62*headHeight],           //ear2
    [-(0.35*torsoWidth), 0.9*torsoHeight, 0.5*torsoWidth],        //left up arm
    [0.0, upperArmHeight, 0.0],                        //left low arm
    [0.35*torsoWidth, 0.9*torsoHeight, 0.5*torsoWidth],          //right up arm
    [0.0, upperArmHeight, 0.0],                        //right low arm
    [-(0.32*torsoWidth), 0.8*upperLegHeight, 0.5*torsoWidth],    // left up leg
    [0.0, upperLegHeight, 0.0],                       //left low leg
    [0.32*torsoWidth, 0.8*upperLegHeight, 0.5*torsoWidth],       //right up leg
    [0.0, upperLegHeight, 0.0],                       //right low leg
    [0, -0.04*(torsoHeight+tailHeight), 0.0]
]

var stack = [];

var figure = [];

for( var i=0; i<numNodes; i++) figure[i] = createNode(i,null, null, null, null);

// TEXTURE -------------------------------------------
var texg, texs, text, texl, texb, texf, texe;

var texSizeleaf = 477;  //477 leaves   and  533leaf2        255leaf
var image_leaf = new Image();
image_leaf.src = "leaves.jpg"

var texSizebark = 900;  //max 900
var image_bark = new Image();
image_bark.src = "tronco.jpg"

var texSizeface = 155;  //548
var image_face = new Image();
image_face.src = "facebear.png"

var texSizeear = 47;  //548
var image_ear = new Image();
image_ear.src = "ear.jpg"

var texSizebear = 256;  // max 1200 bear 2      256 -1      682 bear3
var image_bear = new Image();
image_bear.src = "bear.jpg"

var texSizeground = 1229;  //  600 ground 410-2     1200 grass
var image_ground = new Image();
image_ground.src = "ground3.jpg"

var texSizesky = 2948;  // max 2948
var image_sky = new Image();
image_sky.src = "sky.jpg"

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

var textureArray = [];

//-------------------------------------------
var vBuffer;
var modelViewLoc;

var pointsArray = [];

//-------------------------------------------
function scale4(a, b, c) {
   var result = mat4();
   result[0] = a;
   result[5] = b;
   result[10] = c;
   return result;
}

//--------------------------------------------
function createNode(id, transform, render, sibling, child){
    var node = {
        id : id,
        transform: transform,
        render: render,
        sibling: sibling,
        child: child,
    }
    return node;
}

function initNodesScene(Id) {

    var m = mat4();

    switch(Id) {

    case groundId:
    m = translate(10.0, -10, -14.7);
    figureScene[groundId] = createNode(groundId, m, ground, null, skyId);
    break;

    case skyId:

    m = translate(0.0, groundHeight, -0.4*groundWidth);
    figureScene[skyId] = createNode(skyId, m, sky, null, null);
    break;
    }
}

function initNodesTree(Id) {

    var m = mat4();

    switch(Id) {

    case barkId:

    m = translate(posT[barkId][0], posT[barkId][1], posT[barkId][2]);
    m = mult(m, rotate(thetaTree[barkId], vec3(0,0,1)));
    figureTree[barkId] = createNode(barkId, m, bark, null, leavesId1);
    break;

    case leavesId1:

    m = translate(posT[leavesId1][0], posT[leavesId1][1], posT[leavesId1][2]);
    m = mult(m, rotate(thetaTree[leavesId1], vec3(0,0,1)));
    figureTree[leavesId1] = createNode(leavesId1, m, leaves, leavesId2, leavesId3);
    break;

    case leavesId2:

    m = translate(posT[leavesId2][0], posT[leavesId2][1], posT[leavesId2][2]);
    m = mult(m, rotate(thetaTree[leavesId2], vec3(0,1,0)));
    m = mult(m, rotate(thetaTree[leavesId1], vec3(0,0,1)));
    figureTree[leavesId2] = createNode(leavesId2, m, leaves, null, leavesId4);
    break;
    
    case leavesId3:

    m = translate(posT[leavesId3][0], posT[leavesId3][1], posT[leavesId3][2]);
    figureTree[leavesId3] = createNode(leavesId3, m, leaves, null, leavesId5);
    break;

    case leavesId4:

    m = translate(posT[leavesId3][0], posT[leavesId3][1], posT[leavesId3][2]);
    figureTree[leavesId4] = createNode(leavesId4, m, leaves, null, leavesId6);
    break;

    case leavesId5:

    m = translate(posT[leavesId3][0], posT[leavesId3][1], posT[leavesId3][2]);
    figureTree[leavesId5] = createNode(leavesId5, m, leaves, null, leavesId7);
    break;

    case leavesId6:

    m = translate(posT[leavesId3][0], posT[leavesId3][1], posT[leavesId3][2]);
    figureTree[leavesId6] = createNode(leavesId6, m, leaves, null, leavesId8);
    break;

    case leavesId7:

    m = translate(posT[leavesId3][0], posT[leavesId3][1], posT[leavesId3][2]);
    figureTree[leavesId7] = createNode(leavesId7, m, leaves, null, leavesId9);
    break;

    case leavesId8:

    m = translate(posT[leavesId3][0], posT[leavesId3][1], posT[leavesId3][2]);
    figureTree[leavesId8] = createNode(leavesId8, m, leaves, null, leavesId10);
    break;

    case leavesId9:

    m = translate(posT[leavesId3][0], posT[leavesId3][1], posT[leavesId3][2]);
    figureTree[leavesId9] = createNode(leavesId9, m, leaves, null, null);
    break;

    case leavesId10:

    m = translate(posT[leavesId3][0], posT[leavesId3][1], posT[leavesId3][2]);
    figureTree[leavesId10] = createNode(leavesId10, m, leaves, null, null);
    break;
    }
}

function initNodes(Id) {

    var m = mat4();

    switch(Id) {

    case torsoId:

    m = translate(posB[torsoId][0], posB[torsoId][1], posB[torsoId][2]); 
    m = mult(m, rotate(theta[torsoId], vec3(0, 1, 0) ));
    m = mult(m, rotate(theta[torso2Id], vec3(1, 0, 0)));
    figure[torsoId] = createNode(torsoId, m, torso, null, headId );
    break;

    case headId:
    case head2Id:

    m = translate(posB[headId][0], posB[headId][1], posB[headId][2]);
	m = mult(m, rotate(theta[headId], vec3(1, 0, 0)));
	m = mult(m, rotate(theta[head2Id], vec3(0, 1, 0)));
    m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
    figure[headId] = createNode(headId, m, head, leftUpperArmId, ear1Id);
    break;

    case ear1Id:
    m = translate(posB[ear1Id][0], posB[ear1Id][1], posB[ear1Id][2]);
    figure[ear1Id] = createNode(ear1Id, m, ear, ear2Id, null);
    break;

    case ear2Id:
    m = translate(posB[ear2Id][0], posB[ear2Id][1], posB[ear2Id][2]);
    m = mult(m, rotate(theta[ear2Id], vec3(0, 1, 0)));
    figure[ear2Id] = createNode(ear1Id, m, ear, null, null);
    break;

    case leftUpperArmId:

    m = translate(posB[leftUpperArmId][0], posB[leftUpperArmId][1], posB[leftUpperArmId][2]);
	m = mult(m, rotate(theta[leftUpperArmId], vec3(1, 0, 0)));
    figure[leftUpperArmId] = createNode(leftUpperArmId, m, upperArm, rightUpperArmId, leftLowerArmId );
    break;

        case leftLowerArmId:
        m = translate(posB[leftLowerArmId][0], posB[leftLowerArmId][1], posB[leftLowerArmId][2]);
        m = mult(m, rotate(theta[leftLowerArmId], vec3(1, 0, 0)));
        figure[leftLowerArmId] = createNode(leftLowerArmId, m, lowerArm, null, null );
        break;

    case rightUpperArmId:

    m = translate(posB[rightUpperArmId][0], posB[rightUpperArmId][1], posB[rightUpperArmId][2]);
	m = mult(m, rotate(theta[rightUpperArmId], vec3(1, 0, 0)));
    figure[rightUpperArmId] = createNode(rightUpperArmId, m, upperArm, leftUpperLegId, rightLowerArmId );
    break;

        case rightLowerArmId:
        m = translate(posB[rightLowerArmId][0], posB[rightLowerArmId][1], posB[rightLowerArmId][2]);
        m = mult(m, rotate(theta[rightLowerArmId], vec3(1, 0, 0)));
        figure[rightLowerArmId] = createNode(rightLowerArmId, m, lowerArm, null, null );
        break;

    case leftUpperLegId:

    m = translate(posB[leftUpperLegId][0], posB[leftUpperLegId][1], posB[leftUpperLegId][2]);
	m = mult(m , rotate(theta[leftUpperLegId], vec3(1, 0, 0)));
    figure[leftUpperLegId] = createNode(leftUpperLegId, m, upperLeg, rightUpperLegId, leftLowerLegId );
    break;

        case leftLowerLegId:
            m = translate(posB[leftLowerLegId][0], posB[leftLowerLegId][1], posB[leftLowerLegId][2]);
            m = mult(m, rotate(theta[leftLowerLegId], vec3(1, 0, 0)));
            figure[leftLowerLegId] = createNode(leftLowerLegId, m, lowerLeg, null, null );
            break;

    case rightUpperLegId:

    m = translate(posB[rightUpperLegId][0], posB[rightUpperLegId][1], posB[rightUpperLegId][2]);
	m = mult(m, rotate(theta[rightUpperLegId], vec3(1, 0, 0)));
    figure[rightUpperLegId] = createNode(rightUpperLegId, m, upperLeg, tailId, rightLowerLegId );
    break;

        case rightLowerLegId:

        m = translate(posB[rightLowerLegId][0], posB[rightLowerLegId][1], posB[rightLowerLegId][2]);
        m = mult(m, rotate(theta[rightLowerLegId], vec3(1, 0, 0)));
        figure[rightLowerLegId] = createNode(rightLowerLegId, m, lowerLeg, null, null );
        break;

    case tailId:
    case tail2Id:
   
    m = translate(posB[tailId][0], posB[tailId][1], posB[tailId][2]);
        m = mult(m, rotate(theta[tailId], vec3(1, 0, 0)));
        m = mult(m, rotate(theta[tail2Id], vec3(0, 1, 0)));
    m = mult(m, translate(0.0, -0.5*tailHeight, 0.0));
    figure[tailId] = createNode(tailId, m, tail, null, null );
    break;
    
    }
}

//--------------------------------------------
function traverseScene(Id) {

   if(Id == null) return;
   stackScene.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figureScene[Id].transform);
   figureScene[Id].render();
   if(figureScene[Id].child != null) traverseScene(figureScene[Id].child);
    modelViewMatrix = stackScene.pop();
   if(figureScene[Id].sibling != null) traverseScene(figureScene[Id].sibling);
}

function traverseTree(Id) {

    if(Id == null) return;
    stackTree.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, figureTree[Id].transform);
    figureTree[Id].render();
    if(figureTree[Id].child != null) traverseTree(figureTree[Id].child);
     modelViewMatrix = stackTree.pop();
    if(figureTree[Id].sibling != null) traverseTree(figureTree[Id].sibling);
 }

function traverse(Id) {

   if(Id == null) return;
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child);
   modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}

//--------------------------------------------
function ground(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*groundHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale( groundWidth, groundHeight, groundWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texg);
    gl.uniform1i(gl.getUniformLocation( program, "uTexture"), 0);
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function sky(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*skyHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale( skyWidth, skyHeight, skyDepth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texs);
    gl.uniform1i(gl.getUniformLocation( program, "uTexture"), 0);
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function bark(){
    instanceMatrix = mult(modelViewMatrix, translate(0, 0.5*barkHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale( barkWidth, barkHeight, barkWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, text);
    gl.uniform1i(gl.getUniformLocation( program, "uTexture"), 0);
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function leaves(){
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*leavesHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale( leavesWidth, leavesHeight, leavesWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texl);
    gl.uniform1i(gl.getUniformLocation( program, "uTexture"), 0);
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function torso() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torsoHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale( torsoWidth, torsoHeight, torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texb);
    gl.uniform1i(gl.getUniformLocation( program, "uTexture"), 0);
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function head() {

    instanceMatrix = mult(modelViewMatrix, translate(0, 0.5*headHeight,0.0));
    instanceMatrix = mult(instanceMatrix, scale(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    
    for(var i =0; i<6; i++){
        if(i==3){
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texf);
            gl.uniform1i(gl.getUniformLocation( program, "uTexture"), 0);
            gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
        }
        else{
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texb);
            gl.uniform1i(gl.getUniformLocation( program, "uTexture"), 0);
            gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
        }
    }
}
function ear() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*earHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale( earWidth, earHeight, earWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    for(var i =0; i<6; i++){
        if(i==3){
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texe);
            gl.uniform1i(gl.getUniformLocation( program, "uTexture"), 0);
            gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
        }
        else{
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texb);
            gl.uniform1i(gl.getUniformLocation( program, "uTexture"), 0);
            gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
        }
    }
}
function upperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texb);
    gl.uniform1i(gl.getUniformLocation( program, "uTexture"), 0);
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function lowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texb);
    gl.uniform1i(gl.getUniformLocation( program, "uTexture"), 0);
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function  upperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texb);
    gl.uniform1i(gl.getUniformLocation( program, "uTexture"), 0);
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function lowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * lowerLegHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texb);
    gl.uniform1i(gl.getUniformLocation( program, "uTexture"), 0);
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function tail() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * tailHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale(tailWidth, tailHeight, tailWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix) );
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texb);
    gl.uniform1i(gl.getUniformLocation( program, "uTexture"), 0);
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

//--------------------------------------------
function quad(a, b, c, d) {
     pointsArray.push(vertices[a]);
     textureArray.push(texCoord[0]);

     pointsArray.push(vertices[b]);
     textureArray.push(texCoord[1]);

     pointsArray.push(vertices[c]);
     textureArray.push(texCoord[2]);
     
     pointsArray.push(vertices[d]);
     textureArray.push(texCoord[3]);
}

function cube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

function interpolation(pos0,pos1,t0,t1,t) {
    return  pos0+((t-t0)/(t1-t0))*(pos1-pos0);
}

var tA = 0;
var tL = 0;
var tAB = 0;
var tLB = 0;
var tF=0;
var tR=0;
var tU = 0;
var tS = 0;
var stopScratch = 0;
var stopScratch2 = 0;
var tP = 0;
var tC = 0;
var speed = 1;

function moveArms(){
    if(tA>=0 && tA<=1){
        var rual1 = interpolation(-90, -70, 0, 1, tA);
        var rlal1 = interpolation(0, 15, 0, 1, tA);
        theta[leftUpperArmId]=rual1;
        theta[leftLowerArmId]=rlal1;

    }
    else if(tA>=1 && tA <=2){
        var rual2 = interpolation(-70, -90, 1, 2, tA);
        var rlal2 = interpolation(15, 0, 1, 2, tA);
        theta[leftUpperArmId]=rual2;
        theta[leftLowerArmId]=rlal2;

        var ruar1 = interpolation(-90, -70, 1, 2, tA);
        var rlar1 = interpolation(0, 15, 1, 2, tA);
        theta[rightUpperArmId]=ruar1;
        theta[rightLowerArmId]=rlar1;
    }
    else if(tA >= 2 && tA < 3){
        var ruar2 = interpolation(-70, -90, 2, 3, tA);
        var rlar2 = interpolation(15, 0, 2, 3, tA);
        theta[rightUpperArmId]=ruar2;
        theta[rightLowerArmId]=rlar2;

        theta[leftUpperArmId]=-90;
        theta[leftLowerArmId]=0;
    }
    else if(tA >= 3){
        tA =0;
    }
    if(tR >= 3){
        theta[leftUpperArmId]=-90;
        theta[leftLowerArmId]=0;
        theta[rightUpperArmId]=-90;
        theta[rightLowerArmId]=0;
    } 
    tA += 0.03 * speed;
}

function moveLegs(){
    if( tL>=0 && tL < 0.2){
        theta[rightUpperLegId]=-90;
        theta[rightLowerLegId]=0;
        theta[leftUpperLegId]=-90;
        theta[leftLowerLegId]=0;
    }
    else if( tL >= 0.2 && tL< 1.2){
        var rulr1 = interpolation(-90, -80, 0.2, 1.2, tL);
        var rllr1 = interpolation(0, -50, 0.2, 1.2, tL);
        theta[rightUpperLegId]=rulr1;
        theta[rightLowerLegId]=rllr1;
    }
    else if(tL>=1.2 && tL <2.2){
        var rulr2 = interpolation(-80, -90, 1.2, 2.2, tL);
        var rllr2 = interpolation(-50, 0, 1.2, 2.2, tL);
        theta[rightUpperLegId]=rulr2;
        theta[rightLowerLegId]=rllr2;

        var rull1 = interpolation(-90, -80, 1.2, 2.2, tL);
        var rlll1 = interpolation(0, -50, 1.2, 2.2, tL);
        theta[leftUpperLegId]=rull1;
        theta[leftLowerLegId]=rlll1;
    }
    else if(tL >= 2.2  && tL < 3.2 ){
        theta[rightUpperLegId]=-90;
        theta[leftLowerLegId]=0;

        var rull2 = interpolation(-80, -90, 2.2, 3.2, tL);
        var rlll2 = interpolation(-50, 0, 2.2, 3.2, tL);
        theta[leftUpperLegId]=rull2;
        theta[leftLowerLegId]=rlll2;
    }
    else if(tL >= 3.2){
        tL=0;
    }
    if(tR>=3){
        theta[rightUpperLegId]=-90;
        theta[rightLowerLegId]=0;
        theta[leftUpperLegId]=-90;
        theta[leftLowerLegId]=0;
    }
    tL += 0.03 * speed;       
}

function moveArmsBackward(){
    if(tAB>=0 && tAB<=1){
        var rual3 = interpolation(-90, -120, 0, 1, tAB);
        var rlal3 = interpolation(0, 15, 0, 1, tAB);
        theta[leftUpperArmId]=rual3;
        theta[leftLowerArmId]=rlal3;

    }
    else if(tAB>=1 && tAB <=2){
        var rual4 = interpolation(-120, -90, 1, 2, tAB);
        var rlal4 = interpolation(15, 0, 1, 2, tAB);
        theta[leftUpperArmId]=rual4;
        theta[leftLowerArmId]=rlal4;

        var ruar3 = interpolation(-90, -120, 1, 2, tAB);
        var rlar3 = interpolation(0, 15, 1, 2, tAB);
        theta[rightUpperArmId]=ruar3;
        theta[rightLowerArmId]=rlar3;
    }
    else if(tAB >= 2 && tAB < 3){
        var ruar4 = interpolation(-120, -90, 2, 3, tAB);
        var rlar4 = interpolation(15, 0, 2, 3, tAB);
        theta[rightUpperArmId]=ruar4;
        theta[rightLowerArmId]=rlar4;

        theta[leftUpperArmId]=-90;
        theta[leftLowerArmId]=0;
    }
    else if(tAB >= 3){
        tAB =0;
    }
    if(tR>=3){
        theta[leftUpperArmId]=-90;
        theta[leftLowerArmId]=0;
        theta[rightUpperArmId]=-90;
        theta[rightLowerArmId]=0;
    } 
    tAB += 0.03;
}
function moveLegBackward(){
    if( tLB>=0 && tLB < 0.2){
        theta[rightUpperLegId]=-90;
        theta[rightLowerLegId]=0;
        theta[leftUpperLegId]=-90;
        theta[leftLowerLegId]=0;
    }
    else if( tLB >= 0.2 && tLB< 1.2){
        var rulr3 = interpolation(-90, -110, 0.2, 1.2, tLB);
        var rllr3 = interpolation(0, -30, 0.2, 1.2, tLB);
        theta[rightUpperLegId]=rulr3;
        theta[rightLowerLegId]=rllr3;
    }
    else if(tLB>=1.2 && tLB <2.2){
        var rulr4 = interpolation(-110, -90, 1.2, 2.2, tLB);
        var rllr4 = interpolation(-30, 0, 1.2, 2.2, tLB);
        theta[rightUpperLegId]=rulr4;
        theta[rightLowerLegId]=rllr4;

        var rull3 = interpolation(-90, -110, 1.2, 2.2, tLB);
        var rlll3 = interpolation(0, -30, 1.2, 2.2, tLB);
        theta[leftUpperLegId]=rull3;
        theta[leftLowerLegId]=rlll3;
    }
    else if(tLB >= 2.2  && tLB < 3.2 ){
        theta[rightUpperLegId]=-90;
        theta[leftLowerLegId]=0;

        var rull4 = interpolation(-110, -90, 2.2, 3.2, tLB);
        var rlll4 = interpolation(-30, 0, 2.2, 3.2, tLB);
        theta[leftUpperLegId]=rull4;
        theta[leftLowerLegId]=rlll4;
    }
    else if(tLB >= 3.2){
        tLB=0;
    }
    if(tR>=3){
        theta[rightUpperLegId]=-90;
        theta[rightLowerLegId]=0;
        theta[leftUpperLegId]=-90;
        theta[leftLowerLegId]=0;
    }
    tLB += 0.03;       
}

function move_forward(){

    moveArms();
    moveLegs();

    var x= interpolation(14, -4.5+torsoWidth+headWidth, 0, 10, tF); 
    var z = interpolation(-18, -3, 0, 10, tF);
    posB[torsoId][0]=x;
    posB[torsoId][2]=z;
    if (tF>=10) { 
        posB[torsoId][0]= -4.5+torsoWidth+headWidth;
        posB[torsoId][2]= -3;
    }
    tF+=0.01 * speed;
}
function rotate_to_tree(){
    if(tF>=10){
        var rtorso = interpolation(40, -60, 0, 3, tR);
        theta[torsoId] = rtorso;
        var x2= interpolation(-4.5+torsoWidth+headWidth, -2.5, 0, 3, tR);
        posB[torsoId][0]=x2;
        if(tR>=3){            
            theta[torsoId] = -60;
            posB[torsoId][0]= -2.5;
        }
        tR+=0.007 * speed;
    }
}
function stand_up(){
    if(tR>=3){
        //scendi di posB[torsoId][1]-2*lowerLegHeight
        var head1 = interpolation(0, -90, 0, 1, tU);
        theta[headId] = head1;
        var upx = interpolation(-90, 0, 0, 1, tU);
        theta[torso2Id] = upx;
        var tdown = interpolation(-6, -8.4, 0, 1, tU);
        posB[torsoId][1] = tdown;
        var ldown = interpolation(-90, -180, 0, 1, tU);
        theta[leftUpperArmId] = ldown;
        theta[rightUpperArmId] = ldown;
        theta[rightUpperLegId] = ldown;
        theta[leftUpperLegId] = ldown;        
        if(tU >= 1){
            theta[headId] = -90;
            theta[torso2Id] = 0;
            posB[torsoId][1] = -8.4;
            theta[rightUpperLegId] = -180;
            theta[leftUpperLegId] = -180;
            theta[leftUpperArmId] = -180;
            theta[rightUpperArmId] = -180;
        }
        tU += 0.01 * speed;
    }
}

function scratch(){
    if(tU >= 1){
        if(tS>=0 && tS<= 0.5){
            var g1 = interpolation(-8.4, -8, 0, 0.5, tS);
            posB[torsoId][1] = g1;
            var paws = interpolation(0.64, 0.24, 0, 0.5, tS);
            posB[rightUpperLegId][1]= paws;
            posB[leftUpperLegId][1]= paws;
            var tr = interpolation(0, -3, 0, 0.5, tS);
            thetaTree[barkId] = tr;
        }
        else if(tS>=0.5 && tS <= 1){
            var g2 = interpolation(-8, -8.4, 0.5, 1, tS);
            posB[torsoId][1] = g2;
            var paws2 = interpolation(0.24, 0.64, 0.5, 1, tS);
            posB[rightUpperLegId][1]= paws2;
            posB[leftUpperLegId][1]= paws2;
            var tr = interpolation(-3, 0, 0.5, 1, tS);
            thetaTree[barkId] = tr;
        }
        else if(tS>=1){
            tS=0;
        }
        if(stopScratch <= 3.1 && stopScratch >= 3){
            thetaTree[barkId] = 0;
            
            if(confirm("Want to continue animation?")){
                flagAnimation2 = true;
            }
            else{
                flagAnimation1 = true;
            }
            stopScratch = 3.11;
        }
        else if(stopScratch >= 3.11 ){
            if(flagAnimation1){
                thetaTree[barkId] = 0;
                back_to_paws();
            }
            if(flagAnimation2){
            fall_tree();
            }
        }
        tS += 0.05 * speed;
        stopScratch += 0.01 * speed;
    }
}
function fall_tree(){
    if(tC>=0 && tC<= 0.5){
        var tr = interpolation(0, -3, 0, 0.5, tC);
        thetaTree[barkId] = tr;
    }
    else if(tC>=0.5 && tC<=1){
        tr = interpolation(-3, 0, 0.5, 1, tC);
        thetaTree[barkId] = tr;
    }
    else if(tC>=1 && tC <=1.5){
        tr = interpolation(0, -6, 1, 1.5, tC);
        thetaTree[barkId] = tr;
    }
    else if(tC>=1.5 && tC <= 2){
        tr = interpolation(-6, 0, 1.5, 2, tC);
        thetaTree[barkId] = tr;
    }
    else if(tC>=2){
        tC = 1;
    }
    if(stopScratch2 >= 6){
        back_to_paws();
        tr = interpolation(0, -90, 0, 1, tP);
        thetaTree[barkId] = tr;
        var tras = interpolation(-10, -9, 0, 1, tP);
        posT[barkId][1]=tras;
    }
    if(tP>=1){
        thetaTree[barkId] = -90;
        posT[barkId][1]=-9;
    }       
    
    tC += 0.05 * speed;
    stopScratch2 += 0.05 * speed;
}
function back_to_paws(){
        posB[torsoId][1] = -8.4;
        posB[rightUpperLegId][1]= 0.64;
        posB[leftUpperLegId][1]= 0.64;

        var head2 = interpolation(-90, 0, 0, 1, tP);
        theta[headId] = head2;
        var downx = interpolation(0, -90, 0, 1, tP);
        theta[torso2Id] = downx;
        var tback = interpolation(-8.4, -6, 0, 1, tP);
        posB[torsoId][1] = tback;
        var lback = interpolation(-180, -90, 0, 1, tP);
        theta[leftUpperArmId] = lback;
        theta[rightUpperArmId] = lback;
        theta[rightUpperLegId] = lback;
        theta[leftUpperLegId] = lback;
        if(tP >= 1){
            theta[headId] = 0;
            theta[torso2Id] = -90;
            posB[torsoId][1] = -6;
            theta[rightUpperLegId] = -90;
            theta[leftUpperLegId] = -90;
            theta[leftUpperArmId] = -90;
            theta[rightUpperArmId] = -90;
            if(flagAnimation1){
                flagAnimation1 = false;
            }
            else if(flagAnimation2){
                flagAnimation2 = false;
            }
            document.getElementById("animationButton").style.backgroundColor = "rgb(16, 30, 223)";
            document.getElementById("animationButton").innerHTML = "Animation";
            document.getElementById("animationButton").disabled = true;
            document.getElementById("animationButton").style.opacity = 0.5;
            document.getElementById("resetAnimationButton").innerHTML= "Reset";
            document.getElementById("speed").style.display = "none";
            document.getElementById("hide").style.display = "block";
            flagAnimation = false;
        }
        tP+=0.01 * speed;
}

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader");

    gl.useProgram( program);

    instanceMatrix = mat4();

    projectionMatrix = ortho(-10.0,10.0,-10.0, 10.0,-20.0,55.0);
    modelViewMatrix = mat4();

        gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix)  );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    cube();

    vBuffer = gl.createBuffer();

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( positionLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( positionLoc );

    //texture buffer
    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(textureArray), gl.STATIC_DRAW);

    var TextCoord = gl.getAttribLocation(program, "aTexCoord");
    gl.vertexAttribPointer(TextCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(TextCoord);

    //create all texture 
    texb = gl.createTexture();  //bear
    gl.bindTexture(gl.TEXTURE_2D, texb);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSizebear, texSizebear, 0, gl.RGBA, gl.UNSIGNED_BYTE, image_bear);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    texf = gl.createTexture();  //bear face
    gl.bindTexture(gl.TEXTURE_2D, texf);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSizeface, texSizeface, 0, gl.RGBA, gl.UNSIGNED_BYTE, image_face);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    texe = gl.createTexture();  //bear ear
    gl.bindTexture(gl.TEXTURE_2D, texe);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSizeear, texSizeear, 0, gl.RGBA, gl.UNSIGNED_BYTE, image_ear);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    texl = gl.createTexture();  //leaves
    gl.bindTexture(gl.TEXTURE_2D, texl);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSizeleaf, texSizeleaf, 0, gl.RGBA, gl.UNSIGNED_BYTE, image_leaf);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    text = gl.createTexture();  //bark
    gl.bindTexture(gl.TEXTURE_2D, text);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSizebark, texSizebark, 0, gl.RGBA, gl.UNSIGNED_BYTE, image_bark);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    texg = gl.createTexture();  //ground
    gl.bindTexture(gl.TEXTURE_2D, texg);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSizeground, texSizeground, 0, gl.RGBA, gl.UNSIGNED_BYTE, image_ground);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    texs = gl.createTexture();  //sky
    gl.bindTexture(gl.TEXTURE_2D, texs);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, texSizesky, texSizesky, 0, gl.RGBA, gl.UNSIGNED_BYTE, image_sky);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    
    buttons();

    for(i=0; i<numNodesScene; i++) initNodesScene(i);    
    
    render();
}


var render = function() {
    
    gl.clear( gl.COLOR_BUFFER_BIT );

    eye = vec3(radius*Math.sin(theta2)*Math.cos(phi), radius*Math.sin(theta2)*Math.sin(phi), radius*Math.cos(theta2));
    modelViewMatrix = lookAt(eye, cameraAt, cameraUp);
    
    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix)  );
    
    for(i=0; i<numNodesTree; i++) initNodesTree(i);
    for(i=0; i<numNodes; i++) initNodes(i);
    
    if(flagAnimation){
        move_forward();
        rotate_to_tree();
        stand_up();
        scratch();
    }
    
    traverseScene(groundId);
    traverseTree(barkId);
    traverse(torsoId);
 
    requestAnimationFrame(render);    
}

function buttons(){
    document.getElementById("slider1").onchange = function(event) {
        theta[headId] = event.target.value;
        initNodes(headId);
    };

    document.getElementById("slider2").onchange = function(event) {
        theta[leftUpperArmId] = event.target.value;
        initNodes(leftUpperArmId);
    };
    document.getElementById("slider3").onchange = function(event) {
        theta[leftLowerArmId] =  event.target.value;
        initNodes(leftLowerArmId);
    };

    document.getElementById("slider4").onchange = function(event) {
        theta[rightUpperArmId] = event.target.value;
        initNodes(rightUpperArmId);
    };
    document.getElementById("slider5").onchange = function(event) {
        theta[rightLowerArmId] =  event.target.value;
        initNodes(rightLowerArmId);
    };
    document.getElementById("slider6").onchange = function(event) {
        theta[leftUpperLegId] = event.target.value;
        initNodes(leftUpperLegId);
    };
    document.getElementById("slider7").onchange = function(event) {
        theta[leftLowerLegId] = event.target.value;
        initNodes(leftLowerLegId);
    };
    document.getElementById("slider8").onchange = function(event) {
        theta[rightUpperLegId] =  event.target.value;
        initNodes(rightUpperLegId);
    };
    document.getElementById("slider9").onchange = function(event) {
        theta[rightLowerLegId] = event.target.value;
        initNodes(rightLowerLegId);
    };
    document.getElementById("slider10").onchange = function(event) {
        theta[head2Id] = event.target.value;
        initNodes(head2Id);
    };
    document.getElementById("slider11").onchange = function(event) {
        theta[tailId] = event.target.value;
        initNodes(tailId);
    };
    document.getElementById("slider12").onchange = function(event) {
        theta[tail2Id] = event.target.value;
        initNodes(tail2Id);
    };
    document.getElementById( "Theta" ).oninput = function () {
        theta2 = this.value;
    };
    document.getElementById( "Phi" ).oninput = function () {
        phi = this.value;
    };
    document.getElementById( "animationButton" ).onclick = function () {  
        flagAnimation = !flagAnimation;
        var x = document.getElementById("hide");
        var s = document.getElementById("speed");
        if(flagAnimation == false){
            this.style.backgroundColor = "rgb(16, 30, 223)";
            this.innerHTML = "Animation";
            document.getElementById("resetAnimationButton").innerHTML= "Reset";

            if (x.style.display == "none") {
                x.style.display = "block";
            }
            s.style.display = "none";
        }
        else{
            this.style.backgroundColor = "red";
            this.innerHTML = "Stop";            
            document.getElementById("resetAnimationButton").innerHTML= "Restart";
            
            if (x.style.display == "block") {
                x.style.display = "none";
            }            
            s.style.display = "block";
            document.getElementById("speed").disabled = false;
            document.getElementById("speed").style.opacity = 1;
        }                
    };
    document.getElementById( "speed" ).onclick = function () {
        if(speed == 1){
            speed = 2;
            this.style.backgroundColor ="red";
            this.innerHTML = "speed x1";
        }
        else{
            speed = 1;
            this.style.backgroundColor = "rgb(16, 30, 223)";
            this.innerHTML = "speed x2";
        }
    }
    document.getElementById( "resetAnimationButton" ).onclick = function () {
        theta = [40, 0, 0, 90, -90, 0, -90, 0, -90, 0, -90, 0, 0, -90, -90, 0, 0];

        posB = [
            [14.0, -6, -18.0],                                 //torso
            [0.0, torsoHeight+0.5*headHeight, -0.2],           //head
            [1.05, 0.7*headHeight, -0.62*headHeight],         //ear1
            [1.05, 0.7*headHeight, 0.62*headHeight],           //ear2
            [-(0.35*torsoWidth), 0.9*torsoHeight, 0.5*torsoWidth],        //left up arm
            [0.0, upperArmHeight, 0.0],                        //left low arm
            [0.35*torsoWidth, 0.9*torsoHeight, 0.5*torsoWidth],          //right up arm
            [0.0, upperArmHeight, 0.0],                        //right low arm
            [-(0.32*torsoWidth), 0.8*upperLegHeight, 0.5*torsoWidth],    // left up leg
            [0.0, upperLegHeight, 0.0],                       //left low leg
            [0.32*torsoWidth, 0.8*upperLegHeight, 0.5*torsoWidth],       //right up leg
            [0.0, upperLegHeight, 0.0],                       //right low leg
            [0, -0.04*(torsoHeight+tailHeight), 0.0]
        ]
        tA = 0;
        tL = 0;
        tAB = 0;
        tLB = 0;
        tF= 0;
        tR = 0;
        tU = 0;
        tS = 0;
        stopScratch = 0;
        tP=0;
        tC = 0;
        stopScratch2 = 0;
        
        thetaTree=[0,-45,180];
        posT =[
            [-4.5, -10, -3.0],
            [-barkWidth, 0.8*barkHeight, 0],
            [barkWidth, 0.8*barkHeight, 0],
            [0.2*leavesWidth, leavesHeight, 0]
        ]
        if(flagAnimation==false && flagAnimation2 == false && flagAnimation== false){
            document.getElementById("animationButton").disabled = false;
            document.getElementById("animationButton").style.opacity = 1;
        }
        speed = 1;
        document.getElementById("speed").style.backgroundColor = "rgb(16, 30, 223)";
        document.getElementById("speed").innerHTML = "speed x2";
    }
}
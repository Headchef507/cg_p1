var canvas;
var gl;

var locColor;

var score = 0;


var end = 0.89;

var dirEdge = -0.1;
var dirSides = 0.1;
// Núverandi staðsetning miðju ferningsins
var box0 = vec2( 0.0, 0.0 );
var box = vec2( 0.0, 0.0 );
var box2 = vec2( 0.0, 0.0 );
var boxC = vec2( -0.9, 0.0 );

var box3 = vec2( 0.0, 0.0 );

// Stefna (og hraði) fernings

var dX0;
var dX;
var dX2;
var dXC;
var dX3;
var dY;

// Svæðið er frá -maxX til maxX og -maxY til maxY
var maxX = 1.0;
var maxY = 1.0;

// Hálf breidd/hæð ferningsins
var boxRad = 0.05;
var boxRad2 = 0.05;



var road0 = [ vec2( 1, -0.5), vec2( -1, -0.5 ), vec2( 1, 0.5 ), vec2( -1, 0.5 ) ];

var line0 = [ vec2( 1, -0.15), vec2( -1, -0.15 ), vec2( 1, -0.14 ), vec2( -1, -0.14 ) ];
var line1 = [ vec2( 1, 0.1), vec2( -1, 0.1 ), vec2( 1, 0.11 ), vec2( -1, 0.11 ) ]; 

var colorA = vec4(0.0, 0.0, 0.0, 0.8);

var colorB0 = vec4(1.0, 0.0, 1.0, 1.0);
var colorB1 = vec4(0.0, 1.0, 1.0, 1.0);
var colorB2 = vec4(1.0, 1.0, 0.0, 1.0);
var colorB3 = vec4(0.0, 0.0, 1.0, 1.0);


var colorGreen = vec4(0.0, 1.0, 0.0, 1.0);

var colorWhite = vec4(0.0, 0.0, 0.0, 0.0);

var vertices0 = new Float32Array([-0.05, 0.2, 0.05, 0.2, 0.05, 0.3, -0.05, 0.3]);
var vertices1 = new Float32Array([-0.05, -0.05, 0.05, -0.05, 0.05, 0.05, -0.05, 0.05]);
var vertices2 = new Float32Array([-0.05, -0.3, 0.05, -0.3, 0.05, -0.2, -0.05, -0.2]);
var vertices3 = new Float32Array([-0.05, -0.3, 0.05, -0.3, 0.05, -0.2, -0.05, -0.2]);
var bufferId;
var bufferIdX;
var bufferIdA;
var bufferIdB;
var bufferIdC;
var vPosition;
var iPosition;


var bufferIdEx;
var bufferIdLine0;
var bufferIdLine1;

var vertices = [
    vec2( 0.0, -0.8 ),
    vec2( -0.1, -0.9 ),
    vec2(  0.1, -0.9 )
];

var originalTrianglePos = [
    vec2( 0.0, -0.8 ),
    vec2( -0.1, -0.9 ),
    vec2(  0.1, -0.9 )
];



window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 0.5 );

    dX0 = 0.007;
    dX = 0.01;
    dX2 = 0.005;
    dXC = 0.005;
    dX3 = 0.0;
    dY = 0.0;

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    
    // Load the data into the GPU
    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW );

    bufferIdEx = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdEx );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(road0), gl.STATIC_DRAW );
    
    bufferIdLine0 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdLine0 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(line0), gl.STATIC_DRAW );

    bufferIdLine1 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdLine1 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(line1), gl.STATIC_DRAW );

    

    bufferIdX = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdX );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices0), gl.DYNAMIC_DRAW );

    bufferIdA = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdA );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices1), gl.DYNAMIC_DRAW );

    bufferIdB = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdB );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices2), gl.DYNAMIC_DRAW );
    

    bufferIdC = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdC );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices3), gl.DYNAMIC_DRAW );


    locColor = gl.getUniformLocation( program, "rcolor" );
    vPosition = gl.getAttribLocation( program, "vPosition" );
    locBox = gl.getUniformLocation( program, "boxPos" );

    // Event listener for keyboard
    window.addEventListener("keydown", function(e){
        switch( e.keyCode ) {
            case 37:	// vinstri ör
                xmove = -0.05;
                ymove = 0.0;
                break;
            case 38:	// upp ör
                xmove = 0.0;
                ymove = 0.05;
                break;
            case 39:	// hægri ör
                xmove = 0.05;
                ymove = 0.0;
                break;
            case 40:	// niður ör
                xmove = 0.0;
                ymove = -0.05;
                break;
            default:
                xmove = 0.0;
                ymove = 0.0;
        }
        for(i=0; i<3; i++) {
            vertices[i][0] += xmove;
            vertices[i][1] += ymove;
        }
        if (Math.abs(vertices[0][1]) > 0.9){
            vertices[0][1] += dirEdge;
            vertices[1][1] += dirSides;

            vertices[2][1] += dirSides;
            dirEdge*=-1;
            dirSides*=-1;

            
            if((end > 0 && vertices[0][1] > 0) || (end < 0 && vertices[0][1] < 0)){
                end *=-1;
                this.score += 1;
                document.getElementById("score").innerHTML = "score: " + this.score;
            }
    
        }
        if(dangerZone()){
            vertices = [
                vec2( 0.0, -0.8 ),
                vec2( -0.1, -0.9 ),
                vec2(  0.1, -0.9 )
            ];
            box3 = vec2( 0.0, 0.0 );
            dirEdge = -0.1;
            dirSides = 0.1;
            end = 0.89;

        }

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
    } );

    render();
}





function render() {
    
    
    gl.clear( gl.COLOR_BUFFER_BIT );

    
    // Draw first triangle    
    if (Math.abs(box0[0] + dX0) > maxX - boxRad) box0[0] -= 1.9; //make the car jump from the wall

     // update location
    box0[0] += dX0;
    box0[1] += dY;

    if (Math.abs(box[0] + dX) > maxX - boxRad) box[0] -= 1.9;

    // update location
    box[0] += dX;
    box[1] += dY;

    if (Math.abs(box2[0] + dX2) > maxX - boxRad2) box2[0] -= 1.9;
    
    box2[0] += dX2;
    box2[1] += dY;

    

    if (Math.abs(boxC[0] + dXC) > maxX - boxRad2) boxC[0] -= 1.9;
    
    boxC[0] += dXC;
    boxC[1] += dY;

    if(dangerZone()){
        vertices = [
            vec2( 0.0, -0.8 ),
            vec2( -0.1, -0.9 ),
            vec2(  0.1, -0.9 )
        ];
        box3 = vec2( 0.0, 0.0 );
        dirEdge = -0.1;
        dirSides = 0.1;
        end = 0.89;

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));

    }

    box3[0] += dX3;
    box3[1] += dY;


    

    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdEx );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv( locColor, flatten(colorA) );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );

    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdLine0 );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv( locColor, flatten(colorWhite) );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    

    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdLine1 );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv( locColor, flatten(colorWhite) );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    
    
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdX );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.uniform4fv( locColor, flatten(colorB0) );
    gl.uniform2fv( locBox, flatten(box0) );

    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );


    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdA );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    gl.uniform4fv( locColor, flatten(colorB1) );
    gl.uniform2fv( locBox, flatten(box) );

    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );



    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdB );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.uniform4fv( locColor, flatten(colorB2) );
    gl.uniform2fv( locBox, flatten(box2) );

    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );

    

    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdC );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.uniform4fv( locColor, flatten(colorB3) );
    gl.uniform2fv( locBox, flatten(boxC) );

    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );

    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.uniform2fv( locBox, flatten(box3) );
    gl.uniform4fv( locColor, flatten(colorGreen) );
    gl.drawArrays( gl.TRIANGLES, 0, 3 );

    document.getElementById("score").innerHtml = "score";

    window.requestAnimFrame(render);
}



//If any are true, set triangle to starting position
function dangerZone(){
    // if check if triangle in lower x danger zone from using x from triangle and prepped x
    //  nested if triangle in lower y danger zone from using y from triangle and y from lower car
    if((vertices[0][1] > -0.31 && vertices[0][1] < -0.19) || (vertices[1][1] > -0.31 && vertices[1][1] < -0.19)){
        return (((box2[0] + 0.05) > vertices[0][0] && (box2[0] - 0.05) < vertices[0][0]) || ((boxC[0] + 0.05) > vertices[0][0] && (boxC[0] - 0.05) < vertices[0][0]))
        ||
        (((box2[0] + 0.05) > vertices[1][0] && (box2[0] - 0.05) < vertices[1][0]) || ((boxC[0] + 0.05) > vertices[1][0] && (boxC[0] - 0.05) < vertices[1][0]));
    }

    // if check if triangle in middle x danger zone from using x from triangle and prepped x
    //  nested if triangle in middle y danger zone from using y from triangle and y from middle car
    if((vertices[0][1] > -0.051 && vertices[0][1] < 0.049) || (vertices[1][1] > -0.051 && vertices[1][1] < 0.049)){
        return ((box[0] + 0.05) > vertices[0][0] && (box[0] - 0.05) < vertices[0][0]) || ((box[0] + 0.05) > vertices[1][0] && (box[0] - 0.05) < vertices[1][0]);
    }

    // if check if triangle in upper x danger zone from using x from triangle and prepped x
    //  nested if triangle in upper y danger zone from using y from triangle and y from upper car
    if((vertices[0][1] > 0.21 && vertices[0][1] < 0.299) || (vertices[1][1] > 0.21 && vertices[1][1] < 0.299)){
        return ((box0[0] + 0.05) > vertices[0][0] && (box0[0] - 0.05) < vertices[0][0]) || ((box0[0] + 0.05) > vertices[1][0] && (box0[0] - 0.05) < vertices[1][0]);
    }

    return false;
}

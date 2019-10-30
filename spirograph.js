document.addEventListener("DOMContentLoaded", init, false); 

var 
    canvas,
    ctx,
    _w,
    r1,
    o1x,
    o1y,
    r2,
    o2x,
    o2y,
    r3,
    o3x,
    o3y;

var 
    ang1 = 0.0,
    ang2 = 0.0,
    ang3 = 0.0,
    d1 = 0.01,
    d2,
    d3;

var ccol;

var xstk = [];
var ystk = [];

var fade_len = 500;

var bcol = 'black'

var circ_opac = 255;

var r2_init = 125;
var r3_init = 40;

function init()
{
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    
    _w = canvas.width;

    r1 = Math.floor(_w/2);
    o1x = Math.floor(_w/2);
    o1y = Math.floor(_w/2);
    r2 = r2_init;
    o2x = _w - r2;
    o2y = o1y;
    r3 = r3_init;
    o3x = _w - r3;
    o3y = o1y;

    d2 = -1*(r1/r2)*d1;
    d3 = -1*(r2/r3)*d2;

    setInterval(draw, 16);
}

function draw()
{

    //get slider values

    r2 = $('#slider1').slider('value') * r2_init / 50.0 + 20;

    r3 = $('#slider2').slider('value') * r3_init / 50.0 + 10;

    d1 = $('#slider3').slider('value') * 0.03 / 50.0 + 0.003;

    circ_opac = Math.floor($('#slider4').slider('value') * 255 / 50.0);

    d2 = -1*(r1/r2)*d1;
    d3 = -1*(r2/r3)*d2;

    ctx.clearRect(0, 0, _w, _w);

    ctx.lineWidth = 2;

//put a new point in the draw stack

    xstk.push(o3x + r3*Math.cos(ang3));
    ystk.push(o3y - r3*Math.sin(ang3));

//draw the spirograph lines, from the back of stack (faded lines) to the front
//(freshly drawn lines)

    var xsze = xstk.length;

    if(xsze > fade_len)
    {
        xstk.shift();
        ystk.shift();
    }

    ctx.beginPath()

    for(var i in xstk)
    {
        if(bcol == 'white')
        {
            ccol = Math.floor(255*(xsze-i)/fade_len).toString();
            ctx.strokeStyle = 'rgb(255,' + ccol + ',' + ccol + ')' ;          
        }
        else if(bcol == 'black')
        {

            //ccol is the red value and just goes between 255 and 0

            var ncol = Math.floor(255-255*(xsze-i)/fade_len);

            ccol = ncol.toString();
            
            //Make cool colors, but make sure the used function is zero at both
            //0 and 255, so we get red to start and black to end

            //using the function x^2 - 255*x

            var range1 = 16256.25; //maximum absolute value
            var ngcol1 = Math.floor(255*Math.abs(Math.pow(ncol, 2) - 255*ncol)/range1);
            var gcol1 = ngcol1.toString();

/*          I messed this up ... we really need the zero at 0
            fix it by using a cubic

            //using the function (x - 255)(x - 100)
            // = x^2 - 355x + 25500

            var range2 = 6006.25;
            var ngcol2 = Math.floor(255*Math.abs(Math.pow(ncol, 2) - 355*ncol + 25500)/range2);
            var gcol2 = ngcol2.toString();
*/

            //using the function x(x - 100)
            // = x^2 - 100x

            var range2 = 2500.0;
            var ngcol2 = Math.floor(255*Math.abs(Math.pow(ncol, 2) - 100*ncol)/range2);
            var gcol2 = ngcol2.toString();

            ctx.strokeStyle = 'rgb(' + ccol + ',' + gcol1 + ',' + gcol2 + ')';
        }
        if(i == 0){
            ctx.moveTo(xstk[i], ystk[i]);
        }
        else{
            ctx.lineTo(xstk[i], ystk[i]);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(xstk[i], ystk[i]);
        }
    }

    ctx.stroke();

//draw the three circles

    if(circ_opac > 0)
    {

        ctx.strokeStyle = 'rgb(0,' + circ_opac.toString() + ',' + 
            Math.floor(circ_opac/2).toString() + ')';

        ctx.beginPath();
        ctx.arc(o1x, o1y, r1, 0, 2*Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(o2x, o2y, r2, 0, 2*Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(o3x, o3y, r3, 0, 2*Math.PI);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(o3x, o3y);
        ctx.lineTo(o3x + r3*Math.cos(ang3), o3y - r3*Math.sin(ang3));
        ctx.stroke();

    }

//update angles and centers

    ang1 = (ang1 + d1) % (2*Math.PI);
    ang2 = (ang2 + d2) % (2*Math.PI);
    ang3 = (ang3 + d3) % (2*Math.PI);

    o2x = o1x + (r1 - r2)*Math.cos(ang1);
    o2y = o1y - (r1 - r2)*Math.sin(ang1);

    o3x = o2x + (r2 - r3)*Math.cos(ang2);
    o3y = o2y - (r2 - r3)*Math.sin(ang2);

}




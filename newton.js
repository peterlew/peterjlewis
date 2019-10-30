document.addEventListener("DOMContentLoaded", init, false); 

var canvas, ctx;
var _w, _h;

var r1, r2, r3;
var a, b, c;
var d, e;

var pixR1, pixR2, pixR3;

var r1_up, r2_right, r3_up;

var x_r = 1.5; //complex plane range
var y_r = 1.5;

var res = 5;
var delt = 0.02;

var pointGrab = false;
var rootSelect = 0;
var selEps = 20;    

function c_add(x, y)
{
    return new ComplexNumber(x.real + y.real, x.imaginary + y.imaginary);
}

function c_sub(x, y)
{
    return new ComplexNumber(x.real - y.real, x.imaginary - y.imaginary);
}

function c_mult(x, y)
{
    return new ComplexNumber(x.real * y.real - x.imaginary * y.imaginary, 
                             x.imaginary * y.real + x.real * y.imaginary);
}

function c_div(x, y)
{
    var denom = Math.pow(y.real, 2) + Math.pow(y.imaginary, 2);

    return new ComplexNumber(
        (x.real * y.real + x.imaginary * y.imaginary) / denom,
        (x.imaginary * y.real - x.real * y.imaginary) / denom);
}

function c_scal(x, s)
{
    return new ComplexNumber(x.real * s, x.imaginary * s);
}

function c_mod(x)
{
    return Math.sqrt(Math.pow(x.real, 2) + Math.pow(x.imaginary, 2));
}

function init()
{
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.strokeStyle = "yellow";
    _w = canvas.width;
    _h = canvas.height;
    r1 = new ComplexNumber(1, 0);
    r2 = new ComplexNumber(-0.5, 0.86603);
    r3 = new ComplexNumber(-0.5, -0.86603);
    r1_up = true;
    r2_right = true;
    r3_up = true;

    updateInfo();

    canvas.addEventListener("mousemove", checkMouse, false);
    canvas.addEventListener("mousedown", mouseClick, false);

    setInterval(draw, 16);
}

function updateInfo()
{
    a = c_sub( c_sub( c_scal(r1, -1), r2 ), r3);
    b = c_add( c_add( c_mult(r1, r2), c_mult(r1, r3) ), c_mult(r2, r3));
    c = c_scal( c_mult( c_mult(r1, r2), r3) , -1);
    d = c_scal(a, 2);
    e = b;

    pixR1 = {x: (r1.real + x_r)*_w/(2*x_r),
             y: _h - (r1.imaginary + y_r)*_h/(2*y_r)};
    pixR2 = {x: (r2.real + x_r)*_w/(2*x_r),
             y: _h - (r2.imaginary + y_r)*_h/(2*y_r)};
    pixR3 = {x: (r3.real + x_r)*_w/(2*x_r),
             y: _h - (r3.imaginary + y_r)*_h/(2*y_r)};

    var f_txt = "f(z) = z^3 + (" + a.toString() + ")z^2 + (" + b.toString() +
        ")z + (" + c.toString() + ")";

    var r_txt = "Roots: (" + r1.toString() + "), (" + r2.toString() + 
        "), (" + r3.toString() + ")";

    document.getElementById('func_txt').innerHTML = f_txt;
    document.getElementById('root_txt').innerHTML = r_txt;   

}

//adapted from html5canvastutorials.com
function getMousePos(ev) 
{
    var rect = canvas.getBoundingClientRect();
    return {
        x: ev.clientX - rect.left,
        y: ev.clientY - rect.top
            };
}

function pixDist(p1, p2)
{
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

function checkMouse(ev)
{
    var mousePos = getMousePos(ev);

    if(pointGrab)
    {
        if(rootSelect == 1)
        {
            var pnt = getMousePos(ev);
            r1 = new ComplexNumber(x_r*(pnt.x - _w/2)/(_w/2), 
                        y_r*((_h - pnt.y) - _h/2)/(_h/2));

        }
        if(rootSelect == 2)
        {
            var pnt = getMousePos(ev);
            r2 = new ComplexNumber(x_r*(pnt.x - _w/2)/(_w/2), 
                        y_r*((_h - pnt.y) - _h/2)/(_h/2));

        }
        if(rootSelect == 3)
        {
            var pnt = getMousePos(ev);
            r3 = new ComplexNumber(x_r*(pnt.x - _w/2)/(_w/2), 
                        y_r*((_h - pnt.y) - _h/2)/(_h/2));

        }
        updateInfo();
    }
    else
    {
        if(pixDist(mousePos, pixR1) < selEps)
            rootSelect = 1;
        else if(pixDist(mousePos, pixR2) < selEps)
            rootSelect = 2;
        else if(pixDist(mousePos, pixR3) < selEps)
            rootSelect = 3;
        else rootSelect = 0;
    }
}

function mouseClick(ev)
{
    if(rootSelect)
    {
        if(pointGrab)
            rootSelect = 0;
 
        pointGrab = !pointGrab;
    }
}

function eval_p(x)
{
    //have to use x.mult for complex #s
    //return(x.mult(x.mult(x)).add(x.mult(x.mult(a, 0))).add(x.mult(b, 0)).add(c, 0));
    return(c_add( 
           c_mult(x, c_mult(x, x)), c_add( 
           c_mult(a, c_mult(x, x)), c_add(
           c_mult(b, x), 
           c))));
}

function eval_dp(x)
{
    //return(x.mult(x.mult(3, 0)).add(x.mult(d)).add(e, 0));
    return(c_add(
           c_scal(c_mult(x, x), 3), c_add(
           c_mult(d, x),
           e)));
}

function find_close_h(z_1, count)
{
    var eps = 0.01;
    var z = new ComplexNumber(z_1.real, z_1.imaginary)
    if(count > 25)     
        return {r: 0, g: 0, b: 0};     
    if(c_mod(c_sub(z, r1)) < eps)
        return {r: 255 - 10*count, g: 0, b: 0};
    if(c_mod(c_sub(z, r2)) < eps)
        return {r: 0, g: 255 - 10*count, b: 0};
    if(c_mod(c_sub(z, r3)) < eps)
        return {r: 0, g: 0, b: 255 - 10*count};
    return find_close_h(c_sub(z, c_div(eval_p(z), eval_dp(z))), count + 1); 
    //return find_close_h(z.sub(eval_p(z).div(eval_dp(z))), count + 1);
}

function find_close(z)
{
    return(find_close_h(z, 0));
}

function draw()
{
    ctx.clearRect(0, 0, _w, _h);
    var x, y;
    for(y = 0; y < _h; y += res)
    {
        for(x = 0; x < _w; x += res)
        {
            //x: x - (_w/2) / (_w/2)
            // x/_w/2 - 1
            // 2*x/_w - 1
            //y: _h/2 - y / (_h/2)
            // 1 - y/_h/2
            // 1 - 2*y/_h
            var z = new ComplexNumber(x_r * (2*x/_w - 1.0), y_r * (1.0 - 2*y/_h));
            //console.log(z.toString());
            var newCol = find_close(z);
            ctx.fillStyle = "rgb(" + newCol.r + "," + newCol.g + "," + newCol.b + ")";
            ctx.fillRect(x, y, res, res);

        }
    }

    ctx.fillStyle = "black";
    ctx.fillRect(pixR1.x, pixR1.y, res, res);
    ctx.fillRect(pixR2.x, pixR2.y, res, res);
    ctx.fillRect(pixR3.x, pixR3.y, res, res);

    if(rootSelect)
    {
        if(rootSelect == 1)
        {
            ctx.beginPath();
            ctx.moveTo(pixR1.x + selEps + res/2, pixR1.y + res/2);
            ctx.arc(pixR1.x + res/2, pixR1.y + res/2, selEps, 0, 2*Math.PI);
            ctx.stroke();
        }
        if(rootSelect == 2)
        {
            ctx.beginPath();
            ctx.moveTo(pixR2.x + selEps + res/2, pixR2.y + res/2);
            ctx.arc(pixR2.x + res/2, pixR2.y + res/2, selEps, 0, 2*Math.PI);
            ctx.stroke();
        }
        if(rootSelect == 3)
        {
            ctx.beginPath();
            ctx.moveTo(pixR3.x + selEps + res/2, pixR3.y + res/2);
            ctx.arc(pixR3.x + res/2, pixR3.y + res/2, selEps, 0, 2*Math.PI);
            ctx.stroke();
        }        
    }
    
    if(!pointGrab)
    {
        if(r1_up)
            r1.imaginary += delt;
        else r1.imaginary -= delt;
        if(r2_right)
            r2.real += 2*delt;
        else r2.real -= 2*delt;
        if(r3_up)
        {
            r3.real += delt;
            r3.imaginary += delt;
        }
        else
        {
            r3.real -= delt;
            r3.imaginary -= delt;
        }
        if(r1.imaginary >= y_r)
            r1_up = false;
        if(r1.imaginary <= -y_r)
            r1_up = true;
        if(r2.real >= x_r)
            r2_right = false;
        if(r2.real <= -x_r)
            r2_right = true;
        if(r3.real >= x_r || r3.imaginary >= y_r)
            r3_up = false;
        if(r3.real <= -x_r || r3.imaginary <= -y_r)
            r3_up = true;

        updateInfo();
    }

}
    




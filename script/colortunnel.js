//(function($)
//{
    
function clamp(gun)
{
    return gun < 0 ? 0 : gun > 255 ? 255 : gun;
}
    
function hex(n)
{
    var s = Math.floor(n).toString(16);
    
    if (s.length == 2)
    {
        return s;
    }
    else
    {
        return "0" + s;
    }
}

function color(r,g,b)
{
    r = clamp(r);
    g = clamp(g);
    b = clamp(b);
    
    return "#" + hex(r) + hex(g) + hex(b);
}

var Vector3D = Class.extend({
init:
    function(x,y,z)
    {
        this.x = x;
        this.y = y;
        this.z = z;
    },
add:
    function(x,y,z)
    {
    if (x instanceof Vector3D)
    {
        y = x.y;
        z = x.z;
        x = x.x;
    }
    
    this.x += x;
    this.y += y;
    this.z += z;
    
    return this;
    },
substract:
    function(x,y,z)
    {
    if (x instanceof Vector3D)
    {
        y = x.y;
        z = x.z;
        x = x.x;
    }
    
    this.x -= x;
    this.y -= y;
    this.z -= z;
    
    return this;
    },
length:
    function()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    },
scale:
    function(s)
    {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    },
norm:
    function()
    {
        var s = 1 / this.length();
        return this.scale(s);
    },
clone:
    function()
    {
        return new Vector3D(this.x, this.y, this.z);
    },
toString:
    function()
    {
        return "Vector3D( " + this.x + ", " + this.y + ", " + this.z + ")";
    }
});


var startPoint;
var controlPoint;
var controlPoint2;
var endPoint =  new Vector3D(0,0,0);
var t = 1.0;


var corners = [
   new Vector3D(   0,   0,   0),
   new Vector3D( 255,   0,   0),
   new Vector3D(   0, 255,   0),
   new Vector3D( 255, 255,   0),
   new Vector3D(   0,   0, 255),
   new Vector3D( 255,   0, 255),
   new Vector3D(   0, 255, 255),
   new Vector3D( 255, 255, 255)
];

function cornerPos(excluded)
{
    do
    {
        var pos = corners[ Math.round(Math.random() * 7)];
    } while (pos.x !== excluded.x && pos.y !== excluded.y && pos.z !== excluded.z);
    
    return pos.clone();
}

function gunRnd(range)
{
    return 128 + ( (Math.random() - 0.5) * range) * 255.0; 
}

function colorPos(range)
{
    return new Vector3D(gunRnd(range), gunRnd(range),  gunRnd(range));
}

function bezierPoint(pt0, pt1, t)
{
    return pt1.clone().substract(pt0).scale(t).add(pt0);
}

var mainLoop ;
    
window.onload = function()
{
    var $window = $(window);
    
    var $canvas = $("#teh-canvas");
    var canvas = $canvas[0];
    
    //console.debug($canvas);
    
    var width = $window.width() - 1;
    var height = $window.height() - 1;

    var ctx = canvas.getContext('2d');  
    canvas.width = width;
    canvas.height = height;

    var centerX = width / 2;
    var centerY = height / 2;
    
    var offset = centerX / 100;
    var offset2 = offset + offset;
    
    var scaleX = centerX / 64;
    var scaleY = centerY / 64;
    
    var invert = false;
    
    $(document.body).click(function()
    {   
        invert = !invert;
    });
    
    
    mainLoop = function() {
        
        if (t >= 1)
        {
            startPoint = endPoint;
            endPoint = colorPos(1.0);
            controlPoint = colorPos(1.6);
            controlPoint2 = colorPos(1.6);
            
            //console.debug("start = %s, control = %s, end = %s", colorCubePos, controlPoint, endPoint );
            
            t = 0;
        }
        
        var ptS1 = bezierPoint(startPoint, controlPoint, t);
        var pt12 = bezierPoint(controlPoint, controlPoint2, t);
        var pt2e = bezierPoint(controlPoint2, endPoint, t);
        
        var ptS112 = bezierPoint(ptS1, pt12, t);
        var pt122e = bezierPoint(pt12, pt2e, t);
        
        var pt2 = bezierPoint(ptS112, pt122e, t);
        
        //console.debug("pt0 = %s, pt2 = %s, pt1 = %s", pt0, pt2, pt1);

        
        var col;
        if (invert)
        {
            col = color(255 - pt2.x,255 - pt2.y,255 - pt2.z);
        }
        else
        {
            col = color(pt2.x,pt2.y,pt2.z);
        }
        
        var cx = centerX + Math.random() * 32 - 16;
        var cy = centerY + Math.random() * 32 - 16;
        
        ctx.fillStyle = col;
        ctx.fillRect(cx - offset, cy - offset , offset2, offset2);
        ctx.drawImage(canvas, -scaleX, -scaleY, width + scaleX + scaleX, height + scaleY + scaleY);
        
        t += 0.007;
        requestAnimationFrame(mainLoop);
    };
    

    mainLoop();
};
    
//})(jQuery);
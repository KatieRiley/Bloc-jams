var animatePoints = function() {
 
    var points = document.getElementsByClassName('point');
        
        for (var i = 0; i < points.length; i++) {
            revealPoint(i);
        }
    
    function revealPoint(myIndex) {
        points[myIndex].style.opacity = 1;
        points[myIndex].style.transform = "scaleX(1) translateY(0)";
        points[myIndex].style.msTransform = "scaleX(1) translateY(0)";
        points[myIndex].style.WebkitTransform = "scaleX(1) translateY(0)";
    }
 
 };
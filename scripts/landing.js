var pointsArray = document.getElementsByClassName('point');

var animatePoints = function(points) {
        
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

window.onload = function() {
    if (window.innerHeight > 950) {
        animatePoints(pointsArray);
    }
    var sellingPoints = document.getElementsByClassName('selling-points')[0];
    var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;
    window.addEventListener('scroll', function(event) {
        if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) {
            animatePoints(pointsArray);
        }
    });
}
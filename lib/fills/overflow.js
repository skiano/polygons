

box = {
  [0,1],[0,2]

  topleft, bottomRight, center, width, height

}

module.exports = function overFlowFill(center, radius, interval){
  
  var c = g2d.circumfrance(radius)
    , dotCount = Math.floor(c/interval)
    , dotAngle = 360 / dotCount
    , initialPoint = [center[0]+radius, center[1]]
    , dots = []
    , idx
    ;

  for(idx = 0; idx < dotCount; idx += 1){
    dots.push(g2d.rotate(initialPoint, dotAngle*idx, center))
  }

  return dots;
}
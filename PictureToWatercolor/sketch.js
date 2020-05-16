// Variables to be changed which will alter watercolor output

// Sets the canvas height and width
CanvasWidth = 1499
CanvasHeight = 1080

// Sets the alpha value for the drawn octagons
alphaValue = 5

// How large a space between each row of initial octagons
VerticalSpacing = 100
// How large a space between each column of initial octagons
HorizontalSpacing = 100

// Side length of the initial octagons
InitialShapeSize = VerticalSpacing/sqrt(4.83)

// How many times the octagon's points will deform initall
InitialIteration = 1
// The variance of the initial octagon's deformation, should be higher than layered variance
InitialVariance = 0

// How many times the octagon's points will deform the second time
LayeredIteration = 1
// // The variance of the second octagon's deformation, should be low
LayeredVariance = 0

// Used as the max and min in a random function to see how many layers there should be
MinLayers = 10
MaxLayers = 11

function preload() {
    // preload() runs once
    img = loadImage('20.jpg');
}

function setup() {
    background(0)
    // Create a canvas and the intial color pallette
    img.resize(CanvasWidth, CanvasHeight)
    createCanvas(CanvasWidth, CanvasHeight)

    image(img,0,0)

    // Run down the canvas in the y direction in discrete steps 
    for (yValue = 0; yValue < CanvasHeight; yValue += VerticalSpacing) {
        // Run across the canvas in the x direction in discrete steps
        for (xValue = 0; xValue < CanvasWidth; xValue += HorizontalSpacing) {
            // Select a color corresponding to the image's color at the current point
            imageColor = color(img.get(xValue, yValue))
            imageColor.setAlpha(alphaValue)
            fill(imageColor)
            // noStroke()

            // Create the initial octagon at the chosen xValue and yValue
            initialShape = octagon(xValue, yValue, InitialShapeSize)

            // deform the octagon once according to our desired rules
            initialDeformedShape = deform(initialShape, InitialIteration, InitialVariance)

            // draws the initial deformation as a base. use for more defined color regions
            beginShape()
            for (i = 0; i < initialDeformedShape.length; i++) {
                vertex(initialDeformedShape[i][0], initialDeformedShape[i][1])
            }
            endShape()

            // set the shape to be deformed as the initial deformation
            deformedShape = initialDeformedShape
            // for each layer that we told it to make
            for (i = 0; i < floor(random(MinLayers, MaxLayers)); i++) {
                // deform the previous layer's shape and overwrite the deformedShape variable
                deformedShape = deform(deformedShape, LayeredIteration, LayeredVariance)
                beginShape()
                for (i = 0; i < deformedShape.length; i++) {
                    vertex(deformedShape[i][0], deformedShape[i][1])
                }
                endShape()
            }
        }
        // save("exampleoutput" + drawLoopCount + ".png")
    }
}

function octagon(x_start, y_start, side) {
    x = x_start
    y = y_start
    // the distance in x or y needed to move to create the diagonal section of the octagon
    diagonal_leg = side / sqrt(2)

    // create an array of points in an octagon which work their way counterclockwise from the bottom left
    oct = []
    append(oct, [x, y])
    x += side
    append(oct, [x, y])
    x += diagonal_leg
    y += diagonal_leg
    append(oct, [x, y])
    y += side
    append(oct, [x, y])
    x -= diagonal_leg
    y += diagonal_leg
    append(oct, [x, y])
    x -= side
    append(oct, [x, y])
    x -= diagonal_leg
    y -= diagonal_leg
    append(oct, [x, y])
    y -= side
    append(oct, [x, y])
    x += diagonal_leg
    y -= diagonal_leg
    append(oct, [x, y])

    // return the points which draw out the specified octagon
    return (oct)
}

function deform(shape, iterations, variance) {
    midpoint = []
    // For every iteration
    for (i = 0; i < iterations; i++) {
        // For each point on the shape passed in, backwards to forwards
        for (j = shape.length - 1; j > 0; j--) {
            // Find the midpoint of the point and the previous point
            midpoint = [(shape[j][0] + shape[j - 1][0]) / 2, (shape[j][1] + shape[j - 1][1]) / 2]
            // Add random variation
            midpoint[j, 0] -= random(-variance, variance)
            midpoint[j, 1] -= random(-variance, variance)
            // Add that point back to the shape matrix 
            shape.splice(j, 0, midpoint)
        }
    }
    // Return the shape with all of the added points 
    return shape
}


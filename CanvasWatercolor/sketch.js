// Variables to be changed which will alter watercolor output

// Sets the canvas height and width
CanvasWidth = 800
CanvasHeight = 800

// Changes transition time in seconds between each generated output
TimeBetweenShapeChange = 1
// Gives number of shape changes needed until the color pallette regenerates
LoopsUntilColorChange = 1

// Number of colors to interpolate between for color pallette. 
// Use [ [r,g,b], [r,g,b], [r,g,b], ..] for hand selecting colors to interpolate between
NumColors = 5
// How many points between each color
NumColorSteps = 1
//Changes the brightness of the randomly generated colors
BrightnessLevels = 255
// Alpha value of the initial deformation
InitialAlpha = 3
// Alpha value of the layers
LayeredAlpha = 5

// Size of the initial octagons
InitialShapeSize = 75
// How large a space between each row of initial octagons
VerticalSpacing = 1

// How many times the octagon's points will deform initally
InitialIteration = 1
// The variance of the initial octagon's deformation, should be higher than layered variance
InitialVariance = 25

// How many times the octagon's points will deform the second time
LayeredIteration = 4
// // How many times the octagon's points will deform the second time, should be low
LayeredVariance = 10

// Used as the max and min in a random function to see how many layers there should be
MinLayers = 30
MaxLayers = 35

// Don't change, used to declare the global drawLoopCount variable which changes the color/numbers exported images
drawLoopCount = 0

function setup() {
    background(0)
    // Create a canvas and the intial color pallette
    createCanvas(CanvasWidth, CanvasHeight)
    generateInterpolatedColors(NumColorSteps, NumColors)
}


function draw() {
    // Clear the drawing to allow for the next picture to be drawn
    clear()
    // Set the frame rate between each shape change
    frameRate(1 / TimeBetweenShapeChange)
    // Run the draw loop to see if the color pallette should be changed
    countDrawLoop()

    // Run down the canvas in the y direction in discrete steps 
    for (yValue = -CanvasHeight * 0.2; yValue < CanvasHeight * 1.2; yValue += VerticalSpacing) {
        // Select a random x value to start the octagon in this row
        xValue = random(-100, CanvasWidth + 100)
        // Select a random color from the generated pallette and set the alpha and fill to it
        randomColor = random(lerpedColors)
        randomColor.setAlpha(InitialAlpha)
        fill(randomColor)
        // Turn off to see the edges of the polygons
        noStroke()

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

        // allows for the changing of the alpha between the base and layers
        randomColor.setAlpha(LayeredAlpha)
        fill(randomColor)

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

function generateInterpolatedColors(bP, cB) {
    //bP is the number of points between each color, while cB is the base colors, either a number for random colors, or an array for selected colors 

    lerpedColors = []
    colorBaseColors = []
    // If the color base entry is a number, generate a random array of colors that is the length of that number. Maybe look into using gaussian or 
    // perlin to make colors closer if needed
    if (!isNaN(cB)) {
        for (i = 0; i < cB; i++)
            append(colorBaseColors, [random(0, 1) * BrightnessLevels, random(0, 1) * BrightnessLevels, random(0, 1) * BrightnessLevels])
    }
    // If the color base entry is an array, transfer that array to colorbase colors to be used
    else {
        colorBaseColors = cB
    }

    //RGB works best, but HSL and HSB also kind of work, although not as pretty 
    colorMode(RGB)

    //Loop through all of the base colors
    for (i = 0; i < colorBaseColors.length - 1; i++) {
        // Determine the ranges between these base colors, and set a min and max for that range. Also, the colorBaseColors array is turned into a color here
        // Could change how this is setup to have it work better with different color modes
        minColor = color(colorBaseColors[i][0], colorBaseColors[i][1], colorBaseColors[i][2], colorBaseColors[i][3])
        maxColor = color(colorBaseColors[i + 1][0], colorBaseColors[i + 1][1], colorBaseColors[i + 1][2], colorBaseColors[i + 1][3])

        //Add the minColor to the lerpedColors to have a continuous output matrix of color
        append(lerpedColors, minColor)

        // Add a new color for each interpolated value, which has a color based on the total number of points between base colors (bP). LerpColor takes a 
        // fraction between 0 and 1, hense the 1/(bP+1)
        for (j = 0; j < bP; j++) {
            lerpedColor = lerpColor(minColor, maxColor, (j + 1) / (bP + 1))
            append(lerpedColors, lerpedColor)
        }
    }

    // finally, after all of the colors are added, append the maxColor. This is added outside of the for loop because every max color becomes the min color
    // except for the final one since the loop is exited.
    append(lerpedColors, maxColor)
    // display the color palette in the canvas, then save as pallette.png if desired

    // for (let i = 0; i < lerpedColors.length; i++) {
    //     noStroke();
    //     fill(lerpedColors[i])
    //     rect((i * CanvasWidth / lerpedColors.length), 0, 5, CanvasHeight)
    // }
    // save("pallette" + drawLoopCount + ".png")

    // return all of the interpolated colors and the base colors used 
    return lerpedColors, colorBaseColors


}

function countDrawLoop() {
    // If the number of times looped is divisible by the loops until color change
    if (drawLoopCount % LoopsUntilColorChange == 0) {
        // Regenerate the color pallette
        generateInterpolatedColors(NumColorSteps, NumColors)
    }
    drawLoopCount++
}

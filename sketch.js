function setup() {
    createCanvas(1000, 100);
    [lerpColors, baseColors] = generateInterpolatedColors(1000, 3);
}

function draw() {
    // background(0)
    // fill(lerpedColors[i])
    // rect(i*20,40,20,20)
}


function generateInterpolatedColors(bP, cB) {
    //bP is the number of points between each color, while cB is the base colors, either a number for random colors, or an array for selected colors 

    lerpedColors = []
    colorBaseColors = []

    // If the color base entry is a number, generate a random array of colors that is the length of that number. Brightness levels allows for the 
    // changing of the overall brightness of the randomly generated colors. Maybe look into using gaussian or perlin to make colors closer if needed
    if (!isNaN(cB)) {
        brightnessLevels = 255
        for (i = 0; i < cB; i++)
            append(colorBaseColors, [random(0, 1) * brightnessLevels, random(0, 1) * brightnessLevels, random(0, 1) * brightnessLevels])
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
    for (let i = 0; i < lerpedColors.length; i++) {
        noStroke();
        fill(lerpedColors[i])
        rect((i * windowWidth / lerpedColors.length), 0, 5, windowHeight)
    }
    // save("pallette.png")

    // return all of the interpolated colors and the base colors used 
    return lerpedColors, colorBaseColors

}
const initCanvas = (obj) => {
    const width = obj.width;
    const height = obj.height;

    const drawLine = (ctx, x1, y1, x2,y2, stroke = 'lightgray', width = 3) => {       
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = stroke;
        ctx.lineWidth = width;
        ctx.stroke();
    }

    if(obj.getContext) {
        const ctx = obj.getContext('2d');

        drawLine(ctx, 0, 0, 0, height);
        drawLine(ctx, 0, height, width, height);
    } else {
        console.log("canvas rendering not supported :(");
    } 
}

const canvasObjs = document.querySelectorAll(".histogram-canvas");
canvasObjs.forEach(canvas => initCanvas(canvas));
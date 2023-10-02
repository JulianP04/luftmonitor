const example_dump = [
    {
        "temperature": 19,
        "date": "2023-09-27 12:19:39",
    },
    {
        "temperature": 23,
        "date": "2023-09-27 12:24:39",
    },
    {
        "temperature": 18,
        "date": "2023-09-27 12:29:39",
    },
    {
        "temperature": 24,
        "date": "2023-09-27 12:34:39",
    },
];

const strokeColor = "lightgray";
const strokeWidth = 3;

const stepSize = 2;

class Histogram {
    constructor(obj) {
        this.width = obj.width;
        this.height = obj.height;

        if(obj.getContext) {
            const ctx = obj.getContext('2d');

            this.ctx = ctx;
            this.object = obj;

            this.xRenderStart = 45;
            this.yRenderStop = this.height - 20;

            this.yExtension = obj.getAttribute("data-y-extension") || "";
            
            this.barWidth = 50;
            this.barData = [];

            this.ctx.font = "10px Arial";
            this.ctx.fillStyle = "white";
    
            //axes
            this.drawLine(this.xRenderStart, 0, this.xRenderStart, this.yRenderStop);
            this.drawLine(this.xRenderStart, this.yRenderStop, this.width, this.yRenderStop);
        } else {
            console.log("canvas rendering not supported :(");
        } 
    }

    drawLine = (x1,y1,x2,y2,color) => {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.strokeStyle = color || strokeColor;
        this.ctx.lineWidth = strokeWidth;
        this.ctx.stroke();
    }

    drawBar = (x1,y1,x2,y2,color = "#9400FF",animate=false) => {
        if(animate) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = this.barWidth;
            let yStart = y1;
            const animateGrow = () => {
                if(yStart>y2) {
                    this.ctx.moveTo(x1, yStart);
                    yStart = yStart - 3;
                    this.ctx.lineTo(x2, yStart);
                    this.ctx.stroke();
                    setTimeout(animateGrow, 10);
                }
            }
            animateGrow();
        } else {
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = this.barWidth;
            this.ctx.stroke();
        }
        
    }

    drawData = (value) => {
        const xPos = this.xSteps[value];
        let yPos = null;
        this.ySteps.forEach(step => {
            if(this.data[value]<step.data&&yPos==null) {
                yPos = step.pos;

                let step_diff = (step.data - this.data[value]) / stepSize;
                step_diff = this.yGap * step_diff;
                yPos += step_diff;
            }
        });
        const compileDateString = (string) => {
            return `${new Date(string).toLocaleTimeString().slice(0,-3)} Uhr`;
        }
        this.ctx.fillText(compileDateString(this.dump[value].date),(xPos - this.barWidth / 2),this.height);
        this.drawBar(xPos,(this.yRenderStop - 2),xPos,yPos,"#9400FF",true);
        this.barData.push(
            {
                "xPos": xPos,
                "xMin": (xPos - this.barWidth / 2),
                "xMax": (xPos + this.barWidth / 2),
                "yMin": yPos,
                "yMax": (this.yRenderStop - 2),
                "hovered": false,
                "data": this.data[value],
                "timestamp": this.dump[value].date, 
            }
        );
    }

    compileCanvasData = (data_dump) => {
        this.ySteps = [];

        const data_array = [];
        data_dump.forEach(data => data_array.push(data.temperature.toFixed(2)));
        const data_min = Math.min.apply(Math, data_array);
        const data_max = Math.max.apply(Math, data_array);

        this.data = data_array;
        this.dump = data_dump;

        let sum = 0;
        data_array.forEach(data => sum += parseInt(data));
        const average = sum / data_array.length;

        const differences = [(data_max - average), (average - data_min)];
        const max_diff = Math.max.apply(Math, differences);

        const stepDivider = Math.floor(max_diff / stepSize) + 1;
        const yStepsTotal = stepDivider * 2 + 1;
        
        this.yGap = this.yRenderStop / yStepsTotal;

        for(let i = 0; i < yStepsTotal; i++) {
            let currentData;
            if(i==0) {
                currentData = (average - (stepSize * (Math.floor(yStepsTotal/2) - i))).toFixed(2);
                this.ySteps.push(
                    {
                        "pos": this.yRenderStop - this.yGap / 2,
                        "data": currentData,
                    }
                );
            } else {
                if(i<(yStepsTotal / 2)) {
                    currentData = average - (stepSize * (Math.floor(yStepsTotal/2) - i));
                } else {
                    currentData = average + (stepSize * (i - Math.floor(yStepsTotal/2)));
                }
                currentData = currentData.toFixed(2);
                this.ySteps.push(
                    {
                        "pos":  this.ySteps[i-1].pos - this.yGap,
                        "data": currentData,
                    }
                );
            }
        }

        this.ySteps.forEach(step => {
            this.ctx.fillText(`${step.data + this.yExtension}`,0,step.pos);
            this.drawLine(this.xRenderStart, step.pos, this.width, step.pos, "gray");
        });
        
        //divide x axis
        this.xSteps = [];
        const xGap = (this.width - this.xRenderStart) / data_array.length;
        for(let i = 0; i < data_array.length; i++) {
            if(i==0) {
                this.xSteps.push(this.xRenderStart + xGap / 2); 
            } else {
                this.xSteps.push(this.xSteps[i-1] + xGap);
            }
        }
        this.xSteps.forEach((dataset, index) => this.drawData(index));
    }

    showBarInfo = (bar) => {
        this.ctx.font = "14px Arial";

        const text = `Messwert: ${bar.data + this.yExtension}\nZeitpunkt: ${bar.timestamp}`;
        const texts = text.split("\n");

        const textMeasures = [];
        texts.forEach(line => {
            textMeasures.push(this.ctx.measureText(line).width);
        })

        const rectWidth = Math.max.apply(Math, textMeasures);
        const rectHeight = 100;

        this.textboxRect = {
            "x": bar.xMin,
            "y": (bar.yMin - rectHeight - 20),
            "width": (rectWidth + 10),
            "height": rectHeight,
        };
     
        this.ctx.fillStyle = "#090710";
        this.ctx.fillRect(this.textboxRect.x, this.textboxRect.y, this.textboxRect.width, this.textboxRect.height);

        this.ctx.fillStyle = "white";
        texts.forEach((line, i) => {
            this.ctx.fillText(line, (this.textboxRect.x + 5), (this.textboxRect.y + 25 * (i+1)));
        })
    }

    mouseHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();

        let boundingClientRect = this.object.getBoundingClientRect();

        const mouseMovenmentRatioX = this.width / boundingClientRect.width;
        const mouseMovenmentRatioY = this.height / boundingClientRect.height;

        const mouseX = (e.clientX - boundingClientRect.x) * mouseMovenmentRatioX;
        const mouseY = (e.clientY - boundingClientRect.y) * mouseMovenmentRatioY;

        this.barData.forEach(bar => {
            if(mouseX>bar.xMin&&mouseX<bar.xMax&&mouseY>bar.yMin&&mouseY<bar.yMax) {
                if(bar.hovered) {
                    return;
                }
                let xPos = bar.xMin + this.barWidth / 2;
                bar.hovered = true;
                this.drawBar(xPos,bar.yMax, xPos, (bar.yMin-2), "#6f00bf");
                this.showBarInfo(bar);
            } else {
                if(bar.hovered) {
                    this.ctx.fillStyle = "#212121";
                    this.ctx.fillRect(this.textboxRect.x, this.textboxRect.y, this.textboxRect.width, this.textboxRect.height);
                    this.ySteps.forEach(step => {
                        this.drawLine(this.xRenderStart, step.pos, this.width, step.pos, "gray");
                    });
                    this.barData.forEach(bar => {
                        this.drawBar(bar.xPos,(this.yRenderStop - 2),bar.xPos,bar.yMin,"#9400FF",false);
                    })

                    let xPos = bar.xMin + this.barWidth / 2;
                    this.drawBar(xPos,bar.yMax, xPos, (bar.yMin-2));
                    bar.hovered = false;
                }
            }
        });
    }
}

const canvasObjs = document.querySelectorAll(".histogram-canvas");
const histograms = [];
canvasObjs.forEach(canvas => {
    let cur_obj = new Histogram(canvas);
    histograms.push(cur_obj);
    canvas.addEventListener("mousemove", cur_obj.mouseHandler);
});

histograms[0].compileCanvasData(example_dump);

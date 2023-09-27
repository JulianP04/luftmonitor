const example_dump = [
    {
        "temperature": 19
    },
    {
        "temperature": 23
    },
    {
        "temperature": 18
    },
    {
        "temperature": 24
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

            this.xRenderStart = 35;
            this.yRenderStop = this.height - 20;

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

    drawBar = (x1,y1,x2,y2) => {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.strokeStyle = "#9400FF";
        this.ctx.lineWidth = 50;
        this.ctx.stroke();
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
        })
        this.drawBar(xPos,(this.yRenderStop - 2),xPos,yPos);
    }

    compileCanvasData = (data_dump) => {
        this.ySteps = [];

        const data_array = [];
        data_dump.forEach(data => data_array.push(data.temperature.toFixed(2)));
        const data_min = Math.min.apply(Math, data_array);
        const data_max = Math.max.apply(Math, data_array);

        this.data = data_array;

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
            this.ctx.fillText(step.data,0,step.pos);
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
}

const canvasObjs = document.querySelectorAll(".histogram-canvas");
const histograms = [];
canvasObjs.forEach(canvas => {
    histograms.push(new Histogram(canvas));
});

histograms[0].compileCanvasData(example_dump);

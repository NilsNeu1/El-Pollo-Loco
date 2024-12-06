class DrawableObject{
    posX = 100;
    posY = 350;
    height = 75;
    width = 100;
    img;
    imageCache = {};
    currentImage = 0;
    offset = {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      };


    loadImages(array){
        array.forEach((path) => {
            
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    loadImage(path) {
        this.img = new Image(); // this.img = doc.get element by id "img"
        this.img.src = path;
    }
    
    draw(ctx) {
        if (this.img) {
            try {
                ctx.drawImage(this.img, this.posX, this.posY, this.width, this.height);
            } catch (e) {
                console.warn('Error drawing image:', e);
                console.log('Failed to load', this.img.src);
            }
        } else {}
    }
    

    drawHitbox(ctx){
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss) {
            
            ctx.beginPath();
            ctx.lineWidth = "2";
            ctx.strokeStyle = "yellow";
            ctx.rect(this.posX, this.posY, this.width, this.height);
            ctx.stroke();
        }
    }
}
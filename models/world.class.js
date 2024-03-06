class World {

character = new Character();  // erstellt einen neuen charackter in der Welt // Character erbt variablen u eigenschaften von movable object
level = level1;
canvas;
ctx;
keyboard;
camera_x = 0;

// um die Variablen aus dieser datei nutzen zu können muss "this." davor gesetzt werden. 

    constructor(canvas, keyboard){ // canvas ist die variable die zuvor in game.js definiert wurde
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas; // (Canvas links) greift auf das globale canvas zu. = canvas importiert das globale canvas in diese function.
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
    }

    setWorld(){
        this.character.world = this;
    }

    draw(){ // wird so oft aufgerufen wie für die Grafikkarte möglich
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // cleared das Canvas bevor etwas neues gezeichent wird
        
        this.ctx.translate(this.camera_x, 0); // verschiebt die Kamera nach links

        this.addObjectToMap(this.level.backgroundObjects);
        this.addObjectToMap(this.level.clouds);
        this.addObjectToMap(this.level.enemies);
        this.addToMap(this.character);

        this.ctx.translate(-this.camera_x, 0); // macht das Translate wieder Rückgängig

        let self = this; // function kennt "this" nicht mehr und muss daswegen ausßerhalb neu definiert werden.
        requestAnimationFrame(function(){ // == requestAnimationFrame(this.draw)
            self.draw();
        });
    }

    addObjectToMap(objects){
        objects.forEach(obj => {
            this.addToMap(obj);
        });
    }

    addToMap(MO){
        if(MO.otherDirection) { //spiegelt den das MO 
            this.ctx.save();
            this.ctx.translate(MO.width, 0);
            this.ctx.scale (-1, 1);
            MO.posX = MO.posX * -1;
        }
        this.ctx.drawImage(MO.img, MO.posX, MO.posY, MO.width, MO.height);



        if(MO.otherDirection){
            MO.posX = MO.posX * -1;
            this.ctx.restore();
        }

    }

    

}
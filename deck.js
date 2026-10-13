class DeckData {
    swatch = [] // list of colors in rgba
    numberMeanings = {} // cardNumber -> meaning
    suitMeanings = {} // suitName -> meaning
    suitSprites = {} // suitName -> N*N object, each contains the index of swatch
    cardSprites = {} // suitName -> cardNumber (string) -> list of transformations  (translation(x,y), rotation(degrees)) rotation from left top corner
}



class Deck {
    constructor(swatch, cards, suits, numbers){
        // all these are list of the respective objects
        this.swatch = swatch 
        this.cards = cards 
        this.suits = suits 
        this.numbers = numbers
    }

    static fromDeckData(deckData){
        var suits = []
        for(let suitName in deckData.suitMeanings){
           var suit = new CardSuit(suitName, deckData.suitMeanings[suitName], deckData.suitSprites[suitName])
           suits.push(suit)
        }

        var deckNumbers = []
        for(let numberName in deckData.numberMeanings){
            var deckNumber = new CardNumber(numberName, deckData.numberMeanings[numberName])
            deckNumbers.push(deckNumber)
        }

        var cards = []
        for(let suit of suits){
            cards[suit.name] = {}
            for(let deckNumber of deckNumbers){
                cards.push(new Card(suit, deckNumber, deckData.cardSprites[suit.name][deckNumber.name]))
            }
        }

        return new Deck(deckData.swatch, cards, suits, deckNumbers)
    }

    toDeckData(){
        var deckData = new DeckData()
        for(let suit of this.suits){
            deckData.suitMeanings[suit.name] = suit.meaning
            deckData.suitSprites[suit.name] = suit.sprite
        }

        for(let number of this.numbers){
            deckData.numberMeanings[number.name] = number.meaning
        }

        for(let card of this.cards){
            if(!deckData.cardSprites[card.suit.name]) deckData.cardSprites[card.suit.name] = {}
            deckData.cardSprites[card.suit.name][card.number.name] = card.sprite
        }

        for(let i=0; i<this.swatch.length; i++){
            deckData.swatch[i] = this.swatch[i]
        }

        return deckData
    }

    getCard(suit, numberName){
        return this.cards.find((e)=> {
            if( e.suit.name == suit && e.number.name == numberName) return true
            else return false
        })
    }

    save(){
        var data = deck.toDeckData()
        console.log(data)
        window.location.hash = LZString.compressToEncodedURIComponent(JSON.stringify(data))
    }

    load (data){
        if(!data){
            if(!window.location.hash) {
                console.log("No hash found loading default")
                data = defaultData
            } else {
                if(window.location.hash.split("#")[1].length<30){
                    console.log("hash not long enough, loading default")
                    data = defaultData
                }
                else{
                    data = JSON.parse(LZString.decompressFromEncodedURIComponent(window.location.hash.split("#")[1]))
                }
            }
        }  
        return Deck.fromDeckData(data)
    }

}

class Card {
    // hovering = false
    constructor(suit, number, sprite){
        this.suit = suit
        this.number = number
        this.sprite = sprite // list of transformations for the sprite from suit
        this.selectedIdx = -1
        this.selectedSpriteInitialTransformation = [[0,0],0]
    }


    
    update(mouse, ctx){
        var a=0
        var hovering = false
        for(let b=0; b<this.sprite.length; b++){
            // if(mouse.start_x) break
            this.translateRotateToSprite(ctx,a)
                ctx.beginPath();
                ctx.rect(0,0, s_canvas_grid_size*s_canvas_cell_size*s_c_scale, s_canvas_grid_size*s_canvas_cell_size*s_c_scale)
            this.untranslateRotateSprite(ctx,a)

            if (ctx.isPointInPath(mouse.x,mouse.y)){
                hovering = true
                break
            }
            a++
        }
        this.draw(ctx)
        if(a==this.sprite.length) return
        
        if(hovering || mouse.start_x) {
            if(mouse.start_x && this.selectedIdx!=-1) a = this.selectedIdx
            ctx.fillStyle = "#00000090"
            // ctx.globalCompositeOperation = "darker";
            this.translateRotateToSprite(ctx,a)
                ctx.fillRect(0, 0, s_canvas_x*s_c_scale,s_canvas_y*s_c_scale)
                ctx.drawImage(s_canvas, 0, 0, s_canvas_x*s_c_scale,s_canvas_y*s_c_scale)
            this.untranslateRotateSprite(ctx,a)
        }

        //dragging
        if(mouse.isClicked && mouse.start_x){ 
            if(this.selectedIdx == -1) {
                console.log(a)
                this.selectedIdx = a
                var t = this.sprite[this.selectedIdx]
                this.selectedSpriteInitialTransformation = [[t[0][0], t[0][1]], t[1]]
            }

            var d_x = mouse.x - mouse.start_x
            var d_y = mouse.y - mouse.start_y
            

            this.sprite[this.selectedIdx][0][0] = parseInt(this.selectedSpriteInitialTransformation[0][0]) + d_x
            this.sprite[this.selectedIdx][0][1] = parseInt(this.selectedSpriteInitialTransformation[0][1]) + d_y
            console.log(d_x, d_y,this.sprite[this.selectedIdx])
        }
        else{ // finished dragging
            this.selectedIdx = -1
        }
    }

    draw(ctx){
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, c_canvas_size_x, c_canvas_size_y)

        var purePaint = true
        if(!purePaint){
            for (let transformation of this.sprite){ // the indents help me remember
                ctx.translate(100,150)
                    ctx.rotate(transformation[1]*3.14*30/360);
                        ctx.translate(transformation[0][0]*0, transformation[0][1]*6);
                            ctx.drawImage(s_canvas,0,0, s_canvas_grid_size*s_canvas_cell_size*s_c_scale, s_canvas_grid_size*s_canvas_cell_size*s_c_scale)
                        ctx.translate(-transformation[0][0]*0, -transformation[0][1]*6);
                    ctx.rotate(-transformation[1]*3.14*30/360);
                ctx.translate(-100,-150)
            }
        }
        else {
            for (let n=0; n<this.sprite.length; n++){
                this.drawSprite(ctx, n)
            }
        }

    }

    drawSprite(ctx, idx=0){
        this.translateRotateToSprite(ctx, idx)
            ctx.drawImage(s_canvas, 0, 0, s_canvas_grid_size*s_canvas_cell_size*s_c_scale, s_canvas_grid_size*s_canvas_cell_size*s_c_scale)
        this.untranslateRotateSprite(ctx, idx)
    }

    translateRotateToSprite(ctx, idx){
        // ctx.save()
        var transformation = this.sprite[idx]
        ctx.translate(s_canvas_x/8,s_canvas_y/8);
            ctx.rotate(transformation[1]*Math.PI/360);
        ctx.translate(-s_canvas_x/8,-s_canvas_y/8)
        ctx.translate(transformation[0][0], transformation[0][1])
    }

    untranslateRotateSprite(ctx,idx){
        var transformation = this.sprite[idx]
        ctx.translate(-transformation[0][0], -transformation[0][1])
        ctx.translate(s_canvas_x/8,s_canvas_y/8);
        ctx.rotate(-transformation[1]*Math.PI/360  );
        ctx.translate(-s_canvas_x/8,-s_canvas_y/8)
        // ctx.restore()
    }
}

class CardSuit {
    constructor (name, meaning, gridCells){
        this.name = name
        this.meaning = meaning
        this.sprite = gridCells
    }

    updateName (name) {
        this.name = name
    }

    updateMeaning (meaning) {
        this.meaning = meaning
    }

    updateSprite (grid){
        this.sprite = grid
    }


}


class CardNumber {
    constructor (name, meaning){
        this.name = name
        this.meaning = meaning
    }
    
    updateName (name) {
        this.name = name
    }

    updateMeaning (meaning) {
        this.meaning = meaning
    }
}

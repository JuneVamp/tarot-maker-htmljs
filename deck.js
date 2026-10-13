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

    getCard(suit, numberName){
        return this.cards.find((e)=> {
            if( e.suit.name == suit && e.number.name == numberName) return true
            else return false
        })
    }
}

class Card {
    constructor(suit, number, sprite){
        this.suit = suit
        this.number = number
        this.sprite = sprite // list of transformations for the sprite from suit
    }
    
    update(mouse, ctx){
        var a=0
        for(let b=0; b<this.sprite.length; b++){
            this.translateRotateToSprite(ctx,a)
                ctx.beginPath();
                ctx.rect(0,0, s_canvas_grid_size*s_canvas_cell_size*s_c_scale, s_canvas_grid_size*s_canvas_cell_size*s_c_scale)
            this.untranslateRotateSprite(ctx,a)

            if (ctx.isPointInPath(mouse.x,mouse.y)){
                this.draw(ctx)
                ctx.fillStyle = "#00000090"
                ctx.
                // ctx.globalCompositeOperation = "darker";
                this.translateRotateToSprite(ctx,a)
                    ctx.fillRect(0, 0, s_canvas_x*s_c_scale,s_canvas_y*s_c_scale)
                    ctx.drawImage(s_canvas, 0, 0, s_canvas_x*s_c_scale,s_canvas_y*s_c_scale)
                this.untranslateRotateSprite(ctx,a)
                console.log(a,b)
                // a++
                break
            }
            a++
            ctx.restore()
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
            for (let n=0; n<this.sprite.length; n++){ // the indents help me remember
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
        var transformation = this.sprite[idx]
        // ctx.save()
        ctx.translate(s_canvas_x/8,s_canvas_y/8);
            ctx.rotate(transformation[1]*Math.PI/360);
        ctx.translate(-s_canvas_x/8,-s_canvas_y/8)
        ctx.translate(transformation[0][0]*10, transformation[0][1]*10)
    }

    untranslateRotateSprite(ctx,idx){
        var transformation = this.sprite[idx]
        ctx.translate(-transformation[0][0]*10, -transformation[0][1]*10)
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

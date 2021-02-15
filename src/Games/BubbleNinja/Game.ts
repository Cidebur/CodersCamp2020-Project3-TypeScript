//import game engine
import { Engine, Entity, Component, CRenderable, CPosition, CVelocity, CGravity, IPointerDevice, CanvasBackground, RenderSettings, Shape, Size, Vector } from "../../Engine";

//import game components, objects, modules
import Pointable from "./GameComponents/Pointable"
import * as Collisions from "./GameModules/Collisions";
import GameObjectGenerator from "./BubbleGenerator/bubleGenerator";

//todo DELETE
// class Bubble extends Entity {
//     constructor(position: Vector, velocity: Vector, arrayComponents: Array<Component> = []) {
//         super([...arrayComponents,
//             new CRenderable("blue", Shape.circle, {width: 50, height:50}),
//             new CPosition(position),
//             new CVelocity(velocity),
//             new CGravity({x: 0, y: 0}),
//             new Pointable(10, 25)
//         ]);
//     }
// }
//end DELETE

export default class Game {

    private _engine: Engine;
    private _points = 0;
    private _gameTime = 0;
    private _maxGameTime;
    private _bubbleGenerator;

    constructor(private _canvas: HTMLCanvasElement, private _inputDevice: IPointerDevice){ //setting might include difficulty: number of lifes between gameover, etc.
        this._maxGameTime = 60000;
        this._engine = new Engine(this._canvas, this._inputDevice, true);
        this._bubbleGenerator = new GameObjectGenerator(this._canvas, this._engine);
    }

    private _lastBubble = 0;

    public start() {

        this._engine.changeBackground({imagePath: "https://images.unsplash.com/photo-1530053969600-caed2596d242?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1867&q=80"});
        this._engine.resumeGame();
        this._engine.mainLoop((deltaTime) => {

            // console.log(this._engine.cursorPosition);
            // console.log("Delta time: " + deltaTime + "ms")

            this._gameTime += deltaTime;
            // this._lastBubble += deltaTime

            this._bubbleGenerator.generator(deltaTime);

            //generate bubbles if the time is right (use deltaTime accumulation)
            // if(this._lastBubble >= 1000){
            //     this._engine.addEntity(new Bubble({x: -50, y: 300}, {x: 5, y: 0}))
            //     this._lastBubble = 0;
            // }

            this._engine.entities.forEach(entity => {

                if(this._detectCursorCollision(entity)){
                    this._points += entity.getComponent(Pointable).points;
                    //todo fireworks
                    this._engine.removeEntity(entity);
                }

            });

            if(this._gameTime >= this._maxGameTime){
                this._gameOver();
                this.pause();
            }

        });
    }

    public pause() {
        this._engine.pauseGame();
    }

    public resume() {
        this._engine.resumeGame();
    }

    private _gameOver() {
        //add final point calculation and write to localstorage
    }

    private _detectCursorCollision(object: Entity): boolean{
        if(object.hasComponent(CPosition) && object.hasComponent(Pointable)){

            const position: Vector = object.getComponent(CPosition);
            const radius = object.getComponent(Pointable).radius;

            return Collisions.collisionCirclePoint(position, radius, this._engine.cursorPosition);
        }
        return false;
    }
}
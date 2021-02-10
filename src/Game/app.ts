import { Engine, Entity, Component, Renderable, Colidable, IPointerDevice, CanvasBackground, RenderSettings, Shape, Size, Vector } from "../Engine";

class mockMouse implements IPointerDevice {
    getCursorPosition(): Vector {
        return {x: 1, y: 1};
    }
}

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const engine = new Engine(canvas, new mockMouse());

class Bubble extends Entity {
    constructor(arrayComponents: Array<Component>) {
        super(arrayComponents);
        this.addComponent(new Renderable("blue", Shape.circle, {width: 50, height:50}));
    }
}

const bubble1 = engine.addEntity(new Bubble([new Colidable({x: -20, y: 50}, {x: 3, y: 0}, {x: 0, y: 0.001})]));
const bubble2 = engine.addEntity(new Bubble([new Colidable({x: -40, y: 60}, {x: 2, y: -0.3}, {x: 0, y: 0.001})]));
const bubble3 = engine.addEntity(new Bubble([new Colidable({x: 1920, y: 100}, {x: -1, y: 0}, {x: 0, y: 0.001})]));

engine.changeBackground({color: "green"});

engine.init(() => {
    console.log("one loop passed")
    engine.entities.forEach(object => {
        if (object.getComponent(Colidable).position.x > canvas.width)
            object.getComponent(Colidable).velocity.x *= -1;
        if (object.getComponent(Colidable).position.y > canvas.height)
            object.getComponent(Colidable).velocity.y *= -1;
    })
});
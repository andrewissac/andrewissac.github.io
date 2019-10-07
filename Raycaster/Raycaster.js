import Line2D from "./Line2D.js";
import Vector2D from "./Vector2D.js";

export default class Raycaster{
    constructor(tempPosition, tempRayCount){
        this._position = new Vector2D(tempPosition.x, tempPosition.y);
        this._rayCount = tempRayCount; // int
        this.rays = []; // array of line2Ds
    }

    get position(){
        return this._position;
    }

    set position(newPosition){
        this._position = new Vector2D(newPosition.x, newPosition.y);
    }

    get rayCount(){
        return this._rayCount;
    }

    set rayCount(newRayCount){
        this._rayCount = newRayCount;
    }

    ClearRays(){
        while(this.rays.length > 0){
            this.rays.pop();
        }
    }

    ConstructRays(){
        // Raylength arbitrary large => just has to be larger then any canvas size
        // initial vector points straight up
        const initialVector = new Vector2D(0, 10000);
        const delta_alpha = 2 * Math.PI / this.rayCount;
        for(let i = 0; i < this.rayCount; i++){
            const rotatedRay = new Line2D(this.position, initialVector.RotateCW(i*delta_alpha));
            this.rays.push(rotatedRay);
        }
    }

    // should be called whenever the position of the Raycaster changes
    UpdateRays(){
        this.ClearRays();
        this.ConstructRays();
    }

    FindAllClosestIntersectionPoints(walls){
        let intersectionPoints = [];
        for(let i = 0; i < this.rays.length; i++){
            let closestIntersectionPoint;
            let shortestDistance = 100000; // arbitrary large number
            for(let j = 0; j < walls.length; j++){
                // save distance of all intersection points of all walls and only push the one that has the smallest distance
                const intersectionPoint = this.rays[i].GetIntersectionPointWith(walls[j]);
                if(typeof(intersectionPoint) === 'undefined') 
                { 
                    continue; 
                }
                else{
                    const distance = intersectionPoint.DistanceTo(this.position);
                    if(distance < shortestDistance){
                        shortestDistance = distance;
                        closestIntersectionPoint = new Vector2D(intersectionPoint.x, intersectionPoint.y);
                    }
                    
                }
            }
            intersectionPoints.push(closestIntersectionPoint);
        }
        return intersectionPoints;
    }

    CutRaysAtClosestIntersectionPoint(intersectionPoints){
        if(intersectionPoints.length != this.rays.length) { 
            console.log("Problem at raycaster.js method: CutRaysAtClosestIntersectionPoint, number of intersectionPoints is not equal to number of rays!");
            return; 
        }
        for(let i = 0; i < this.rays.length; i++){
            if(typeof(intersectionPoints[i]) === 'undefined'){ 
                //console.log("undef intersection point number: " + i); 
                //console.log(intersectionPoints[i]);
            }
            else{
                const newDirection = Vector2D.GetVectorBetween(this.position, intersectionPoints[i]);
                this.rays[i].direction = new Vector2D(newDirection.x, newDirection.y);
            }

        }
    }

    Draw(context){
        for(let ray of this.rays){
            context.beginPath();
            ray.Draw(context);
        }
    }
}
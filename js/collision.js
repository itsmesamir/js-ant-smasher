const rotateCollidedAnts = function(velocity, angle) {

    const velocityAfterRotation = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return velocityAfterRotation;
}
const collisionDetection = function(currentAnt, nextAnt) {

    const verticalVelDiff = currentAnt.velocity.x - nextAnt.velocity.x;
    const horVelDiff = currentAnt.velocity.y - nextAnt.velocity.y;
    const verticalDist = nextAnt.x - currentAnt.x;
    const horizontalDist = nextAnt.y - currentAnt.y;

    // Prevent overlap of currentAnt
    if (verticalVelDiff * verticalDist + horVelDiff * horizontalDist >= 0) {
        const angle = -Math.atan2(nextAnt.y - currentAnt.y, nextAnt.x - currentAnt.x);
        const m1 = currentAnt.mass;
        const m2 = nextAnt.mass;
        // initial velocities after rotation 
        const intVelOfCurrentAnt = rotateCollidedAnts(currentAnt.velocity, angle);
        const intVelOfNextAnt = rotateCollidedAnts(nextAnt.velocity, angle);
        // Final Velocities 
        const finalVelOfCurrentAnt = { x: intVelOfCurrentAnt.x * (m1 - m2) / (m1 + m2) + intVelOfNextAnt.x * 2 * m2 / (m1 + m2), y: intVelOfCurrentAnt.y };
        const finalVelOfNextAnt = { x: intVelOfNextAnt.x * (m1 - m2) / (m1 + m2) + intVelOfCurrentAnt.x * 2 * m2 / (m1 + m2), y: intVelOfNextAnt.y };
        // Final velocity after re-rotating
        const finalVelCurrent = rotateCollidedAnts(finalVelOfCurrentAnt, -angle);
        const finalVelNext = rotateCollidedAnts(finalVelOfNextAnt, -angle);

        currentAnt.velocity.x = finalVelCurrent.x;
        currentAnt.velocity.y = finalVelCurrent.y;

        nextAnt.velocity.x = finalVelNext.x;
        nextAnt.velocity.y = finalVelNext.y;
    }
}
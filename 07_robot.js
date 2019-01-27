// MEASURING A ROBOT
//
// It’s hard to objectively compare robots by just letting them solve a few
// scenarios. Maybe one robot just happened to get easier tasks or the kind of
// tasks that it is good at, whereas the other didn’t.
//
// Write a function compareRobots that takes two robots (and their starting
// memory). It should generate 100 tasks and let each of the robots solve each of
// these tasks. When done, it should output the average number of steps each robot
// took per task.
//
// For the sake of fairness, make sure you give each task to both robots, rather
// than generating different tasks per robot.

function compareRobots(robot1, memory1, robot2, memory2){
    let robot1Results = []; 
    let robot2Results = []; 
    for (let packageNumber = 5; packageNumber <= 500; packageNumber += 5) {
	robot1Results.push(countRobotTurns(VillageState.random(packageNumber), robot1, memory1));
	robot2Results.push(countRobotTurns(VillageState.random(packageNumber), robot2, memory2));
    }
    let average1 = robot1Results.reduce((a,b) => a + b) / 100;
    let average2 = robot2Results.reduce((a,b) => a + b) / 100;
    console.log(`robot1's steps average:${average1}`);
    console.log(`robot2's steps average:${average2}`);
} 

function countRobotTurns(state, robot, memory) {
  for (let turn = 0;; turn++) {
    if (state.parcels.length == 0) {
	return turn;
    }
    let action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
  }
}
// Notice that, even if goalOrientedrobot is better than routeRobot when we
// consider village states with 5 parcels, when we consider village states with
// more parcels (as I do in the loop) routeRobot ends up being better. The
// author does not mention this.


// ROBOT EFFICIENCY
//
// Can you write a robot that finishes the delivery task faster than
// goalOrientedRobot? If you observe that robot’s behavior, what obviously
// stupid things does it do? How could those be improved?
//
// If you solved the previous exercise, you might want to use your compareRobots
// function to verify whether you improved the robot.

function yourRobot({place, parcels}, route) {
    // compute best parcel to deliver
    let bestToDeliver = parcels.filter(p => p.place === place).map(function(p) {
	return {parcel: p, distance: findRoute(roadGraph, place, p.address).length};
    }).reduce( function(a, b ) { if (a.distance <= b.distance) return a; else return b; }, {isEmpty: true} );
    // compute best parcel to pick up
    let bestToPickup  = parcels.filter(p => p.place !== place).map(function(p) {
	return {parcel: p, distance: findRoute(roadGraph, place, p.place).length};
    }).reduce( function(a, b) { if (a.distance <= b.distance) return a; else return b; }, {isEmpty: true} );

    if (route.length == 0) { // if we have no route planned, compute route
	if (bestToPickup.isEmpty) { // if there are no parcel to pick up
	    route = findRoute(roadGraph, place, bestToDeliver.parcel.address);
	} else {
	    if (bestToDeliver.isEmpty) { // if there are no parcel to deliver
		route = findRoute(roadGraph, place, bestToPickup.parcel.place);
	    } else { // if there are both parcels to pick up and parcels to deliver
		if (bestToPickup.distance === bestToDeliver.distance) { // if there's no difference in distance, go for the one to pick up
		    route = findRoute(roadGraph, place, bestToPickup.parcel.place);
		} else { // otherwise choose the closer place
		    parcel = bestToPickup.distance < bestToDeliver.distance ? bestToPickup.parcel : bestToDeliver.parcel;
		    if (bestToPickup.distance < bestToDeliver.distance) {
			route = findRoute(roadGraph, place, bestToPickup.parcel.place);
		    } else {
			route = findRoute(roadGraph, place, bestToDeliver.parcel.address);
		    }
		}
	    }
	}
    }
    return {direction: route[0], memory: route.slice(1)};
}


// Persistent group
//
// Most data structures provided in a standard JavaScript environment aren’t
// very well suited for persistent use. Arrays have slice and concat methods,
// which allow us to easily create new arrays without damaging the old one. But
// Set, for example, has no methods for creating a new set with an item added or
// removed.
//
// Write a new class PGroup, similar to the Group class from Chapter 6, which
// stores a set of values. Like Group, it has add, delete, and has methods.
//
// Its add method, however, should return a new PGroup instance with the given
// member added and leave the old one unchanged. Similarly, delete creates a new
// instance without a given member.
//
// The class should work for values of any type, not just strings. It does not
// have to be efficient when used with large amounts of values.
//
// The constructor shouldn’t be part of the class’s interface (though you’ll
// definitely want to use it internally). Instead, there is an empty instance,
// PGroup.empty, that can be used as a starting value.
//
// Why do you need only one PGroup.empty value, rather than having a function
// that creates a new, empty map every time?

class PGroup {
    constructor(members) {
	this.members = members; 
    }
    add(el) {
	let members = this.members.concat();
	if (! members.includes(el)) members.push(el);
	return new PGroup(members);
    }
    delete(el) {
	let members = this.members.concat().filter(a => a !== el);
	return new PGroup(members);
    }
    has(el) {
	return this.members.includes(el);
    }
}
PGroup.empty = new PGroup([]); 

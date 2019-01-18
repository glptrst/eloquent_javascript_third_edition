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

// runRobotAnimation(VillageState.random(), yourRobot, memory);


// ROBOT EFFICIENCY
//
// Can you write a robot that finishes the delivery task faster than
// goalOrientedRobot? If you observe that robot’s behavior, what obviously
// stupid things does it do? How could those be improved?
//
// If you solved the previous exercise, you might want to use your compareRobots
// function to verify whether you improved the robot.

function yourRobot({place, parcels}, route) {
    if (route.length == 0) { // if we have no route planned, compute route
	// parcels to deliver
	let toDeliver = parcels.filter(p => p.place === place).map(function(p) {
	    return {parcel: p, distance: findRoute(roadGraph, place, p.address).length};
	});
	// compute best parcel to deliver
	let bestToDeliver = toDeliver[0];
	for (let i = 1; i < toDeliver.length; i++)
	    if (toDeliver[i].distance < bestToDeliver.distance)
		bestToDeliver = toDeliver[i];
	// parcels to pick up
	let toPickup  = parcels.filter(p => p.place !== place).map(function(p) {
	    return {parcel: p, distance: findRoute(roadGraph, place, p.place).length};
	});
	// compute best parcel to pick up
	let bestToPickup = toPickup[0];
	for (let i = 1; i < toPickup.length; i++)
	    if (toPickup[i].distance < bestToPickup.distance)
		bestToPickup = toPickup[i];
	
	if (bestToPickup === undefined) { // if there are no parcel to pick
	    parcel = bestToDeliver.parcel;
	} else {
	    if (bestToDeliver === undefined) { // if there are no parcel to deliver
		parcel = bestToPickup.parcel;
	    } else { // if there are both parcels to pick up and parcels to deliver
		if (bestToPickup.distance === bestToDeliver.distance) {
		    parcel = bestToPickup.parcel;
		} else {
		    parcel = bestToPickup.distance < bestToDeliver.distance ? bestToPickup.parcel : bestToDeliver.parcel;
		}
	    }
	}
	
	if (parcel.place != place) { // if that parcel is not where the robot currently is
	    route = findRoute(roadGraph, place, parcel.place); // then compute the route to pick it up
	} else { // if that parcel is where the roboto currently is
	    route = findRoute(roadGraph, place, parcel.address); // then compute the route to deliver it
	}
    }
    return {direction: route[0], memory: route.slice(1)};
}

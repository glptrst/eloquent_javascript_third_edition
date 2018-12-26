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

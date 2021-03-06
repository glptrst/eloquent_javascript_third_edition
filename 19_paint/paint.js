class Picture {
  constructor(width, height, pixels) {
    this.width = width;
    this.height = height;
    this.pixels = pixels;
  }
  static empty(width, height, color) {
    let pixels = new Array(width * height).fill(color);
    return new Picture(width, height, pixels);
  }
  pixel(x, y) {
    return this.pixels[x + y * this.width];
  }
  draw(pixels) {
    let copy = this.pixels.slice();
    for (let { x, y, color } of pixels) {
      copy[x + y * this.width] = color;
    }
    return new Picture(this.width, this.height, copy);
  }
}

function updateState(state, action) {
  return Object.assign({}, state, action);
}

function elt(type, props, ...children) {
  let dom = document.createElement(type);
  if (props) Object.assign(dom, props);
  for (let child of children) {
    if (typeof child != "string") dom.appendChild(child);
    else dom.appendChild(document.createTextNode(child));
  }
  return dom;
}

let scale = 10;

class PictureCanvas {
  constructor(picture, pointerDown) {
    this.dom = elt("canvas", {
      onmousedown: event => this.mouse(event, pointerDown),
      ontouchstart: event => this.touch(event, pointerDown)
    });
    this.syncState(picture);
  }
  syncState(picture) {
    if (this.picture == picture) return;
    let previousPic = this.picture;
    this.picture = picture;
    drawPicture(this.picture, this.dom, scale, previousPic);
  }
}

function drawPicture1(picture, canvas, scale, previousPic) {
  // set canvas.width/height only if picture's size is different from
  // previousPic's size, to avoid clearing the canvas.
  if (!(previousPic && picture.width == previousPic.width && picture.height === previousPic.height)) {
    canvas.width = picture.width * scale;
    canvas.height = picture.height * scale;
    previousPic = null;
  }
  let cx = canvas.getContext("2d");

  for (let y = 0; y < picture.height; y++) {
    for (let x = 0; x < picture.width; x++) {
      if (previousPic && previousPic.pixel(x, y) === picture.pixel(x, y)) {
        ; //nothing to do  
      } else {
        cx.fillStyle = picture.pixel(x, y);
        cx.fillRect(x * scale, y * scale, scale, scale);
      }
    }
  }
}

function drawPicture(picture, canvas, scale) {
  canvas.width = picture.width * scale;
  canvas.height = picture.height * scale;
  let cx = canvas.getContext("2d");

  for (let y = 0; y < picture.height; y++) {
    for (let x = 0; x < picture.width; x++) {
      cx.fillStyle = picture.pixel(x, y);
      cx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
}

PictureCanvas.prototype.mouse = function(downEvent, onDown) {
  if (downEvent.button != 0) return;
  let pos = pointerPosition(downEvent, this.dom);
  let onMove = onDown(pos);
  if (!onMove) return;
  let move = moveEvent => {
    if (moveEvent.buttons == 0) {
      this.dom.removeEventListener("mousemove", move);
    } else {
      let newPos = pointerPosition(moveEvent, this.dom);
      if (newPos.x == pos.x && newPos.y == pos.y) return;
      pos = newPos;
      onMove(newPos);
    }
  };
  this.dom.addEventListener("mousemove", move);
};

function pointerPosition(pos, domNode) {
  let rect = domNode.getBoundingClientRect();
  return {
    x: Math.floor((pos.clientX - rect.left) / scale),
    y: Math.floor((pos.clientY - rect.top) / scale)
  };
}

PictureCanvas.prototype.touch = function(startEvent,
					 onDown) {
  let pos = pointerPosition(startEvent.touches[0], this.dom);
  let onMove = onDown(pos);
  startEvent.preventDefault();
  if (!onMove) return;
  let move = moveEvent => {
    let newPos = pointerPosition(moveEvent.touches[0],
				 this.dom);
    if (newPos.x == pos.x && newPos.y == pos.y) return;
    pos = newPos;
    onMove(newPos);
  };
  let end = () => {
    this.dom.removeEventListener("touchmove", move);
    this.dom.removeEventListener("touchend", end);
  };
  this.dom.addEventListener("touchmove", move);
  this.dom.addEventListener("touchend", end);
};

class PixelEditor {
  constructor(state, config) {
    let { tools, controls, dispatch } = config;
    this.state = state;

    this.canvas = new PictureCanvas(state.picture, pos => {
      let tool = tools[this.state.tool];
      let onMove = tool(pos, this.state, dispatch);
      if (onMove) return pos => onMove(pos, this.state);
    });
    this.controls = controls.map(
      Control => new Control(state, config));
    this.dom = elt("div", { tabIndex: 0 }, this.canvas.dom, elt("br"),
		   ...this.controls.reduce(
                     (a, c) => a.concat(" ", c.dom), []));

    this.dom.addEventListener("keydown", function(ev) {
      for (let tool of Object.keys(tools)) {
        if (ev.key[0] === tool[0]) {
          ev.preventDefault();
          dispatch({ tool: tool });
          return;
        }
      }
      if ((ev.ctrlKey && ev.key === 'z') || (ev.metaKey && ev.key === 'z')) {
        ev.preventDefault();
        dispatch({ undo: true });
      }
    });
  }
  syncState(state) {
    this.state = state;
    this.canvas.syncState(state.picture);
    for (let ctrl of this.controls) ctrl.syncState(state);
  }
}

class ToolSelect {
  constructor(state, { tools, dispatch }) {
    this.select = elt("select", {
      onchange: () => dispatch({ tool: this.select.value })
    }, ...Object.keys(tools).map(name => elt("option", {
      selected: name == state.tool
    }, name)));
    this.dom = elt("label", null, "🖌 Tool: ", this.select);
  }
  syncState(state) { this.select.value = state.tool; }
}

class ColorSelect {
  constructor(state, { dispatch }) {
    this.input = elt("input", {
      type: "color",
      value: state.color,
      onchange: () => dispatch({ color: this.input.value })
    });
    this.dom = elt("label", null, "🎨 Color: ", this.input);
  }
  syncState(state) { this.input.value = state.color; }
}

function draw(pos, state, dispatch) {
  function drawPixel({ x, y }, state) {
    let drawn = { x, y, color: state.color };
    console.log(drawn);
    dispatch({ picture: state.picture.draw([drawn]) });
  }
  drawPixel(pos, state);
  return drawPixel;
}


function line(pos, state, dispatch) {
  // ``naive algorithm'' from Wikipedia:
  // dx = x2 - x1
  // dy = y2 - y1
  // for x from x1 to x2 {
  //   y = y1 + dy * (x - x1) / dx
  //   plot(x, y)
  // }
  let startPoint, endPoint;
  function drawLine({x, y}) {
    let line = [];
    if (!startPoint)
      startPoint = { x, y, color: state.color };
    else
      endPoint = { x, y, color: state.color };
    if (endPoint) {
      if (Math.abs(startPoint.x - endPoint.x) >
	  Math.abs(startPoint.y - endPoint.y)) { //horizontalish line
	
	if (startPoint.x > endPoint.x) { 
	  // swap start and end
	  let dx = startPoint.x - endPoint.x;
	  let dy = startPoint.y - endPoint.y;
	  for (let x = endPoint.x; x <= startPoint.x; x++) {
	    let y = Math.floor(endPoint.y + dy * (x - endPoint.x) / dx);
	    line.push({x, y, color: state.color});
	  }
	}
	else {
	  let dx = endPoint.x - startPoint.x;
	  let dy = endPoint.y - startPoint.y;
	  for (let x = startPoint.x; x <= endPoint.x; x++) {
	    let y = Math.floor(startPoint.y + dy * (x - startPoint.x) / dx);
	    line.push({x, y, color: state.color});
	  }
	}
      } else { //verticalish line
	if (startPoint.y > endPoint.y) {
	  // swap start and end
	  let dx = startPoint.x - endPoint.x;
	  let dy = startPoint.y - endPoint.y;
	  for (let y = endPoint.y; y <= startPoint.y; y++) {
	    let x = Math.floor(endPoint.x + dx * (y - endPoint.y) / dy);
	    line.push({x, y, color: state.color});
	  }
	} else {
	  let dx = endPoint.x - startPoint.x;
	  let dy = endPoint.y - startPoint.y;
	  for (let y = startPoint.y; y <= endPoint.y; y++) {
	    let x = Math.floor(startPoint.x + dx * (y - startPoint.y) / dy);
	    line.push({x, y, color: state.color});
	  }
	}
      }
    }
    dispatch({ picture: state.picture.draw(line) });
  }
  drawLine(pos);
  return drawLine;
}

function rectangle(start, state, dispatch) {
  function drawRectangle(pos) {
    let xStart = Math.min(start.x, pos.x);
    let yStart = Math.min(start.y, pos.y);
    let xEnd = Math.max(start.x, pos.x);
    let yEnd = Math.max(start.y, pos.y);
    let drawn = [];
    for (let y = yStart; y <= yEnd; y++) {
      for (let x = xStart; x <= xEnd; x++) {
        drawn.push({ x, y, color: state.color });
      }
    }
    dispatch({ picture: state.picture.draw(drawn) });
  }
  drawRectangle(start);
  return drawRectangle;
}

function circle(start, state, dispatch) {
  function drawCircle(pos) {
    //get distance between start and current pointer (radius)
    let xStart = Math.min(start.x, pos.x);
    let yStart = Math.min(start.y, pos.y);
    let xEnd = Math.max(start.x, pos.x);
    let yEnd = Math.max(start.y, pos.y);
    let xDiff = xEnd - xStart;
    let yDiff = yEnd - yStart;
    let radius = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
    console.log(`distance: ${radius}`);
    let drawn = [];
    //loop over a square of pixels around the start position,
    //whose sides are at least twice the radius. Color those that
    //are withing the circle radius
    console.log(`start: x: ${xStart}, y: ${yStart}`);
    let rectStart = { x: xStart - Math.floor(radius), y: yStart - Math.floor(radius) };
    console.log(`floor(radius): ${Math.floor(radius)}`);
    console.log(`rectStart: ${rectStart.x}, ${rectStart.y}`);
    let rectEnd = { x: xStart + Math.floor(radius), y: yStart + Math.floor(radius) };
    console.log(`rectEnd: ${rectEnd.x}, ${rectEnd.y}`);
    console.log(state.picture.width);
    console.log(state.picture.height);
    for (let y = rectStart.y; y <= rectEnd.y; y++) {
      for (let x = rectStart.x; x <= rectEnd.x; x++) {
        console.log(`x: ${x}, y: ${y}`);
        if (x < state.picture.width && x > 0) {
          // get distance from current pixel to the starting pixel
          let xd = x - xStart;
          let yd = y - yStart;
          let distance = Math.sqrt(Math.pow(xd, 2) + Math.pow(yd, 2));
          // (is the distance from current pixel to the starting
          // pixel less or equal to the radius?)
          if (distance < radius) {
            // color pixel if conditions are met
            drawn.push({ x, y, color: state.color });
          }
        }
      }
    }


    dispatch({ picture: state.picture.draw(drawn) });
  }
  drawCircle(start);
  return drawCircle;
}

let around = [{ dx: -1, dy: 0 }, { dx: 1, dy: 0 },
	      { dx: 0, dy: -1 }, { dx: 0, dy: 1 }];

function fill({ x, y }, state, dispatch) {
  let targetColor = state.picture.pixel(x, y);
  let drawn = [{ x, y, color: state.color }];
  for (let done = 0; done < drawn.length; done++) {
    for (let { dx, dy } of around) {
      let x = drawn[done].x + dx, y = drawn[done].y + dy;
      if (x >= 0 && x < state.picture.width &&
          y >= 0 && y < state.picture.height &&
          state.picture.pixel(x, y) == targetColor &&
          !drawn.some(p => p.x == x && p.y == y)) {
        drawn.push({ x, y, color: state.color });
      }
    }
  }
  dispatch({ picture: state.picture.draw(drawn) });
}

function pick(pos, state, dispatch) {
  dispatch({ color: state.picture.pixel(pos.x, pos.y) });
}

class SaveButton {
  constructor(state) {
    this.picture = state.picture;
    this.dom = elt("button", {
      onclick: () => this.save()
    }, "💾 Save");
  }
  save() {
    let canvas = elt("canvas");
    drawPicture(this.picture, canvas, 1);
    let link = elt("a", {
      href: canvas.toDataURL(),
      download: "pixelart.png"
    });
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  syncState(state) { this.picture = state.picture; }
}

class LoadButton {
  constructor(_, { dispatch }) {
    this.dom = elt("button", {
      onclick: () => startLoad(dispatch)
    }, "📁 Load");
  }
  syncState() { }
}

function startLoad(dispatch) {
  let input = elt("input", {
    type: "file",
    onchange: () => finishLoad(input.files[0], dispatch)
  });
  document.body.appendChild(input);
  input.click();
  input.remove();
}

function finishLoad(file, dispatch) {
  if (file == null) return;
  let reader = new FileReader();
  reader.addEventListener("load", () => {
    let image = elt("img", {
      onload: () => dispatch({
        picture: pictureFromImage(image)
      }),
      src: reader.result
    });
  });
  reader.readAsDataURL(file);
}

function pictureFromImage(image) {
  let width = Math.min(100, image.width);
  let height = Math.min(100, image.height);
  let canvas = elt("canvas", { width, height });
  let cx = canvas.getContext("2d");
  cx.drawImage(image, 0, 0);
  let pixels = [];
  let { data } = cx.getImageData(0, 0, width, height);

  function hex(n) {
    return n.toString(16).padStart(2, "0");
  }
  for (let i = 0; i < data.length; i += 4) {
    let [r, g, b] = data.slice(i, i + 3);
    pixels.push("#" + hex(r) + hex(g) + hex(b));
  }
  return new Picture(width, height, pixels);
}

function historyUpdateState(state, action) {
  if (action.undo == true) {
    if (state.done.length == 0) return state;
    return Object.assign({}, state, {
      picture: state.done[0],
      done: state.done.slice(1),
      doneAt: 0
    });
  } else if (action.picture &&
             state.doneAt < Date.now() - 1000) {
    return Object.assign({}, state, action, {
      done: [state.picture, ...state.done],
      doneAt: Date.now()
    });
  } else {
    return Object.assign({}, state, action);
  }
}

class UndoButton {
  constructor(state, { dispatch }) {
    this.dom = elt("button", {
      onclick: () => dispatch({ undo: true }),
      disabled: state.done.length == 0
    }, "⮪ Undo");
  }
  syncState(state) {
    this.dom.disabled = state.done.length == 0;
  }
}

let startState = {
  tool: "draw",
  color: "#000000",
  picture: Picture.empty(60, 30, "#f0f0f0"),
  done: [],
  doneAt: 0
};

let baseTools = { draw, fill, rectangle, pick, circle, line };

let baseControls = [
  ToolSelect, ColorSelect, SaveButton, LoadButton, UndoButton
];

function startPixelEditor({ state = startState,
			    tools = baseTools,
			    controls = baseControls }) {
  let app = new PixelEditor(state, {
    tools,
    controls,
    dispatch(action) {
      state = historyUpdateState(state, action);
      app.syncState(state);
    }
  });
  return app.dom;
}

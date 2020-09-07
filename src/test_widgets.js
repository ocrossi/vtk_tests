import 'vtk.js/Sources/favicon';

import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';
import vtkConeSource from 'vtk.js/Sources/Filters/Sources/ConeSource';
import vtkDistanceWidget from 'vtk.js/Sources/Widgets/Widgets3D/DistanceWidget'; // pour  instant on test comme ca apres faudra le lnk aux custooms files de mon
import vtkWidgetManager from 'vtk.js/Sources/Widgets/Core/WidgetManager';
import vtkCubeSource from 'vtk.js/Sources/Filters/Sources/CubeSource';
import controlPanel from './controlPanel.html';

// render setup

const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({background: [0, 0, 0]});
const renderer = fullScreenRenderer.getRenderer();
const renderWindow = fullScreenRenderer.getRenderWindow();



// --- Set up the cone actor ---

const cone = vtkCubeSource.newInstance();
const actor = vtkActor.newInstance();
const mapper = vtkMapper.newInstance();


// tell the actor which mapper to use
actor.setMapper(mapper);
mapper.setInputConnection(cone.getOutputPort());
actor.getProperty().setOpacity(0.5);

renderer.addActor(actor);


/************** WIDGET MANAGER ************************************************/

const widgetManager = vtkWidgetManager.newInstance();
widgetManager.setRenderer(renderer);

const widget = vtkDistanceWidget.newInstance();
widget.placeWidget(cone.getOutputData().getBounds);
widgetManager.addWidget(widget);

renderer.resetCamera();
widgetManager.enablePicking();

/******************************************************************************/
// --- Add actor to scene ---

fullScreenRenderer.addController(controlPanel);

widget.getWidgetState().onModified(() => {
	console.log(widget.getDistance());
	document.querySelector('#distance').innerText = widget.getDistance();
});

document.querySelector('button').addEventListener('click', () => {
	widgetManager.grabFocus(widget);
});


// --- Expose globals so we can play with values in the dev console ---


renderer.resetCamera();
renderWindow.render();



global.renderWindow = renderWindow;
global.renderer = renderer;
global.actor = actor;
global.mapper = mapper;

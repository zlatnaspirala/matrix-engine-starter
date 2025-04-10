# matrix-engine-starter 1.1.0

## Objective

- Real matrix-engine projects help examples.
- Test matrix-engine usage with npm service (`npm i matrix-engine`).
- Very interest apps (all done with matrixEngine):
  - Web Anatomy
  - FPShooter HANG3d-Matrix
  - Roulette
  - Slot

I have single package.json file for client and server staff.
Compiled lib destionation is folder `./builds`.

### Prerequirement

```js
npm install -g browserify
```

### Install with:

```js
npm i
```

### Watch build with:

```js
  npm run examples
  npm run app
  npm run slot
  npm run roulette
	npm run anatomy
	npm run hang3d
```

### Build your Application script bundle with:

```js
  npm run build.examples
  npm run build.app
  npm run build.slot
  npm run build.roulette
	npm run build.hang3d
```

And navigate to app.html, examples.html etc.

## Projects

## NEW PROJECT - Hang3d Matrix MultiPlayer FPShooter MIT Licence

- Basic for now

<img src="https://github.com/zlatnaspirala/matrix-engine-starter/blob/main/non-project/hang3d-matrix.png" >
Run:  `npm run hang3d`
Link : https://maximumroulette.com/apps/matrix-engine-starter/projects/hang3d/

Under hang3d project you can find in folder `tools/` Map Creator. [Will be part of MatrixEngine or ME-plugins]
<img src="https://github.com/zlatnaspirala/matrix-engine-starter/blob/main/non-project/map-creator.png" >

Big map comes from object (OBJ format) with groups.
If you wanna platform for player walking then add cube from blender and give similar name:

Collider will tell MartixEngine to add physics body cube.
floor will break jumping effect.

```
Cube.COLLIDER.floor
```


## Matrix Roulette - 3d physics roulette

TODO:

- After updating me2.0.xx i found bug in wheels roation
- Replace with net2 driver. WIP

In `projects\matrix-roulette` First time is used ServerEvents tech from rocketcraftingserver project.

I separated server gameplay code to the BE project rocketcraftingserver.

Communication is so simple:

```js
matrixEngine.Engine.activateNet2(undefined, {
  sessionName: "matrix-roulette",
  resolution: "240x160",
});
```

New feature is ServerEvent tech.
On client side only we need to do:

```js
const events = new EventSource("https://maximumroulette.com/matrix-roulette");
events.onmessage = event => {
  console.log("MatrixRoulette:", event);
};
```

#### Url parameters:

<pre>
 +-----------------------------------------------------------------------------------+
 |-----------------------------------------------------------------------------------+
 ||       URLParameter          value          Description                           |
 +-----------------------------------------------------------------------------------+
 |                                                                                   |
 |        ?server=              manual         Server is used for video chat etc not |
 |                                             gameplay results.Wheel view is called |
 |                                                              on SPIN procedure.   |
 |                                                                                   |
 |                                                                                   |
 |        &sounds=              Boolean        Sounds are active only if url param   |
 |                                             is true.                              |
 |                                                                                   |
 |        &cameraSpeed=         Number         Best range values from 0.5 to 1       |
 |                                                                                   |
 |        &nui=                 Boolean        Use NUICommander or not.              |
 |                                                                                   |
 +-----------------------------------------------------------------------------------+

</pre>

##### Notes

- Used cannon.js integration for matrix-engine.
- It is important to run in `https` protocol for production also for localhost!
- Video presentation
  https://www.youtube.com/watch?v=2N_vgMu5QoI&ab_channel=javascriptfanatic

### table bet view

![matrix-slot](https://github.com/zlatnaspirala/matrix-engine-starter/blob/main/non-project/matrix-roulette-1.png)

### Wheel view

![matrix-slot](https://github.com/zlatnaspirala/matrix-engine-starter/blob/main/non-project/matrix-roulette-2.png)

## Web-Anatomy [skeletal , muscular]

![matrix-anatomy](https://github.com/zlatnaspirala/matrix-engine-starter/blob/main/non-project/matrix-anatomy.png)
Implemented skeletal system ~ 20mb data

## Slot-Mashine

- Slot mashine config constructor.
- Voice commander [Say `spin` or `play` for spining.].

- Video presentation
  https://www.youtube.com/watch?v=SG7jid1IDkA&ab_channel=javascriptfanatic

  ![matrix-slot](https://github.com/zlatnaspirala/matrix-engine-starter/blob/main/non-project/slot.png)

## Matrix Video Editor 
   [DEEP WIP]
   From canvas to mp4 
	 

### Demo from this repo [matrix-engine-starter]

- https://maximumroulette.com/apps/matrix-engine-starter/projects/matrix-roulette/
- https://maximumroulette.com/apps/matrix-engine-starter/projects/matrix-slot/
- https://maximumroulette.com/apps/matrix-engine-starter/projects/web-anatomy/
- https://maximumroulette.com/apps/matrix-engine-starter/projects/hang3d/

### Engine source link:

https://github.com/zlatnaspirala/matrix-engine



### About BVH animator

- BVH automatic scene elements dont have a physics by default.
- Sometime there is a error in decimals like 0,10000 become 0.33000 or similar.
You can easy fix direct in bvh file.
- You can change manual content intro bvh file:


Shema for position `XZY`
```bvh
ROOT Bone
{
	OFFSET 0.000000 0.000000 0.000000
	CHANNELS 6 Xposition Zposition Yposition Xrotation Yrotation Zrotation
	End Site
	{
		OFFSET 0.000000 0.000000 1.000000
	}
}
```
Shema for position `XYZ`
```js
ROOT Bone
{
	OFFSET 0.000000 0.000000 0.000000
	CHANNELS 6 Xposition Yposition Zposition Xrotation Yrotation Zrotation
	End Site
	{
		OFFSET 0.000000 0.000000 1.000000
	}
}
```

### About videos optimisation 

```js
   ffmpeg -i 503148_inn.mp4 -codec:a copy -vcodec libx264 -crf 24 503148.mp4
   ffmpeg  -i 503148_inn.mp4 -codec:a copy -preset ultrafast -vcodec h264 -b:v 1000k -acodec mp3 503148.mp4
```


### Credits

- https://www.wildtextures.com
- https://www.iconfinder.com/icons/939737/html5_icon_%E2%80%A2_html_icon

- Anatomy objects
  The license for this database is specified in the Creative Commons Attribution-Share Alike 2.1 Japan. If you use data from this database, please be sure attribute this database as follows:
  "BodyParts3D, © The Database Center for Life
  Science licensed under CCAttribution-Share Alike 2.1 Japan".
  Origin license link: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html

  Modification (optimisation) on origin data
  CCAttribution-Share Alike 2.1 Japan ©
  Nikola Lukic maximumroulette.com

  https://www.freesoundtrackmusic.com/guest/demolib

### Licence

Projects folder 
 -`projects/hang3d`
 -`projects/matrix-slot`
 under licence:
`MIT Licence`
All other folders are under `Mit licence` except on graphics cases (ussually i add origin src link).
I never take non-commercial in resources aspect.
My blender works are total free.

Projects folder:
 -`projects/web-anatomy`
 under GPL v3 + CCAttribution-Share Alike 2.1 Japan

 -`projects/matrix-roulette`
 under GPL v3
 
### Credits

- Used in HANG3d Matrix template:
  BLACK FLY by Audionautix | http://audionautix.com
  Music promoted by https://www.free-stock-music.com
  Creative Commons Attribution-ShareAlike 3.0 Unported

### Join chat on slack

(GamePlay platform Rock)[https://join.slack.com/t/gameplay-rock/shared_invite/zt-ffcgl80x-CYu4s~YC0bD9Od9_bkqmzw]

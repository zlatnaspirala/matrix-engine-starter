# matrix-engine-starter
## Objective
 - Real matrix-engine projects help examples.
 - Test matrix-engine usage with npm service (`npm i matrix-engine`).
 
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
```

### Build your Application script bundle with:

```js
  npm run build.examples
  npm run build.app
  npm run build.slot
  npm run build.roulette
```

And navigate to app.html, examples.html etc.

### Projects

#### Matrix Roulette - 3d physics roulette 

 In `projects\matrix-roulette` First time is used inject if gameplay logic intro broadcaster(matrix-networks)
 Networking is based for now only on websocket tech.
 - Video chat P2P/webRTC
 - Data channels - matrix-roulette server part

If you wanna run server part best way is to navigate to the folder `projects\matrix-roulette\scripts\server`
And then from server folder run Node.js file:

```bash
node roulette
```

For windows users:
```bash
matrix-network.bat
```

For Linux/Mac users:
```bash
matrix-network.sh
```

##### Notes
 - Used cannon.js integration for matrix-engine.
 - It is important to run in `https` protocol for production also for localhost!
 - Video presentation
  https://www.youtube.com/watch?v=2N_vgMu5QoI&ab_channel=javascriptfanatic

### table bet view
![matrix-slot](https://github.com/zlatnaspirala/matrix-engine-starter/blob/main/non-project/matrix-roulette-1.png)

### Wheel view
![matrix-slot](https://github.com/zlatnaspirala/matrix-engine-starter/blob/main/non-project/matrix-roulette-2.png)

#### Web-Anatomy underconstructing

![matrix-anatomy](https://github.com/zlatnaspirala/matrix-engine-starter/blob/main/non-project/matrix-anatomy.png)
Implemented skeletal system ~ 20mb data

#### Slot-Mashine underconstructing

- Slot mashine config constructor.
- Voice commander [Say `spin` or `play` for spining.].

- Video presentation
  https://www.youtube.com/watch?v=SG7jid1IDkA&ab_channel=javascriptfanatic

  ![matrix-slot](https://github.com/zlatnaspirala/matrix-engine-starter/blob/main/non-project/slot.png)

### Demo links for engine:

- https://maximumroulette.com/apps/matrix-engine/examples-build.html
- https://maximumroulette.com/apps/matrix-engine/app-build.html

### Demo from this repo [matrix-engine-starter]

- https://maximumroulette.com/apps/matrix-engine-starter/projects/matrix-roulette/
- https://maximumroulette.com/apps/matrix-engine-starter/projects/matrix-slot/
- https://maximumroulette.com/apps/matrix-engine-starter/projects/web-anatomy/ WIP

Standard Matrix engine apps/examples:
- https://maximumroulette.com/apps/matrix-engine-starter/examples.html
- https://maximumroulette.com/apps/matrix-engine-starter/projects/matrix-slot/
- https://maximumroulette.com/apps/matrix-engine-starter/app-build.html [anatomy]

### Engine source link:

https://github.com/zlatnaspirala/matrix-engine

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

### Licence

 Projects folder `projects/` under licence:
`GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007`
All other folders are under `Mit licence`.

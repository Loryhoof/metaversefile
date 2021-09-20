import * as THREE from 'three';

import metaversefile from 'metaversefile';
const {useApp, useWorld, useCleanup} = metaversefile;

console.log('load scn');

export default e => {
  // const app = useApp();
  const world = useWorld();
  
  const srcUrl = '${this.srcUrl}';

  (async () => {
    const res = await fetch(srcUrl);
    const j = await res.json();
    console.log('scene json', j);
    const {objects} = j;
    const promises = objects.map(async object => {
      let {start_url, position = [0, 0, 0], quaternion = [0, 0, 0, 1], scale = [1, 1, 1]} = object;
      position = new THREE.Vector3().fromArray(position);
      quaternion = new THREE.Quaternion().fromArray(quaternion);
      scale = new THREE.Vector3().fromArray(scale);
      world.addObject(start_url, position, quaternion, scale);

      /* let {start_url, position, quaternion, scale, physics, physics_url, autoScale, autoRun, dynamic} = object;
      if (position) {
        position = new THREE.Vector3().fromArray(position);
      }
      if (quaternion) {
        quaternion = new THREE.Quaternion().fromArray(quaternion);
      }
      if (scale) {
        scale = new THREE.Vector3().fromArray(scale);
      }
      const o = await world.addObject(start_url, null, position, quaternion, scale, {
        physics,
        physics_url,
        autoScale,
      }); */
      /* if (autoRun && o.useAux) {
        o.useAux(rigManager.localRig.aux);
      } */
    });
    await Promise.all(promises);
  })();

  return null;
};
import * as THREE from 'three';
import metaversefile from 'metaversefile';
const {useApp, useFrame, useLoaders, useScene, usePhysics, useInternals, useJSON6Internal, useCleanup} = metaversefile;

const {renderer} = useInternals();
const JSON6 = useJSON6Internal();
const geometry = new THREE.PlaneBufferGeometry(2, 2);

export default e => {
  const app = useApp();
  app.appType = 'gltj';

  const srcUrl = '${this.srcUrl}';
  
  let _update = null;
  e.waitUntil((async () => {
    const res = await fetch(srcUrl);
    const s = await res.text();
    const j = JSON6.parse(s);
    
    const material = new THREE.ShaderMaterial(j);
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    app.add(mesh);
    
    let now = 0;
    _update = timeDiff => {
      if (material.uniforms.iTime) {
        material.uniforms.iTime.value = now/1000;
        material.uniforms.iTime.needsUpdate = true;
      }
      if (material.uniforms.iResolution) {
        if (!material.uniforms.iResolution.value) {
          material.uniforms.iResolution.value = new THREE.Vector2();
        }
        renderer.getSize(material.uniforms.iResolution.value)
          .multiplyScalar(renderer.getPixelRatio());
        material.uniforms.iResolution.needsUpdate = true;
      }
      
      now += timeDiff;
    };
  })());

  useFrame(({timeDiff}) => {
    _update && _update(timeDiff);
  });

  return app;
};
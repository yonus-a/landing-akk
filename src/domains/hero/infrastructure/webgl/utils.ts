import * as THREE from "three";

export function freezeStaticGroup(group: THREE.Object3D): void {
  group.updateMatrixWorld(true);
  group.traverse((obj) => {
    obj.matrixAutoUpdate = false;
  });
}

export function disposeObject3D(obj: THREE.Object3D): void {
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh || child instanceof THREE.Sprite) {
      if (child.geometry) {
        child.geometry.dispose();
      }
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => disposeMaterial(mat));
        } else {
          disposeMaterial(child.material);
        }
      }
    }
  });
}

function disposeMaterial(material: THREE.Material): void {
  material.dispose();
  const mat = material as unknown as Record<string, unknown>;
  for (const key of Object.keys(mat)) {
    const prop = mat[key];
    if (
      prop &&
      typeof prop === "object" &&
      "isTexture" in prop &&
      Boolean((prop as { isTexture?: boolean }).isTexture)
    ) {
      (prop as THREE.Texture).dispose();
    }
  }
}

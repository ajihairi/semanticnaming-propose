import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";

/* deterministic pseudo-random from slide index */
function seed01(i: number, salt: number) {
  let h = (i + 1) * 2654435761 + salt * 40503;
  h = (h ^ (h >> 13)) * 1103515245;
  return ((h ^ (h >> 16)) >>> 0) / 4294967296;
}

type Motion = {
  rx: number; ry: number; rz: number;
  cx: number; cy: number; cz: number;
  sx: number;
};

function makeTarget(i: number): Motion {
  const range = (s: number, lo: number, hi: number) => lo + seed01(i, s) * (hi - lo);
  return {
    rx: range(1, -0.22, 0.22),
    ry: range(2, -0.9, 0.9),
    rz: range(3, -0.14, 0.14),
    cx: range(4, -2.4, 2.4),
    cy: range(5, -1.4, 1.4),
    cz: range(6, 7.4, 9.4),
    sx: range(7, 0.9, 1.12),
  };
}

/* must render INSIDE <Canvas> for useFrame to work */
function Rig({ active }: { active: number }) {
  const activeRef = useRef(active);
  activeRef.current = active;

  const group = useRef<THREE.Group>(null);
  const cur = useRef<Motion>(makeTarget(0));

  useFrame((state, delta) => {
    const target = makeTarget(activeRef.current);
    const k = 1 - Math.exp(-2.1 * delta);
    const c = cur.current;
    c.rx += (target.rx - c.rx) * k;
    c.ry += (target.ry - c.ry) * k;
    c.rz += (target.rz - c.rz) * k;
    c.cx += (target.cx - c.cx) * k;
    c.cy += (target.cy - c.cy) * k;
    c.cz += (target.cz - c.cz) * k;
    c.sx += (target.sx - c.sx) * k;

    if (group.current) {
      group.current.rotation.x = c.rx;
      group.current.rotation.y = c.ry;
      group.current.rotation.z = c.rz;
      const s = c.sx;
      group.current.scale.set(s, s, s);
    }
    state.camera.position.x = c.cx;
    state.camera.position.y = c.cy;
    state.camera.position.z = c.cz;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group name="parallax" ref={group}>
      <Float speed={1.1} rotationIntensity={0.22} floatIntensity={0.5}>
        <mesh position={[0, 0, 0]}>
          <icosahedronGeometry args={[2.3, 32]} />
          <MeshDistortMaterial
            color="#23252b"
            emissive="#3a3f4a"
            emissiveIntensity={0.55}
            roughness={0.3}
            metalness={0.75}
            distort={0.34}
            speed={1.3}
          />
        </mesh>
      </Float>

      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh position={[5.4, 2.8, -2.4]} scale={0.5}>
          <torusKnotGeometry args={[1.6, 0.4, 140, 20]} />
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.12} />
        </mesh>
      </Float>

      <Float speed={2.1} rotationIntensity={0.35} floatIntensity={1}>
        <mesh position={[-5.2, -3.1, -1.8]} scale={0.5}>
          <sphereGeometry args={[1.15, 40, 40]} />
          <MeshDistortMaterial
            color="#2c2e36"
            emissive="#565b68"
            emissiveIntensity={0.4}
            roughness={0.25}
            metalness={0.7}
            distort={0.46}
            speed={1.9}
          />
        </mesh>
      </Float>
    </group>
  );
}

export function MagicScene({ active }: { active: number }) {
  return (
    <Canvas
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 8.2], fov: 55 }}
      style={{ position: "fixed", inset: 0, pointerEvents: "none" }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 7, 6]} intensity={1.1} color="#ffffff" />
      <pointLight position={[-7, 4, -3]} intensity={90} color="#e2e8f0" />
      <pointLight position={[7, -4, 3]} intensity={70} color="#cbd5e1" />
      <Rig active={active} />
      <Sparkles count={130} scale={[24, 15, 9]} size={1.7} speed={0.3} color="#dbe2ea" opacity={0.3} />
    </Canvas>
  );
}

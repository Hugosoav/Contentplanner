import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Icosahedron, TorusKnot, Torus } from "@react-three/drei";
import type { Group, Mesh } from "three";

const ORANGE = "#f2540f";
const AMBER = "#ffb347";

function ScrollRig({ children }: { children: React.ReactNode }) {
  const group = useRef<Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    if (!group.current) return;
    const scroll = window.scrollY / (window.innerHeight || 1);
    target.current.y = state.pointer.x * 0.35 + scroll * 0.9;
    target.current.x = -state.pointer.y * 0.25 + scroll * 0.35;
    group.current.rotation.y += (target.current.y - group.current.rotation.y) * Math.min(1, delta * 2.2);
    group.current.rotation.x += (target.current.x - group.current.rotation.x) * Math.min(1, delta * 2.2);
    group.current.position.y += (-scroll * 0.6 - group.current.position.y) * Math.min(1, delta * 2);
  });

  return <group ref={group}>{children}</group>;
}

function Blob() {
  const mesh = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (mesh.current) mesh.current.rotation.z += delta * 0.08;
  });
  return (
    <Icosahedron ref={mesh} args={[1.55, 32]}>
      <MeshDistortMaterial
        color={ORANGE}
        emissive={ORANGE}
        emissiveIntensity={0.28}
        roughness={0.18}
        metalness={0.65}
        distort={0.38}
        speed={1.4}
      />
    </Icosahedron>
  );
}

/**
 * Cena 3D decorativa do hero: blob orgânico central + anéis e nó flutuantes,
 * reagindo suavemente ao mouse e ao scroll.
 */
const Scene3D = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`pointer-events-none ${className}`} aria-hidden>
      <Canvas
        dpr={[1, 1.8]}
        camera={{ position: [0, 0, 7.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[4, 5, 5]} intensity={2.4} color={AMBER} />
          <pointLight position={[-4, -2, 3]} intensity={18} color={ORANGE} />
          <pointLight position={[3, -3, -4]} intensity={10} color="#ffd9a0" />

          <ScrollRig>
            <group scale={0.92}>
            <Float speed={1.1} rotationIntensity={0.5} floatIntensity={0.9}>
              <Blob />
            </Float>

            <Float speed={1.6} rotationIntensity={1.2} floatIntensity={1.6}>
              <TorusKnot args={[0.42, 0.13, 128, 24]} position={[2.5, 1.2, -1]}>
                <meshStandardMaterial color={AMBER} metalness={0.9} roughness={0.15} />
              </TorusKnot>
            </Float>

            <Float speed={1.3} rotationIntensity={0.9} floatIntensity={1.3}>
              <Torus args={[0.75, 0.045, 24, 96]} position={[-2.6, -1.1, 0.4]} rotation={[1.1, 0.3, 0]}>
                <meshStandardMaterial color={ORANGE} metalness={0.8} roughness={0.25} />
              </Torus>
            </Float>

            <Float speed={2} rotationIntensity={1.4} floatIntensity={2}>
              <Icosahedron args={[0.28, 0]} position={[1.6, -1.6, 1.2]}>
                <meshStandardMaterial color="#fff1e0" metalness={0.6} roughness={0.2} />
              </Icosahedron>
            </Float>
            </group>
          </ScrollRig>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene3D;

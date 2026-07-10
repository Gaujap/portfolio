"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "@/lib/scroll-state";

/*
 * The immersive backdrop: a slow-drifting particle field and a wireframe
 * centerpiece that swaps geometry as project panels scroll past. The camera
 * dollies with page scroll, so the whole world responds to the visitor.
 *
 * WebGL can't read CSS custom properties (and three can't parse oklch), so the
 * two theme palettes are mirrored here; materials re-sync when the `dark`
 * class on <html> changes.
 */
const PALETTES = {
  dark: { accent: "#d9694c", dust: "#a79e90" },
  light: { accent: "#b8442b", dust: "#5e564d" },
} as const;

function activePalette() {
  return document.documentElement.classList.contains("dark")
    ? PALETTES.dark
    : PALETTES.light;
}

function Particles({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null);
  const theme = useRef<string>("");

  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // A loose cylinder around the camera path, denser toward the middle.
      const radius = 5 + Math.random() * 13;
      const angle = Math.random() * Math.PI * 2;
      array[i * 3] = Math.cos(angle) * radius;
      array[i * 3 + 1] = (Math.random() - 0.5) * 18;
      array[i * 3 + 2] = Math.sin(angle) * radius - 8;
    }
    return array;
  }, [count]);

  useFrame((state) => {
    const mesh = points.current;
    if (!mesh) return;
    // Slow drift plus a push from scroll, so scrolling stirs the field.
    mesh.rotation.y =
      state.clock.elapsedTime * 0.018 + scrollState.page * Math.PI * 0.6;
    mesh.position.y = scrollState.page * 3;

    const paletteKey = document.documentElement.className;
    if (theme.current !== paletteKey) {
      theme.current = paletteKey;
      (mesh.material as THREE.PointsMaterial).color.set(activePalette().dust);
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color={PALETTES.dark.dust}
      />
    </points>
  );
}

// One wireframe signature shape per project, in projects.ts order:
// Hermes (flow), Vybe (network of facets), MCP pipeline, infra, scheduling grid.
function buildGeometries(): THREE.BufferGeometry[] {
  return [
    new THREE.TorusKnotGeometry(1.7, 0.42, 140, 20),
    new THREE.IcosahedronGeometry(2.1, 1),
    new THREE.OctahedronGeometry(2.2, 0),
    new THREE.TorusGeometry(1.9, 0.55, 12, 44),
    new THREE.BoxGeometry(2.6, 2.6, 2.6, 4, 4, 4),
  ];
}

function Centerpiece() {
  const group = useRef<THREE.Group>(null);
  const theme = useRef<string>("");
  const geometries = useMemo(buildGeometries, []);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;

    g.rotation.x += delta * 0.12;
    g.rotation.y += delta * 0.19;
    // Lean toward the pointer (lerped, so it never accumulates).
    g.rotation.z += (scrollState.pointerX * 0.22 - g.rotation.z) * 0.05;
    g.position.y += (-scrollState.pointerY * 0.4 - g.position.y) * 0.05;

    // A ghost behind the hero and manifesto; fully lit among the projects.
    const presence = scrollState.projectsPresence;
    g.scale.setScalar(0.75 + presence * 0.45);

    const paletteKey = document.documentElement.className;
    const themeChanged = theme.current !== paletteKey;
    theme.current = paletteKey;

    g.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const target = i === scrollState.activeProject ? 1 : 0;
      const next = mesh.scale.x + (target - mesh.scale.x) * 0.07;
      mesh.scale.setScalar(next);
      mesh.visible = next > 0.02;
      const material = mesh.material as THREE.MeshBasicMaterial;
      material.opacity = 0.1 + presence * 0.42;
      if (themeChanged) {
        material.color.set(activePalette().accent);
      }
    });
  });

  return (
    // Offset right so it frames the left-aligned type instead of sitting on it.
    <group ref={group} position={[2.7, 0, -3]}>
      {geometries.map((geometry, i) => (
        <mesh key={i} geometry={geometry} scale={i === 0 ? 1 : 0}>
          <meshBasicMaterial
            wireframe
            transparent
            opacity={0.5}
            color={PALETTES.dark.accent}
          />
        </mesh>
      ))}
    </group>
  );
}

function Rig() {
  const { camera } = useThree();
  useFrame((state) => {
    // Dolly in with scroll; breathe on time; lean toward the pointer.
    camera.position.z = 9.5 - scrollState.page * 2.2;
    const targetX =
      Math.sin(state.clock.elapsedTime * 0.1) * 0.35 + scrollState.pointerX * 0.7;
    const targetY =
      Math.cos(state.clock.elapsedTime * 0.13) * 0.25 - scrollState.pointerY * 0.45;
    camera.position.x += (targetX - camera.position.x) * 0.04;
    camera.position.y += (targetY - camera.position.y) * 0.04;
    camera.lookAt(0, 0, -3);
  });
  return null;
}

export function Scene() {
  // Lighter world on small screens: fewer particles, capped resolution.
  const small =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 767px)").matches;

  return (
    <Canvas
      dpr={small ? [1, 1.25] : [1, 1.5]}
      camera={{ position: [0, 0, 9.5], fov: 52 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
    >
      <Rig />
      <Particles count={small ? 850 : 1600} />
      <Centerpiece />
    </Canvas>
  );
}
